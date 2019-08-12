import ajax from '@fdaciuk/ajax';

import { Widget } from 'smartframes';
import { BoardTypeSelector } from 'paragraph/boards/select-board-type.js';
import { moduleLoader } from 'paragraph/module-loader.js';

const addBoardHeight = 40;
const boardHeaderHeight = 50;

const BoardsComponent = function() {
	this.boardsRoot = createDiv(`
		<div id="paragraph" class="spa-text">
			<div id="boards-loader" style="display:none"><img src="resources/images/spinner-grey.svg" width="80" alt=""></div>
			<div id="board-header" >
				<div id="add-board-header">
					<div id="add-board">
						<div class="btn"> Add Board</div>
						<img src="resources/images/spinner.svg" alt=""/>
					</div>
				</div>
				<div id="remove-board-header">
					<div id="remove-board">
						<div class="btn"> Remove Board</div>
						<img src="resources/images/grid.svg" alt=""/>
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

	this.boardTypeSelector = new BoardTypeSelector(this, addBoard);
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

BoardsComponent.prototype.loadBoardsFromServer = function() {
	const request = ajax({
		headers: {
			'content-type': 'application/json'
		}
	});

	const roomNumber = getRoomNumberFromUrl();
	console.log('Going to get boards with roomNumber : ' + roomNumber);

	request
		.get('/api/getRoomBoards?roomNumber=' + roomNumber)
		.then(loadedBoards => {
			for (let i = 0; i < loadedBoards.length; i++) {
				const loadedBoard = loadedBoards[i];
				console.log(loadedBoard);

				let boardDiv = document.createElement('div');
				boardDiv.setAttribute('class', 'board');

				const board = {
					type: loadedBoard.contentType,
					commands: loadedBoard.commands,
					rootElement: boardDiv,
					boardId: loadedBoard.id
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
						});
					});
			}
		});
};

function addBoard(boardsComponent, boardType, typeId) {
	const loaderDiv = document.getElementById('boards-loader');
	loaderDiv.style.display = 'block';

	const request = ajax({
		headers: {
			'content-type': 'application/json'
		}
	});

	const roomNumber = getRoomNumberFromUrl();
	request
		.post('/api/addBoard', {
			roomNumber,
			boardPayload: {
				boardType,
				typeId,
				commands: ''
			}
		})
		.then(boardId => {
			let newBoardDiv = document.createElement('div');
			newBoardDiv.setAttribute('class', 'board');

			const newBoard = {
				type: boardType,
				commands: '',
				rootElement: newBoardDiv,
				boardId
			};

			return getSamplesForType(boardType).then(samples => {
				loaderDiv.style.display = 'none';

				newBoard.samples = samples;
				boardsComponent.boards.push(newBoard);

				registerBoardOnClickHandler(
					newBoard.rootElement,
					boardsComponent
				);
				boardsComponent.boardContainer.appendChild(
					newBoard.rootElement
				);

				makeBoardSelected(
					boardsComponent.boards.length - 1,
					newBoard,
					boardsComponent
				);
				boardsComponent.boardTypeSelector.remove();
			});
		});
}

function registerBoardOnClickHandler(boardDiv, boardsComponent) {
	boardDiv.addEventListener('click', event => {
		const boardIndex = Array.from(boardDiv.parentNode.children).indexOf(
			boardDiv
		);
		const board = boardsComponent.boards[boardIndex];
		makeBoardSelected(boardIndex, board, boardsComponent);
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

	const marginTooSeeALittleBitOfBoardAbove = 25;
	const scrollTop =
		boardIndex * (boardElement.clientHeight + marginBottom + marginTop) -
		marginTooSeeALittleBitOfBoardAbove;
	boardsContainer.scrollTop = scrollTop;
}

function makeBoardSelected(selectedBoardIndex, selectedBoard, boardsComponent) {
	const selectedBoardDiv = selectedBoard.rootElement;

	if (boardsComponent.selectedBoardDiv) {
		boardsComponent.selectedBoardDiv.classList.remove('selected');
	}

	boardsComponent.selectedBoardIndex = selectedBoardIndex;
	boardsComponent.selectedBoardDiv = selectedBoardDiv;
	selectedBoardDiv.classList.add('selected');

	boardsComponent.commandsComponent.setCommands(selectedBoard.commands);
	boardsComponent.commandsComponent.setSamples(selectedBoard.samples);
	boardsComponent.commandsComponent.setBoard(selectedBoard);

	scrollToBaord(selectedBoardIndex, boardsComponent);
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
require('paragraph/boards/boards-component.css');
