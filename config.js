'use strict';

var config = {
  /// port for server
  port: 4000,
  /// grant access only to $HOME
  home: process.env.HOME,
  /// options for `marked`
  browser: 'firefox',
  marked: {
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    langPrefix: ''
  },
  /// template settings
  template: {
    assets: __dirname + '/assets',
    css: '/css/',
    js: '/js/',
    template: 'template.html'
  },
};

module.exports = config;
