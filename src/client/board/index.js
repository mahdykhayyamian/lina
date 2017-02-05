import {Pencil} from "../toolbox/pencil.js";

export const Board = (function() {

	let self;

	function Board (boardWebSocket, parent, width, height, fillColor) {
		self = this;

		self.boardWebSocket = boardWebSocket;
		setupBoardWebSocketEventHandlers();

		self.canvasNode = document.createElement('canvas');
		self.canvasContext = self.canvasNode.getContext('2d');
		self.canvasNode.width = width || 100;
		self.canvasNode.height = height || 100;
		parent.appendChild(self.canvasNode);
		setupNodeEventHandlers();

		clearTo(fillColor || "#ddd");

		self.pencil = new Pencil();
		self.pencil.draw();
	};

	function fillCircle (x, y, radius, fillColor) {
		self.canvasContext.fillStyle = fillColor;
		self.canvasContext.beginPath();
		self.canvasContext.moveTo(x, y);
		self.canvasContext.arc(x, y, radius, 0, Math.PI * 2, false);
		self.canvasContext.fill();
	}

	function clearTo(fillColor) {
		self.canvasContext.fillStyle = fillColor;
		self.canvasContext.fillRect(0, 0, self.canvasNode.width, self.canvasNode.height);
	}

	function setupNodeEventHandlers() {

		self.canvasNode.onmousemove = function(e) {
			if (!self.isDrawing) {
			   return;
			}
			var x = e.pageX - this.offsetLeft;
			var y = e.pageY - this.offsetTop;
			var radius = 10; // or whatever
			var fillColor = 'green';
			fillCircle(x, y, radius, fillColor);

			//self.pencil.moveTo(x,y);

			var msg = {
				type: 'command',
				command: {
					type: 'fillCircle',
					x: x,
					y: y,
					radius: radius,
					fillColor: fillColor
				}
			  };


			self.boardWebSocket.send(JSON.stringify(msg));
		};

		self.canvasNode.onmousedown = function(e) {
			self.isDrawing = true;
			var msg = {
				type: 'command',
				command: {
					type: 'mouseDown'
				}
			  };

			self.boardWebSocket.send(JSON.stringify(msg));
		};

		self.canvasNode.onmouseup = function(e) {
			self.isDrawing = false;
			var msg = {
				type: 'command',
				command: {
					type: 'mouseUp'
				}
			  };

			self.boardWebSocket.send(JSON.stringify(msg));
		};
	}

	function setupBoardWebSocketEventHandlers() {
	 	self.boardWebSocket.onmessage = function (eventStr) {
			console.log(eventStr);
			var data = JSON.parse(eventStr.data);

			if (data.command.type === 'fillCircle') {
				fillCircle(data.command.x, data.command.y, data.command.radius, data.command.fillColor);
			} else if (data.command.type === 'mouseUp') {
				self.isDrawing = false;
			} else if (data.command.type === 'mouseDown') {
				self.isDrawing = true;
			}
		}
	}

	return Board;
})();