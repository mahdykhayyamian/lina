export default class RTCClient {
	constructor() {
		const protocol =
			window.location.hostname === 'localhost' ? 'ws://' : 'wss://';

		const wsUri = protocol + window.location.host + '/broadcast';

		this.webSocket = new WebSocket(wsUri);

		this.webSocket.onerror = function(evt) {
			onError(evt);
		};
		this.webSocket.onopen = function(evt) {
			onOpen(evt);
		};

		this.webSocket.onmessage = event => {
			this.onRecieveCallbacks.forEach(callback => {
				callback(event.data);
			});
		};

		function onError(evt) {
			console.error(evt.data);
		}

		function onOpen() {
			console.log('Connected to ' + wsUri);
		}

		this.onRecieveCallbacks = [];
	}

	send(message) {
		this.webSocket.send(message);
	}

	subscribeMessageReceiver(receiverCallback) {
		this.onRecieveCallbacks.push(receiverCallback);
	}
}
