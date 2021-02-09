import ajax from '@fdaciuk/ajax';

import { Widget } from 'smartframes';

import { CONSTANTS } from 'src/paragraph/constants.js';

import {
	getUserEmail,
	getGivenName,
	getRoomNumberFromUrl
} from 'src/paragraph/utils.js';

const CHAT_COLOR_DEFAULT = 'black';

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

	this.rootNode.appendChild(this.chatCompose);

	const chatColor =
		window.Lina.Paragraph.Environment.roomSettings.roomChatColor ||
		CHAT_COLOR_DEFAULT;

	this.textArea.addEventListener('keypress', event => {
		if (event.code === 'Enter' && !event.shiftKey) {
			const textAreaDiv = document.getElementById(
				'chat-compose-text-area'
			);
			const chatMessage = textAreaDiv.value;

			const senderEmail = getUserEmail();
			const senderGivenName = getGivenName();

			const roomId = getRoomNumberFromUrl();

			const request = ajax({
				headers: {
					'content-type': 'application/json'
				}
			});

			request
				.post('/api/addChatMessage', {
					roomId,
					senderEmail,
					senderGivenName,
					textContent: chatMessage,
					chatColor
				})
				.then(result => {
					const messageObj = {
						type: CONSTANTS.RTC_MESSAGE_TYPES.CHAT_MESSAGE,
						content: {
							chatMessage,
							senderGivenName,
							senderEmail,
							chatColor
						}
					};
					const messageStr = JSON.stringify(messageObj, null, 4);

					this.rtcClient.send(messageStr);
					this.addChatMessage(
						chatMessage,
						senderGivenName,
						chatColor
					);
					textAreaDiv.value = '';
				});
		}
	});

	loadChatsFromServer(this);
};

ChatComponent.prototype.createWidget = function() {
	const chatWidget = new Widget('chatWidget', [
		{
			title: 'Chat',
			contentNode: this.rootNode,
			onRenderCallback: widget => {
				const chatContainerDiv = this.rootNode;
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

ChatComponent.prototype.addChatMessage = function(
	content,
	senderGivenName,
	chatColor
) {
	const chatMessageNodes = document.getElementById('chat-messages');
	const chatMessageDiv = document.createElement('div');
	chatMessageDiv.classList.add('chat-message');

	const chatSenderDiv = document.createElement('div');
	chatSenderDiv.classList.add('chat-sender');
	chatSenderDiv.innerText = senderGivenName;
	chatSenderDiv.style.backgroundColor = chatColor;
	chatMessageDiv.appendChild(chatSenderDiv);

	const chatContentDiv = document.createElement('div');
	chatContentDiv.classList.add('chat-content');
	chatContentDiv.innerText = content;
	chatMessageDiv.appendChild(chatContentDiv);

	chatMessageNodes.appendChild(chatMessageDiv);
	chatMessageNodes.scrollTop = chatMessageNodes.scrollHeight;
};

function loadChatsFromServer(chatComponent) {
	const request = ajax({
		headers: {
			'content-type': 'application/json'
		}
	});

	const roomId = getRoomNumberFromUrl();

	request.get('/api/getChatMessages?roomId=' + roomId).then(chatMessages => {
		for (let i = 0; i < chatMessages.length; i++) {
			const chatMessage = chatMessages[i];
			chatComponent.addChatMessage(
				chatMessage.textContent,
				chatMessage.senderGivenName,
				chatMessage.chatColor || CHAT_COLOR_DEFAULT
			);
		}
	});
}

function onRecieveRTCMessage(chatComponent, rtcMessage) {
	const message = JSON.parse(rtcMessage);
	switch (message.type) {
		case CONSTANTS.RTC_MESSAGE_TYPES.CHAT_MESSAGE:
			chatComponent.addChatMessage(
				message.content.chatMessage,
				message.content.senderGivenName,
				message.content.chatColor
			);
			break;
		default:
			return;
	}
}

export { ChatComponent };
require('src/paragraph/chat/chat-component.css');
