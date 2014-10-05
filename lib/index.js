'use strict';

var
  express = require('express');

var
  config = require('../config'),
  watch = require('./watch'),
  mw = require('./middlewares');

var 
  app = express();

// css
app.use('/css/', mw.serveStatic(config.template.assets + config.template.css))
  .use(mw.error);

// js
app.use('/js/', mw.serveStatic(config.template.assets + config.template.js))
  .use(mw.error);
  
app.use('/xhr/', watch.xhr)
  .use(mw.error);

// all other files under `config.home`
app.use(mw.forbiddenRemote)
  .use(mw.forbiddenNotHome)
  .use(watch.watch)
  .use(mw.markdown)
  .use(mw.serveIndex)
  .use(mw.serveStatic('/'))
  .use(mw.error);

// anything else
app.use(mw.forbiddenRemote)
  .use(mw.forbiddenNotHome)
  .use(mw.error);

module.exports = app;

if (require.main === module) {
  console.log('md-fileserver started on 127.0.0.1 port ' + config.port);
  app.listen(config.port);
}
