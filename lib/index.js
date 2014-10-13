'use strict';

var http = require('http'),
	express = require('express');

var config = require('../config'),
	watch = require('./watch'),
	mw = require('./middlewares');

var server,
	app = express();

// css
app.use('/css/', mw.serveStatic(config.template.assets + config.template.css))
	.use(mw.error);

// js
app.use('/js/', mw.serveStatic(config.template.assets + config.template.js))
	.use(mw.error);

// all other files under `config.home`
app.use(mw.forbiddenRemote)
	.use(mw.forbiddenNotHome)
	.use(mw.unescape)
	.use(watch.watch)
	.use(mw.markdown)
	.use(mw.serveIndex)
	.use(mw.serveStatic('/'))
	.use(mw.error);

// anything else
app.use(mw.forbiddenRemote)
	.use(mw.forbiddenNotHome)
	.use(mw.error);

console.log('"md-fileserver" started. Open http://localhost:' + config.port + ' in browser.');
server = http.createServer(app).listen(config.port, '127.0.0.1');
watch.websocket(server);
