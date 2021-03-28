//sample commands for piechart

/*
	piechart statePopulations
	statePopulations.title = "US State Populations im millions"
	statePopulations.data = [["California", 36], ["Texas", 22], ["New York", 19]]
	statePopulations.color = "blue"
*/

const DEFINITION_REGX = /^piechart[\s+]([\S].*)$/;
const TITLE_ASSIGNMENT_REGX = /^(.*)\.title[\s*]=[\s*]\"(.*)\"$/;
const DATA_ASSIGNMENT_REGX = /^(.*)\.data[\s*]=[\s*](.*)$/;
const COLOR_ASSIGNMENT_REGX = /^(.*)\.color[\s*]=[\s*]\"(.*)\"$/;

const parsePieChartCommands = function(commands) {
	const piechartIR = {};

	const lines = commands.split(/\r?\n/);

	for (let i = 0; i < lines.length; i++) {
		interpretLine(lines[i], piechartIR);
	}

	return piechartIR;
};

function interpretLine(line, piechartIR) {
	line = line.trim();

	let match = DEFINITION_REGX.exec(line);

	// definition
	if (match) {
		const piechartVarName = match[1];
		piechartIR[piechartVarName] = {};
		return;
	}

	// title
	match = TITLE_ASSIGNMENT_REGX.exec(line);
	if (match) {
		const piechartVarName = match[1];

		if (!piechartIR[piechartVarName]) {
			throw new Error(`${piechartVarName} is not defined`);
		}

		const piechartTitle = match[2];
		piechartIR[piechartVarName].title = piechartTitle;
		return;
	}

	// data
	match = DATA_ASSIGNMENT_REGX.exec(line);
	if (match) {
		const piechartVarName = match[1];

		if (!piechartIR[piechartVarName]) {
			throw new Error(`${piechartVarName} is not defined`);
		}
		const data = JSON.parse(match[2]);
		piechartIR[piechartVarName].data = data;
		return;
	}

	// color
	match = COLOR_ASSIGNMENT_REGX.exec(line);
	if (match) {
		const piechartVarName = match[1];

		if (!piechartIR[piechartVarName]) {
			throw new Error(`${piechartVarName} is not defined`);
		}

		const piechartColor = match[2];
		piechartIR[piechartVarName].color = piechartColor;
		return;
	}
}

export { parsePieChartCommands };
