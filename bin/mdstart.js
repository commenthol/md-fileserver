#!/usr/bin/env node

var config = require('../config');

if (require.main === module) {
  console.log('"md-fileserver" started. Open http://localhost:' + config.port + ' in browser.');
  require('../lib').listen(config.port);
}
