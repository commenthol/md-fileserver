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
  const cmd = Object.assign(
    {
      browser: config.browser[process.platform],
      port: config.port
    },
    appConfig.config,
    {
      confluencer: undefined,
      confluenceHtml: undefined
    }
  )
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
  const url =
    `http://${config.hostname}:${cmd.port}` +
    filename2uri(filename) +
    `?session=${token}`

  if (cmd.output) {
    const _config = Object.assign({}, config, appConfig.config)
    render(filename, '', _config)
      .then((data) => fs.writeFileSync(cmd.output, data))
      .catch(console.error)

    return
  }

  let server
  if (!isOpen) {
    const { port, confluencer, confluenceHtml } = cmd
    server = require('../lib').start({
      port,
      confluencer,
      confluenceHtml,
      quiet: startBrowser
    })
    // child.execFile('node', [path.resolve(__dirname, 'start.js')],
    //   isWin32 ? { windowsHide: true, shell: true } : void 0)
  }

  const reportBrowserError = (exe, err) => {
    if (err.code !== 'ENOENT' && err.code !== 127) return
    console.log(
      '\n' +
        `    Error: Starting browser with "${exe}" failed.\n` +
        `    Open: ${url}\n`
    )
  }

  const shellQuote = (value) => `'${value.replace(/'/g, "'\\''")}'`

  const openBrowser = () => {
    const [exe, ...args] = cmd.browser
    args.push(url)

    // Termux's xdg-open is a shell command which hands the URL to an Android
    // app. Run it through the shell rather than detaching a direct spawn so it
    // gets the same shell environment as an invocation from the terminal.
    if (process.platform === 'android' && exe === 'xdg-open') {
      const command = [exe, ...args].map(shellQuote).join(' ')
      child.exec(command, (err) => {
        if (err) reportBrowserError(exe, err)
      })
      return
    }

    const www = child.spawn(exe, args, {
      detached: true,
      stdio: 'ignore'
    })
    www.on('error', (err) => reportBrowserError(exe, err))
    www.unref()
  }

  if (startBrowser) {
    if (server && !server.listening) {
      // Wait until the URL is reachable instead of relying on a fixed delay.
      server.once('listening', openBrowser)
    } else {
      openBrowser()
    }
  } else {
    console.log('\n' + `    Open: ${url}\n`)
  }
})

function version() {
  console.log('v' + require('../package.json').version)
  process.exit(0)
}

function help() {
  console.log(
    fs.readFileSync(path.resolve(__dirname, '..', 'man', 'mdstart.txt'), 'utf8')
  )
  process.exit(0)
}
