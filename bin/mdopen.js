#!/usr/bin/env node

var
  path = require('path'),
  spawn = require('child_process').spawn,
  config = require('../config');

var 
  file = process.argv[2],
  browserExe = config.browser[process.platform];

if (file && browserExe) { 
  file = 'http://localhost:' + config.port + path.resolve( process.cwd(), file );
  spawn(browserExe, [ file ]);
}
else {
  console.log('\
Usage: mdopen <file>\n\
\n\
Make sure that the "markdown-server" is running.\n\
Otherwise start it with `mdstart`.\n\
');
}
