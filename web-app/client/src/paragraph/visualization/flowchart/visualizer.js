import * as mermaid from 'mermaid';

mermaid.mermaidAPI.initialize({
	startOnLoad: false
});

function visualizeBoardCommands(board) {
	const { commands, rootElement } = board;

	// clean the board
	while (rootElement.firstChild) {
		rootElement.firstChild.remove();
	}

	const container = document.createElement('div');
	const uniqueId = 'id-' + rootElement.id;
	container.id = uniqueId;
	board.rootElement.appendChild(container);

	const insertSvg = function(svgCode, bindFunctions) {
		container.innerHTML = svgCode;
	};

	const graphDefinition = commands;
	const graph = mermaid.mermaidAPI.render(
		`flowchart-${uniqueId}`,
		graphDefinition,
		insertSvg
	);
}

const visualizer = {
	visualizeBoardCommands
};

export { visualizer };
