const fs = require('fs')
const mw = require('./middlewares')
const { uri2filename, filename2uri } = require('./utils')
const WebSocket = require('ws')

const MARKDOWNEXT = mw.MARKDOWNEXT
const WATCHOPTS = { persistent: true, recursive: false }

const M = {}
const changedFiles = {}

// list of connected browser pages
let connects = []

/**
 * parse string to object
 * @private
 * @param {String} msg
 * @return {Object}
 */
const parse = (msg) => {
  try {
    return JSON.parse(msg)
  } catch (e) {
    console.error(e)
    return {}
  }
}

/**
 * broadcast msg to all connected clients
 * @private
 * @param {Object} msg
 */
const broadcast = (msg, origin) => {
  const message = JSON.stringify(msg)
  connects = connects.filter(connection => {
    const isOpen = (connection.readyState === connection.OPEN)
    if (isOpen && connection !== origin) {
      connection.send(message)
      return true
    }
    return isOpen
  })
}

/**
 * create websockets
 * @param {http.Server} server
 */
M.websocket = function (server) {
  // create the server
  const wsServer = new WebSocket.Server({
    server
  })

  // WebSocket server
  wsServer.on('connection', function (connection, req) {
    if (/http:\/\/(localhost|127.0.0.1):/.test(req.headers.origin)) {
      connection.on('message', message => {
        const msg = parse(message)
        console.log(msg)
        broadcast(msg, connection)
      })
      connects.push(connection)
    } else {
      connection.terminate()
    }
  })
}

const lastchange = () => Date.now() / 1000 | 0

/**
 * callback of fs.watch
 * @param {String} file - filename which has changed
 */
function onChange (file) {
  return function (event) {
    if (changedFiles[file] !== lastchange()) {
      const change = filename2uri(file)
      broadcast({ change })
      changedFiles[file] = lastchange()
    }

    if (event === 'rename') {
      try {
        fs.unwatchFile(file)
        fs.watch(file, WATCHOPTS, onChange(file))
      } catch (e) {} // file may not be present after renaming...
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
  const file = uri2filename(req.url)

  if (!req.isDirectory && MARKDOWNEXT.test(file)) {
    if (changedFiles[file] === undefined) {
      fs.watch(file, WATCHOPTS, onChange(file))
    }
    changedFiles[file] = lastchange()
  }

  next()
}

module.exports = M
