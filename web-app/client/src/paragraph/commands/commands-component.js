import { Widget } from 'smartframes';
import { CONSTANTS } from 'src/paragraph/constants.js';
import { moduleLoader } from 'src/paragraph/module-loader.js';
import ajax from '@fdaciuk/ajax';
import * as loadJSPromise from 'load-js';

const CommandsComponent = function() {
	this.commandsRoot = createDiv(`
		<div id="${CONSTANTS.COMMANDS_ACE_EDITOR_CONTAINER}" placeholder="Write commands to visualize..."></div>
		<input type="button" class="btn run-command" value="Run" />
		`);
	this.commandsRoot.id = 'commands-container';

	this.samplesRoot = createDiv(`
		<div id="${CONSTANTS.SAMPLE_COMMANDS_ID}"></div>
	`);
	this.samplesRoot.style.overflow = 'auto';

	this.commands = '';
	this.samples = [];
	this.widget = null;

	loadAceEditor().then(editor => {
		this.commandsAceEditor = editor;
	});
};

CommandsComponent.prototype.createWidget = function() {
	const runCommandClickEventHandler = event => {
		this.runCommands();
	};

	const self = this;

	const commandsWidget = new Widget('commands', [
		{
			title: 'Commands',
			contentNode: this.commandsRoot,
			onRenderCallback: function(widget) {
				const runButtonHeight = 40;
				const extraSpace = 4;

				const textEditorContainer = document.getElementById(
					CONSTANTS.COMMANDS_ACE_EDITOR_CONTAINER
				);
				if (textEditorContainer) {
					textEditorContainer.style.setProperty(
						'width',
						textEditorContainer.parentNode.offsetWidth + 'px'
					);
					textEditorContainer.style.setProperty(
						'height',
						textEditorContainer.parentNode.offsetHeight -
							(runButtonHeight + extraSpace) +
							'px'
					);
					textEditorContainer.value = self.commands;
				}

				const buttons = document.querySelectorAll('.btn.run-command');
				for (let i = 0; i < buttons.length; ++i) {
					buttons[i].style.height = runButtonHeight + 'px';
					buttons[i].style.top =
						textEditorContainer.parentNode.offsetHeight -
						(runButtonHeight + extraSpace / 2) +
						'px';
					buttons[i].addEventListener(
						'click',
						runCommandClickEventHandler
					);
				}

				if (self.commandsAceEditor) {
					self.commandsAceEditor.resize(true);
				}
			}
		},
		{
			title: 'Sample Commands',
			contentNode: this.samplesRoot,

			onRenderCallback: widget => {
				this.samplesRoot.style.height = widget.contentHeight;
				this.setSamples(this.samples);
			}
		}
	]);

	this.widget = commandsWidget;
	return commandsWidget;
};

CommandsComponent.prototype.setBoard = function(board) {
	this.board = board;
};

CommandsComponent.prototype.setSamples = function(samples) {
	this.samples = samples;
	const samplesDiv = document.getElementById(CONSTANTS.SAMPLE_COMMANDS_ID);

	if (samplesDiv) {
		refreshSamples(samplesDiv, samples);
	}
};

CommandsComponent.prototype.setCommands = function(commands) {
	this.commands = commands;

	const textEditorContainer = document.getElementById(
		CONSTANTS.COMMANDS_ACE_EDITOR_CONTAINER
	);
	if (textEditorContainer) {
		textEditorContainer.value = this.commands;
		this.commandsAceEditor.setValue(this.commands, -1);
	}
};

CommandsComponent.prototype.runCommands = function() {
	if (!this.board) {
		return;
	}

	this.commands = this.commandsAceEditor.getValue();

	const request = ajax({
		headers: {
			'content-type': 'application/json'
		}
	});

	request
		.post('/api/updateBoardCommands', {
			boardId: this.board.boardId,
			commands: this.commands
		})
		.then(() => {
			const moduleName = this.board.type;
			this.board.commands = this.commands;

			return moduleLoader
				.getModuleByName(moduleName)
				.then(visualizerModule => {
					const visualizer = visualizerModule.default.visualizer;
					visualizer.visualizeBoardCommands(this.board);
				});
		});
};

function loadAceEditor() {
	return loadJSPromise([
		{
			async: true,
			url: '/ace/src-min-noconflict/ace.js'
		}
	]).then(() => {
		const aceEditor = ace.edit(
			`${CONSTANTS.COMMANDS_ACE_EDITOR_CONTAINER}`
		);
		aceEditor.setTheme('ace/theme/chrome');
		aceEditor.session.setMode('ace/mode/javascript');
		aceEditor.session.setOption('useWorker', false);
		aceEditor.setOption('showPrintMargin', false);
		aceEditor.setOption('autoScrollEditorIntoView', true);
		aceEditor.setOptions({
			fontFamily: 'monaco',
			fontSize: '10pt'
		});
		aceEditor.resize(true);
		return aceEditor;
	});
}

function createDiv(innerHtml) {
	const div = document.createElement('div');
	div.style.setProperty('width', '100%');
	div.style.setProperty('height', '100%');
	div.innerHTML = innerHtml;
	return div;
}

function copyToClipboard(text) {
	if (window.clipboardData && window.clipboardData.setData) {
		// IE specific code path to prevent textarea being shown while dialog is visible.
		return clipboardData.setData('Text', text);
	} else if (
		document.queryCommandSupported &&
		document.queryCommandSupported('copy')
	) {
		var textarea = document.createElement('textarea');
		textarea.textContent = text;
		textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
		document.body.appendChild(textarea);
		textarea.select();
		try {
			return document.execCommand('copy'); // Security exception may be thrown by some browsers.
		} catch (ex) {
			console.warn('Copy to clipboard failed.', ex);
			return false;
		} finally {
			document.body.removeChild(textarea);
		}
	}
}

function refreshSamples(samplesDiv, samples) {
	// remove current samples if any
	while (samplesDiv.firstChild) {
		samplesDiv.removeChild(samplesDiv.firstChild);
	}

	for (let i = 0; i < samples.length; i++) {
		const sampleDiv = document.createElement('div');
		sampleDiv.classList.add('sample-command');

		const sampleDivCommands = document.createElement('div');
		sampleDivCommands.innerText = samples[i];
		sampleDiv.appendChild(sampleDivCommands);

		const sampleDivButton = document.createElement('div');
		sampleDivButton.classList.add('copy-to-clipboard-button-holder');

		const copyToClipboardButton = document.createElement('input');
		copyToClipboardButton.setAttribute('type', 'button');
		copyToClipboardButton.setAttribute('class', 'btn copy-to-clipboard');
		copyToClipboardButton.setAttribute('value', 'copy');

		copyToClipboardButton.onclick = () => {
			copyToClipboard(samples[i]);
		};

		sampleDivButton.appendChild(copyToClipboardButton);
		sampleDiv.appendChild(sampleDivButton);

		samplesDiv.appendChild(sampleDiv);
	}
}

export { CommandsComponent };
require('src/paragraph/commands/commands.css');
