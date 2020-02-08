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
				rtcClient.onRecieveCallbacks.forEach(callback => {
					callback(event.data);
				});
			};

			webSocket.onclose = event => {
				rtcClient.webSocket = createSocket(rtcClient);
			};

			function onError(evt) {
				console.error(evt.data);
			}

			function onOpen(evt) {
				console.log('Connection opened');
			}
			return webSocket;
		}
	}

	send(message) {
		console.log('going to send message');
		this.webSocket.send(message);
	}

	subscribeMessageReceiver(receiverCallback) {
		this.onRecieveCallbacks.push(receiverCallback);
	}
}
