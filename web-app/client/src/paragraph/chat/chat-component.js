import { Widget } from 'smartframes';

const ChatComponent = function() {};

ChatComponent.prototype.createWidget = function() {
	const chatWidget = new Widget('chatWidget', [
		{
			title: 'Chat',
			contentNode: createDiv(
				`<div id="chat-container" class="spa-text">
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
						<textArea id="chat-compose-text-area">
						</textArea>
					</div>
					<div class="send-button">
						<div class="btn">Send</div>
					</div>
				</div>`
			)
		}
	]);

	function createDiv(innerHtml) {
		const div = document.createElement('div');
		div.style.setProperty('width', '100%');
		div.style.setProperty('height', '100%');
		div.innerHTML = innerHtml;
		return div;
	}
	return chatWidget;
};

export { ChatComponent };
require('src/paragraph/chat/chat-component.css');
