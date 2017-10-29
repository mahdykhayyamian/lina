import {Widget} from "./layout/widget/widget.js";
import {Pencil} from "./toolbox/pencil.js";
import {WidgetContainer} from "./layout/widget-container.js";
import {WidgetTabDragController} from "./layout/widget-tab-drag-controller.js";
import {CONSTANTS} from "./layout/constants.js";

window.onload = function () {

	const appDiv = document.getElementById("lina.app");


	function createTextDiv(text) {
		const div = document.createElement("div");
		div.textContent = text;
		div.style["font-size"] = "12px";

		return div;
	}

	const widgetA = new Widget("widgetA",
		[{
			title: 'Judy',
			contentNode: createTextDiv('Jon Jon Jon')
		}, {
			title: 'Niki',
			contentNode: createTextDiv('mish mish mikh mikh mahan!') 
		},{
			title: 'Lina',
			contentNode: createTextDiv('Hashem!')
		},{
			title: 'Mashmash',
			contentNode: createTextDiv('Mashmash!')
		}]
	);

	const widgetB = new Widget("widgetB",
		[{
			title: 'Lina',
			contentNode: createTextDiv('Hashem!')
		},{
			title: 'Mehrkish',
			contentNode: createTextDiv('Mehrkish!')
		}]);

	const widgetC = new Widget("widgetC", 
		[{
			title: 'Home',
		},{
			title: 'Mahdy',
			contentNode: createTextDiv('Pake paghan!')
		}
	]);

	const widgetD = new Widget("widgetD", 
		[{
			title: 'Hashem',			
		}
	]);

	const widgetContainer1 = new WidgetContainer([widgetC, widgetD], CONSTANTS.TOP_TO_BOTTOM);

	const widgetContainer2 = new WidgetContainer([widgetB, widgetContainer1], CONSTANTS.LEFT_TO_RIGHT);

	const widgetContainer3 = new WidgetContainer([widgetA, widgetContainer2], CONSTANTS.TOP_TO_BOTTOM, null, 80, 120, 800, 400);

	widgetA.widgetContainer = widgetContainer3;
	widgetB.widgetContainer = widgetContainer2;
	widgetC.widgetContainer = widgetContainer1;
	widgetD.widgetContainer = widgetContainer1;

	widgetContainer2.parentWidgetContainer = widgetContainer3;
	widgetContainer1.parentWidgetContainer = widgetContainer2;

	widgetContainer3.render(appDiv);

	const widgetTabDragController = new WidgetTabDragController(widgetContainer3);
}