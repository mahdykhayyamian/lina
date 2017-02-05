const createBoardWebSocket = () => {

	const wsUri = 'ws://' + window.location.host + '/lina/broadcast';

	const websocket = new WebSocket(wsUri);

	websocket.onerror = function(evt) { onError(evt) };
	websocket.onopen = function(evt) { onOpen(evt) };

	let canvas = document.getElementById("messageBoard");

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

export {createBoardWebSocket};