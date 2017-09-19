import {Widget} from "./layout/widget/widget.js";
import {Pencil} from "./toolbox/pencil.js";
import {WidgetContainer} from "./layout/widget-container.js";
import {WidgetTabDragController} from "./layout/widget-tab-drag-controller.js";

window.onload = function () {

	const appDiv = document.getElementById("lina.app");

	let insertedWidgets = 0;

	function mouseDownHandler(event, widget) {
		const widgetBoundingRectangle = widget.contentDiv.getBoundingClientRect(); 

		const x = event.clientX - widgetBoundingRectangle.left;
		const y = event.clientY - widgetBoundingRectangle.top;

		const pencil = new Pencil();
		pencil.render();

		const inserteee = new Widget("inserteee" + insertedWidgets++, 0, 100, 400, 100, 
			[{
			title: 'Pencil' + insertedWidgets,
			contentNode: pencil.svg
		}]);
		inserteee.addMouseDownOnContentHandler(mouseDownHandler);

		widget.insertWidget(inserteee, x, y);
	}

	function createTextDiv(text) {
		const div = document.createElement("div");
		div.textContent = text;
		div.style["font-size"] = "12px";

		return div;
	}

	const widgetA = new Widget("widgetA", 0, 0, 800, 200,
		[{
			title: 'Judy',
			contentNode: createTextDiv('Jon Jon Jon')
		}, {
			title: 'Niki',
			contentNode: createTextDiv('mish mish mikh mikh mahan!') 
		}, {
			title: 'Mahdy',
			contentNode: createTextDiv('Pake paghan!')
		}]
	);

	const widgetB = new Widget("widgetB", 0, 0, 400, 200,
		[{
			title: 'Lina',
			contentNode: createTextDiv('Hashem!')
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

	widgetA.widgetContainer = widgetContainer3;
	widgetB.widgetContainer = widgetContainer2;
	widgetC.widgetContainer = widgetContainer1;
	widgetD.widgetContainer = widgetContainer1;

	widgetContainer3.render(appDiv);

	const widgetTabDragController = new WidgetTabDragController(widgetContainer3);
}