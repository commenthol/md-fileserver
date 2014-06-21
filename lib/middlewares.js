'use strict';

var 
  fs = require('fs'),
  async = require('async'),
  serveIndex = require('serve-index'),
  serveStatic = require('serve-static');

var 
  config = require('../config'),
  markd = require('./markd');

/**
 * sets error
 * @param {Error|Number} err
 * @return {Error}
 */
function newError(err) {
  var map = {
    403: { status: 403, message: 'Access forbidden' },
    404: { status: 404, message: 'Not found' }
  };
  if (typeof err === 'string' || typeof err === 'number') {
    err = map[err] || err;
  }
  return err;
}

/**
 * middlewares
 */
var M = {
  // only allow access from localhost
  forbiddenRemote: function(req, res, next) {
    if (req.connection.remoteAddress !== '127.0.0.1') {
      return next(newError(403));
    }
    return next();
  },
  // no access to other folders than under $HOME
  forbiddenNotHome: function(req, res, next) {
    if (config.home && req.url.indexOf(config.home + '/') !== 0) {
      res.redirect(config.home + '/');
      return;
    }
    return next();
  },
  // make markdown conversion
  markdown: function(req, res, next) {
    // transform markdown pages
    if ( /\.(md|markdown)$/.test(req.url) ) {
      fs.readFile(req.url, function(err, data) {
        if (err) {
          return next(newError(404));
        }
        markd.includeFiles(req.url, data.toString(), function(err, data){
          markd.markdown(req.url, data, function(err, data){
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
            return;
          });
        });
      });
    }
    else {
      return next();
    }
  },
  // show index for directories
  serveIndex: serveIndex( '/', {'icons': true}),
  // serve static files
  serveStatic: function (path, options) {
    path = path || '/';
    options = options || {};
    return function(req, res, next) {
      serveStatic( path, options )(req, res, function(err) {
        // called only if file cannot be served
        if (!err) {
          // `err` is undefined if file not found - so set
          err = newError(404);
        }
        return next(err);
      });
    };
  },
  // error handler
  error: function(err, req, res, next) {
    //~ console.log(err, err.status, err.message);
    res.writeHead(err.status || 404);
    res.write(err.message || 'Not found');
    res.end();
    return;
  }
};

module.exports = M;
