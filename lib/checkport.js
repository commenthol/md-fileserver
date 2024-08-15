const net = require('net')

/**
 * check if port is open
 * @param {Object} options
 * @param {Number} options.port - port number to check if open
 * @param {String} [options.host=127.0.0.1] - host
 * @param {Number} [options.timeout=100] - timeout to connect
 * @param {Function} callback
 */
function isPortOpen({ port, host = '127.0.0.1', timeout = 100 }, callback) {
  let conn = null
  let timeoutId = null
  let isOpen = false

  function onEnd() {
    clearTimeout(timeoutId)
    callback(isOpen)
  }

  function onOpen() {
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
