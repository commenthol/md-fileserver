/**
 * a timing save interval timer
 */
export default class Interval {
  /**
   * @constructor
   * @param {Function} fn - function to run
   * @param {Number} timeout
   * @param {Object} [opts]
   * @param {Boolean} [opts.runOnInit=false] - run `fn` on init
   */
  constructor(fn, timeout, opts) {
    const { runOnInit = false } = opts || {}
    Object.assign(this, { fn, timeout })
    this.set()
    runOnInit && fn()
  }

  set() {
    const { fn, timeout } = this
    this._timer = setTimeout(() => {
      this.set() // restart timer
      fn()
    }, timeout)
  }

  clear() {
    clearTimeout(this._timer)
  }
}
