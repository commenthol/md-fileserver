'use strict';

var fs = require('fs'),
	mw = require('./middlewares'),
	WebSocketServer = require('websocket').server;

var MARKDOWNEXT = mw.MARKDOWNEXT;

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
		if (request.origin.indexOf('http://localhost:') === 0) {
			var connection = request.accept(null, request.origin);
			connects.push(connection);
		}
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
			fs.watchFile(file, { persistent: true, interval: 200 }, onChange(file));
		}
		changedFiles[file] = false;
	}

	next && next();
};

module.exports = M;
