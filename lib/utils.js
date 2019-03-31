const os = require('os')
const isWin32 = os.platform() === 'win32'

const uri2filename = (uri) => isWin32
  ? decodeURIComponent(uri).replace(/^\//, '').replace(/\//g, '\\')
  : uri

const filename2uri = (filename) => isWin32
  ? filename.replace(/^/, '/').replace(/\\/g, '/')
  : filename

const drive = (uri) => isWin32
  ? decodeURIComponent(uri).replace(/^\/?([a-zA-Z]:).*$/, (m, g) => g.toUpperCase() + '\\')
  : '/'

const urlWithoutDrive = (uri) => isWin32
  ? decodeURIComponent(uri).replace(/^\/?[a-zA-Z]:/, '')
  : uri

const homedir = () => isWin32
  ? filename2uri(os.homedir())
  : os.homedir()

/**
 * sets error
 * @param {Error|Number} err
 * @return {Error}
 */
function newError (err) {
  const map = {
    403: { status: 403, message: 'Access forbidden' },
    404: { status: 404, message: 'Not found' }
  }
  if (typeof err === 'number') {
    err = map[err] || { status: err, message: 'HTTP ' + err }
  }
  return err
}

const merge = (...objs) =>
  [...objs].reduce(
    (acc, obj) => Object.keys(obj).reduce((_a, k) => {
      acc[k] = acc.hasOwnProperty(k) && typeof acc[k] === 'object'
        ? merge(acc[k], obj[k])
        : obj[k]
      return acc
    }, {}),
    {}
  )

module.exports = {
  isWin32,
  homedir,
  uri2filename,
  filename2uri,
  drive,
  urlWithoutDrive,
  newError,
  merge
}
