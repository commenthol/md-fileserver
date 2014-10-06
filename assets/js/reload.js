;(function(){

	window.WebSocket = window.WebSocket || window.MozWebSocket;
	
	if (WebSocket) {
		var connection = new WebSocket('ws://127.0.0.1:4000');

		connection.onmessage = function (message) {
			if (message.data === location.pathname) {
				location.reload();
			}
		};
	}

})();
