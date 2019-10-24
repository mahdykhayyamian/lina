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

	var d = Diagram.parse(commands);
	var options = { theme: 'simple' };
	d.drawSVG(uniqueId, options);
}

const visualizer = {
	visualizeBoardCommands
};

export { visualizer };
