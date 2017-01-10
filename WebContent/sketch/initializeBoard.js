var initializeBoard = function() {
	const canvasWebSocket = createWebSocket();
	createCanvas(canvasWebSocket);
};