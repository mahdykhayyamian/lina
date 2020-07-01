import { Widget } from 'smartframes';

import { CONSTANTS } from 'src/paragraph/constants.js';

import { getUserName } from 'src/paragraph/utils.js';

const ChatComponent = function(rtcClient) {
	this.rtcClient = rtcClient;

	this.rtcClient.subscribeMessageReceiver(event => {
		onRecieveRTCMessage(this, event);
	});

	this.rootNode = document.createElement('div');
	this.rootNode.innerHTML = `<div id="chat-container" class="spa-text">
			<div id="chat-messages">
				<div class="chat-message">
					<div class="chat-sender"> Mahdy </div>
					<div class="chat-content"> Some chat chat chat chat ... </div>
				</div>

				<div class="chat-message">
					<div class="chat-sender"> Patricia </div>
					<div class="chat-content"> Some other chat chat chat chat ... </div>
				</div>
			</div>
			<div id="chat-compose">
				<textArea id="chat-compose-text-area"></textArea>
			</div>
		</div>`;
	this.rootNode.style.setProperty('width', '100%');
	this.rootNode.style.setProperty('height', '100%');

	this.sendButton = document.createElement('div');
	this.sendButton.id = 'send-button';
	this.sendButton.innerHTML = `<div class="btn">Send</div>`;

	this.sendButton.addEventListener('click', () => {
		console.log('in send button click...');

		const textAreaDiv = document.getElementById('chat-compose-text-area');
		const chatMessage = textAreaDiv.value;

		console.log(chatMessage);

		const sender = getUserName();

		const messageObj = {
			type: CONSTANTS.RTC_MESSAGE_TYPES.CHAT_MESSAGE,
			content: {
				chatMessage,
				sender
			}
		};
		const messageStr = JSON.stringify(messageObj, null, 4);

		this.rtcClient.send(messageStr);
		this.addChatMessage(chatMessage, sender);
		textAreaDiv.value = '';
	});

	this.rootNode.appendChild(this.sendButton);
};

ChatComponent.prototype.createWidget = function() {
	const chatWidget = new Widget('chatWidget', [
		{
			title: 'Chat',
			contentNode: this.rootNode
		}
	]);

	return chatWidget;
};

ChatComponent.prototype.addChatMessage = function(content, sender) {
	const chatMessageNodes = document.getElementById('chat-messages');
	const chatMessageDiv = document.createElement('div');
	chatMessageDiv.classList.add('chat-message');

	chatMessageDiv.innerHTML = `<div class="chat-sender"> ${sender} </div> <div class="chat-content"> ${content} </div>`;
	chatMessageNodes.appendChild(chatMessageDiv);
};

function onRecieveRTCMessage(chatComponent, rtcMessage) {
	const message = JSON.parse(rtcMessage);

	switch (message.type) {
		case CONSTANTS.RTC_MESSAGE_TYPES.CHAT_MESSAGE:
			console.log('got chat rtc message');
			chatComponent.addChatMessage(
				message.content.chatMessage,
				message.content.sender
			);
			break;
		default:
			return;
	}
}

export { ChatComponent };
require('src/paragraph/chat/chat-component.css');
