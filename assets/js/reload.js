;(function(){

	window.WebSocket = window.WebSocket || window.MozWebSocket;
	
	if (WebSocket) {
		var connection = new WebSocket('ws://127.0.0.1:4000');

		connection.onopen = function () {
			// connection is opened and ready to use
		};

		connection.onerror = function (error) {
			// an error occurred when sending/receiving data
		};

		connection.onmessage = function (message) {
			console.log(message.data);
			// handle incoming message
			if (message.data === location.pathname) {
				console.log('reloading');
				location.reload();
			}
		};
	}

})();
