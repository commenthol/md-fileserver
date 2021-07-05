const _template = require('lodash.template')
const fs = require('fs')
const path = require('path')
const markedpp = require('markedpp')
const md = require('markdown-it')
const { newError } = require('./utils')
const confluencer = require('confluencer')

const tmpl = fs.readFileSync(path.resolve(__dirname, 'pages', 'template.html'))

/**
 * @callback Callback
 * @param {Error} err
 * @param {String} data
 */
/**
 * @param {String} filename - request url
 * @param {String} data - markdown data
 * @param {Callback} callback
 */
function preprocess (filename, data, config, callback) {
  const options = Object.assign({ dirname: path.dirname(filename), markdownit: true }, config.markedpp)
  markedpp(data, options, callback)
}

/**
 * transform markdown into html
 * @param {String} reqUrl - request url
 * @param {String} data - markdown data
 * @param {Callback} callback
 */
async function markdown (reqUrl, data, config, callback) {
  // set options for marked
  const title = reqUrl.replace(/.*\/([^/]*?)$/, '$1')
  const options = Object.assign({}, config.markdownIt)

  let _data = config.markdownItPlugins(md(options))
    .use(require('markdown-it-anchor'), {
      // slugify: (id) => {
      //   return id
      //     .replace(/(&[lg]t;|[^\w]+)/g, '-')
      //     .toLowerCase()
      // }
    })
    .render(data)

  if (config.confluencer) {
    const confluenceHtml = config.confluenceHtml || /<p>!confluence\b/m.test(_data)
    _data = await confluencer.render(_data, { isHtml: !confluenceHtml, style: false })
  }

  // add template
  callback(null, _template(tmpl)({
    markdown: _data,
    title: title,
    highlight: config.template.highlight
  }))
}

/**
 * render markdown file
 * @param  {String} filename
 * @param  {Request} req
 * @param  {Response} res
 * @param  {Function} next
 */
function render (filename, req, res, next, status = 200) {
  fs.readFile(filename, 'utf8', function (err, data) {
    if (err) {
      next(newError(404))
      return
    }
    preprocess(filename, data, req._config, (_err, data) => {
      markdown(req.url, data, req._config, (_err, data) => {
        res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' })
        res.write(data)
        res.end()
      })
    })
  })
}

module.exports = {
  markdown,
  preprocess,
  render
}
