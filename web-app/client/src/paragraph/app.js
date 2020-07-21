import { Widget } from 'smartframes';
import { WidgetContainer } from 'smartframes';
import { WidgetTabDragController } from 'smartframes';
import { WidgetResizeController } from 'smartframes';
import { CONSTANTS as SMARTFRAME_CONSTANTS } from 'smartframes';
import { CommandsComponent } from './commands/commands-component.js';
import { BoardsComponent } from 'src/paragraph/boards/boards-component.js';
import { ChatComponent } from 'src/paragraph/chat/chat-component.js';
import { CONSTANTS } from 'src/paragraph/constants.js';
import RTCClient from 'src/paragraph/rtc/rtc-client.js';
import { getRoomNumberFromUrl } from 'src/paragraph/utils.js';

window.onload = function() {
	const appDiv = document.getElementById('lina.app');
	appDiv.style.setProperty('position', 'absolute');

	const roomNumber = getRoomNumberFromUrl();
	const rtcClient = new RTCClient(roomNumber);

	const boardsComponent = new BoardsComponent(rtcClient);
	const rootContainer = buildLayout(boardsComponent, rtcClient);

	function onResize() {
		const width = window.innerWidth - 50;
		const height = window.innerHeight - 50;
		const left = 10;
		const top = 10;

		rootContainer.left = left;
		rootContainer.top = top;
		rootContainer.width = width;
		rootContainer.height = height;

		rootContainer.render(appDiv);
	}

	window.onresize = onResize;
	onResize();
	boardsComponent.loadBoardsFromServer();
};

function determineDisplayType() {
	if (screen.width <= 1600) {
		return CONSTANTS.DISPLAY_SIZE_SMALL;
	} else if (screen.width <= 2000) {
		return CONSTANTS.DISPLAY_SIZE_MEDIUM;
	} else {
		return CONSTANTS.DISPLAY_SIZE_LARGE;
	}
}

function buildLayout(boardsComponent, rtcClient) {
	const displaySize = determineDisplayType();
	switch (displaySize) {
		case CONSTANTS.DISPLAY_SIZE_SMALL:
			return createLayoutForSmallSizeDisplays(boardsComponent, rtcClient);
		case CONSTANTS.DISPLAY_SIZE_MEDIUM:
			return createLayoutForMediumSizeDisplays(
				boardsComponent,
				rtcClient
			);
		case CONSTANTS.DISPLAY_SIZE_LARGE:
			return createLayoutForLargeSizeDisplays(boardsComponent, rtcClient);
		default:
			return null;
	}
}

function createLayoutForSmallSizeDisplays(boardsComponent, rtcClient) {
	const chatComponent = new ChatComponent(rtcClient);
	const chatWidget = chatComponent.createWidget();

	const commandsComponent = new CommandsComponent(rtcClient);
	const commandsWidget = commandsComponent.createWidget();

	boardsComponent.setCommandsComponent(commandsComponent);
	const boardsWidget = boardsComponent.createWidget();

	const leftContainer = new WidgetContainer(
		[commandsWidget, chatWidget],
		SMARTFRAME_CONSTANTS.TOP_TO_BOTTOM
	);
	leftContainer.childrenRatios = [0.5, 0.5];
	commandsWidget.widgetContainer = leftContainer;
	chatWidget.widgetContainer = leftContainer;

	const rootContainer = new WidgetContainer(
		[leftContainer, boardsWidget],
		SMARTFRAME_CONSTANTS.LEFT_TO_RIGHT
	);
	rootContainer.childrenRatios = [0.3, 0.7];
	rootContainer.parentWidgetContainer = null;
	boardsWidget.widgetContainer = rootContainer;
	leftContainer.parentWidgetContainer = rootContainer;

	const widgetTabDragController = new WidgetTabDragController(rootContainer);
	const widgetResizeController = new WidgetResizeController(rootContainer);

	return rootContainer;
}

function createLayoutForMediumSizeDisplays(boardsComponent, rtcClient) {
	const chatComponent = new ChatComponent(rtcClient);
	const chatWidget = chatComponent.createWidget();

	const commandsComponent = new CommandsComponent(rtcClient);
	const commandsWidget = commandsComponent.createWidget();

	boardsComponent.setCommandsComponent(commandsComponent);
	const boardsWidget = boardsComponent.createWidget();

	const leftContainer = new WidgetContainer(
		[commandsWidget, chatWidget],
		SMARTFRAME_CONSTANTS.TOP_TO_BOTTOM
	);
	leftContainer.childrenRatios = [0.7, 0.3];
	commandsWidget.widgetContainer = leftContainer;
	chatWidget.widgetContainer = leftContainer;

	const rootContainer = new WidgetContainer(
		[leftContainer, boardsWidget],
		SMARTFRAME_CONSTANTS.LEFT_TO_RIGHT
	);
	rootContainer.childrenRatios = [0.4, 0.6];
	rootContainer.parentWidgetContainer = null;
	boardsWidget.widgetContainer = rootContainer;
	leftContainer.parentWidgetContainer = rootContainer;

	const widgetTabDragController = new WidgetTabDragController(rootContainer);
	const widgetResizeController = new WidgetResizeController(rootContainer);

	return rootContainer;
}

function createLayoutForLargeSizeDisplays(boardsComponent, rtcClient) {
	const chatComponent = new ChatComponent(rtcClient);
	const chatWidget = chatComponent.createWidget();

	const commandsComponent = new CommandsComponent(rtcClient);
	const commandsWidget = commandsComponent.createWidget();

	boardsComponent.setCommandsComponent(commandsComponent);
	const boardsWidget = boardsComponent.createWidget();

	const rootContainer = new WidgetContainer(
		[commandsWidget, boardsWidget, chatWidget],
		SMARTFRAME_CONSTANTS.LEFT_TO_RIGHT
	);
	rootContainer.childrenRatios = [0.3, 0.5, 0.2];
	const widgetTabDragController = new WidgetTabDragController(rootContainer);
	const widgetResizeController = new WidgetResizeController(rootContainer);
	rootContainer.parentWidgetContainer = null;

	commandsWidget.widgetContainer = rootContainer;
	boardsWidget.widgetContainer = rootContainer;
	chatWidget.widgetContainer = rootContainer;

	return rootContainer;
}
