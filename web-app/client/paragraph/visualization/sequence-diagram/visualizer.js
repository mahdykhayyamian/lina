function visualizeBoardCommands(board) {
	console.log('in sequence diagram visualization');

	const { commands, rootElement } = board;

	// clean the board
	while (rootElement.firstChild) {
		rootElement.firstChild.remove();
	}

	const container = document.createElement('div');
	const uniqueid = String(Date.now());
	container.id = uniqueid;
	board.rootElement.appendChild(container);

	var d = Diagram.parse(commands);
	var options = { theme: 'simple' };
	d.drawSVG(uniqueid, options);
}

const visualizer = {
	visualizeBoardCommands
};

export { visualizer };
