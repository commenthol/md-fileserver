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

const highlightStyles = path.resolve(__dirname, '..', 'node_modules', 'highlight.js', 'styles')

function setupApp () {
  const app = express()

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

  return app
}

function start (_config) {
  const confluencerBak = appConfig.get('confluencer.bak')

  if (_config.confluencer) {
    if (confluencerBak === undefined) {
      appConfig.set('confluencer.bak', appConfig.get('confluencer'))
      appConfig.set('confluenceHtml.bak', appConfig.get('confluenceHtml'))
    }
    appConfig.set('confluencer', true)
    appConfig.set('confluenceHtml', true)
  } else if (confluencerBak !== undefined) {
    appConfig.set('confluencer', confluencerBak)
    appConfig.set('confluencer.bak', undefined)
    appConfig.set('confluenceHtml', appConfig.get('confluenceHtml.bak'))
    appConfig.set('confluenceHtml.bak', undefined)
  }

  const { port } = merge({}, config, appConfig.config, _config)
  const server = http.createServer(setupApp()).listen(port, config)
  watch.websocket(server)

  return server
}

module.exports = {
  setupApp,
  watch,
  start,
  appConfig
}
