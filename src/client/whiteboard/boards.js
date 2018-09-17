import { Widget } from "smartframes";

const addBoardHeight = 35;

const boardsWidget = new Widget("boards", [{
    title: 'Boards',
    contentNode: createDiv(`<div id="whiteboard" class="spa-text"><input type="button" class="btn add-board" value="Add Board"</div>`),

    onRenderCallback: function(widget) {
        var buttons = document.querySelectorAll('.btn.add-board');
        for (let i = 0; i < buttons.length; ++i) {
            buttons[i].style.height = addBoardHeight + "px";
        }
    }
}]);

function createDiv(innerHtml) {
    const div = document.createElement("div");
    div.style.setProperty("width", "100%");
    div.style.setProperty("height", "100%");
    div.innerHTML = innerHtml;
    return div;
}

export { boardsWidget };
require("whiteboard/boards.css")