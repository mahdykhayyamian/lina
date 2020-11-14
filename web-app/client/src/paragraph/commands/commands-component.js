import { Widget } from 'smartframes';
import { CONSTANTS } from 'src/paragraph/constants.js';
import { moduleLoader } from 'src/paragraph/module-loader.js';
import ajax from '@fdaciuk/ajax';
import * as loadJSPromise from 'load-js';

const CommandsComponent = function(rtcClient) {
	this.rtcClient = rtcClient;

	this.commandsRoot = createDiv(`
		<div id="${CONSTANTS.COMMANDS_ACE_EDITOR_CONTAINER}" placeholder="Write commands to visualize..."></div>
		`);
	this.commandsRoot.id = 'commands-container';

	this.samplesRoot = createDiv(`
		<div id="${CONSTANTS.SAMPLE_COMMANDS_ID}"></div>
	`);
	this.samplesRoot.style.overflow = 'auto';

	this.commands = '';
	this.samples = [];
	this.widget = null;

	attachAceEditor(`${CONSTANTS.COMMANDS_ACE_EDITOR_CONTAINER}`).then(
		editor => {
			this.commandsAceEditor = editor;

			let timeout;

			this.commandsAceEditor.on('change', () => {
				if (timeout) {
					clearTimeout(timeout);
				}

				timeout = setTimeout(() => {
					this.runCommands();
				}, 100);
			});
		}
	);
};

CommandsComponent.prototype.createWidget = function() {
	const self = this;

	const commandsWidget = new Widget('commands', [
		{
			title: 'Editor',
			contentNode: this.commandsRoot,
			onRenderCallback: function(widget) {
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
						textEditorContainer.parentNode.offsetHeight + 'px'
					);
					textEditorContainer.value = self.commands;
				}

				if (self.commandsAceEditor) {
					self.commandsAceEditor.resize(true);
				}
			}
		},
		{
			title: 'Samples',
			contentNode: this.samplesRoot,

			onRenderCallback: widget => {
				this.samplesRoot.style.height = widget.contentHeight;
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
	refreshSamples(this.samplesRoot, samples);
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

					const messageObj = {
						type: CONSTANTS.RTC_MESSAGE_TYPES.RUN_COMMANDS,
						content: {
							board: this.board
						}
					};

					const messageStr = JSON.stringify(messageObj, null, 4);
					this.rtcClient.send(messageStr);
				});
		});
};

function loadAceEditorCode() {
	if (loadAceEditorCode.loaded) {
		return Promise.resolve();
	}

	return loadJSPromise([
		{
			async: true,
			url: '/ace/src-min-noconflict/ace.js'
		}
	]).then(() => {
		loadAceEditorCode.loaded = true;
	});
}

function attachAceEditor(containerId) {
	return loadAceEditorCode().then(() => {
		const aceEditor = ace.edit(containerId);
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
		aceEditor.setOption('wrap', true);
		aceEditor.setOption('indentedSoftWrap', false);
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
		const id = `sample-command-${i}`;
		sampleDivCommands.id = id;
		sampleDivCommands.classList.add('sampleEditorContainer');
		attachAceEditor(sampleDivCommands).then(sampleAceEditor => {
			sampleAceEditor.setValue(samples[i], -1);
		});

		// sampleDivCommands.innerText = samples[i];
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
