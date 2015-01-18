#!/usr/bin/env node

var
	path = require('path'),
	child = require('child_process'),
	isPortOpen = require('../lib/checkport'),
	config = require('../config');

var args;
	file = process.argv[2],
	browserExe = config.browser[process.platform];

isPortOpen({ port: config.port }, function(isOpen) {

	if (!isOpen) {
		child.execFile(__dirname + '/mdstart.js');
	}

	if (file && browserExe) {
		file = 'http://' + config.host + ':' + config.port + path.resolve( process.cwd(), file );
		args = browserExe.split(/ +/);
		args.push(file);
		browserExe = args.shift();
		child.spawn(browserExe, args);
	}
	else {
		console.log('\
	Usage: mdopen <file>\n\
	\n\
	Make sure that the "md-fileserver" is running.\n\
	Otherwise start it with `mdstart`.\n');
	}

});
