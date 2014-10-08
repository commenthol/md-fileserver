'use strict';

var
	_ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	hljs = require('highlight.js'),
	marked = require('marked'),
	markedpp = require('markedpp');

var
	config = require('../config');

var M = {};

/**
 * @param {String} reqUrl : request url
 * @param {String} data : markdown data
 * @param {Function} callback : type `function(err, data)`
 */
M.preprocess = function(reqUrl, data, options, callback) {
	markedpp.setOptions(config.markedpp);
	markedpp(data, { dirname: path.dirname(reqUrl) }, callback);
};

/**
 * transform markdown into html
 * @param {String} reqUrl : request url
 * @param {String} data : markdown data
 * @param {Function} callback : type `function(err, data)`
 */
M.markdown = function(reqUrl, data, callback) {
	// set options for marked
	var
		mapLang = {
			'js': 'javascript'
		},
		title = reqUrl.replace(/.*\/([^\/]*?)$/, '$1'),
		options = config.marked || {};

	options.highlight = function (code, lang) {
		lang = mapLang[lang] || lang;
		var res = hljs.highlightAuto(code, [ lang ] );
		return res.value;
	};
	options.langPrefix = '';

	marked.setOptions(options);

	data = marked(data);

	fs.readFile(config.template.assets + '/' + config.template.template, function(err, temp) {
		if (err) {
			return callback (null, data);
		}
		return callback(null, _.template(temp, {markdown: data, title: title, cssDir: '/css/' }));
	});

};

module.exports = M;
