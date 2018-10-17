import { Widget } from "smartframes";

import { BoardTypeSelector } from "./select-board-type.js";

const addBoardHeight = 40;
const boardHeight = 600;
const margin = 20;
const whiteBoardWidth = 1000;
const boardHeaderHeight = 50;

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

        let whiteBoardDiv = document.getElementById("whiteboard");

        let boardHeaderDiv = document.getElementById("board-header");
        boardHeaderDiv.style.setProperty("height", boardHeaderHeight + "px");

        let boardContainer = document.getElementById("board-container");                
        boardContainer.style.setProperty("height", (widget.contentHeight - boardHeaderHeight) + "px");
        boardContainer.style.setProperty("width", widget.width + "px");

        const width = 250;
        let boardTypeSelector = null;

        addBoardButton.style.height = addBoardHeight + "px";
        addBoardButton.addEventListener("click", (event) => {

            if (boardTypeSelector && boardTypeSelector.isShown()) {
                return;
            }

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
        });
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