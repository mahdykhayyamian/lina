import {parseBarChartCommands} from "./command-parser";

function visualize(commands) {
	console.log("Visualizing commands : ");
	console.log(commands);
	const barChartIR = parseBarChartCommands(commands);
	console.log("barchart commands intermediate representation");
	console.log(barChartIR);
}

const visualizer = {
	visualize
};

export {visualizer};
