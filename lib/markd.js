const _template = require('lodash.template')
const fs = require('fs')
const path = require('path')
const hljs = require('highlight.js')
const markedpp = require('markedpp')
const md = require('markdown-it')
const { newError } = require('./utils')
const config = require('../config')

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
function preprocess (filename, data, options, callback) {
  markedpp.setOptions(config.markedpp)
  markedpp(data, { dirname: path.dirname(filename) }, callback)
}

/**
 * transform markdown into html
 * @param {String} reqUrl - request url
 * @param {String} data - markdown data
 * @param {Callback} callback
 */
function markdown (reqUrl, data, callback) {
  // set options for marked
  const title = reqUrl.replace(/.*\/([^/]*?)$/, '$1')
  const options = Object.assign({}, config.markdownIt, {
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value
          } catch (e) { // eslint-disable-line
        }
      }
      return '' // use external default escaping
    }
  })

  data = config.markdownItPlugins(md(options))
    .use(require('markdown-it-anchor'), {
      slugify: function (id) {
        return id
          .replace(/[^\w]+/g, '-')
          .toLowerCase()
      }
    })
    .render(data)

  // add template
  fs.readFile(path.join(config.template.assets, config.template.template), function (err, temp) {
    if (err) {
      return callback(null, data)
    }
    return callback(null, _template(temp)({ markdown: data,
      title: title,
      cssDir: config.template.css,
      highlight: config.template.highlight
    }))
  })
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
    preprocess(filename, data, {}, function (_err, data) {
      markdown(req.url, data, function (_err, data) {
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
