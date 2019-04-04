#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const child = require('child_process')
const isPortOpen = require('../lib/checkport')
const config = require('../config')
const { filename2uri } = require('../lib/utils')
const appConfig = require('../lib/appConfig')()

const argv = () => {
  const argv = process.argv.slice(2)
  const cmd = {
    browser: config.browser[process.platform],
    port: config.port
  }
  while (argv.length) {
    const arg = argv.shift()
    if (['-p', '--port'].includes(arg)) {
      cmd.port = parseInt(argv.shift(), 10)
    } else if (['-b', '--browser'].includes(arg)) {
      cmd.browser = [ argv.shift() ]
    } else if (['-h', '--help'].includes(arg)) {
      help()
    } else if (['--version'].includes(arg)) {
      version()
    } else {
      cmd.file = arg
    }
  }
  return cmd
}

const cmd = argv()

isPortOpen(cmd, (isOpen) => {
  const startBrowser = cmd.file && cmd.browser

  if (!isOpen) {
    require('../lib').start({ port: cmd.port, quiet: startBrowser })
    // child.execFile('node', [path.resolve(__dirname, 'start.js')],
    //   isWin32 ? { windowsHide: true, shell: true } : void 0)
  }

  if (startBrowser) {
    setTimeout(function () {
      const token = appConfig.token()
      const url = `http://${config.hostname}:${cmd.port}` +
        filename2uri(path.resolve(process.cwd(), cmd.file)) + `?session=${token}`
      const [exe, ...args] = cmd.browser
      args.push(url)
      child.spawn(exe, args)
    }, isOpen ? 0 : 250)
  }
})

/* eslint-disable no-console */

function version () {
  console.log('v' + require('../package.json').version)
  process.exit(0)
}

function help () {
  console.log(fs.readFileSync(path.resolve(__dirname, '..', 'man', 'mdstart.txt'), 'utf8'))
  process.exit(0)
}
