import * as loadJSPromise from 'load-js';
import * as loadjs from 'loadjs';

let barChartModule = null;
let markdownModule = null;
let sequenceDiagramModule = null;
let mathModule = null;

function getModuleByName(moduleName) {
	switch (moduleName) {
		case 'bar-chart':
			if (barChartModule) {
				return barChartModule;
			}

			barChartModule = import('paragraph/visualization/bar-chart');
			return barChartModule;
		case 'markdown':
			if (markdownModule) {
				return markdownModule;
			}

			markdownModule = import('paragraph/visualization/markdown');
			return markdownModule;
		case 'sequence-diagram':
			if (sequenceDiagramModule) {
				return sequenceDiagramModule;
			}

			return loadJSPromise([
				{
					async: true,
					url: '/webfont.js'
				},
				{
					async: true,
					url: '/snap.svg-min.js'
				},
				{
					async: true,
					url: '/underscore-min.js'
				}
			])
				.then(() => {
					return loadJSPromise([
						{
							async: true,
							url: '/sequence-diagram-min.js'
						}
					]);
				})
				.then(() => {
					sequenceDiagramModule = import(
						'paragraph/visualization/sequence-diagram'
					);
					return sequenceDiagramModule;
				});
		case 'math':
			if (mathModule) {
				return mathModule;
			}
			return loadJSPromise([
				{
					async: true,
					url: '/katex/katex.min.js'
				}
			]).then(() => {
				return new Promise((resolve, reject) => {
					loadjs(['css!/katex/katex.css'], function() {
						mathModule = import('paragraph/visualization/math');
						return resolve(mathModule);
					});
				});
			});
		default:
			return Promise.resolve(null);
	}
}

const moduleLoader = {
	getModuleByName
};

export { moduleLoader };
