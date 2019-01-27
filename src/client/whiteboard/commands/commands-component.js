import { Widget } from "smartframes";
import { CONSTANTS } from "whiteboard/constants.js";
import { moduleLoader } from "whiteboard/module-loader.js";

const CommandsComponent =  function () {
	this.commandsRoot = createDiv(`
	    <textarea id="${CONSTANTS.COMMANDS_TEXT_AREA_ID}" placeholder="Write commands to visualize..."></textarea>
	    <input type="button" class="btn run-command" value="Run" />
	    `);
	this.commandsRoot.id = "commands-container";

	this.samplesRoot = createDiv(`
	    <div id="${CONSTANTS.SAMPLE_COMMANDS_ID}"></div>
	`);
	this.samplesRoot.style.overflow = "auto";

	this.commands = "";
	this.samples = [];
	this.widget = null;
};

CommandsComponent.prototype.createWidget = function() {

	const runCommandClickEventHandler = (event) => {
		this.runCommands();
	}

	const self = this;

	const commandsWidget = new Widget("commands", [{
	    title: 'Commands',
	    contentNode: this.commandsRoot,
	    onRenderCallback: function(widget) {
			const runButtonHeight = 40;
			const extraSpace = 4;

	        const commandsTextArea = document.getElementById(CONSTANTS.COMMANDS_TEXT_AREA_ID);
	        if (commandsTextArea) {
	            commandsTextArea.style.setProperty("width", commandsTextArea.parentNode.offsetWidth + "px");
				commandsTextArea.style.setProperty("height", commandsTextArea.parentNode.offsetHeight - (runButtonHeight + extraSpace) + "px");
				commandsTextArea.value = self.commands;
	        }

	        var buttons = document.querySelectorAll('.btn.run-command');
	        for (let i = 0; i < buttons.length; ++i) {
	            buttons[i].style.height = runButtonHeight + "px";
	            buttons[i].style.top = (commandsTextArea.parentNode.offsetHeight - (runButtonHeight + extraSpace/2)) + "px";
				buttons[i].addEventListener("click", runCommandClickEventHandler);
			}
	    }
	}, {
	    title: 'Sample Commands',
	    contentNode: this.samplesRoot,

	    onRenderCallback: (widget) => {
			this.samplesRoot.style.height = widget.contentHeight;

			// remove current samples if any
			while (this.samplesRoot.firstChild) {
				this.samplesRoot.removeChild(this.samplesRoot.firstChild);
			}

			for (let i=0; i<self.samples.length; i++) {
				const sampleDiv = document.createElement("div");
				sampleDiv.classList.add('sample-command');
				sampleDiv.innerText = self.samples[i];
				this.samplesRoot.appendChild(sampleDiv);
			}
	    }
	}]);

	this.widget = commandsWidget;
	return commandsWidget;
};


CommandsComponent.prototype.setBoard = function(board) {
	this.board = board;
};

CommandsComponent.prototype.setSamples = function(samples) {
	this.samples = samples;
	this.widget.render();
};

CommandsComponent.prototype.setCommands = function(commands) {
	this.commands = commands;
	this.widget.render();
};


CommandsComponent.prototype.runCommands = function() {
	if (!this.board) {
		return;
	}

	const moduleName = this.board.type;
	this.commands = document.getElementById(CONSTANTS.COMMANDS_TEXT_AREA_ID).value;
	this.board.commands = this.commands;

	return moduleLoader.getModuleByName(moduleName).then(visualizerModule => {
		const visualizer = visualizerModule.default.visualizer;
		visualizer.visualizeBoardCommands(this.board);
	});
};

function createDiv(innerHtml) {
    const div = document.createElement("div");
    div.style.setProperty("width", "100%");
    div.style.setProperty("height", "100%");
    div.innerHTML = innerHtml;
    return div;
}

export {CommandsComponent};
require("whiteboard/commands/commands.css");