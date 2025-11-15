const os = require('os')
const isWin32 = os.platform() === 'win32'

const uri2filename = (uri) =>
  isWin32
    ? decodeURIComponent(uri).replace(/^\//, '').replace(/\//g, '\\')
    : uri

const filename2uri = (filename) =>
  isWin32 ? filename.replace(/^/, '/').replace(/\\/g, '/') : filename

const drive = (uri) =>
  isWin32
    ? decodeURIComponent(uri).replace(
        /^\/?([a-zA-Z]:).*$/,
        (m, g) => g.toUpperCase() + '\\'
      )
    : '/'

const urlWithoutDrive = (uri) =>
  isWin32 ? decodeURIComponent(uri).replace(/^\/?[a-zA-Z]:/, '') : uri

const homedir = () => (isWin32 ? filename2uri(os.homedir()) : os.homedir())

const contentSecurityPolicy = [
  "default-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  'img-src data: *',
  'font-src data: *',
  "connect-src 'self'",
  'media-src data: *',
  'object-src data: *',
  'prefetch-src data: *'
].join('; ')

/**
 * sets error
 * @param {Error|Number} err
 * @return {Error}
 */
function newError(err) {
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
    (acc, obj) =>
      Object.keys(obj).reduce((_a, k) => {
        acc[k] =
          Object.prototype.hasOwnProperty.call(acc, k) &&
          typeof acc[k] === 'object'
            ? merge(acc[k], obj[k])
            : obj[k]
        return acc
      }, {}),
    {}
  )

const requireResolve = (m) => {
  const path = require.resolve(m)
  let pos = 0
  while (true) {
    const next = path.indexOf(m, pos)
    if (next < 0) {
      break
    }
    pos = next + 1
  }
  return path.substring(0, pos + m.length)
}

module.exports = {
  isWin32,
  homedir,
  uri2filename,
  filename2uri,
  drive,
  urlWithoutDrive,
  newError,
  merge,
  requireResolve,
  contentSecurityPolicy
}
