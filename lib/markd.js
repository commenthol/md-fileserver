const _template = require('lodash/template')
const { promisify } = require('util')
const fs = require('fs')
const fsP = require('fs/promises')
const path = require('path')
const markedpp = require('markedpp').default
const md = require('markdown-it')
const confluencer = require('confluencer')
const { newError, contentSecurityPolicy } = require('./utils.js')

const tmpl = fs.readFileSync(path.resolve(__dirname, 'pages', 'template.html'))

const markedppP = promisify(markedpp)

/**
 * @param {String} filename - request url
 * @param {String} data - markdown data
 */
function preprocess(filename, data, config) {
  const options = Object.assign(
    { dirname: path.dirname(filename), markdownit: true },
    config.markedpp
  )
  return markedppP(data, options)
}

/**
 * transform markdown into html
 * @param {String} reqUrl - request url
 * @param {String} data - markdown data
 * @param {Callback} callback
 */
async function markdown(title, data, config) {
  // set options for markdown-it
  const options = Object.assign({}, config.markdownIt)

  const mdIt = md(options).use(require('markdown-it-anchor'))
  // apply markdown plugins
  config.markdownItPlugins(mdIt)

  let _data = mdIt.render(data)

  if (config.confluencer) {
    const confluenceHtml =
      config.confluenceHtml || /<p>!confluence\b/m.test(_data)
    _data = await confluencer.render(_data, {
      isHtml: !confluenceHtml,
      style: false
    })
  }

  // add template
  return _template(tmpl)({
    markdown: _data,
    title,
    highlight: config.template.highlight
  })
}

async function render(filename, title, config) {
  const data = await fsP.readFile(filename, 'utf8')
  const preprocessed = await preprocess(filename, data, config)
  const rendered = await markdown(title, preprocessed, config)
  return rendered
}
/**
 * render markdown file
 * @param  {String} filename
 * @param  {Request} req
 * @param  {Response} res
 * @param  {Function} next
 */
function renderRequest(filename, req, res, next, status = 200) {
  const title = req.url.replace(/.*\/([^/]*?)$/, '$1')

  render(filename, title, req._config)
    .then((rendered) => {
      res.writeHead(status, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy': contentSecurityPolicy
      })
      res.write(rendered)
      res.end()
    })
    .catch((err) => {
      next(newError(404, err))
    })
}

module.exports = {
  markdown,
  preprocess,
  render,
  renderRequest
}
