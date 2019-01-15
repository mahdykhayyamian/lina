import { Widget } from "smartframes";
import { BoardTypeSelector } from "whiteboard/boards/select-board-type.js";
import { CONSTANTS } from "whiteboard/constants.js";
import { moduleLoader } from "whiteboard/module-loader.js";

const addBoardHeight = 40;
const boardHeight = 600;
const margin = 20;
const whiteBoardWidth = 1000;
const boardHeaderHeight = 50;

const BoardsComponent =  function () {

	this.boardsRoot = createDiv(`<div id="whiteboard" class="spa-text">
									<div id="board-header">
										<div id="add-board-header">
											<input id = "add-board" type="button" class="btn" value="Add Board"</input>
										</div>
										<div id="remove-board-header">
											<input id="remove-board" type="button" class="btn" value="Remove Board"</input>
										</div>
									</div>
									<div id="board-container"></div>
								</div>`);
	this.boards = [];
	this.boardTypeSelector = null;
	this.boardHeaderDiv = null;
	this.boardContainer = null;
};

BoardsComponent.prototype.createWidget = function() {
	const addBoardButtonClickEventHandler = (event) => {

		if (this.boardTypeSelector &&  this.boardTypeSelector.isShown()) {
			return;
		}
		this.boardTypeSelector = new BoardTypeSelector(this, addBoard);
		this.boardTypeSelector.render();
	}

	const removeBoardButtonClickEventHandler = (event) => {
		removeSelectedBoard(this);
	}

	const boardsWidget = new Widget("boards", [{
		title: 'Boards',
		contentNode: this.boardsRoot,

		onRenderCallback: (widget) => {

			const addBoardButton = document.getElementById('add-board');

			if (addBoardButton) {
				addBoardButton.style.height = addBoardHeight + "px";
				addBoardButton.addEventListener("click", addBoardButtonClickEventHandler);
			}

			const removeBoardButton = document.getElementById('remove-board');

			if (removeBoardButton) {
				removeBoardButton.style.height = addBoardHeight + "px";
				removeBoardButton.addEventListener("click", removeBoardButtonClickEventHandler);
			}

			this.boardHeaderDiv = document.getElementById("board-header");

			if (this.boardHeaderDiv) {
				this.boardHeaderDiv.style.setProperty("height", boardHeaderHeight + "px");
				this.boardContainer = document.getElementById("board-container");
				this.boardContainer.style.setProperty("height", (widget.contentHeight - boardHeaderHeight) + "px");
				this.boardContainer.style.setProperty("width", widget.width + "px");
			}

			this.addBoardHeader = document.getElementById("add-board-header");
		}
	}]);

	return boardsWidget;
};


BoardsComponent.prototype.setCommandsComponent = function(commandsComponent) {
	this.commandsComponent = commandsComponent;
}


function addBoard(boardsComponent, type) {

	let newBoardDiv = document.createElement("div");
	newBoardDiv.setAttribute("id", "board-" + boardsComponent.boards.length);
	newBoardDiv.setAttribute("class", "board");

	const newBoard = {
		type,
		commands: "",
		rootElement: newBoardDiv
	};

	return getSamplesForType(type).then(samples => {
		newBoard.samples = samples
		boardsComponent.boards.push(newBoard);

		addBoardOnClickHandler(newBoard.rootElement, boardsComponent);
		makeBoardSelected(boardsComponent.boards.length-1, newBoard, boardsComponent);

		boardsComponent.boardContainer.appendChild(newBoard.rootElement);
		boardsComponent.boardTypeSelector.remove();
	});
};

function addBoardOnClickHandler(boardDiv, boardsComponent) {
	boardDiv.addEventListener("click", (event) => {
		const boardIndex = Array.from(boardDiv.parentNode.children).indexOf(boardDiv);
		const board = boardsComponent.boards[boardIndex];
		makeBoardSelected(boardIndex, board, boardsComponent);
	});
}

function makeBoardSelected(selectedBoardIndex, selectedBoard, boardsComponent) {

	const selectedBoardDiv = selectedBoard.rootElement;

	if (boardsComponent.selectedBoardDiv) {
		boardsComponent.selectedBoardDiv.classList.remove("selected");
	}

	boardsComponent.selectedBoardIndex = selectedBoardIndex;
	boardsComponent.selectedBoardDiv = selectedBoardDiv;
	selectedBoardDiv.classList.add("selected");

	boardsComponent.commandsComponent.setSamples(selectedBoard.samples);
	boardsComponent.commandsComponent.setBoard(selectedBoard);
}

function removeSelectedBoard(boardsComponent) {

	if (boardsComponent.selectedBoardIndex !== null) {
		boardsComponent.selectedBoardDiv.remove();
		boardsComponent.boards.splice(boardsComponent.selectedBoardIndex, 1);
		boardsComponent.selectedBoardIndex = null;
		boardsComponent.selectedBoardDiv = null;
	}
}

function createDiv(innerHtml) {
	const div = document.createElement("div");
	div.style.setProperty("width", "100%");
	div.style.setProperty("height", "100%");
	div.innerHTML = innerHtml;
	return div;
}


function getSamplesForType(type) {
	switch (type) {
		case "bar-chart":
			const barchartModule = moduleLoader.getModuleByName(type);
			return barchartModule.then(barchartModule => {
				return barchartModule.default.samples;
			});

			break;
		default:
			return Promise.resolve([]);
			break;
	}
}

export {BoardsComponent};
require("whiteboard/boards/boards.css");