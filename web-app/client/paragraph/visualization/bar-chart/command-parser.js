//sample commands for barchart

/*
	Barchart statePopulations
	statePopulations.title = "US State Populations im millions"
	statePopulations.data = [["California", 36], ["Texas", 22], ["New York", 19]]
	statePopulations.color = "blue"
*/

const DEFINITION_REGX = /^Barchart[\s+]([\S].*)$/;
const TITLE_ASSIGNMENT_REGX = /^(.*)\.title[\s*]=[\s*]\"(.*)\"$/;
const DATA_ASSIGNMENT_REGX = /^(.*)\.data[\s*]=[\s*](.*)$/;
const COLOR_ASSIGNMENT_REGX = /^(.*)\.color[\s*]=[\s*]\"(.*)\"$/;

const parseBarChartCommands = function(commands) {
	const barChartIR = {};

	const lines = commands.split(/\r?\n/);

	for (let i = 0; i < lines.length; i++) {
		interpretLine(lines[i], barChartIR);
	}

	return barChartIR;
};

function interpretLine(line, barChartIR) {
	line = line.trim();

	let match = DEFINITION_REGX.exec(line);

	// definition
	if (match) {
		const barchartVarName = match[1];
		barChartIR[barchartVarName] = {};
		return;
	}

	// title
	match = TITLE_ASSIGNMENT_REGX.exec(line);
	if (match) {
		const barchartVarName = match[1];

		if (!barChartIR[barchartVarName]) {
			throw new Error(`${barchartVarName} is not defined`);
		}

		const barchartTitle = match[2];
		barChartIR[barchartVarName].title = barchartTitle;
		return;
	}

	// data
	match = DATA_ASSIGNMENT_REGX.exec(line);
	if (match) {
		const barchartVarName = match[1];

		if (!barChartIR[barchartVarName]) {
			throw new Error(`${barchartVarName} is not defined`);
		}
		const data = JSON.parse(match[2]);
		barChartIR[barchartVarName].data = data;
		return;
	}

	// color
	match = COLOR_ASSIGNMENT_REGX.exec(line);
	if (match) {
		const barchartVarName = match[1];

		if (!barChartIR[barchartVarName]) {
			throw new Error(`${barchartVarName} is not defined`);
		}

		const barChartColor = match[2];
		barChartIR[barchartVarName].color = barChartColor;
		return;
	}
}

export { parseBarChartCommands };
