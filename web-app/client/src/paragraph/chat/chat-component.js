import { Widget } from 'smartframes';
const ChatComponent = function() {
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
	});
	this.rootNode.appendChild(this.sendButton);
};

ChatComponent.prototype.createWidget = function() {
	console.log(this.rootNode);
	const chatWidget = new Widget('chatWidget', [
		{
			title: 'Chat',
			contentNode: this.rootNode
		}
	]);

	return chatWidget;
};

export { ChatComponent };
require('src/paragraph/chat/chat-component.css');
