;(function(){
	var reest;

	window.WebSocket = window.WebSocket || window.MozWebSocket;

	if (WebSocket) {

		function recreateConnection() {
			reest = true;
			setTimeout(createConnection, 1000);
		}

		function createConnection() {
			var connection = new WebSocket('ws://127.0.0.1:4000');

			connection.onmessage = function (message) {
				if (message.data === location.pathname) {
					location.reload();
				}
			};

			connection.onopen = function() {
				if (reest && connection) {
					reest = false;
					location.reload();
				}
			};

			connection.onclose = function() {
				// automatically reconnect - onclose is always called even if socket cannot connect.
				recreateConnection();
			};

			connection.onerror = function(err) {};
		}

		createConnection();
	}

})();
