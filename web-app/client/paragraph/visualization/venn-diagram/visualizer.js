import * as d3 from 'd3';
import * as venn from 'venn.js';

function visualizeBoardCommands(board) {
	console.log('in venn diagram visualization');

	const { commands, rootElement } = board;

	// clean the board
	while (rootElement.firstChild) {
		rootElement.firstChild.remove();
	}

	console.log(venn);
	console.log(d3);

	const container = document.createElement('div');
	const uniqueid = 'id-' + String(Date.now());
	container.id = uniqueid;
	board.rootElement.appendChild(container);

	if (!commands || commands.length == 0) {
		return;
	}

	const sets = JSON.parse(commands);
	var chart = venn.VennDiagram();
	d3.select(`#${uniqueid}`)
		.datum(sets)
		.call(chart);
}

const visualizer = {
	visualizeBoardCommands
};

export { visualizer };
