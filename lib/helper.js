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
    regex = /!INCLUDE "([^"]+)"/g,
    store = [],
    includes = _.uniq((data.match(regex) || []));
    
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
      var file = i.replace(regex, '$1');
      file = /^samples/.test(file) ? reqUrl + '../' + file : reqUrl + file
      //~ file = reqUrl + file;
      //~ console.log('#1', i, file);
      
      fs.readFile(file, function(err, data) {
        store[i] = data || err;
        if ( ++cnt === includes.length) {
          return _callback();
        }
      });
    });
  })(function(){
    data = data.replace(regex, function(m, i){
      //~ console.log('#2', m, i);
      return store[m] || '';
    });
    return callback(null, data);
  });
};

/**
 * TODO:
 */
M.markdown = function(data, callback) {
  
  // set options for marked
  var 
    mapLang = {
      'js': 'javascript'
    }, 
    options = config.marked || {};

  options.highlight = function (code, lang) {
    lang = mapLang[lang] || lang;
    var res = hljs.highlightAuto(code, [ lang ] );
    return res.value;
  }
  
  marked.setOptions(options);
  
  data = marked(data);
  
  fs.readFile(config.template.assets + '/' + config.template.template, function(err, temp) {
    if (err) {
      return callback (null, data);
    }
    return callback(null, _.template(temp, {markdown: data, title: 'title', cssDir: '/css/' })); 
  });
  
};

module.exports = M;
