import vis from 'vis-network';

function visualizeBoardCommands(board) {
	const { commands, rootElement } = board;

	// clean the board
	while (rootElement.firstChild) {
		rootElement.firstChild.remove();
	}

	const container = document.createElement('div');
	container.style.height = '600px';

	const uniqueId = 'id-' + rootElement.id;
	container.id = uniqueId;
	board.rootElement.appendChild(container);

	const graph = JSON.parse(commands);

	var data = {
		nodes: graph.nodes,
		edges: graph.edges
	};
	var options = {
		nodes: {
			shape: 'circle'
		}
	};
	var network = new vis.Network(container, data, options);
}

const visualizer = {
	visualizeBoardCommands
};

export { visualizer };
