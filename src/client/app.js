import {Widget} from "./layout/widget/widget.js";
import {Pencil} from "./toolbox/pencil.js";
import {WidgetContainer} from "./layout/widget-container.js";

window.onload = function () {

	const appDiv = document.getElementById("lina.app");

	const pencil = new Pencil();
	pencil.render();

	appDiv.appendChild(pencil.svg);

	let insertedWidgets = 0;

	function mouseDownHandler(event, widget) {
		const widgetBoundingRectangle = widget.contentDiv.getBoundingClientRect(); 

		const x = event.clientX - widgetBoundingRectangle.left;
		const y = event.clientY - widgetBoundingRectangle.top;
		const inserteee = new Widget("inserteee" + insertedWidgets++, 0, 100, 400, 100, 
			[{
			title: 'Mooshzad' + insertedWidgets,			
		}]);
		inserteee.onContentMouseDown(mouseDownHandler);

		widget.insertWidget(inserteee, x, y);
	}

	const widgetA = new Widget("widgetA", 0, 0, 800, 200,
		[{
			title: 'Judy',
		}, {
			title: 'Niki' 
		}, {
			title: 'Mahdy'
		}]
	);
	widgetA.onContentMouseDown(mouseDownHandler);

	const widgetB = new Widget("widgetB", 0, 0, 400, 200,
		[{
			title: 'Lina',
		}]
	);
	widgetB.onContentMouseDown(mouseDownHandler);

	const widgetC = new Widget("widgetC", 0, 0, 400, 100, 
		[{
			title: 'Home',			
	}]);
	widgetC.onContentMouseDown(mouseDownHandler);


	const widgetD = new Widget("widgetD", 0, 100, 400, 100, 
		[{
			title: 'Hashem',			
	}]);
	widgetD.onContentMouseDown(mouseDownHandler);


	const widgetContainer1 = new WidgetContainer(400, 0, 400, 200, [widgetC, widgetD], widgetContainer1);

	const widgetContainer2 = new WidgetContainer(0, 200, 800, 200, [widgetB, widgetContainer1], widgetContainer2);

	const widgetContainer3 = new WidgetContainer(80, 120, 800, 400, [widgetA, widgetContainer2], null);

	widgetA.widgetContainer = widgetContainer3;
	widgetB.widgetContainer = widgetContainer2;
	widgetC.widgetContainer = widgetContainer1;
	widgetD.widgetContainer = widgetContainer1;

	widgetContainer3.render(appDiv);
}