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
  // .use(mw.forbiddenNotHome)
  .use(mw.unescape)
  .use(mw.noextfile)
  .use(mw.plaintext)
  .use(watch.watch)
  .use(mw.markdown)
  .use(mw.serveIndex)
  .use(mw.serveStatic('/'))
  .use(mw.error)

// anything else
app.use(mw.forbiddenRemote)
  .use(mw.forbiddenNotHome)
  .use(mw.error)

console.log('"md-fileserver" started. Open http://' + config.host + ':' + config.port + ' in browser.')
const server = http.createServer(app).listen(config.port, config.host)
watch.websocket(server)
