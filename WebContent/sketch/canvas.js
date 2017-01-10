var createCanvas = function(canvasWebSocket) {

	// Creates a new canvas element and appends it as a child
	// to the parent element, and returns the reference to
	// the newly created canvas element

	var that = this;
	this.canvasWebSocket = canvasWebSocket;

	this.canvasWebSocket.onmessage = function (eventStr) {
		console.log(eventStr);
		var data = JSON.parse(eventStr.data);
		var ctx = that.canvas.context;

		if (data.command.type === 'fillCircle') {
			ctx.fillCircle(data.command.x, data.command.y, data.command.radius, data.command.fillColor);
		} else if (data.command.type === 'mouseUp') {
			that.canvas.isDrawing = false;
		} else if (data.command.type === 'mouseDown') {
			that.canvas.isDrawing = true;
		}
	}

	function createCanvas(parent, width, height) {
		var canvas = {};
		canvas.node = document.createElement('canvas');
		canvas.context = canvas.node.getContext('2d');
		canvas.node.width = width || 100;
		canvas.node.height = height || 100;
		parent.appendChild(canvas.node);
		that.canvas = canvas;
		return canvas;
	}

	function init(container, width, height, fillColor) {
		var canvas = createCanvas(container, width, height);
		var ctx = canvas.context;
		// define a custom fillCircle method
		ctx.fillCircle = function(x, y, radius, fillColor) {
			this.fillStyle = fillColor;
			this.beginPath();
			this.moveTo(x, y);
			this.arc(x, y, radius, 0, Math.PI * 2, false);
			this.fill();
		};

		ctx.clearTo = function(fillColor) {
			ctx.fillStyle = fillColor;
			ctx.fillRect(0, 0, width, height);
		};
		ctx.clearTo(fillColor || "#ddd");

		// bind mouse events
		canvas.node.onmousemove = function(e) {
			if (!canvas.isDrawing) {
			   return;
			}
			var x = e.pageX - this.offsetLeft;
			var y = e.pageY - this.offsetTop;
			var radius = 10; // or whatever
			var fillColor = '#ff0000';
			ctx.fillCircle(x, y, radius, fillColor);

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

			that.canvasWebSocket.send(JSON.stringify(msg));
		};

		canvas.node.onmousedown = function(e) {
			canvas.isDrawing = true;
			var msg = {
				type: 'command',
				command: {
					type: 'mouseDown'
				}
			  };

			that.canvasWebSocket.send(JSON.stringify(msg));
		};

		canvas.node.onmouseup = function(e) {
			canvas.isDrawing = false;

			var msg = {
				type: 'command',
				command: {
					type: 'mouseUp'
				}
			  };

			that.canvasWebSocket.send(JSON.stringify(msg));
		};
	}

	var container = document.getElementById('canvas');
	init(container, 500, 500, '#ddd');
};