const createBoardWebSocket = () => {

	const wsUri = 'ws://' + window.location.host + '/lina/broadcast';

	const websocket = new WebSocket(wsUri);

	websocket.onerror = function(evt) { onError(evt) };
	websocket.onopen = function(evt) { onOpen(evt) };

	let canvas = document.getElementById("messageBoard");

	function onError(evt) {
	    console.error(evt.data);
	}

	function onOpen() {
	    console.log("Connected to " + wsUri);
	}

	return websocket;
};

export {createBoardWebSocket};