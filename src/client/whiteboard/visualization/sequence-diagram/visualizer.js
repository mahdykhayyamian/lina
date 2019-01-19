function visualizeBoardCommands(board) {

	console.log("in sequence diagram visualization");

	const {commands, rootElement} = board;

	// clean the board
	while (rootElement.firstChild) {
		rootElement.firstChild.remove();
	}
	
	const container = document.createElement("div");
	const uniqid = String(Date.now());
	container.id = uniqid;
	board.rootElement.appendChild(container);

	var d = Diagram.parse(commands);
	var options = {theme: 'simple'};
	d.drawSVG(uniqid, options);
}

const visualizer = {
	visualizeBoardCommands
};

export {visualizer};
