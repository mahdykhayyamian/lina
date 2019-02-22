import * as loadJSPromise from "load-js"
import * as loadjs from "loadjs"

let barChartModule = null;
let markdownModule = null;
let sequenceDiagramModule = null;
let mathModule = null;

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

			return loadJSPromise([{
				async: true,
				url: "/webfont.js"
			}, {
					async: true,
					url: "/snap.svg-min.js"
			}, {
					async: true,
					url: "/underscore-min.js"
			}])
			.then(() => {
				console.log("All dependencies for js-sequence-diagrams loaded");
				return loadJSPromise([{
					async: true,
					url: "/sequence-diagram-min.js"
				}]);
			})
			.then(() => {
				console.log("js-sequence-diagrams loaded");
				sequenceDiagramModule = import("whiteboard/visualization/sequence-diagram");
				return sequenceDiagramModule;
			});
		case "math":
			if (mathModule) {
				return mathModule;
			}
			return loadJSPromise([{
				async: true,
				url: "/katex/katex.min.js"
			}])
			.then(() => {
				return new Promise((resolve, reject) => {
					loadjs(['css!/katex/katex.css'], function() {
						console.log("katex is loaded ha!");
						mathModule = import("whiteboard/visualization/math");
						return resolve(mathModule);
					});
				});
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