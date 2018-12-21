const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const hljs = require('highlight.js')
const markedpp = require('markedpp')
const md = require('markdown-it')

const config = require('../config')

const M = {}

/**
 * @param {String} filename : request url
 * @param {String} data : markdown data
 * @param {Function} callback : type `function(err, data)`
 */
M.preprocess = function (filename, data, options, callback) {
  markedpp.setOptions(config.markedpp)
  markedpp(data, { dirname: path.dirname(filename) }, callback)
}

/**
 * transform markdown into html
 * @param {String} reqUrl : request url
 * @param {String} data : markdown data
 * @param {Function} callback : type `function(err, data)`
 */
M.markdown = function (reqUrl, data, callback) {
  // set options for marked
  const title = reqUrl.replace(/.*\/([^/]*?)$/, '$1')
  const options = _.assign({}, config.markdownIt, {
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
    return callback(null, _.template(temp)({ markdown: data,
      title: title,
      cssDir: config.template.css,
      highlight: config.template.highlight
    }))
  })
}

module.exports = M
