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
			console.log('got rtc message: ');
			console.log(event.data);

			console.log(this.onRecieveCallbacks);

			this.onRecieveCallbacks.forEach(callback => {
				console.log('callback to call');
				console.log(callback);
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
		console.log('in subscribeMessageReceiver');
		this.onRecieveCallbacks.push(receiverCallback);
		console.log(this.onRecieveCallbacks);
	}
}
