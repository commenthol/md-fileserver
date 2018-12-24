const http = require('http')
const URL = require('url').URL

const config = require('../config')
const watch = require('./watch')
const mw = require('./middlewares')
const base = 'http://' + config.host + ':' + config.port

function app (req, res) {
  const pathname = new URL(req.url, base).pathname
  const layers = app.layers.slice()
  req.originalUrl = req.url

  function next (err) {
    if (err) {
      if (!app.onerror) {
        throw err
      }
      return app.onerror(err, req, res)
    }

    const layer = layers.shift()
    if (!layer) {
      return next(new Error('unhandled request'))
    }

    if (layer.reset) {
      req.url = req.originalUrl
      return next()
    }

    if (layer.route === '') {
      layer.handler(req, res, next)
    } else if (layer.route && pathname.startsWith(layer.route)) {
      // rebase url to within the use() scope
      req.url = req.url.replace(layer.route, '')
      layer.handler(req, res, next)
    } else if (layer.path && pathname === layer.path) {
      layer.handler(req, res, next)
    } else {
      // layer doesn't match, try the next
      next()
    }
  }

  // start handling
  next()
}
app.layers = []
app.use = function (...handlers) {
  let route = typeof handlers[0] === 'string' ? handlers.shift() : ''
  this.layers.push({ reset: true })
  for (const handler of handlers) {
    this.layers.push({ route, handler })
  }
}
app.get = function (path, handler) {
  if (!path.startsWith('/')) {
    throw new Error('bad path "' + path + '"')
  }
  this.layers.push({ reset: true })
  this.layers.push({ path, handler })
}
app.onerror = mw.error

// css
app.use('/css/',
  mw.serveStatic(config.template.assets + config.template.css)
)

// js
app.use('/js/', mw.reloadJs)

app.get('/', mw.home)

// all other files under `config.home`
app.use(
  mw.forbiddenRemote,
  mw.unescape,
  mw.noextfile,
  mw.plaintext,
  watch.watch,
  mw.markdown,
  mw.serveIndex,
  mw.serveStatic('/')
)

// anything else
app.use(
  mw.forbiddenRemote,
  mw.forbiddenNotHome
)

console.log('"md-fileserver" started. Open ' + base + ' in browser.')
const server = http.createServer(app).listen(config.port, config.host)
watch.websocket(server)
