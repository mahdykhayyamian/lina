import {Widget} from "./layout/widget/widget.js";
import {Pencil} from "./toolbox/pencil.js";
import {WidgetContainer} from "./layout/widget-container.js";

window.onload = function () {

	const appDiv = document.getElementById("lina.app");

	const pencil = new Pencil();
	pencil.render();

	appDiv.appendChild(pencil.svg);

	const widgetA = new Widget("widgetA", 0, 0, 800, 400,
		[{
			title: 'Judy',
		}, {
			title: 'Niki' 
		}, {
			title: 'Mahdy'
		}]
	);


	const widgetB = new Widget("widgetB", 0, 0, 400, 200,
		[{
			title: 'Lina',
		}]
	);

	const widgetC = new Widget("widgetC", 0, 0, 400, 100, 
		[{
			title: 'Home',			
	}]);

	const widgetD = new Widget("widgetD", 0, 100, 400, 100, 
		[{
			title: 'Hashem',			
	}]);

	const widgetContainer1 = new WidgetContainer(400, 0, 400, 200, [widgetC, widgetD], widgetContainer1);

	const widgetContainer2 = new WidgetContainer(0, 200, 800, 200, [widgetB, widgetContainer1], widgetContainer2);

	const widgetContainer3 = new WidgetContainer(80, 120, 800, 400, [widgetA, widgetContainer2], null);

	widgetContainer3.render(appDiv);

	// layoutRoot.insertWidget(widgetD, 550, 140);
}