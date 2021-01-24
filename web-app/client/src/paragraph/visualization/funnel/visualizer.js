import D3Funnel from 'd3-funnel';

function visualizeBoardCommands(board) {
	const { commands, rootElement } = board;

	// clean the board
	while (rootElement.firstChild) {
		rootElement.firstChild.remove();
	}

	const container = document.createElement('div');
	const uniqueId = 'id-' + rootElement.id;
	container.id = uniqueId;
	container.setAttribute('class', 'funnel-container');

	board.rootElement.appendChild(container);

	const data = JSON.parse(commands);

	const options = {
		block: {
			dynamicSlope: true,
			fill: {
				type: 'gradient'
			}
		},
		chart: {
			curve: {
				enabled: true
			}
		},
		fill: {
			type: 'gradient'
		}
	};

	const chart = new D3Funnel('#' + uniqueId);
	chart.draw(data, options);
}

const visualizer = {
	visualizeBoardCommands
};

export { visualizer };
require('src/paragraph/visualization/funnel/visualizer.css');
