import { parsePieChartCommands } from './command-parser';
import { Chart } from 'chart.js';

function visualizeBoardCommands(board) {
	const { commands, rootElement } = board;

	// clean the board
	while (rootElement.firstChild) {
		rootElement.firstChild.remove();
	}

	const pieChartIR = parsePieChartCommands(commands);
	const pieChartCanvas = document.createElement('canvas');
	rootElement.appendChild(pieChartCanvas);

	for (const chartId in pieChartIR) {
		const labels = pieChartIR[chartId].data.map(tuple => tuple[0]);
		const data = pieChartIR[chartId].data.map(tuple => tuple[1]);
		const backgroundColor = pieChartIR[chartId].data.map(tuple => tuple[2]);

		const options = {
			type: 'pie',
			data: {
				labels,
				datasets: [
					{
						label: pieChartIR[chartId].title,
						data,
						borderWidth: 1,
						backgroundColor
					}
				]
			},
			options: {
				scales: {
					yAxes: [
						{
							ticks: {
								beginAtZero: true
							}
						}
					]
				}
			}
		};

		var myChart = new Chart(pieChartCanvas, options);
	}
}

const visualizer = {
	visualizeBoardCommands
};

export { visualizer };
