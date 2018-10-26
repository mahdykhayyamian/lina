import { Widget } from "smartframes";
import { BoardTypeSelector } from "whiteboard/boards/select-board-type.js";
import { samples as barChartSamples } from "whiteboard/visualization/bar-chart/sample-command.js";
import { CONSTANTS } from "whiteboard/constants.js";

const addBoardHeight = 40;
const boardHeight = 600;
const margin = 20;
const whiteBoardWidth = 1000;
const boardHeaderHeight = 50;

const BoardsComponent =  function () {

	this.boardsRoot = createDiv(`<div id="whiteboard" class="spa-text">
	                                <div id="board-header">
	                                    <input id = "add-board" type="button" class="btn" value="Add Board"</input>
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

	const boardsWidget = new Widget("boards", [{
	    title: 'Boards',
	    contentNode: this.boardsRoot,

	    onRenderCallback: (widget) => {

	        const addBoardButton = document.getElementById('add-board');

	        if (addBoardButton) {
	            addBoardButton.style.height = addBoardHeight + "px";
	            addBoardButton.addEventListener("click", addBoardButtonClickEventHandler);
	        }

	        this.boardHeaderDiv = document.getElementById("board-header");

	        if (this.boardHeaderDiv) {
	            this.boardHeaderDiv.style.setProperty("height", boardHeaderHeight + "px");
	            this.boardContainer = document.getElementById("board-container");
	            this.boardContainer.style.setProperty("height", (widget.contentHeight - boardHeaderHeight) + "px");
	            this.boardContainer.style.setProperty("width", widget.width + "px");
	        }
	    }
	}]);

	return boardsWidget;
};


function addBoard(boardsComponent, contentType) {

    const newBoard = {
        type: contentType,
        commands: "",
        samples: getSamplesForContentType(contentType)
    };

    boardsComponent.boards.push(newBoard);

    let newBoardDiv = document.createElement("div");
    newBoardDiv.setAttribute("id", "board-" + boardsComponent.boards.length);
    newBoardDiv.setAttribute("class", "board");

    let newBoardTop = (boardsComponent.boards.length-1) * boardHeight + boardsComponent.boards.length * margin + addBoardHeight;
    newBoardDiv.style.setProperty("top", newBoardTop + "px");

    boardsComponent.boardContainer.appendChild(newBoardDiv);
    boardsComponent.boardTypeSelector.remove();
    boardsComponent.commandsComponent.setSamples(newBoard.samples);
};

BoardsComponent.prototype.setCommandsComponent = function(commandsComponent) {
	this.commandsComponent = commandsComponent;
}

function createDiv(innerHtml) {
    const div = document.createElement("div");
    div.style.setProperty("width", "100%");
    div.style.setProperty("height", "100%");
    div.innerHTML = innerHtml;
    return div;
}


function getSamplesForContentType(contentType) {
    console.log("in getSamplesForContentType, contentType = " + contentType);
    console.log(barChartSamples);
    switch (contentType) {
        case "bar-chart":
            return barChartSamples;
            break;
        default:
            return [];
            break;
    }
}

export {BoardsComponent};
require("whiteboard/boards/boards.css");