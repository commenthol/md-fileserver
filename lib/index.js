const path = require('path')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')

const config = require('../config')
const watch = require('./watch')
const mw = require('./middlewares')
const { merge } = require('./utils')
const appConfig = require('./appConfig')()
const token = appConfig.token()
const app = express()

const highlightStyles = path.resolve(__dirname, '..', 'node_modules', 'highlight.js', 'styles')

app.use('/static/highlight',
  mw.serveStatic(highlightStyles)
)

app.use(mw.config(appConfig))

app.use('/static/',
  mw.serveStatic(path.resolve(__dirname, '..', 'assets')),
  mw.error
)

app
  .use(mw.session(token))
  .use(mw.error)

app.get('/config', mw.renderConfig({ highlightStyles }))
app.post('/config',
  bodyParser.urlencoded({ extended: true }),
  mw.updateConfig(appConfig)
)

app.get('/', mw.home)
app.get('/cheatsheet', mw.cheatsheet)

// all other files under `config.home`
app
  .use(mw.forbiddenRemote)
  .use(mw.unescape)
  .use(mw.noextfile)
  .use(mw.stat)
  .use(mw.plaintext)
  .use(watch.watch)
  .use(mw.markdown)
  .use(mw.serveIndex)
  .use(mw.serveStatic())
  .use(mw.four0four)
  .use(mw.error)

function start (_config) {
  const { port, hostname, quiet } = merge({}, config, appConfig.config, _config)

  if (!quiet) {
    console.log(`
    "md-fileserver" started.
    Open http://${hostname}:${port}/?session=${token} in the browser.
    `)
  }
  const server = http.createServer(app).listen(port, config)
  watch.websocket(server)

  return server
}

module.exports = {
  app,
  watch,
  start
}
