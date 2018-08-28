'use strict'

var _ = require('lodash')
var fs = require('fs')
var path = require('path')
var async = require('asyncc')
var serveIndex = require('serve-index')
var serveStatic = require('serve-static')

var config = require('../config')
var markd = require('./markd')

var MARKDOWNEXT = /\.(md|mdown|markdown)$/
var FILETEXT = /\/([A-Za-z]+)$/
var FILENOEXT = /\/([^.]+)$/

var templates = {}

templates.reloadJS = fs.readFileSync(path.join(__dirname, '../assets/js/reload.js'))

/**
 * sets error
 * @param {Error|Number} err
 * @return {Error}
 */
function newError (err) {
  var map = {
    403: { status: 403, message: 'Access forbidden' },
    404: { status: 404, message: 'Not found' },
    600: { status: 600 } // do not return any message
  }
  if (typeof err === 'string' || typeof err === 'number') {
    err = map[err] || err
  }
  return err
}

/**
 * middlewares
 */
var M = {
  // only allow access from localhost
  forbiddenRemote: function (req, res, next) {
    if (!(req.connection.remoteAddress === '127.0.0.1' || // ipv4
        req.connection.remoteAddress === '::ffff:127.0.0.1')) { // hybrid ipv6
      console.error('Access forbidden for ' + req.connection.remoteAddress)
      return next(newError(600))
    }
    return next()
  },
  // no access to other folders than under $HOME
  forbiddenNotHome: function (req, res, next) {
    if (config.home && req.url.indexOf(config.home + '/') !== 0) {
      res.redirect(config.home + '/')
      return
    }
    return next()
  },
  // unescape an escaped URL
  unescape: function (req, res, next) {
    req.url = decodeURIComponent(req.url)
    return next()
  },
  // try to autocorrect markdown links (e.g. for gitlab)
  noextfile: function (req, res, next) {
    var path
    if (FILENOEXT.test(req.url)) {
      async.eachSeries(
        ['', '.md', '.markdown'], // order of processing extensions
        function (ext, cb) {
          path = req.url + ext
          fs.exists(path, function (exists) {
            if (exists) {
              return cb(new Error('found'))
            }
            cb()
          })
        },
        function (/* err */) {
          if (path && path !== req.url) {
            res.redirect(path)
          } else {
            next && next()
          }
        }
      )
    } else {
      next && next()
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
      fs.readFile(req.url, 'utf8', function (err, data) {
        if (err) {
          return next()
        }
        markd.preprocess(req.url, data, {}, function (_err, data) {
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
    serveIndex('/', { icons: true,
      filter: function (f) {
        var stats
        if (!config.filter) {
          return f
        } else { // filter only markdown files
          stats = fs.statSync(req.url + '/' + f)
          if (!stats.isFile() || MARKDOWNEXT.test(f)) {
            return f
          }
        }
      }
    })(req, res, function (err) {
      return next(err)
    })
  },
  // serve static files
  serveStatic: function (path, options) {
    path = path || '/'
    options = options || {}
    return function (req, res, next) {
      serveStatic(path, options)(req, res, function (err) {
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
  reloadJs: function (req, res, next) { // eslint-disable-line no-unused-vars
    var data = _.template(templates.reloadJS)({ hostname: config.host + ':' + config.port })
    res.writeHead(200, { 'Content-Type': 'application/javascript' })
    res.write(data)
    res.end()
  },
  // error handler
  error: function (err, req, res, next) { // eslint-disable-line no-unused-vars
    // ~ console.log(err, err.status, err.message);
    if (err.status === 600) {
      res.destroy()
    } else {
      res.writeHead(err.status || 404)
      res.write(err.message || 'Not found')
      res.end()
    }
  }
}

M.MARKDOWNEXT = MARKDOWNEXT

module.exports = M
