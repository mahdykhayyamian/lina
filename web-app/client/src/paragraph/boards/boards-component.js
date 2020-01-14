import ajax from '@fdaciuk/ajax';

import { Widget } from 'smartframes';
import { BoardTypeSelector } from 'src/paragraph/boards/select-board-type.js';
import { moduleLoader } from 'src/paragraph/module-loader.js';
import { CONSTANTS } from 'src/paragraph/constants.js';

const addBoardHeight = 40;
const boardHeaderHeight = 50;

const BoardsComponent = function(rtcClient) {
	this.rtcClient = rtcClient;
	this.rtcClient.subscribeMessageReceiver(event => {
		onRecieveRTCMessage(this, event);
	});

	this.boardsRoot = createDiv(`
		<div id="paragraph" class="spa-text">
			<div id="boards-loader" style="display:none"><img src="/src/resources/images/spinner-grey.svg" width="80" alt=""></div>
			<div id="board-header" >
				<div id="add-board-header">
					<div id="add-board">
						<div class="btn"> Add Board</div>
						<img src="/src/resources/images/spinner.svg" alt=""/>
					</div>
				</div>
				<div id="remove-board-header">
					<div id="remove-board">
						<div class="btn"> Remove Board</div>
						<img src="/src/resources/images/grid.svg" alt=""/>
					</div>
				</div>
			</div>
			<div id="board-container"></div>
		</div>
	`);

	this.boards = [];
	this.boardTypeSelector = null;
	this.boardHeaderDiv = null;
	this.boardContainer = null;

	this.boardTypeSelector = new BoardTypeSelector(this, appendBoard);
};

BoardsComponent.prototype.createWidget = function() {
	const addBoardButtonClickEventHandler = event => {
		if (this.boardTypeSelector && this.boardTypeSelector.isShown()) {
			return;
		}
		this.boardTypeSelector.render();
	};

	const removeBoardButtonClickEventHandler = event => {
		removeSelectedBoard(this);
	};

	const boardsWidget = new Widget('boards', [
		{
			title: 'Boards',
			contentNode: this.boardsRoot,

			onRenderCallback: widget => {
				const addBoardButton = document.getElementById('add-board');

				if (addBoardButton) {
					addBoardButton.style.height = addBoardHeight + 'px';
					addBoardButton.addEventListener(
						'click',
						addBoardButtonClickEventHandler
					);
				}

				const removeBoardButton = document.getElementById(
					'remove-board'
				);

				if (removeBoardButton) {
					removeBoardButton.style.height = addBoardHeight + 'px';
					removeBoardButton.addEventListener(
						'click',
						removeBoardButtonClickEventHandler
					);
				}

				this.boardHeaderDiv = document.getElementById('board-header');

				if (this.boardHeaderDiv) {
					this.boardHeaderDiv.style.setProperty(
						'height',
						boardHeaderHeight + 'px'
					);
					this.boardContainer = document.getElementById(
						'board-container'
					);
					this.boardContainer.style.setProperty(
						'height',
						widget.contentHeight - boardHeaderHeight + 'px'
					);
					this.boardContainer.style.setProperty(
						'width',
						widget.width + 'px'
					);
				}

				this.addBoardHeader = document.getElementById(
					'add-board-header'
				);
			}
		}
	]);

	return boardsWidget;
};

BoardsComponent.prototype.setCommandsComponent = function(commandsComponent) {
	this.commandsComponent = commandsComponent;
};

BoardsComponent.prototype.setRTCClient = function(rtcClient) {
	this.rtcClient = rtcClient;
	console.log('rtc client set to');
	console.log(this.rtcClient);
};

BoardsComponent.prototype.loadBoardsFromServer = function() {
	const request = ajax({
		headers: {
			'content-type': 'application/json'
		}
	});

	const roomNumber = getRoomNumberFromUrl();

	request
		.get('/api/getRoomBoards?roomNumber=' + roomNumber)
		.then(loadedBoards => {
			for (let i = 0; i < loadedBoards.length; i++) {
				const loadedBoard = loadedBoards[i];

				let boardDiv = document.createElement('div');
				boardDiv.setAttribute('class', 'board');
				boardDiv.setAttribute('id', loadedBoard.id);

				const board = {
					type: loadedBoard.contentType,
					commands: loadedBoard.commands,
					rootElement: boardDiv,
					boardId: loadedBoard.id,
					previousBoardId: loadedBoard.previousBoardId,
					nextBoardId: loadedBoard.nextBoardId
				};

				this.boards.push(board);
				this.boardContainer.appendChild(board.rootElement);
				registerBoardOnClickHandler(board.rootElement, this);

				moduleLoader
					.getModuleByName(board.type)
					.then(visualizerModule => {
						const visualizer = visualizerModule.default.visualizer;
						visualizer.visualizeBoardCommands(board);
						getSamplesForType(board.type).then(samples => {
							board.samples = samples;

							// make the first board selected by default
							if (loadedBoards.length > 0) {
								makeBoardSelected(0, this);
							}
						});
					});
			}
		});
};

function onRecieveRTCMessage(boardsComponent, rtcMessage) {
	console.log('in onRecieveRTCMessage with message : ');
	console.log(rtcMessage);
	console.log(boardsComponent);

	const message = JSON.parse(rtcMessage);
	console.log(message);

	renderNewBoard(
		boardsComponent,
		message.content.boardType,
		message.content.newBoardId
	);
}

function appendBoard(boardsComponent, boardType, typeId) {
	const roomNumber = getRoomNumberFromUrl();

	let previousBoardId = null;
	let nextBoardId = null;
	if (boardsComponent.boards.length > 0) {
		previousBoardId =
			boardsComponent.boards[boardsComponent.boards.length - 1].boardId;
	}

	return saveBoard(
		roomNumber,
		boardType,
		typeId,
		previousBoardId,
		nextBoardId
	).then(newBoardId => {
		renderNewBoard(boardsComponent, boardType, newBoardId);

		console.log('going to notify with rtc');
		const messageObj = {
			type: CONSTANTS.RTC_MESSAGE_TYPES.ADD_BOARD,
			content: {
				newBoardId,
				roomNumber,
				boardType,
				typeId,
				previousBoardId,
				nextBoardId
			}
		};

		const messageStr = JSON.stringify(messageObj, null, 4);
		boardsComponent.rtcClient.send(messageStr);
		console.log('sent message : ' + messageStr);
	});
}

function saveBoard(
	roomNumber,
	boardType,
	typeId,
	previousBoardId,
	nextBoardId
) {
	const request = ajax({
		headers: {
			'content-type': 'application/json'
		}
	});

	const boardPayload = {
		boardType,
		typeId,
		commands: '',
		previousBoardId,
		nextBoardId
	};

	return request.post('/api/addBoard', {
		roomNumber,
		boardPayload
	});
}

function renderNewBoard(boardsComponent, boardType, newBoardId) {
	const loaderDiv = document.getElementById('boards-loader');
	loaderDiv.style.display = 'block';

	let newBoardDiv = document.createElement('div');
	newBoardDiv.setAttribute('class', 'board');
	newBoardDiv.setAttribute('id', newBoardId);

	const newBoard = {
		type: boardType,
		commands: '',
		rootElement: newBoardDiv,
		boardId: newBoardId
	};

	return getSamplesForType(boardType).then(samples => {
		loaderDiv.style.display = 'none';

		newBoard.samples = samples;
		boardsComponent.boards.push(newBoard);

		registerBoardOnClickHandler(newBoard.rootElement, boardsComponent);
		boardsComponent.boardContainer.appendChild(newBoard.rootElement);

		makeBoardSelected(boardsComponent.boards.length - 1, boardsComponent);
		if (boardsComponent.boardTypeSelector.isShown()) {
			console.log(boardsComponent.boardTypeSelector);
			boardsComponent.boardTypeSelector.remove();
		}
	});
}

function registerBoardOnClickHandler(boardDiv, boardsComponent) {
	boardDiv.addEventListener('click', event => {
		const boardIndex = Array.from(boardDiv.parentNode.children).indexOf(
			boardDiv
		);
		const board = boardsComponent.boards[boardIndex];
		makeBoardSelected(boardIndex, boardsComponent);
	});
}

function scrollToBaord(boardIndex, boardsComponent) {
	const boardsContainer = document.getElementById('board-container');
	const boardElement = boardsComponent.boards[boardIndex].rootElement;
	const boardStyle =
		boardElement.currentStyle || window.getComputedStyle(boardElement);
	const marginTop = parseInt(boardStyle.getPropertyValue('margin-top'), 10);
	const marginBottom = parseInt(
		boardStyle.getPropertyValue('margin-bottom'),
		10
	);

	let scrollTop = 0;
	for (let i = 0; i < boardIndex; i++) {
		const boardElement = boardsComponent.boards[i].rootElement;
		scrollTop += boardElement.clientHeight + marginBottom + marginTop;
	}
	const marginTooSeeALittleBitOfBoardAbove = 25;
	scrollTop -= marginTooSeeALittleBitOfBoardAbove;

	boardsContainer.scrollTop = scrollTop;
}

function makeBoardSelected(boardIndex, boardsComponent) {
	const selectedBoard = boardsComponent.boards[boardIndex];
	const selectedBoardDiv = selectedBoard.rootElement;

	if (boardsComponent.selectedBoardDiv) {
		boardsComponent.selectedBoardDiv.classList.remove('selected');
	}

	boardsComponent.selectedBoardIndex = boardIndex;
	boardsComponent.selectedBoardDiv = selectedBoardDiv;
	selectedBoardDiv.classList.add('selected');

	boardsComponent.commandsComponent.setCommands(selectedBoard.commands);
	boardsComponent.commandsComponent.setSamples(selectedBoard.samples);
	boardsComponent.commandsComponent.setBoard(selectedBoard);

	scrollToBaord(boardIndex, boardsComponent);
}

function removeSelectedBoard(boardsComponent) {
	const board = boardsComponent.boards[boardsComponent.selectedBoardIndex];
	const request = ajax({
		headers: {
			'content-type': 'application/json'
		}
	});

	const roomNumber = getRoomNumberFromUrl();
	request
		.post('/api/removeBoard', {
			boardId: board.boardId,
			roomNumber
		})
		.then(() => {
			if (boardsComponent.selectedBoardIndex !== null) {
				boardsComponent.selectedBoardDiv.remove();
				boardsComponent.boards.splice(
					boardsComponent.selectedBoardIndex,
					1
				);
				boardsComponent.selectedBoardIndex = null;
				boardsComponent.selectedBoardDiv = null;
			}
		});
}

function createDiv(innerHtml) {
	const div = document.createElement('div');
	div.style.setProperty('width', '100%');
	div.style.setProperty('height', '100%');
	div.innerHTML = innerHtml;
	return div;
}

function getSamplesForType(type) {
	switch (type) {
		case 'bar-chart':
			const barchartModule = moduleLoader.getModuleByName(type);
			return barchartModule.then(barchartModule => {
				return barchartModule.default.samples;
			});
		case 'markdown':
			const markdownModule = moduleLoader.getModuleByName(type);
			return markdownModule.then(markdownModule => {
				return markdownModule.default.samples;
			});
		case 'sequence-diagram':
			const sequenceDiagramModule = moduleLoader.getModuleByName(type);
			return sequenceDiagramModule.then(sequenceDiagramModule => {
				return sequenceDiagramModule.default.samples;
			});
		case 'math':
			const mathModule = moduleLoader.getModuleByName(type);
			return mathModule.then(mathModule => {
				return mathModule.default.samples;
			});
		case 'venn-diagram':
			const vennDiagramModule = moduleLoader.getModuleByName(type);
			return vennDiagramModule.then(vennDiagramModule => {
				return vennDiagramModule.default.samples;
			});
		default:
			return Promise.resolve([]);
	}
}

function getRoomNumberFromUrl() {
	const url = new URL(window.location.href);
	const roomNumber = url.searchParams.get('roomNumber');
	return roomNumber;
}

export { BoardsComponent };
require('src/paragraph/boards/boards-component.css');
