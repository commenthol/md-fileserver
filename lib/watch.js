'use strict';

var fs = require('fs'),
	mw = require('./middlewares'),
	WebSocketServer = require('websocket').server;

var MARKDOWNEXT = mw.MARKDOWNEXT;

var M = {},
	watchFile = fs.watchFile,
	changedFiles = {},
	connects = []; // list of connected browser pages

if (process.platform === 'darwin') {
	watchFile = fs.watch;
}

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
 * callback of fs.watchFile || fs.watch
 * @param {String} file
 * @return {Function} function(curr, prev)
 */
function onChange(file) {
	return function (curr, prev) {
		if ((curr && prev && (curr.mtime !== prev.mtime)) || 
			curr === 'change') 
		{
			changedFiles[file] = true;
			connects = connects.filter(function(connection) {
				if (connection.state === 'closed') {
					return false;
				}
				connection.sendUTF(file);
				return true;
			});
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
			watchFile(file, { persistent: true, recursive: false, interval: 200 }, onChange(file));
		}
		changedFiles[file] = false;
	}

	next && next();
};

module.exports = M;
