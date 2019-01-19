import * as loadJS from "load-js"

let barChartModule = null;
let markdownModule = null;
let sequenceDiagramModule = null;

function getModuleByName(moduleName) {
	switch (moduleName) {
		case "bar-chart":

			if (barChartModule) {
				return barChartModule;
			}

			barChartModule = import("whiteboard/visualization/bar-chart");
			return barChartModule;
		case "markdown":

			if (markdownModule) {
				return markdownModule;
			}

			markdownModule = import("whiteboard/visualization/markdown");
			return markdownModule;
		case "sequence-diagram":

			if (sequenceDiagramModule) {
				return sequenceDiagramModule;
			}

			return loadJS([{
				async: true,
				url: "/lina/webfont.js"
			}, {
					async: true,
					url: "/lina/snap.svg-min.js"
			}, {
					async: true,
					url: "/lina/underscore-min.js"
			}])
			.then(() => {
				console.log("All dependencies for js-sequence-diagrams loaded");
				return loadJS([{
					async: true,
					url: "/lina/sequence-diagram-min.js"
				}]);
			})
			.then(() => {
				console.log("js-sequence-diagrams loaded");
				sequenceDiagramModule = import("whiteboard/visualization/sequence-diagram");
				return sequenceDiagramModule;
			});	
		default:
			return Promise.resolve(null);
			break;
	}
}

const moduleLoader = {
	getModuleByName
};

export {moduleLoader};