import { CONSTANTS } from 'src/paragraph/constants.js';

export default class RTCClient {
	constructor(roomNumber) {
		this.roomNumber = roomNumber;
		this.webSocket = createSocket(this);
		this.onRecieveCallbacks = [];

		keepConnectionAlive(
			this.webSocket,
			CONSTANTS.WS_KEEP_ALIVE_INTERVAL_IN_MS
		);

		function createSocket(rtcClient) {
			const protocol =
				window.location.hostname === 'localhost' ? 'ws://' : 'wss://';
			const wsUri =
				protocol +
				window.location.host +
				`/broadcast?roomNumber=${roomNumber}`;
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
				//rtcClient.webSocket = createSocket(rtcClient);
			};

			function onError(evt) {
				console.error(evt.data);
			}

			function onOpen(evt) {
				console.log('Connection opened');
			}
			return webSocket;
		}

		function keepConnectionAlive(webSocket, interval) {
			setInterval(function() {
				webSocket.send(CONSTANTS.WS_KEEP_ALIVE_MESSAGE);
			}, interval);
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
