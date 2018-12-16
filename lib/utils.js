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

module.exports = {
  isWin32,
  homedir,
  uri2filename,
  filename2uri,
  drive,
  urlWithoutDrive
}
