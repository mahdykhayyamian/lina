import * as d3 from 'd3';
import * as venn from 'venn.js';

function visualizeBoardCommands(board) {
	const { commands, rootElement } = board;

	// clean the board
	while (rootElement.firstChild) {
		rootElement.firstChild.remove();
	}

	const container = document.createElement('div');
	const uniqueId = 'id-' + String(Date.now());
	container.id = uniqueId;
	board.rootElement.appendChild(container);

	if (!commands || commands.length == 0) {
		return;
	}

	const sets = JSON.parse(commands);
	var chart = venn.VennDiagram();
	d3.select(`#${uniqueId}`)
		.datum(sets)
		.call(chart);
}

const visualizer = {
	visualizeBoardCommands
};

export { visualizer };
