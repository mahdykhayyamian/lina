import ajax from '@fdaciuk/ajax';

import { Widget } from 'smartframes';

import { CONSTANTS } from 'src/paragraph/constants.js';

import {
	getUserEmail,
	getGivenName,
	getRoomNumberFromUrl
} from 'src/paragraph/utils.js';

const ChatComponent = function(rtcClient) {
	this.rtcClient = rtcClient;

	this.rtcClient.subscribeMessageReceiver(event => {
		onRecieveRTCMessage(this, event);
	});

	this.rootNode = document.createElement('div');

	this.rootNode.id = 'chat-container';
	this.rootNode.classList.add('spa-text');

	this.rootNode.innerHTML = `
		<div id="chat-messages">
		</div>
	`;

	this.rootNode.style.setProperty('width', '100%');

	this.chatCompose = document.createElement('div');
	this.chatCompose.id = 'chat-compose';

	this.textArea = document.createElement('textArea');
	this.textArea.id = 'chat-compose-text-area';

	this.chatCompose.appendChild(this.textArea);

	this.sendButton = document.createElement('div');
	this.sendButton.id = 'send-button';
	this.sendButton.innerHTML = `<div class="btn">Send</div>`;

	this.chatCompose.appendChild(this.sendButton);
	this.rootNode.appendChild(this.chatCompose);

	this.sendButton.addEventListener('click', () => {
		console.log('in send button click...');

		const textAreaDiv = document.getElementById('chat-compose-text-area');
		const chatMessage = textAreaDiv.value;

		console.log(chatMessage);

		const senderEmail = getUserEmail();
		const senderGivenName = getGivenName();

		const roomNumber = getRoomNumberFromUrl();

		const request = ajax({
			headers: {
				'content-type': 'application/json'
			}
		});

		request
			.post('/api/addChatMessage', {
				roomNumber,
				senderEmail,
				senderGivenName,
				textContent: chatMessage
			})
			.then(result => {
				console.log(result);
				const messageObj = {
					type: CONSTANTS.RTC_MESSAGE_TYPES.CHAT_MESSAGE,
					content: {
						chatMessage,
						senderGivenName,
						senderEmail
					}
				};
				const messageStr = JSON.stringify(messageObj, null, 4);

				this.rtcClient.send(messageStr);
				this.addChatMessage(chatMessage, senderGivenName);
				textAreaDiv.value = '';
			});
	});

	loadChatsFromServer(this);
};

ChatComponent.prototype.createWidget = function() {
	const chatWidget = new Widget('chatWidget', [
		{
			title: 'Chat',
			contentNode: this.rootNode,
			onRenderCallback: widget => {
				console.log('render chat widget...');
				const chatContainerDiv = this.rootNode;
				console.log(chatContainerDiv);
				if (chatContainerDiv) {
					chatContainerDiv.style.setProperty(
						'width',
						widget.width + 'px'
					);
					chatContainerDiv.style.setProperty(
						'height',
						widget.contentHeight + 'px'
					);
				}
			}
		}
	]);

	return chatWidget;
};

ChatComponent.prototype.addChatMessage = function(content, senderGivenName) {
	const chatMessageNodes = document.getElementById('chat-messages');
	const chatMessageDiv = document.createElement('div');
	chatMessageDiv.classList.add('chat-message');

	chatMessageDiv.innerHTML = `<div class="chat-sender"> ${senderGivenName} </div> <div class="chat-content"> ${content} </div>`;
	chatMessageNodes.appendChild(chatMessageDiv);
};

function loadChatsFromServer(chatComponent) {
	const request = ajax({
		headers: {
			'content-type': 'application/json'
		}
	});

	const roomNumber = getRoomNumberFromUrl();

	request
		.get('/api/getChatMessages?roomNumber=' + roomNumber)
		.then(chatMessages => {
			console.log('loaded chat messages');
			console.log(chatMessages);

			for (let i = 0; i < chatMessages.length; i++) {
				const chatMessage = chatMessages[i];
				chatComponent.addChatMessage(
					chatMessage.textContent,
					chatMessage.senderGivenName
				);
			}
		});
}

function onRecieveRTCMessage(chatComponent, rtcMessage) {
	const message = JSON.parse(rtcMessage);

	switch (message.type) {
		case CONSTANTS.RTC_MESSAGE_TYPES.CHAT_MESSAGE:
			console.log('got chat rtc message');
			chatComponent.addChatMessage(
				message.content.chatMessage,
				message.content.senderGivenName
			);
			break;
		default:
			return;
	}
}

export { ChatComponent };
require('src/paragraph/chat/chat-component.css');
