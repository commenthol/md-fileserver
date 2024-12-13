const fs = require('fs')
const mw = require('./middlewares')
const { uri2filename, filename2uri } = require('./utils')
const WebSocket = require('ws')

const MARKDOWNEXT = mw.MARKDOWNEXT
const WATCHOPTS = { persistent: true, recursive: false }

const M = {}
// list of connected browser pages
let connects = []
const watchedFiles = new Set()
const fileWatchers = new Map()
const changedFiles = new Map()

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
  connects = connects.filter((connection) => {
    const isOpen = connection.readyState === connection.OPEN
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
  const wsServer = new WebSocket.Server({ server })

  // WebSocket server
  wsServer.on('connection', function (connection, req) {
    if (/http:\/\/(localhost|127.0.0.1):/.test(req.headers.origin)) {
      connection.on('message', (message) => {
        const msg = parse(message)
        console.log(msg)
        broadcast(msg, connection)
      })

      connection.on('close', () => {
        connects = connects.filter((conn) => conn !== connection)
      })

      connection.on('error', (error) => {
        console.error('WebSocket error:', error)
        connection.terminate()
      })

      connects.push(connection)
    } else {
      connection.terminate()
    }
  })
}

const lastchange = () => (Date.now() / 1000) | 0

/**
 * callback of fs.watch
 * @param {String} file - filename which has changed
 */
function onChange(file) {
  let debounceTimer

  return function (event) {
    clearTimeout(debounceTimer)

    debounceTimer = setTimeout(() => {
      const currentTime = lastchange()
      if (changedFiles.get(file) !== currentTime) {
        const change = filename2uri(file)
        broadcast({ change })
        changedFiles.set(file, currentTime)
      }

      if (event === 'rename') {
        if (fileWatchers.has(file)) {
          fileWatchers.get(file).close()
          fileWatchers.delete(file)
          watchedFiles.delete(file)
        }

        try {
          const watcher = fs.watch(file, WATCHOPTS, onChange(file))
          fileWatchers.set(file, watcher)
          watchedFiles.add(file)
          // eslint-disable-next-line no-unused-vars
        } catch (e) {
          // file may not be present after renaming...
        }
      }
    }, 100)
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
    if (!watchedFiles.has(file)) {
      const watcher = fs.watch(file, WATCHOPTS, onChange(file))
      watcher.on('close', () => {
        watchedFiles.delete(file)
        fileWatchers.delete(file)
      })

      fileWatchers.set(file, watcher)
      watchedFiles.add(file)
    }
    changedFiles.set(file, lastchange())
  }

  next()
}

// Cleanup function for tests/server shutdown
M.cleanup = function () {
  console.log('cleanup')
  fileWatchers.forEach((watcher) => watcher.close())
  fileWatchers.clear()
  watchedFiles.clear()
  changedFiles.clear()
  connects.forEach((conn) => conn.terminate())
  connects = []
}

module.exports = M
