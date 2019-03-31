const path = require('path')
const http = require('http')
const express = require('express')

const config = require('../config')
const watch = require('./watch')
const mw = require('./middlewares')
const appConfig = require('./appConfig')

const app = express()
const token = appConfig().token()

app.use('/static/highlight',
  mw.serveStatic(path.resolve(__dirname, '..', 'node_modules', 'highlight.js', 'styles'))
)

app.use('/static/',
  mw.serveStatic(config.template.assets),
  mw.error
)

app.use(
  mw.session(token),
  mw.error
)

app.get('/', mw.home)

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
  const { port, hostname, quiet } = Object.assign(config, _config)

  if (!quiet) {
    console.log(`
    "md-fileserver" started.
    Open <http://${hostname}:${port}/?session=${token}> in the browser.
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
