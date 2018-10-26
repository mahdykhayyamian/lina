import { Widget } from "smartframes";
import { BoardTypeSelector } from "./select-board-type.js";
import { samples as barChartSamples } from "./visualization/bar-chart/sample-command.js";
import { CONSTANTS } from "./constants.js";

const addBoardHeight = 40;
const boardHeight = 600;
const margin = 20;
const whiteBoardWidth = 1000;
const boardHeaderHeight = 50;

let boardTypeSelector;
let boardHeaderDiv;
let boardContainer;

function addButtonClickEventListener(event) {

    if (boardTypeSelector && boardTypeSelector.isShown()) {
        return;
    }

    const width = 250;

    boardTypeSelector = new BoardTypeSelector(boardHeaderDiv, width, (contentType) => {
        const newBoard = {
            type: contentType,
            commands: "",
            samples: getSamplesForContentType(contentType)
        };

        boardsWidget.boards.push(newBoard);

        let newBoardDiv = document.createElement("div");
        newBoardDiv.setAttribute("id", "board-" + boardsWidget.boards.length);
        newBoardDiv.setAttribute("class", "board");

        let newBoardTop = (boardsWidget.boards.length-1) * boardHeight + boardsWidget.boards.length * margin + addBoardHeight;
        newBoardDiv.style.setProperty("top", newBoardTop + "px");

        boardContainer.appendChild(newBoardDiv);
        boardTypeSelector.remove();
        boardsWidget.commandsComponent.setSamples(newBoard.samples);
    });

    boardTypeSelector.render();
}

function setSampleCommands(commands) {
    const sampleCommands = document.getElementById(CONSTANTS.SAMPLE_COMMANDS_ID);
    console.log(sampleCommands);
    sampleCommands.innerText = commands;
}

var boardsWidget = new Widget("boards", [{
    title: 'Boards',
    contentNode: createDiv(`<div id="whiteboard" class="spa-text">
                                <div id="board-header">
                                    <input id = "add-board" type="button" class="btn" value="Add Board"</input>
                                </div>
                                <div id="board-container"></div>
                            </div>`),

    onRenderCallback: (widget) => {

        const addBoardButton = document.getElementById('add-board');

        if (addBoardButton) {
            addBoardButton.style.height = addBoardHeight + "px";
            addBoardButton.addEventListener("click", addButtonClickEventListener);
        }

        boardHeaderDiv = document.getElementById("board-header");

        if (boardHeaderDiv) {
            boardHeaderDiv.style.setProperty("height", boardHeaderHeight + "px");
            boardContainer = document.getElementById("board-container");
            boardContainer.style.setProperty("height", (widget.contentHeight - boardHeaderHeight) + "px");
            boardContainer.style.setProperty("width", widget.width + "px");
        }
    }
}]);

boardsWidget.boards = [];

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

export { boardsWidget };
require("whiteboard/boards.css")