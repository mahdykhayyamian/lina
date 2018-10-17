import { Widget } from "smartframes";

import { BoardTypeSelector } from "./select-board-type.js";

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
        boardsWidget.boards.push({
            type: contentType,
            commands: ""
        });

        let newBoardDiv = document.createElement("div");
        newBoardDiv.setAttribute("id", "board-" + boardsWidget.boards.length);
        newBoardDiv.setAttribute("class", "board");

        let newBoardTop = (boardsWidget.boards.length-1) * boardHeight + boardsWidget.boards.length * margin + addBoardHeight;
        newBoardDiv.style.setProperty("top", newBoardTop + "px");

        boardContainer.appendChild(newBoardDiv);

        boardTypeSelector.remove();
    });

    boardTypeSelector.render();
}


const boardsWidget = new Widget("boards", [{
    title: 'Boards',
    contentNode: createDiv(`<div id="whiteboard" class="spa-text">
                                <div id="board-header">
                                    <input id = "add-board" type="button" class="btn" value="Add Board"</input>
                                </div>
                                <div id="board-container"></div>
                            </div>`),

    onRenderCallback: (widget) => {

        const addBoardButton = document.getElementById('add-board');

        boardHeaderDiv = document.getElementById("board-header");
        boardHeaderDiv.style.setProperty("height", boardHeaderHeight + "px");

        boardContainer = document.getElementById("board-container");
        boardContainer.style.setProperty("height", (widget.contentHeight - boardHeaderHeight) + "px");
        boardContainer.style.setProperty("width", widget.width + "px");

        addBoardButton.style.height = addBoardHeight + "px";
        addBoardButton.addEventListener("click", addButtonClickEventListener);
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

export { boardsWidget };
require("whiteboard/boards.css")