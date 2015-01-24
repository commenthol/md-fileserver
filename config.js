'use strict';

var config = {
	/// host
	//host: '127.0.0.1',
	host: 'localhost',
	/// port for server
	port: 4000,
	/// grant access only to $HOME
	home: process.env.HOME,
	/// browser settings per platform
	browser: {
		darwin: 'open',              // Default browser
		//darwin: 'open -a Safari',  // Safari
		//darwin: 'open -a Firefox', // Firefox
		linux: 'x-www-browser',      // Default browser use `sudo update-alternatives --config x-www-browser` to change
		//linux: 'firefox',
		win32: 'firefox.exe'
	},
	/// show only markdown files in browser folder view
	filter: true,
	/// options for `markedpp` see https://github.com/commenthol/markedpp
	markedpp: {
		gfm: true,    // consider gfm fences
		breaks: true, // render <br> tags for Table of Contents with numbered style
		tags: true,   // render pre-proc tags <!-- !command -->
		level: 3,     // default level for !toc and !numberheadings
		minlevel: 1   // default minlevel for !toc and !numberheadings
	},
	/// options for `marked` see https://github.com/chjj/marked
	marked: {
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: false,
		smartLists: true,
		smartypants: false
	},
	/// template settings
	template: {
		assets: __dirname + '/assets',
		css: '/css/',
		js: '/js/',
		template: 'template.html',
		highlight: 'himbeere.css', // github.css || himbeere.css
	},
};

module.exports = config;
