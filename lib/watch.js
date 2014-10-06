'use strict';

var fs = require('fs'),
	mw = require('./middlewares'),
	WebSocketServer = require('websocket').server;

var MARKDOWNEXT = mw.MARKDOWNEXT;

var M = {},
	connection,
	changedFiles = {};

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
		connection = request.accept(null, request.origin);

		// This is the most important callback for us, we'll handle
		// all messages from users here.
		connection.on('message', function(message) {
			console.log(message);
			if (message.type === 'utf8') {
				// process WebSocket message
			}
		});

		connection.on('close', function(connection) {
			// close user connection
		});
	});
};

/**
 * callback of fs.watchFile
 * @param {String} file
 * @return {Function} function(curr, prev)
 */
function onChange(file) {
	return function (curr, prev) {
		if (curr.mtime !== prev.mtime) {
			changedFiles[file] = true;
			connection.sendUTF(file);
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
			fs.watchFile(file, { persistent: true, interval: 200 }, onChange(file));
		}
		changedFiles[file] = false;
	}

	next && next();
};

module.exports = M;
