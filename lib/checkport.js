const net = require('net')

const isPortOpen = function (options, callback) {
  let conn
  let timeoutId
  let isOpen = false

  const port = options.port
  const host = options.host || '127.0.0.1'
  const timeout = options.timeout || 100

  function onEnd () {
    clearTimeout(timeoutId)
    callback(isOpen)
  }

  function onOpen () {
    isOpen = true
    conn.end()
  }

  timeoutId = setTimeout(function () {
    conn.destroy()
  }, timeout)

  conn = net.createConnection(port, host, onOpen)

  conn
    .on('close', onEnd)
    .on('error', function () {
      conn.end()
    })
    .on('connect', onOpen)
}

module.exports = isPortOpen
