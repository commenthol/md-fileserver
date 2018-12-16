const fs = require('fs')
const mw = require('./middlewares')
const { uri2filename, filename2uri } = require('./utils')
const WebSocket = require('ws')

const MARKDOWNEXT = mw.MARKDOWNEXT
const WATCHOPTS = { persistent: true, recursive: false }

const M = {}
const changedFiles = {}
let connects = [] // list of connected browser pages

/**
 * create websockets
 */
M.websocket = function (server) {
  // create the server
  const wsServer = new WebSocket.Server({
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
        const uri = filename2uri(file)
        connection.send(encodeURIComponent(uri))
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
  var file = uri2filename(req.url)

  if (MARKDOWNEXT.test(file)) {
    if (changedFiles[file] === undefined) {
      fs.watch(file, WATCHOPTS, onChange(file))
    }
    changedFiles[file] = false
  }

  next && next()
}

module.exports = M
