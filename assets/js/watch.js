;(function(){

/*
 * XHR Request
 * adapted code from <https://github.com/xui/xui/blob/master/src/js/xhr.js>
 * @credits Brian LeRoux, Brock Whitten, Rob Ellis
 */
function xhr (url, options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = null;
	}
	var o = options ? options : {};
	var	req    = new XMLHttpRequest(),
		method = o.method || 'get',
		async  = (typeof o.async !== 'undefined' ? o.async : true),
		params = o.data || null,
		key;

	req.queryString = params;
	req.open(method, url, async);
	// Set "X-Requested-With" header
	req.setRequestHeader('X-Requested-With','XMLHttpRequest');

	if (method.toLowerCase() == 'post') {
		req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	}

	for (key in o.headers) {
		if (o.headers.hasOwnProperty(key)) {
			req.setRequestHeader(key, o.headers[key]);
		}
	}

	function stateChange(){
		if(req.readyState === 4) {
			if((/^[20]/).test(req.status)) {
				callback(null, req.responseText);
			}
			else if((/^[45]/).test(req.status)) {
				callback(new Error(req.status));
			}
		}
	}

	if (async) {
		req.onreadystatechange = stateChange;
	}
	req.send(params);
	if (!async) stateChange();
}

function check () {
	var key = 'scroll',
		pos,
		url = location.protocol + 
		'//' + location.host + 
		'/xhr' + location.pathname;

	// longpolling
	xhr(url, function(err, data){
		if (0 === data.indexOf('true')) {
			location.reload();
		}
	});
}

var timer = {
	id: 0,
	start: function() {
		if (! this.id ) {
			this.id = setInterval(check, 500);
		}
	},
	stop: function() {
		if (this.id) {
			clearTimeout(this.id);
		}
		this.id = 0;
	}
};

timer.start();

function onPageShow(event) {
	timer.start();
}
//~ 
function onPageHide(event) {
	timer.stop();
}

// window handling to prevent battery drain
//~ window.onfocus = window.onpageshow = onPageShow;
//~ window.onblur = window.onpagehide = onPageHide;

})();
