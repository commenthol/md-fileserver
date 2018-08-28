'use strict'

var http = require('http')
var express = require('express')

var config = require('../config')
var watch = require('./watch')
var mw = require('./middlewares')

var app = express()

// css
app.use('/css/', mw.serveStatic(config.template.assets + config.template.css))
  .use(mw.error)

// js
app.use('/js/', mw.reloadJs)
  .use(mw.error)

// all other files under `config.home`
app.use(mw.forbiddenRemote)
  .use(mw.forbiddenNotHome)
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
var server = http.createServer(app).listen(config.port, config.host)
watch.websocket(server)
