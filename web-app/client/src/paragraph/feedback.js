import * as html2canvas from 'html2canvas';

export default function addFeedbackLink(rootContainer) {
	console.log('addFeedbackLink...');
	console.log('html2canvas');
	console.log(html2canvas);

	console.log(rootContainer);

	const accountInfoDiv = document.getElementById('account-info');

	const feedbackLink = document.createElement('a');

	feedbackLink.setAttribute('href', '#');
	feedbackLink.onclick = () => {
		console.log('feedback clicked...');

		html2canvas(rootContainer.rootDiv, { useCORS: true }).then(function(
			canvas
		) {
			const feedbackModal = document.createElement('div');
			feedbackModal.className = 'modal';

			const screenshotContainer = document.createElement('div');
			screenshotContainer.className = 'screenshot-container';

			feedbackModal.appendChild(screenshotContainer);
			document.body.appendChild(feedbackModal);

			const imgData = canvas.toDataURL('image/png');
			const image = new Image(300);
			image.src = imgData;

			screenshotContainer.appendChild(image);

			const feedbackTextArea = document.createElement('textArea');
			feedbackTextArea.className = 'feedback-txt';
			feedbackModal.appendChild(feedbackTextArea);

			const feedbackButton = document.createElement('button');
			feedbackButton.innerText = 'Submit';
			feedbackButton.className = 'feedback-button';
			feedbackModal.appendChild(feedbackButton);
		});
	};

	feedbackLink.innerText = 'We love Your Feedback!';

	accountInfoDiv.appendChild(feedbackLink);

	console.log('accountInfoDiv');
	console.log(accountInfoDiv);
}

require('src/paragraph/feedback.css');
