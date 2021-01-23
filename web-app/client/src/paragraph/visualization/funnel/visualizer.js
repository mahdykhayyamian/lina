import D3Funnel from 'd3-funnel';

function visualizeBoardCommands(board) {
	console.log('in funnel visualize commands');
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

	const data = [
		{ label: 'Inquiries', value: 5000 },
		{ label: 'Applicants', value: 2500 },
		{ label: 'Admits', value: 1500 },
		{ label: 'Deposits', value: 800 }
	];
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
