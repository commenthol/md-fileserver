'use strict';

var net = require('net');

var isPortOpen = function (options, callback) {
	var conn;
	var timeoutId;
	var isOpen = false;

	var port = options.port;
	var host = options.host || '127.0.0.1';
	var timeout = options.timeout || 100;

	function onEnd() {
		clearTimeout(timeoutId);
		callback(isOpen);
	}

	function onOpen() {
		isOpen = true;
		conn.end();
	}

	timeoutId = setTimeout(function() {
		conn.destroy();
	}, timeout);

	conn = net.createConnection(port, host, onOpen);

	conn
	.on('close', onEnd)
	.on('error', function() {
		conn.end();
	})
	.on('connect', onOpen);
};

module.exports = isPortOpen;
