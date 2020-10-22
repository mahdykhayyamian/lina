import * as showdown from 'showdown';

function visualizeBoardCommands(board) {
	const { commands, rootElement } = board;

	// clean the board
	while (rootElement.firstChild) {
		rootElement.firstChild.remove();
	}

	const converter = new showdown.Converter();
	const html = converter.makeHtml(board.commands);

	const showDownTargetDiv = document.createElement('div');
	rootElement.append(showDownTargetDiv);

	showDownTargetDiv.style.textAlign = 'left';
	showDownTargetDiv.style.margin = '10px';
	showDownTargetDiv.innerHTML = html;
}

const visualizer = {
	visualizeBoardCommands
};

export { visualizer };
