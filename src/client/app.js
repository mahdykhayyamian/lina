import {Widget} from "./layout/widget/widget.js";
import {Pencil} from "./toolbox/pencil.js";
import {DockableWidgetLayout} from "./layout/dockable-widget-layout.js";

window.onload = function () {

	const appDiv = document.getElementById("lina.app");

	const pencil = new Pencil();
	pencil.render();

	appDiv.appendChild(pencil.svg);

	const widgetA = new Widget("widgetA", 100, 100, 300, 400);
	const widgetB = new Widget("widgetB", 400, 100, 600, 200);
	const widgetC = new Widget("widgetC", 400, 300, 600, 200);

	const layoutRoot = new DockableWidgetLayout("CONTAINER_NODE", 0, 0, 900, 900, [widgetA, widgetB, widgetC	], appDiv);
	layoutRoot.render(appDiv);
}