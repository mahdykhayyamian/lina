import { Widget } from "smartframes";

const runButtonHeight = 40;
const extraSpace = 4;

const commandsWidget = new Widget("commands", [{
    title: 'Commands',
    contentNode: createDiv(`
        <textarea id="commandsTextArea" placeholder="Write commands to visualize..."></textarea>
        <input type="button" class="btn run-command" value="Run" />
        `),
    onRenderCallback: function(widget) {

        const commandsTextArea = document.getElementById("commandsTextArea");
        if (commandsTextArea) {
            commandsTextArea.style.setProperty("width", commandsTextArea.parentNode.offsetWidth + "px");
            commandsTextArea.style.setProperty("height", commandsTextArea.parentNode.offsetHeight - (runButtonHeight + extraSpace) + "px");
        }

        var buttons = document.querySelectorAll('.btn.run-command');
        for (let i = 0; i < buttons.length; ++i) {
            buttons[i].style.height = runButtonHeight + "px";
            buttons[i].style.top = (commandsTextArea.parentNode.offsetHeight - (runButtonHeight + extraSpace/2)) + "px";
        }

    }
}, {
    title: 'Samples'
}]);


function createDiv(innerHtml) {
    const div = document.createElement("div");
    div.setAttribute("id", "commands-container");
    div.style.setProperty("width", "100%");
    div.style.setProperty("height", "100%");
    div.innerHTML = innerHtml;
    return div;
}

export { commandsWidget };
require("whiteboard/commands.css")