import { Widget } from "smartframes";
import { WidgetContainer } from "smartframes";
import { WidgetTabDragController } from "smartframes";
import { WidgetResizeController } from "smartframes";
import { CONSTANTS } from "smartframes";
import { CommandsComponent } from "./commands/commands-component.js";
import { BoardsComponent } from "whiteboard/boards/boards-component.js";

window.onload = function() {

    const appDiv = document.getElementById("lina.app");
    appDiv.style.setProperty("position", "absolute");

    function createTextDiv(text) {
        const div = document.createElement("div");
        div.textContent = text;
        div.style["font-size"] = "12px";
        return div;
    }

    function createDiv(innerHtml) {
        const div = document.createElement("div");
        div.style.setProperty("width", "100%");
        div.style.setProperty("height", "100%");
        div.innerHTML = innerHtml;
        return div;
    }

    function createImage(source) {
        const image = document.createElement("img");
        image.src = source;
        return image;
    }

    const chatWidget = new Widget("chatWidget", [{
        title: 'Chat',
        contentNode: createDiv(`<div id="chat" class="spa-text"></div>`)
    }]);


    const commandsComponent = new CommandsComponent();
    const commandsWidget = commandsComponent.createWidget();

    const boardsComponent = new BoardsComponent();
    boardsComponent.setCommandsComponent(commandsComponent);
    const boardsWidget = boardsComponent.createWidget();

    const topLevelContainer = new WidgetContainer([commandsWidget, boardsWidget, chatWidget], CONSTANTS.LEFT_TO_RIGHT);
    topLevelContainer.childrenRatios = [0.2, 0.6, 0.2];
    const widgetTabDragController = new WidgetTabDragController(topLevelContainer);
    const widgetResizeController = new WidgetResizeController(topLevelContainer);
    topLevelContainer.parentWidgetContainer = null;

    commandsWidget.widgetContainer = topLevelContainer;
    boardsWidget.widgetContainer = topLevelContainer;
    chatWidget.widgetContainer = topLevelContainer;

    function onResize() {
        const width = window.innerWidth - 50;
        const height = window.innerHeight - 50;
        const left = 10;
        const top = 10;

        topLevelContainer.left = left;
        topLevelContainer.top = top;
        topLevelContainer.width = width;
        topLevelContainer.height = height;

        topLevelContainer.render(appDiv);
    };

    window.onresize = onResize;
    onResize();
}