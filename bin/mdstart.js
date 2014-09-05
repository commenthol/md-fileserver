#!/usr/bin/env node

var config = require('../config');

if (require.main === module) {
  console.log('md-fileserver started on 127.0.0.1 port ' + config.port);
  require('../lib').listen(config.port);
}
