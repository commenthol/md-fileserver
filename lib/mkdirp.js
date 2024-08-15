const fs = require('fs')
const path = require('path')

/**
 * synchronous mkdir -p
 * @param  {String} dirname - directory name
 */
function mkdirp(dirname) {
  const _dirs = path.resolve(dirname).split(path.sep)
  let _dir = ''
  while (_dirs.length) {
    _dir += _dirs.shift() + path.sep
    try {
      fs.statSync(_dir)
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      fs.mkdirSync(_dir)
    }
  }
}

module.exports = mkdirp
