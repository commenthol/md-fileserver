'use strict';

var fs = require('fs'),
	async = require('async'),
	serveIndex = require('serve-index'),
	serveStatic = require('serve-static');

var config = require('../config'),
	markd  = require('./markd');

var MARKDOWNEXT = /\.(md|mdown|markdown)$/;

/**
 * sets error
 * @param {Error|Number} err
 * @return {Error}
 */
function newError(err) {
	var map = {
		403: { status: 403, message: 'Access forbidden' },
		404: { status: 404, message: 'Not found' },
		600: { status: 600 } // do not return any message
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
		if (!(req.connection.remoteAddress === '127.0.0.1' ||       // ipv4
				req.connection.remoteAddress === '::ffff:127.0.0.1')) { // hybrid ipv6
			console.error('Access forbidden for ' + req.connection.remoteAddress);
			return next(newError(600));
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
		if ( MARKDOWNEXT.test(req.url) ) {
			fs.readFile(req.url, { encoding: 'utf8' }, function(err, data) {
				if (err) {
					return next(newError(404));
				}
				markd.preprocess(req.url, data, {}, function(err, data){
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
	serveIndex: function (req, res, next) {
			serveIndex( '/', { icons: true, filter: function(f){
				var stats;
				if (! config.filter) {
					return f;
				} else { // filter only markdown files
					stats = fs.statSync(req.url + '/' + f);
					if (! stats.isFile() || MARKDOWNEXT.test(f)) {
						return f;
					}
					return;
				}
			} 
		})(req, res, function(err){
			return next(err);
		});
	},
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
		if (err.status === 600) {
			res.destroy();
		}
		else {
			res.writeHead(err.status || 404);
			res.write(err.message || 'Not found');
			res.end();
		}
		return;
	}
};

M.MARKDOWNEXT = MARKDOWNEXT;

module.exports = M;
