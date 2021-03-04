import * as loadJSPromise from 'load-js';
import * as loadjs from 'loadjs';

let barChartModule = null;
let markdownModule = null;
let sequenceDiagramModule = null;
let mathModule = null;
let vennDiagramModule = null;
let graphModule = null;
let treeChartModule = null;
let funnelModule = null;
let erdModule = null;
let flowchartModule = null;

function getModuleByName(moduleName) {
	switch (moduleName) {
		case 'bar-chart':
			if (barChartModule) {
				return barChartModule;
			}

			barChartModule = import('src/paragraph/visualization/bar-chart');
			return barChartModule;
		case 'markdown':
			if (markdownModule) {
				return markdownModule;
			}

			markdownModule = import('src/paragraph/visualization/markdown');
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
						'src/paragraph/visualization/sequence-diagram'
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
						mathModule = import('src/paragraph/visualization/math');
						return resolve(mathModule);
					});
				});
			});
		case 'venn-diagram':
			if (vennDiagramModule) {
				return vennDiagramModule;
			}

			vennDiagramModule = import(
				'src/paragraph/visualization/venn-diagram'
			);
			return vennDiagramModule;
		case 'graph':
			if (graphModule) {
				return graphModule;
			}

			graphModule = import('src/paragraph/visualization/graph');
			return graphModule;
		case 'tree-chart':
			if (treeChartModule) {
				return treeChartModule;
			}

			treeChartModule = import('src/paragraph/visualization/tree-chart');
			return treeChartModule;
		case 'funnel':
			if (funnelModule) {
				return funnelModule;
			}

			funnelModule = import('src/paragraph/visualization/funnel');
			return funnelModule;
		case 'erd':
			if (erdModule) {
				return erdModule;
			}

			erdModule = import('src/paragraph/visualization/erd');
			return erdModule;
		case 'flowchart':
			if (flowchartModule) {
				return flowchartModule;
			}

			flowchartModule = import('src/paragraph/visualization/flowchart');
			return flowchartModule;
		default:
			return Promise.resolve(null);
	}
}

const moduleLoader = {
	getModuleByName
};

export { moduleLoader };
