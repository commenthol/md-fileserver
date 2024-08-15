const os = require('os')
const fs = require('fs')
const path = require('path')
const mkdirp = require('./mkdirp')
const crypto = require('crypto')
const { merge } = require('./utils')

const APP = 'md-fileserver'
const CONF = 'config.json'

const getAppConfig = (filename = CONF) => {
  const homedir = os.homedir()
  switch (os.platform()) {
    case 'win32':
      return path.resolve(
        homedir,
        'AppData',
        'Local',
        'Packages',
        APP,
        filename
      )
    case 'darwin':
      return path.resolve(homedir, 'Library', 'Preferences', APP, filename)
    default:
      return path.resolve(homedir, '.config', APP, filename)
  }
}

const randomToken = (len = 20) =>
  crypto
    .randomBytes(len + 2)
    .toString('base64')
    .replace(/[+/=]/g, 'x')
    .substring(0, len)

/**
 * handle app configuration
 */
class AppConfig {
  constructor() {
    this.filename = getAppConfig()
    this.config = {}
    this.read()
  }

  _create() {
    this.config = Object.assign({}, this.config, {
      updatedAt: new Date(),
      token: randomToken()
    })
    const dirname = path.dirname(this.filename)
    mkdirp(dirname)
    this.write()
  }

  set(key, value) {
    if (typeof key === 'object') {
      this.config = merge(this.config, key)
    } else {
      this.config[key] = value
    }
    this.write()
  }

  get(key) {
    return this.config[key]
  }

  read() {
    try {
      const data = fs.readFileSync(this.filename, 'utf8')
      this.config = JSON.parse(data)
      if (typeof this.config !== 'object') this.config = {}
      const { updatedAt, token } = this.config
      if (
        !token ||
        !updatedAt ||
        new Date(updatedAt) < new Date(Date.now() - 86400000) // recreate session each day
      ) {
        throw new Error('recreate config')
      }
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      // console.error(e.message)
      this._create()
    }
  }

  write() {
    fs.writeFileSync(
      this.filename,
      JSON.stringify(this.config, null, 2),
      'utf8'
    )
  }

  token() {
    if (!this.config) {
      this.read()
    }
    return this.config.token
  }
}

const appConfig = () => new AppConfig()

module.exports = appConfig
