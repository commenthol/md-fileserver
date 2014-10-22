#!/usr/bin/env node

var
	path = require('path'),
	spawn = require('child_process').spawn,
	config = require('../config');

var args;
	file = process.argv[2],
	browserExe = config.browser[process.platform];

if (file && browserExe) { 
	file = 'http://' + config.host + ':' + config.port + path.resolve( process.cwd(), file );
	args = browserExe.split(/ +/);
	args.push(file);
	browserExe = args.shift();
	spawn(browserExe, args);
}
else {
	console.log('\
Usage: mdopen <file>\n\
\n\
Make sure that the "md-fileserver" is running.\n\
Otherwise start it with `mdstart`.\n');
}
