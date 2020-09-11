import * as html2canvas from 'html2canvas';
import ajax from '@fdaciuk/ajax';

export default function addFeedbackLink(rootContainer) {
	console.log('addFeedbackLink...');
	console.log('html2canvas');
	console.log(html2canvas);

	console.log(rootContainer);

	const request = ajax({
		headers: {
			'content-type': 'application/json'
		}
	});

	const accountInfoDiv = document.getElementById('account-info');

	const feedbackLink = document.createElement('a');

	feedbackLink.setAttribute('href', '#');
	feedbackLink.onclick = () => {
		console.log('feedback clicked...');

		const feedbackModal = document.createElement('div');
		feedbackModal.className = 'modal';

		const loadingImage = document.createElement('img');
		loadingImage.src = '/src/resources/images/spinner.svg';
		loadingImage.className = 'loading-icon';
		feedbackModal.appendChild(loadingImage);
		document.body.appendChild(feedbackModal);

		html2canvas(rootContainer.rootDiv, { useCORS: true }).then(function(
			canvas
		) {
			feedbackModal.removeChild(loadingImage);
			const feedbackHeader = document.createElement('div');
			feedbackHeader.className = 'feedback-header';
			feedbackModal.appendChild(feedbackHeader);

			const closeIcon = document.createElement('img');
			closeIcon.className = 'close-icon';
			closeIcon.src = '/src/resources/icons/close.png';
			feedbackHeader.appendChild(closeIcon);

			closeIcon.onclick = () => {
				document.body.removeChild(feedbackModal);
			};

			const screenshotContainer = document.createElement('div');
			screenshotContainer.className = 'screenshot-container';
			feedbackModal.appendChild(screenshotContainer);

			const imgData = canvas.toDataURL('image/png');
			const image = new Image(300);
			image.src = imgData;
			screenshotContainer.appendChild(image);

			const feedbackTextArea = document.createElement('textArea');
			feedbackTextArea.className = 'feedback-txt';
			feedbackTextArea.placeholder = 'Your Feedback...';
			feedbackModal.appendChild(feedbackTextArea);

			const submitContainer = document.createElement('div');
			submitContainer.className = 'submit-button-container';
			feedbackModal.appendChild(submitContainer);

			const feedbackButton = document.createElement('div');
			feedbackButton.innerText = 'Submit';
			submitContainer.appendChild(feedbackButton);

			submitContainer.onclick = () => {
				console.log('text : ' + feedbackTextArea.value);
				console.log('img : ' + imgData);

				const submitSpinner = document.createElement('img');
				submitSpinner.src = '/src/resources/images/spinner.svg';
				submitSpinner.className = 'submit-spinner';
				submitContainer.appendChild(submitSpinner);

				request
					.post('/api/addFeedback', {
						feedback: feedbackTextArea.value,
						screenshotImg: imgData
					})
					.then(() => {
						document.body.removeChild(feedbackModal);
					});
			};
		});
	};

	feedbackLink.innerText = 'Send Feedback';

	accountInfoDiv.appendChild(feedbackLink);
}

require('src/paragraph/feedback.css');
