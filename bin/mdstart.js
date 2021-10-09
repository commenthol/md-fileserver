#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const child = require('child_process')
const isPortOpen = require('../lib/checkport')
const config = require('../config')
const { filename2uri } = require('../lib/utils')
const appConfig = require('../lib/appConfig')()
const { render } = require('../lib/markd')

const argv = () => {
  const argv = process.argv.slice(2)
  const cmd = Object.assign({
    browser: config.browser[process.platform],
    port: config.port
  }, appConfig.config, {
    confluencer: undefined,
    confluenceHtml: undefined
  })
  while (argv.length) {
    const arg = argv.shift()
    if (['-p', '--port'].includes(arg)) {
      cmd.port = parseInt(argv.shift(), 10)
    } else if (['-b', '--browser'].includes(arg)) {
      cmd.browser = [argv.shift()]
    } else if (['-c', '--confluence'].includes(arg)) {
      cmd.confluencer = true
      cmd.confluenceHtml = true
    } else if (['-o', '--output'].includes(arg)) {
      cmd.output = path.resolve(process.cwd(), argv.shift())
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

  const token = appConfig.token()
  const filename = path.resolve(process.cwd(), cmd.file || '')
  const url = `http://${config.hostname}:${cmd.port}` +
    filename2uri(filename) + `?session=${token}`

  if (cmd.output) {
    const _config = Object.assign({}, config, appConfig.config)
    render(filename, '', _config)
      .then(data => fs.writeFileSync(cmd.output, data))
      .catch(console.error)

    return
  }

  if (!isOpen) {
    const { port, confluencer, confluenceHtml } = cmd
    require('../lib').start({ port, confluencer, confluenceHtml, quiet: startBrowser })
    // child.execFile('node', [path.resolve(__dirname, 'start.js')],
    //   isWin32 ? { windowsHide: true, shell: true } : void 0)
  }

  if (startBrowser) {
    setTimeout(function () {
      const [exe, ...args] = cmd.browser
      args.push(url)
      const www = child.spawn(exe, args)
      www.on('error', (err) => {
        if (err.code === 'ENOENT') {
          console.log('\n' +
            `    Error: Starting browser with "${exe}" failed.\n` +
            `    Open: ${url}\n`
          )
        }
      })
    }, isOpen ? 0 : 250)
  } else {
    console.log('\n' +
      `    Open: ${url}\n`)
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
