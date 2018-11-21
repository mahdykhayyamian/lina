let barChartModule = null;

function getModuleByName(moduleName) {
	switch (moduleName) {
		case "bar-chart":

			if (barChartModule) {
				return barChartModule;
			}

			barChartModule = import("whiteboard/visualization/bar-chart");
			return barChartModule;
			break;
		default:
			return Promise.resolve(null);
			break;
	}
}

const moduleLoader = {
	getModuleByName
};

export {moduleLoader};