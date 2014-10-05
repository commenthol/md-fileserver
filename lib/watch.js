'use strict';

var fs = require('fs'),
	mw = require('./middlewares');

var MARKDOWNEXT = mw.MARKDOWNEXT;

var M = {},
	changedFiles = {};

/**
 * callback of fs.watchFile
 * @param {String} file
 * @return {Function} function(curr, prev)
 */
function onChange(file) {
	return function (curr, prev) {
		if (curr.mtime !== prev.mtime) {
			changedFiles[file] = true;
		} 
	};
}

/**
 * middleware which is called by XHR to check if file has changed
 * @param {Object} req
 * @param {Object} res
 */
M.xhr = function (req, res) {
	var file = req.url,
		data = JSON.stringify(changedFiles[file]) + '\n';
	
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.write(data);
	res.end();
	return;
};

/**
 * middleware which registers file for watching
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
M.watch = function (req, res, next) {
	var file = req.url;
	
	if (MARKDOWNEXT.test(file)) {
		
		if (changedFiles[file] === undefined) {
			fs.watchFile(file, { persistent: true, interval: 200 }, onChange(file));
		}
		changedFiles[file] = false;
	}

	next && next();
};

module.exports = M;
