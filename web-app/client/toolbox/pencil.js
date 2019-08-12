import { Polygon } from './polygon.js';

const Pencil = (function() {
	var self;

	function Pencil() {
		self = this;
		self.id = 'lina.tools.pencil';
		self.totalHeight = 100;
		self.totalWidth = 100;
		self.pencilColor = 'green';

		self.svg = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'svg'
		);
		self.svg.setAttribute('width', self.totalWidth + 'px');
		self.svg.setAttribute('height', self.totalHeight + 'px');
		self.svg.style.position = 'absolute';
		self.svg.style.top = 0;
		self.svg.style.left = 0;

		self.tipSideLength = 10;
		self.tipAngle = Math.PI / 4;

		self.woodSideLength = 22;
		self.woodColor = '#f4bc42';

		self.bodyLength = 70;

		self.furrelLength = 16;
		self.furrelLayers = 6;
		self.furrelCurveAngle = Math.PI / 20;

		self.eraserLength = 10;
		self.eraserColor = '#e5577a';
	}

	function drawLead() {
		var p1 = [0, self.totalHeight];

		var teta = (Math.PI / 2 - self.tipAngle) / 2;

		var p2 = [
			Math.cos(teta) * self.tipSideLength,
			self.totalHeight - Math.sin(teta) * self.tipSideLength
		];
		var p3 = [
			self.tipSideLength * Math.sin(teta),
			self.totalHeight - Math.cos(teta) * self.tipSideLength
		];

		var polygon = new Polygon(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);

		polygon.attribute(
			'style',
			'fill-opacity:0.5;stroke:' +
				self.pencilColor +
				';fill:' +
				self.pencilColor
		);

		self.svg.appendChild(polygon.node);
	}

	function drawWood() {
		var teta = (Math.PI / 2 - self.tipAngle) / 2;

		var p2 = [
			Math.cos(teta) * self.tipSideLength,
			self.totalHeight - Math.sin(teta) * self.tipSideLength
		];
		var p1 = [
			self.tipSideLength * Math.sin(teta),
			self.totalHeight - Math.cos(teta) * self.tipSideLength
		];
		var p3 = [
			self.woodSideLength * Math.sin(teta),
			self.totalHeight - Math.cos(teta) * self.woodSideLength
		];
		var p4 = [
			Math.cos(teta) * self.woodSideLength,
			self.totalHeight - Math.sin(teta) * self.woodSideLength
		];

		var cp1 = getCurveControlPoint(
			p1[0],
			p1[1],
			p2[0],
			p2[1],
			self.furrelCurveAngle
		);
		var cp2 = getCurveControlPoint(
			p3[0],
			p3[1],
			p4[0],
			p4[1],
			self.furrelCurveAngle
		);

		var penWood = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'path'
		);
		var penWoodData =
			'M' +
			p1[0] +
			' ' +
			p1[1] +
			' C ' +
			cp1[0] +
			' ' +
			cp1[1] +
			', ' +
			cp1[0] +
			' ' +
			cp1[1] +
			', ' +
			p2[0] +
			' ' +
			p2[1] +
			' L ' +
			p4[0] +
			' ' +
			p4[1] +
			' C ' +
			cp2[0] +
			' ' +
			cp2[1] +
			', ' +
			cp2[0] +
			' ' +
			cp2[1] +
			', ' +
			p3[0] +
			' ' +
			p3[1] +
			' L ' +
			p1[0] +
			' ' +
			p1[1];

		penWood.setAttribute('d', penWoodData);
		penWood.setAttribute('stroke', self.woodColor);
		penWood.setAttribute('fill-opacity', 0.6);
		penWood.setAttribute('fill', self.woodColor);
		self.svg.appendChild(penWood);
	}

	function drawBody() {
		var teta = (Math.PI / 2 - self.tipAngle) / 2;
		var p2 = [
			self.woodSideLength * Math.sin(teta),
			self.totalHeight - Math.cos(teta) * self.woodSideLength
		];
		var p1 = [
			Math.cos(teta) * self.woodSideLength,
			self.totalHeight - Math.sin(teta) * self.woodSideLength
		];
		var p4 = [
			p2[0] + self.bodyLength * Math.sin(Math.PI / 4),
			p2[1] - self.bodyLength * Math.sin(Math.PI / 4)
		];
		var p3 = [
			p1[0] + self.bodyLength * Math.sin(Math.PI / 4),
			p1[1] - self.bodyLength * Math.sin(Math.PI / 4)
		];

		var cp1 = getCurveControlPoint(
			p1[0],
			p1[1],
			p2[0],
			p2[1],
			self.furrelCurveAngle
		);
		var cp2 = getCurveControlPoint(
			p3[0],
			p3[1],
			p4[0],
			p4[1],
			self.furrelCurveAngle
		);

		var penBody = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'path'
		);
		var penBodyData =
			'M' +
			p1[0] +
			' ' +
			p1[1] +
			' C ' +
			cp1[0] +
			' ' +
			cp1[1] +
			', ' +
			cp1[0] +
			' ' +
			cp1[1] +
			', ' +
			p2[0] +
			' ' +
			p2[1] +
			' L ' +
			p4[0] +
			' ' +
			p4[1] +
			' C ' +
			cp2[0] +
			' ' +
			cp2[1] +
			', ' +
			cp2[0] +
			' ' +
			cp2[1] +
			', ' +
			p3[0] +
			' ' +
			p3[1] +
			' L ' +
			p1[0] +
			' ' +
			p1[1];

		penBody.setAttribute('d', penBodyData);
		penBody.setAttribute('stroke', self.pencilColor);
		penBody.setAttribute('fill-opacity', 0.5);
		penBody.setAttribute('fill', self.pencilColor);
		self.svg.appendChild(penBody);
	}

	function drawDebugCircle(x, y, color) {
		var c = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'circle'
		);
		c.setAttribute('cx', x);
		c.setAttribute('cy', y);
		c.setAttribute('r', 5);
		c.setAttribute('fill', color);
		self.svg.appendChild(c);
	}

	function distance(x1, y1, x2, y2) {
		return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
	}

	function getCurveControlPoint(x1, y1, x2, y2, angle) {
		var l = distance(x1, y1, x2, y2) / 2;
		var h = l * Math.tan(angle);
		var cp = [
			(x1 + x2) / 2 + h * Math.cos(angle),
			(y1 + y2) / 2 - h * Math.sin(angle)
		];

		return cp;
	}

	function drawFerrule() {
		var teta = (Math.PI / 2 - self.tipAngle) / 2;

		for (var i = 0; i < self.furrelLayers; i++) {
			var f = self.furrelLength / self.furrelLayers;

			var p1 = [
				Math.cos(teta) * self.woodSideLength +
					(i * f + self.bodyLength) * Math.sin(Math.PI / 4),
				self.totalHeight -
					(self.woodSideLength * Math.sin(teta) +
						(i * f + self.bodyLength) * Math.sin(Math.PI / 4))
			];

			var p2 = [
				Math.sin(teta) * self.woodSideLength +
					(i * f + self.bodyLength) * Math.sin(Math.PI / 4),
				self.totalHeight -
					(self.woodSideLength * Math.cos(teta) +
						(i * f + self.bodyLength) * Math.sin(Math.PI / 4))
			];

			var p3 = [
				Math.cos(teta) * self.woodSideLength +
					((i + 1) * f + self.bodyLength) * Math.sin(Math.PI / 4),
				self.totalHeight -
					(self.woodSideLength * Math.sin(teta) +
						((i + 1) * f + self.bodyLength) * Math.sin(Math.PI / 4))
			];

			var p4 = [
				Math.sin(teta) * self.woodSideLength +
					((i + 1) * f + self.bodyLength) * Math.sin(Math.PI / 4),
				self.totalHeight -
					(self.woodSideLength * Math.cos(teta) +
						((i + 1) * f + self.bodyLength) * Math.sin(Math.PI / 4))
			];

			var cp1 = getCurveControlPoint(
				p1[0],
				p1[1],
				p2[0],
				p2[1],
				self.furrelCurveAngle
			);
			var cp2 = getCurveControlPoint(
				p3[0],
				p3[1],
				p4[0],
				p4[1],
				self.furrelCurveAngle
			);

			var furrelArc = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'path'
			);
			var furrelArcData =
				'M' +
				p1[0] +
				' ' +
				p1[1] +
				' C ' +
				cp1[0] +
				' ' +
				cp1[1] +
				', ' +
				cp1[0] +
				' ' +
				cp1[1] +
				', ' +
				p2[0] +
				' ' +
				p2[1] +
				' L ' +
				p4[0] +
				' ' +
				p4[1] +
				' C ' +
				cp2[0] +
				' ' +
				cp2[1] +
				', ' +
				cp2[0] +
				' ' +
				cp2[1] +
				', ' +
				p3[0] +
				' ' +
				p3[1] +
				' L ' +
				p1[0] +
				' ' +
				p1[1];

			furrelArc.setAttribute('d', furrelArcData);
			furrelArc.setAttribute('stroke', 'grey');

			var fillOpac = 0.2;
			if (i % 2 == 1) {
				fillOpac = 0.5;
			}
			furrelArc.setAttribute('fill-opacity', fillOpac);

			furrelArc.setAttribute('fill', 'grey');
			self.svg.appendChild(furrelArc);
		}
	}

	function drawEraser() {
		var teta = (Math.PI / 2 - self.tipAngle) / 2;
		var i = self.furrelLayers;
		var f = self.furrelLength / self.furrelLayers;

		var p1 = [
			Math.cos(teta) * self.woodSideLength +
				(i * f + self.bodyLength) * Math.sin(Math.PI / 4),
			self.totalHeight -
				(self.woodSideLength * Math.sin(teta) +
					(i * f + self.bodyLength) * Math.sin(Math.PI / 4))
		];

		var p2 = [
			Math.sin(teta) * self.woodSideLength +
				(i * f + self.bodyLength) * Math.sin(Math.PI / 4),
			self.totalHeight -
				(self.woodSideLength * Math.cos(teta) +
					(i * f + self.bodyLength) * Math.sin(Math.PI / 4))
		];

		var p3 = [
			Math.cos(teta) * self.woodSideLength +
				(i * f + self.eraserLength + self.bodyLength) *
					Math.sin(Math.PI / 4),
			self.totalHeight -
				(self.woodSideLength * Math.sin(teta) +
					(i * f + self.eraserLength + self.bodyLength) *
						Math.sin(Math.PI / 4))
		];

		var p4 = [
			Math.sin(teta) * self.woodSideLength +
				(i * f + self.eraserLength + self.bodyLength) *
					Math.sin(Math.PI / 4),
			self.totalHeight -
				(self.woodSideLength * Math.cos(teta) +
					(i * f + self.eraserLength + self.bodyLength) *
						Math.sin(Math.PI / 4))
		];

		var cp1 = getCurveControlPoint(
			p1[0],
			p1[1],
			p2[0],
			p2[1],
			self.furrelCurveAngle
		);
		var cp2 = getCurveControlPoint(
			p3[0],
			p3[1],
			p4[0],
			p4[1],
			self.furrelCurveAngle * 5
		);

		var eraser = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'path'
		);
		var eraserDate =
			'M' +
			p1[0] +
			' ' +
			p1[1] +
			' C ' +
			cp1[0] +
			' ' +
			cp1[1] +
			', ' +
			cp1[0] +
			' ' +
			cp1[1] +
			', ' +
			p2[0] +
			' ' +
			p2[1] +
			' L ' +
			p4[0] +
			' ' +
			p4[1] +
			' C ' +
			cp2[0] +
			' ' +
			cp2[1] +
			', ' +
			cp2[0] +
			' ' +
			cp2[1] +
			', ' +
			p3[0] +
			' ' +
			p3[1] +
			' L ' +
			p1[0] +
			' ' +
			p1[1];

		eraser.setAttribute('d', eraserDate);
		eraser.setAttribute('stroke', self.eraserColor);
		eraser.setAttribute('fill', self.eraserColor);
		eraser.setAttribute('fill-opacity', 0.5);
		self.svg.appendChild(eraser);
	}

	Pencil.prototype.render = function() {
		drawLead();
		drawWood();
		drawBody();
		drawFerrule();
		drawEraser();
	};

	Pencil.prototype.moveTo = function(x, y) {
		self.svg.style.left = x + 'px';
		self.svg.style.top = y + 'px';
	};

	Pencil.prototype.hide = function() {
		self.svg.style.display = 'none';
	};

	Pencil.prototype.show = function() {
		self.svg.style.display = 'inherit';
	};

	return Pencil;
})();

export { Pencil };
