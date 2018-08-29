'use strict'

var fs = require('fs')
var mw = require('./middlewares')
var WebSocket = require('ws')

var MARKDOWNEXT = mw.MARKDOWNEXT
var WATCHOPTS = { persistent: true, recursive: false }

var M = {}
var changedFiles = {}
var connects = [] // list of connected browser pages

/**
 * create websockets
 */
M.websocket = function (server) {
  // create the server
  var wsServer = new WebSocket.Server({
    server: server
  })

  // WebSocket server
  wsServer.on('connection', function (connection, req) {
    if (/http:\/\/(localhost|127.0.0.1):/.test(req.headers.origin)) {
      connects.push(connection)
    } else {
      connection.terminate()
    }
  })
}

/**
 * callback of fs.watch
 * @param {String} file
 * @return {Function} function(event)
 */
function onChange (file) {
  return function (event) {
    if (event === 'change') {
      changedFiles[file] = true
      connects = connects.filter(function (connection) {
        if (connection.readyState !== connection.OPEN) {
          return false
        }
        connection.send(encodeURIComponent(file))
      })
    } else if (event === 'rename') {
      if (changedFiles[file]) {
        try {
          fs.watch(file, WATCHOPTS, onChange(file))
        } catch (e) {} // eslint-disable-line no-empty
      }
      changedFiles[file] = false
    }
  }
}

/**
 * middleware which registers file for watching
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
M.watch = function (req, res, next) {
  var file = req.url

  if (MARKDOWNEXT.test(file)) {
    if (changedFiles[file] === undefined) {
      fs.watch(file, WATCHOPTS, onChange(file))
    }
    changedFiles[file] = false
  }

  next && next()
}

module.exports = M
