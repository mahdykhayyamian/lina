export default class RTCClient {
	constructor() {
		this.webSocket = createSocket(this);
		this.onRecieveCallbacks = [];

		function createSocket(rtcClient) {
			const protocol =
				window.location.hostname === 'localhost' ? 'ws://' : 'wss://';
			const wsUri = protocol + window.location.host + '/broadcast';
			const webSocket = new WebSocket(wsUri);

			webSocket.onerror = function(evt) {
				onError(evt);
			};

			webSocket.onopen = function(evt) {
				onOpen(evt);
			};

			webSocket.onmessage = event => {
				console.log('message received');
				rtcClient.onRecieveCallbacks.forEach(callback => {
					callback(event.data);
				});
			};

			webSocket.onclose = event => {
				console.log('WebSocket is closed now.');
				console.log(event);

				console.log('creating connection again');
				rtcClient.webSocket = createSocket(rtcClient);
			};

			function onError(evt) {
				console.error(evt.data);
			}

			function onOpen(evt) {
				console.log('Connection opened');
				console.log(evt);
			}
			return webSocket;
		}
	}

	send(message) {
		console.log('going to send message');
		console.log(this);
		this.webSocket.send(message);
	}

	subscribeMessageReceiver(receiverCallback) {
		this.onRecieveCallbacks.push(receiverCallback);
	}
}
