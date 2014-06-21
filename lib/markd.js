'use strict';

var
  _ = require('lodash'),
  fs = require('fs'),
  hljs = require('highlight.js'),
  marked = require('marked');

var 
  config = require('../config');

var M = {};

/**
 * @param {String} reqUrl : request url
 * @param {String} data : markdown data
 * @param {Function} callback : type `function(err, data)`
 */
M.includeFiles = function(reqUrl, data, options, callback) {
  var
    regex = /[^\\](!INCLUDE *\(([^\)]+)\))/g,
    store = [],
    includes = [];
 
  data.replace(regex, function(m, i){
    includes.push(i);
  });
  includes = _.uniq(includes); 
 
  reqUrl = reqUrl.replace(/^(.*\/)[^\/]+$/, '$1');

  if (typeof options === 'function') {
    callback = options;
  }
  
  if (includes.length === 0) {
    return callback(null, data);
  } 
  
  (function(_callback){
    var cnt = 0;
    
    includes.forEach(function(i){
      var file = (' '+i).replace(regex, '$2');
      file = /^samples/.test(file) ? reqUrl + '../' + file : reqUrl + file
      
      fs.readFile(file, function(err, data) {
        store[i] = data || err;
        if ( ++cnt === includes.length) {
          return _callback();
        }
      });
    });
  })(function(){
    data = data.replace(regex, function(m, i){
      return '\n' + store[i] || i;
    });
    return callback(null, data);
  });
};

/**
 * transform markdown into html
 * @param {String} reqUrl : request url
 * @param {String} data : markdown data
 * @param {Function} callback : type `function(err, data)`
 */
M.markdown = function(reqUrl, data, callback) {
  // set options for marked
  var 
    mapLang = {
      'js': 'javascript'
    }, 
    title = reqUrl.replace(/.*\/([^\/]*?)$/, '$1'),
    options = config.marked || {};

  options.highlight = function (code, lang) {
    lang = mapLang[lang] || lang;
    var res = hljs.highlightAuto(code, [ lang ] );
    return res.value;
  }
  options.langPrefix = '';
  
  marked.setOptions(options);
  
  data = marked(data);
  
  fs.readFile(config.template.assets + '/' + config.template.template, function(err, temp) {
    if (err) {
      return callback (null, data);
    }
    return callback(null, _.template(temp, {markdown: data, title: title, cssDir: '/css/' })); 
  });
  
};

module.exports = M;
