#!/usr/bin/env node

const path = require('path')
const child = require('child_process')
const isPortOpen = require('../lib/checkport')
const config = require('../config')
const { isWin32, filename2uri } = require('../lib/utils')

const args = []
let file = process.argv[2]
let browserExe = config.browser[process.platform]

isPortOpen({ port: config.port }, function (isOpen) {
  if (!isOpen) {
    child.execFile('node', [path.resolve(__dirname, 'mdstart.js')],
      isWin32 ? {windowsHide: true, shell: true} : void 0)
  }

  if (file && browserExe) {
    setTimeout(function () {
      file = 'http://' + config.host + ':' + config.port +
        filename2uri(path.resolve(process.cwd(), file))
      args.push(file)
      child.spawn(browserExe, args)
    }, isOpen ? 0 : 250)
  } else {
    console.log('\
  Usage: mdopen <file>\n\
  \n\
  Make sure that the "md-fileserver" is running.\n\
  Otherwise start it with `mdstart`.\n')
  }
})
