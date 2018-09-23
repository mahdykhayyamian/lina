import { Widget } from "smartframes";

const addBoardHeight = 40;
const boardHeight = 600;
const margin = 20;
const whiteBoardWidth = 1000;
const boardHeaderHeight = 50;

const boardsWidget = new Widget("boards", [{
    title: 'Boards',
    contentNode: createDiv(`<div id="whiteboard" class="spa-text">
                                <div id="board-header">
                                    <input type="button" class="btn add-board" value="Add Board"</input>
                                </div>
                                <div id="board-container"></div>
                            </div>`),

    onRenderCallback: (widget) => {
        var buttons = document.querySelectorAll('.btn.add-board');

        let whiteBoardDiv = document.getElementById("whiteboard");

        let boardHeaderDiv = document.getElementById("board-header");
        boardHeaderDiv.style.setProperty("height", boardHeaderHeight + "px");

        let boardContainer = document.getElementById("board-container");                
        boardContainer.style.setProperty("height", (widget.contentHeight - boardHeaderHeight) + "px");
        boardContainer.style.setProperty("width", widget.width + "px");

        for (let i = 0; i < buttons.length; ++i) {

            buttons[i].style.height = addBoardHeight + "px";

            buttons[i].addEventListener("click", (event) => {
                boardsWidget.boards.push({
                    type: "someType",
                    commands: "someCommands"
                });

                let newBoardDiv = document.createElement("div");
                newBoardDiv.setAttribute("id", "board-" + boardsWidget.boards.length);
                newBoardDiv.setAttribute("class", "board");

                let newBoardTop = (boardsWidget.boards.length-1) * boardHeight + boardsWidget.boards.length * margin + addBoardHeight;
                newBoardDiv.style.setProperty("top", newBoardTop + "px");

                boardContainer.appendChild(newBoardDiv);
            });
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

export { boardsWidget };
require("whiteboard/boards.css")