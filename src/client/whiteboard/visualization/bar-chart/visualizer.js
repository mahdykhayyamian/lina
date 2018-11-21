import {parseBarChartCommands} from "./command-parser";

function visualize(commands) {
	console.log("Visualizing commands : " + commands);
	const barChartIR = parseBarChartCommands(commands);
	console.log(barChartIR);
}

const visualizer = {
	visualize
};

export {visualizer};
