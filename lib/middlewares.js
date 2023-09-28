const fs = require('fs')
const path = require('path')
const async = require('asyncc')
const serveIndex = require('serve-index')
const serveStatic = require('serve-static')
const cookie = require('cookie')

const config = require('../config')
const { renderRequest } = require('./markd')
const { renderConfig, updateConfig } = require('./renderConfig')
const { newError, homedir, drive, uri2filename, filename2uri, urlWithoutDrive } = require('./utils')

const MARKDOWNEXT = /\.(md|mdown|markdown)$/
const FILETEXT = /[/\\]([A-Za-z]+)$/
const FILENOEXT = /[/\\]([^.]+)$/

/**
 * middlewares
 */
const M = {
  // only allow access from localhost
  forbiddenRemote: function (req, res, next) {
    if (['127.0.0.1', '::ffff:127.0.0.1', '::1']
      .indexOf(req.connection.remoteAddress) === -1
    ) {
      console.error('Access forbidden for ' + req.connection.remoteAddress)
      next(newError(600))
    } else {
      next()
    }
  },
  // check session
  session: (token) => (req, res, next) => {
    const cookies = cookie.parse(req.headers.cookie || '')
    req.url = req._parsedUrl.pathname

    if (token && req.query.session === token) {
      // const domain = req._parsedUrl.hostname
      res.setHeader('Set-Cookie', cookie.serialize('session', token,
        { httpOnly: true, path: '/' }))
      res.redirect(req.url)
    } else if (token && cookies.session === token) {
      next()
    } else {
      next(newError(403))
    }
  },
  config: (appConfig) => (req, res, next) => {
    req._config = Object.assign({}, config, appConfig.config)
    next()
  },
  renderConfig,
  updateConfig,
  // render cheatsheet
  cheatsheet: (req, res, next) => {
    const file = path.resolve(__dirname, '..', 'test', 'cheatsheet.md')
    req.url = filename2uri(file)
    next()
  },
  // redirect to homeDir
  home: (req, res) => {
    res.redirect(homedir())
  },
  // unescape an escaped URL
  unescape: function (req, res, next) {
    req.url = decodeURIComponent(req.url)
    next()
  },
  // check if file exists and if is directory
  stat: function (req, res, next) {
    const filename = uri2filename(req.url)
    fs.stat(filename, (err, stats) => {
      if (err) {
        next(newError(404))
      } else {
        if (stats && stats.isDirectory()) req.isDirectory = true
        next()
      }
    })
  },
  // try to autocorrect markdown links (e.g. for gitlab)
  noextfile: function (req, res, next) {
    let path
    const filename = uri2filename(req.url)
    if (!req.isDirectory && FILENOEXT.test(req.url)) {
      async.eachSeries(
        ['', '.md', '.markdown'], // order of processing extensions
        function (ext, cb) {
          path = filename + ext
          fs.stat(path, function (err) {
            if (!err) {
              return cb(new Error('found'))
            }
            cb()
          })
        },
        function (/* err */) {
          if (path && path !== filename) {
            res.redirect(filename2uri(path))
          } else {
            next()
          }
        }
      )
    } else {
      next()
    }
  },
  // serve files without extension as plaintext files
  plaintext: function (req, res, next) {
    if (!req.isDirectory && FILETEXT.test(req.url)) {
      const filename = uri2filename(req.url)

      fs.readFile(filename, 'utf8', function (err, data) {
        if (err) {
          next(newError(404))
          return
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.write(data)
        res.end()
      })
    } else {
      next()
    }
  },
  // make markdown conversion
  markdown: function (req, res, next) {
    // transform markdown pages
    if (!req.isDirectory && MARKDOWNEXT.test(req.url)) {
      const filename = uri2filename(req.url)
      renderRequest(filename, req, res, next)
    } else {
      next()
    }
  },
  // show index for directories
  serveIndex: function (req, res, next) {
    if (!req.isDirectory) {
      next()
      return
    }

    const originalUrl = req.url
    const _drive = drive(req.url)
    req.url = urlWithoutDrive(req.url)

    serveIndex(_drive, {
      icons: true,
      filter: function (f) {
        if (!req._config.filter) {
          return f
        } else { // filter only markdown files
          const stats = fs.statSync(uri2filename(originalUrl + '/' + f))
          if (!stats.isFile() || MARKDOWNEXT.test(f)) {
            return f
          }
        }
      }
    })(req, res, function (err) {
      req.url = originalUrl
      next(err)
    })
  },
  // serve static files
  serveStatic: function (path, options) {
    return function (req, res, next) {
      path = path || drive(req.url)
      req.url = urlWithoutDrive(req.url)

      serveStatic(path, options)(req, res, function (err) {
        // called only if file cannot be served
        if (!err) {
          // `err` is undefined if file not found - so set
          err = newError(404)
        }
        next(err)
      })
    }
  },
  // final 404 handler
  four0four: function (req, res, next) {
    next(newError(404))
  },
  // error handler
  error: function (err, req, res, next) { // eslint-disable-line no-unused-vars
    if (!err.status) {
      // Error objects
      err = { status: 500, message: err.toString() }
    }

    const final = () => {
      res.writeHead(err.status, { 'Content-Type': 'text/plain' })
      res.write(err.message)
      res.end()
    }

    if (err.status === 600) { // remote access is forbidden
      res.destroy()
    } else if ([403, 404].includes(err.status)) {
      const filename = path.resolve(__dirname, 'pages', `error${err.status}.md`)
      renderRequest(filename, req, res, final, err.status)
    } else {
      final()
    }
  }
}

M.MARKDOWNEXT = MARKDOWNEXT

module.exports = M
