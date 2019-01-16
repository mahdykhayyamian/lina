let barChartModule = null;
let markdownModule = null;

function getModuleByName(moduleName) {
	switch (moduleName) {
		case "bar-chart":

			if (barChartModule) {
				return barChartModule;
			}

			barChartModule = import("whiteboard/visualization/bar-chart");
			return barChartModule;
			break;
		case "markdown":

			if (markdownModule) {
				return markdownModule;
			}

			markdownModule = import("whiteboard/visualization/markdown");
			return markdownModule;
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