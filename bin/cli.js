#!/usr/bin/env node

const path = require('path')
const child = require('child_process')
const isPortOpen = require('../lib/checkport')
const config = require('../config')
const { filename2uri } = require('../lib/utils')
const appConfig = require('../lib/appConfig')()

const file = process.argv[2]
const browserExe = config.browser[process.platform]

isPortOpen({ port: config.port }, (isOpen) => {
  const startBrowser = file && browserExe

  if (!isOpen) {
    require('../lib').start({ quiet: startBrowser })
    // child.execFile('node', [path.resolve(__dirname, 'start.js')],
    //   isWin32 ? { windowsHide: true, shell: true } : void 0)
  }

  if (startBrowser) {
    setTimeout(function () {
      const token = appConfig.token()
      const url = `http://${config.hostname}:${config.port}` +
        filename2uri(path.resolve(process.cwd(), file)) + `?session=${token}`
      const [exe, ...args] = browserExe
      args.push(url)
      child.spawn(exe, args)
    }, isOpen ? 0 : 250)
  }
})
