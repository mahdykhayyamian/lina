import * as d3 from 'd3';

const HEIGHT_MARGIN = 100;
const RADIUS = 30;
const SIZE_X = 500;
const SIZE_Y = 500;

function visualizeBoardCommands(board) {
	console.log('in org chart visualizer...');

	console.log(d3);

	const { commands, rootElement } = board;

	// clean the board
	while (rootElement.firstChild) {
		rootElement.firstChild.remove();
	}

	const container = document.createElement('div');

	container.innerHTML = `
		<svg height="100%" width="100%">
		    <g transform="translate(0,50)">
		      <g class="links"></g>
		      <g class="nodes"></g>
		    </g>
		  </svg>
	`;

	container.setAttribute('class', 'math-container');
	rootElement.appendChild(container);

	const data = {
		name: 'A1',
		children: [
			{
				name: 'B1',
				children: [
					{
						name: 'C1',
						value: 100
					},
					{
						name: 'C2',
						value: 300
					},
					{
						name: 'Pretty Long Name',
						value: 200,
						children: [
							{
								name: 'D1',
								value: 400,
								children: [
									{
										name: 'E1',
										value: 600
									}
								]
							},
							{
								name: 'D2',
								value: 500,
								children: [
									{
										name: 'R1',
										value: 400,
										children: [
											{
												name: 'S1',
												value: 600
											}
										]
									},
									{
										name: 'T2',
										value: 500
									}
								]
							}
						]
					}
				]
			},
			{
				name: 'B2',
				value: 200
			}
		]
	};

	const root = d3.hierarchy(data);
	const treeLayout = d3.tree();
	treeLayout.size([SIZE_X, SIZE_Y]);
	treeLayout(root);

	console.log(root.descendants());
	console.log(root.links());

	const nodes = root.descendants();

	const maxY = Math.max(...nodes.map(n => n.y));

	console.log('maxY = ' + maxY);

	container.style.height = maxY + HEIGHT_MARGIN + 'px';

	// Nodes
	const g = d3
		.select('svg g.nodes')
		.selectAll('circle.node')
		.data(root.descendants())
		.enter()
		.append('g');

	// Node Circles
	g.append('circle')
		.classed('node', true)
		.attr('cx', function(d) {
			return d.x;
		})
		.attr('cy', function(d) {
			return d.y;
		})
		.attr('r', RADIUS);

	// Node Labels
	const textContaier = g
		.append('g')
		.attr('transform', `translate(${-RADIUS / 2}, 0)`);

	textContaier
		.append('text')
		.text(function(d) {
			return d.data.name;
		})
		.attr('x', d => d.x)
		.attr('y', d => d.y)
		.classed('node-text', true);

	// Links
	d3.select('svg g.links')
		.selectAll('line.link')
		.data(root.links())
		.enter()
		.append('line')
		.classed('link', true)
		.attr('x1', function(d) {
			return d.source.x;
		})
		.attr('y1', function(d) {
			return d.source.y;
		})
		.attr('x2', function(d) {
			return d.target.x;
		})
		.attr('y2', function(d) {
			return d.target.y;
		});
}

const visualizer = {
	visualizeBoardCommands
};

require('src/paragraph/visualization/org-chart/visualizer.css');
export { visualizer };
