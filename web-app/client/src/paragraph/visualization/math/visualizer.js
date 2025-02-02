function visualizeBoardCommands(board) {
	const { commands, rootElement } = board;

	// clean the board
	while (rootElement.firstChild) {
		rootElement.firstChild.remove();
	}

	const mathContainer = document.createElement('div');
	mathContainer.setAttribute('class', 'math-container');
	rootElement.appendChild(mathContainer);

	katex.render(commands, mathContainer, {
		throwOnError: true
	});
}

const visualizer = {
	visualizeBoardCommands
};

export { visualizer };
require('src/paragraph/visualization/math/visualizer.css');
