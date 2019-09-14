import Interval from './Interval'

/**
 * handler for connection, dispatcher and master-slave
 * @class
 * @private
 */
class Handler {
  constructor () {
    this.isReestablishing = false
    this._isSlave = true
    this.interval = new Interval(() => {
      if (!this._isSlave) this.send({ slave: true })
    }, 1000)
    this.interval.set()
  }

  /**
   * @param {WebSocket} conn - socket connection
   */
  set connection (conn) {
    this._conn = conn
  }

  /**
   * @param {Dispatcher} dispatch
   */
  set dispatcher (dispatch) {
    this._dispatch = dispatch
  }

  /**
   * @param {Boolean} isRx
   */
  set isSlave (isRx) {
    this._isSlave = isRx
    this.dispatch({ isRx })
    // const el = document.getElementById('master')
    const el = document.documentElement
    if (!isRx) { // master mode
      el.classList.remove('slave')
      this.send({ slave: true })
    } else { // slave mode
      el.classList.add('slave')
    }
  }

  /**
   * @returns {Boolean}
   */
  get isSlave () {
    return this._isSlave
  }

  /**
   * @param {Object} msg
   */
  dispatch (msg) {
    const { _dispatch } = this
    if (_dispatch) _dispatch.dispatch(msg)
  }

  /**
   * @param {Object} msg
   */
  send (msg) {
    const { _conn } = this
    if (_conn && _conn.readyState === _conn.OPEN) {
      _conn.send(JSON.stringify(msg))
    }
  }

  close () {
    const { _conn } = this
    this.interval.clear()
    if (_conn) {
      _conn.close()
    }
  }

  sendScroll () {
    const top = window.scrollY / document.body.clientHeight
    const left = window.scrollX / document.body.clientWidth
    const scroll = { top, left }
    this.send({ scroll })
  }
}

const handler = new Handler()

/**
 * @private
 * @param {String} msg - message
 * @return {Object} object
 */
function parse (msg) {
  try {
    return JSON.parse(msg)
  } catch (e) {
    console.error(e)
    return {}
  }
}

/**
 * @private
 * @param {Object} arg
 */
function recreateConnection (arg) {
  handler.isReestablishing = true
  setTimeout(() => {
    createConnection(arg)
  }, 500)
}

/**
 * creates a websocket connection
 * @param {Object} arg
 */
export function createConnection () {
  const WebSocket = window.WebSocket || window.MozWebSocket
  if (!WebSocket) {
    console.error('there is no WebSocket...')
    return
  }

  const conn = new WebSocket(`ws://${location.host}`)

  handler.connection = conn

  conn.onmessage = function (message) {
    const msg = parse(message.data)

    if (msg.change === location.pathname) {
      location.reload()
    }
  }

  conn.onopen = function () {
    if (handler.isReestablishing && conn) {
      handler.isReestablishing = false
      location.reload()
    }
  }

  conn.onclose = function () {
    // automatically reconnect - onclose is always called even if socket cannot connect.
    recreateConnection()
  }

  conn.onerror = function (err) {
    console.log(err)
  }

  return {
    send: (msg) => !handler.isSlave && handler.send(msg)
  }
}

// close connection before reloading page.
window.addEventListener('beforeunload', () => {
  handler.close()
})
