const createWebSocket = function() {

	const wsUri = "ws://localhost:8080/lina/broadcast";
	const websocket = new WebSocket(wsUri);

	websocket.onerror = function(evt) { onError(evt) };
	websocket.onopen = function(evt) { onOpen(evt) };


	var canvas = document.getElementById("messageBoard");

	function onError(evt) {
	    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
	}

	function onOpen() {
	    writeToScreen("Connected to " + wsUri);
	}

	function writeToScreen(message) {
	    canvas.innerHTML += message + "<br>";
	}

	return websocket;

};