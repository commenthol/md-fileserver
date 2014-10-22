'use strict';

var fs = require('fs'),
	mw = require('./middlewares'),
	WebSocketServer = require('websocket').server;

var MARKDOWNEXT = mw.MARKDOWNEXT,
	WATCHOPTS = { persistent: true, recursive: false };

var M = {},
	changedFiles = {},
	connects = []; // list of connected browser pages

/**
 * create websockets
 */
M.websocket = function (server) {
	// create the server
	var wsServer = new WebSocketServer({
		httpServer: server
	});

	// WebSocket server
	wsServer.on('request', function(request) {
		if (/http:\/\/(localhost|127.0.0.1):/.test(request.origin)) {
			var connection = request.accept(null, request.origin);
			connects.push(connection);
		}
	});
};

/**
 * callback of fs.watch
 * @param {String} file
 * @return {Function} function(event)
 */
function onChange(file) {
	return function (event) {
		if (event === 'change') {
			changedFiles[file] = true;
			connects = connects.filter(function(connection) {
				if (connection.state === 'closed') {
					return false;
				}
				connection.send(encodeURIComponent(file));
			});
		}
		else if (event === 'rename') {
			if (changedFiles[file]) {
				try {
					fs.watch(file, WATCHOPTS, onChange(file));
				} catch(e) {}
			}
			changedFiles[file] = false;
		}
	};
}

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
			fs.watch(file, WATCHOPTS, onChange(file));
		}
		changedFiles[file] = false;
	}

	next && next();
};

module.exports = M;
