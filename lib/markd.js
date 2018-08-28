'use strict'

var _ = require('lodash')
var fs = require('fs')
var path = require('path')
var hljs = require('highlight.js')
var markedpp = require('markedpp')
var md = require('markdown-it')

var config = require('../config')

var M = {}

/**
 * @param {String} reqUrl : request url
 * @param {String} data : markdown data
 * @param {Function} callback : type `function(err, data)`
 */
M.preprocess = function (reqUrl, data, options, callback) {
  markedpp.setOptions(config.markedpp)
  markedpp(data, { dirname: path.dirname(reqUrl) }, callback)
}

/**
 * transform markdown into html
 * @param {String} reqUrl : request url
 * @param {String} data : markdown data
 * @param {Function} callback : type `function(err, data)`
 */
M.markdown = function (reqUrl, data, callback) {
  // set options for marked
  var title = reqUrl.replace(/.*\/([^/]*?)$/, '$1')
  var options = _.assign({}, config.markdownIt, {
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
