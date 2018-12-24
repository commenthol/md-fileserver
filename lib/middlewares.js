const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const async = require('asyncc')
const serveIndex = require('serve-index')
const serveStatic = require('serve-static')

const config = require('../config')
const markd = require('./markd')
const { homedir, drive, uri2filename, filename2uri, urlWithoutDrive } = require('./utils')

const MARKDOWNEXT = /\.(md|mdown|markdown)$/
const FILETEXT = /[/\\]([A-Za-z]+)$/
const FILENOEXT = /[/\\]([^.]+)$/

const templates = {}

templates.reloadJS = fs.readFileSync(path.join(__dirname, '../assets/js/reload.js'))

/**
 * sets error
 * @param {Error|Number} err
 * @return {Error}
 */
function newError (err) {
  const map = {
    403: { status: 403, message: 'Access forbidden' },
    404: { status: 404, message: 'Not found' }
  }
  if (typeof err === 'number') {
    err = map[err] || { status: err, message: 'HTTP ' + err }
  }
  return err
}

function newRedirect (location) {
  return { redirect: location }
}

/**
 * middlewares
 */
const M = {
  // only allow access from localhost
  forbiddenRemote: function (req, res, next) {
    if (!(req.connection.remoteAddress === '127.0.0.1' || // ipv4
        req.connection.remoteAddress === '::ffff:127.0.0.1')) { // hybrid ipv6
      console.error('Access forbidden for ' + req.connection.remoteAddress)
      return next(newError(401))
    }
    return next()
  },
  // no access to other folders than under $HOME
  forbiddenNotHome: function (req, res, next) {
    if (config.home && req.url.indexOf(config.home + '/') !== 0) {
      next(newRedirect(config.home + '/'))
      return
    }
    return next()
  },
  // redirect to homeDir
  home: function (req, res, next) {
    next(newRedirect(homedir()))
  },
  // unescape an escaped URL
  unescape: function (req, res, next) {
    req.url = decodeURIComponent(req.url)
    return next()
  },
  // try to autocorrect markdown links (e.g. for gitlab)
  noextfile: function (req, res, next) {
    let path
    const filename = uri2filename(req.url)

    if (FILENOEXT.test(req.url)) {
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
            next(newRedirect(filename2uri(path)))
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
    if (FILETEXT.test(req.url)) {
      fs.readFile(req.url, 'utf8', function (err, data) {
        if (err) {
          return next()
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.write(data)
        res.end()
      })
    } else {
      return next()
    }
  },
  // make markdown conversion
  markdown: function (req, res, next) {
    // transform markdown pages
    if (MARKDOWNEXT.test(req.url)) {
      const filename = uri2filename(req.url)

      fs.readFile(filename, 'utf8', function (err, data) {
        if (err) {
          return next()
        }
        markd.preprocess(filename, data, {}, function (_err, data) {
          markd.markdown(req.url, data, function (_err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.write(data)
            res.end()
          })
        })
      })
    } else {
      return next()
    }
  },
  // show index for directories
  serveIndex: function (req, res, next) {
    const originalUrl = req.url
    const _drive = drive(req.url)
    req.url = urlWithoutDrive(req.url)

    serveIndex(_drive, { icons: true,
      filter: function (f) {
        if (!config.filter) {
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
      return next(err)
    })
  },
  // serve static files
  serveStatic: function (path, options) {
    return function (req, res, next) {
      serveStatic(path)(req, res, function (err) {
        // called only if file cannot be served
        if (!err) {
          // `err` is undefined if file not found - so set
          err = newError(404)
        }
        return next(err)
      })
    }
  },
  // add host, port to reload script
  reloadJs: function (req, res) {
    const data = _.template(templates.reloadJS)({ hostname: config.host + ':' + config.port })
    res.writeHead(200, { 'Content-Type': 'application/javascript' })
    res.write(data)
    res.end()
  },
  // error handler
  error: function (err, req, res) {
    if (err.redirect) {
      res.writeHead(err.status || 302, {
        'Location': err.redirect,
        'Content-Type': 'text/plain'
      })
      res.write('Redirecting to ' + err.redirect)
      res.end()
      return
    }
    if (!err.status) {
      // Error objects
      err = { status: 500, message: err.toString() }
    }
    if (err.status === 401) {
      res.destroy()
    } else {
      res.writeHead(err.status, { 'Content-Type': 'text/plain' })
      res.write(err.message)
      res.end()
    }
  }
}

M.MARKDOWNEXT = MARKDOWNEXT

module.exports = M
