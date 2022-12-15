import 'regenerator-runtime/runtime.js';

window.onload = async function() {
	const videoSrc = document.querySelector('#video-source');
	const videoTag = document.querySelector('#video-tag');

	const overlayCanvas = document.querySelector('#cv1');

	let topLeft, bottomRight;
	let isDragging = false;

	var c = document.getElementById('cv1');
	var ctx = c.getContext('2d');

	const uploadButton = document.querySelector('#upload-video-button');

	function resizeCanvas(element) {
		var w = element.offsetWidth;
		var h = element.offsetHeight;
		var cv = document.getElementById('cv1');
		cv.width = w;

		// -60 so we don't cover the controls with the cancvas
		cv.height = h - 60;

		var rect = element.getBoundingClientRect();

		cv.left = rect.left;
		cv.top = rect.top;
	}

	uploadButton.addEventListener('change', event => {
		console.log(event.target.files);
		if (event.target.files && event.target.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				videoSrc.src = e.target.result;
				videoTag.load();
			};
			reader.readAsDataURL(event.target.files[0]);
		}
	});

	videoTag.addEventListener('loadeddata', event => {
		videoTag.style.visibility = 'visible';
		resizeCanvas(videoTag);
	});

	overlayCanvas.addEventListener('mouseup', e => {
		isDragging = false;
	});

	overlayCanvas.addEventListener('mousemove', e => {
		if (!isDragging) {
			return;
		}

		var rect = e.target.getBoundingClientRect();
		var x = e.clientX - rect.left; //x position within the element.
		var y = e.clientY - rect.top; //y position within the element.

		// clear previous rect
		if (topLeft && bottomRight) {
			ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
		}

		bottomRight = {
			x,
			y
		};

		//draw new rect
		ctx.beginPath();

		ctx.rect(
			topLeft.x,
			topLeft.y,
			Math.abs(bottomRight.x - topLeft.x),
			Math.abs(bottomRight.y - topLeft.y)
		);
		ctx.stroke();
	});

	overlayCanvas.addEventListener('mousedown', e => {
		isDragging = true;

		var rect = e.target.getBoundingClientRect();
		var x = e.clientX - rect.left; //x position within the element.
		var y = e.clientY - rect.top; //y position within the element.

		topLeft = {
			x,
			y
		};

		bottomRight = {
			x,
			y
		};
	});

	videoTag.addEventListener('loadedmetadata', event => {
		console.log('loaded meta data...');
		console.log(videoTag.videoWidth, videoTag.videoHeight);
	});
};

require('src/videdit/app.css');
