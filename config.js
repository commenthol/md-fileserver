'use strict'

const config = {
  /// host
  // host: '127.0.0.1',
  hostname: 'localhost',
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
  confluencer: false, // disable confluencer by default
  confluenceHtml: false, // use confluence html if enabled
  /// add `markdown-it` plugins
  markdownItPlugins: function (parser) {
    return parser
      .use(require('markdown-it-abbr'))
      .use(require('markdown-it-admon'))
      .use(require('markdown-it-attrs'))
      .use(require('markdown-it-emoji').full)
      .use(require('markdown-it-deflist'))
      .use(require('markdown-it-footnote'))
      .use(require('markdown-it-highlightjs'), {
        auto: false,
        register: {
          plantuml: () => ({
            name: 'plantuml',
            aliases: [
              '!plantuml',
              '!plantuml(format=svg)',
              '!plantuml(format=png)'
            ],
            keywords: [],
            contains: []
          })
        }
      })
      .use(require('@commenthol/markdown-it-katex'))
      .use(require('markdown-it-mark'))
      .use(require('markdown-it-multimd-table'), {
        multiline: true,
        rowspan: true,
        headerless: true
      })
      .use(require('markdown-it-task-lists'))
      .use(require('markdown-it-sub'))
      .use(require('markdown-it-sup'))
    // .use(require(other-plugin), {/* options */})
  },
  /// template settings
  template: {
    highlight: 'github' /// see available styles at https://github.com/highlightjs/highlight.js/tree/master/src/styles
  }
}

module.exports = config
