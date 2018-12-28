'use strict'

var path = require('path')

var config = {
  /// host
  host: 'localhost',
  /// port for server
  port: 4000,
  /// browser settings per platform
  browser: {
    darwin: ['open'],
    linux: ['x-www-browser'], // Default browser use `sudo update-alternatives --config x-www-browser` to change
    win32: ['cmd.exe', '/C', 'start']
  },
  /// show only markdown files in browser folder view
  filter: true,
  /// options for `markedpp` see https://github.com/commenthol/markedpp
  markedpp: {
    gfm: true, // consider gfm fences
    breaks: true, // render <br> tags for Table of Contents with numbered style
    tags: true, // render pre-proc tags <!-- !command -->
    level: 3, // default level for !toc and !numberheadings
    minlevel: 1 // default minlevel for !toc and !numberheadings
  },
  /// options for `markdown-it` see https://github.com/markdown-it/markdown-it#api
  markdownIt: {
    html: true,
    linkify: true,
    typographer: false
  },
  /// add `markdown-it` plugins
  markdownItPlugins: function (parser) {
    return parser
      .use(require('markdown-it-emoji'))
      .use(require('markdown-it-task-lists'))
      .use(require('markdown-it-footnote'))
      .use(require('markdown-it-katex'))
    // .use(require(other-plugin), {/* options */})
  },
  /// template settings
  template: {
    assets: path.join(__dirname, 'assets'),
    css: '/css/',
    js: '/js/',
    template: 'template.html',
    highlight: 'github.css' // github.css || himbeere.css
  }
}

module.exports = config
