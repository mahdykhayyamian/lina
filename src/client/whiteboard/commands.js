import { Widget } from "smartframes";

const commandsWidget = new Widget("commands", [{
    title: 'Commands',
    contentNode: createDiv(`
        <textarea id="commandsTextArea" placeholder="Write commands to visualize..."></textarea>
        `),
    onRenderCallback: function(widget) {
        const commandsTextArea = document.getElementById("commandsTextArea");
        if (commandsTextArea) {
            commandsTextArea.style.setProperty("width", commandsTextArea.parentNode.offsetWidth + "px");
            commandsTextArea.style.setProperty("height", commandsTextArea.parentNode.offsetHeight + "px");
        }
    }
}, {
    title: 'Samples'
}]);

function createDiv(innerHtml) {
    const div = document.createElement("div");
    div.style.setProperty("width", "100%");
    div.style.setProperty("height", "100%");
    div.innerHTML = innerHtml;
    return div;
}

export { commandsWidget };
require("whiteboard/commands.css")