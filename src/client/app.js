import {Widget} from "./layout/widget/widget.js";
import {Pencil} from "./toolbox/pencil.js";
import {WidgetContainer} from "./layout/widget-container.js";

window.onload = function () {

	const appDiv = document.getElementById("lina.app");

	const pencil = new Pencil();
	pencil.render();

	appDiv.appendChild(pencil.svg);

	const widgetA = new Widget("widgetA", 100, 100, 300, 400,
		[{
			title: 'Judy',
		}, {
			title: 'Niki' 
		}, {
			title: 'Mahdy'
		}]
	);

	const widgetB = new Widget("widgetB", 400, 100, 600, 200,
		[{
			title: 'Lina',
		}]
	);

	const widgetC = new Widget("widgetC", 400, 300, 600, 200, 
		[{
			title: 'Home',			
	}]);

	const widgetD = new Widget("widgetD", 600, 700, 600, 200, 
		[{
			title: 'Hashem',			
	}]);

	const layoutRoot = new WidgetContainer(0, 0, 900, 900, [widgetA, widgetB, widgetC], null);
	widgetA.widgetContainer = layoutRoot;
	widgetB.widgetContainer = layoutRoot;
	widgetC.widgetContainer = layoutRoot;

	layoutRoot.render(appDiv);

	layoutRoot.insertWidget(widgetD, 550, 140);
}