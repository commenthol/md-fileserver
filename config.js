'use strict';

var config = {
  /// port for server
  port: 4000,
  /// grant access only to $HOME
  home: process.env.HOME,
  /// browser settings per platform
  browser: {
    darwin: 'open', 
    linux: 'firefox',
    win32: 'firefox.exe'
  },
  /// options for `marked` see https://github.com/chjj/marked
  marked: {
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
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
