const http = require('http')
const express = require('express')

const config = require('../config')
const watch = require('./watch')
const mw = require('./middlewares')

const app = express()

// css
app.use('/css/',
  mw.serveStatic(config.template.assets + config.template.css),
  mw.error
)

// js
app.use('/js/', mw.reloadJs, mw.error)

app.get('/', mw.home)

// all other files under `config.home`
app
  .use(mw.forbiddenRemote)
  .use(mw.unescape)
  .use(mw.noextfile)
  .use(mw.stat)
  .use(mw.plaintext)
  .use(mw.markdown)
  .use(watch.watch)
  .use(mw.serveIndex)
  .use(mw.serveStatic())
  .use(mw.four0four)
  .use(mw.error)

function start (_config) {
  const { port, host } = _config || config

  console.log(`"md-fileserver" started. Open http://${host}:${port} in browser.`)
  const server = http.createServer(app).listen(port, config)
  watch.websocket(server)

  return server
}

module.exports = {
  app,
  watch,
  start
}
