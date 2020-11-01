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

	const chatColor =
		window.Lina.Paragraph.Environment.roomSettings.roomChatColor;

	this.sendButton.addEventListener('click', () => {
		const textAreaDiv = document.getElementById('chat-compose-text-area');
		const chatMessage = textAreaDiv.value;

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
				console.log('Hey, chatColor');
				console.log(chatColor);
				this.addChatMessage(chatMessage, senderGivenName, chatColor);
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
	console.log('chatColor');
	console.log(chatColor);

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
					chatMessage.senderGivenName,
					chatMessage.chatColor
				);
			}
		});
}

function onRecieveRTCMessage(chatComponent, rtcMessage) {
	const message = JSON.parse(rtcMessage);

	console.log('received message');
	console.log(message);

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
