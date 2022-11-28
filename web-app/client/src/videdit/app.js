import 'regenerator-runtime/runtime.js';

window.onload = async function() {
	const videoSrc = document.querySelector('#video-source');
	const videoTag = document.querySelector('#video-tag');

	const uploadButton = document.querySelector('#upload-video-button');

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
	});

	videoTag.addEventListener('click', event => {
		console.log('click event');
		console.log(event);
		videoTag.pause();
		event.preventDefault();
	});

	videoTag.addEventListener('mouseup', event => {
		console.log('mouseup event');
		console.log(event);
		event.preventDefault();
	});

	videoTag.addEventListener('loadedmetadata', event => {
		console.log('loaded meta data...');
		console.log(videoTag.videoWidth, videoTag.videoHeight);
	});
};

require('src/videdit/app.css');
