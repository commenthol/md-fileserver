const _template = require('lodash.template')
const fs = require('fs')
const path = require('path')
const { markdown } = require('./markd')

function renderConfig ({ highlightStyles }) {
  const styles = fs.readdirSync(highlightStyles)
    .filter(file => path.extname(file) === '.css')
    .map(file => path.basename(file, '.css'))

  return (req, res) => {
    const tmpl = fs.readFileSync(path.resolve(__dirname, 'pages', 'config.md'))
    const data = _template(tmpl)(Object.assign({
      styles
    }, req._config))

    markdown(req.url, data, req._config, (_err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.write(data)
      res.end()
    })
  }
}

function updateConfig (appConfig) {
  return (req, res) => {
    const obj = {}
    const { port, filter, highlight } = req.body
    if (port && port >= 1000 && port <= 5000) {
      obj.port = parseInt(port)
    }
    obj.filter = filter === 'on'
    if (highlight) {
      obj.template = {
        highlight
      }
    }
    appConfig.set(obj)
    // console.log(appConfig.config)
    res.redirect(req.url)
  }
}

module.exports = {
  renderConfig,
  updateConfig
}
