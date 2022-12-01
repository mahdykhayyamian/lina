import 'regenerator-runtime/runtime.js';

window.onload = async function() {
	const videoSrc = document.querySelector('#video-source');
	const videoTag = document.querySelector('#video-tag');

	const overlayCanvas = document.querySelector('#cv1');

	console.log('overlayCanvas');
	console.log(overlayCanvas);

	let topLeft, bottomRight;

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
		console.log('loadeddata..');
		videoTag.style.visibility = 'visible';
		resizeCanvas(videoTag);
	});

	overlayCanvas.addEventListener('mouseup', e => {
		console.log('mouseup event');
		console.log(e);

		var rect = e.target.getBoundingClientRect();
		var x = e.clientX - rect.left; //x position within the element.
		var y = e.clientY - rect.top; //y position within the element.
		console.log('Left? : ' + x + ' ; Top? : ' + y + '.');

		bottomRight = {
			x,
			y
		};

		var c = document.getElementById('cv1');
		var ctx = c.getContext('2d');
		ctx.beginPath();

		console.log('topLeft');
		console.log(topLeft);

		console.log('bottomRight');
		console.log(bottomRight);

		ctx.rect(
			topLeft.x,
			topLeft.y,
			Math.abs(bottomRight.x - topLeft.x),
			Math.abs(bottomRight.y - topLeft.y)
		);
		ctx.stroke();

		e.preventDefault();
	});

	overlayCanvas.addEventListener('mousedown', e => {
		console.log('mousedown event');
		console.log(e);

		var rect = e.target.getBoundingClientRect();
		var x = e.clientX - rect.left; //x position within the element.
		var y = e.clientY - rect.top; //y position within the element.
		console.log('Left? : ' + x + ' ; Top? : ' + y + '.');

		topLeft = {
			x,
			y
		};

		e.preventDefault();
	});

	videoTag.addEventListener('loadedmetadata', event => {
		console.log('loaded meta data...');
		console.log(videoTag.videoWidth, videoTag.videoHeight);
	});
};

require('src/videdit/app.css');
