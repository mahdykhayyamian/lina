
import {DockPanel} from 'phosphor-dockpanel';
import {Widget} from 'phosphor-widget';
import {createBoardWebSocket} from "../board/board-web-socket.js";
import {Board} from "../board/index.js";
import {Pencil} from "../toolbox/pencil.js";

const Layout = (function() {
	
	let self;
	
	function Layout(parentElement) {
		self = this;
		self.root = parentElement;
	}

	function createWidget(title) {
		const widget = new Widget();
		widget.addClass('content');
 		widget.addClass(title.toLowerCase());
		widget.title.text = title;
  		widget.title.closable = true;
		return widget;
	}

	Layout.prototype.create = function() {
		var panel = new DockPanel();
  		panel.id = 'lina.app';

		const toolBoxWidget = createWidget('lina.app.toolBox');
		const pencil = new Pencil();
		pencil.draw();
		toolBoxWidget.node.appendChild(pencil.svg);

		const boardWidget = createWidget('lina.app.board');
		const boardWebSocket = createBoardWebSocket();
		const board = new Board (boardWebSocket, boardWidget.node, 1000, 1000);

		const chatWidget = createWidget('lina.app.chat');

		panel.insertLeft(toolBoxWidget);

		panel.insertRight(boardWidget, toolBoxWidget);
		panel.insertRight(chatWidget, boardWidget);

		panel.attach(self.root);
  		window.onresize = () => { panel.update() };
	};

	return Layout;
})();

export {Layout};
require('./layout.css');
