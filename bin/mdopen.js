#!/usr/bin/env node

var
  path = require('path'),
  spawn = require('child_process').spawn,
  config = require('../config');

var 
  file = process.argv[2],
  pwd = process.env.PWD;

if (file && pwd) { 
  file = 'http://localhost:' + config.port + path.resolve( pwd, file );
  spawn(config.browser, [ file ]);
}
else {
  console.log('TODO -- help');
}
