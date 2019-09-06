import { moduleLoader } from "web-app/client/src/paragraph/module-loader.js"

describe('moduleLoader', function() {
	it('should load module successfully', () => {
		console.log(moduleLoader);
		moduleLoader.getModuleByName('bar-chart').then( (module) => {
			console.log(module);
		})
	});
});