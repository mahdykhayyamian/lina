
import {Widget} from "../layout/widget/widget.js";

function WidgetTabDragController(widgetContainer) {

	const controller = this;

	controller.widgetContainer = widgetContainer;
	registerWidgetsMouseEventHandlers(controller);
	registerWidgetContainerMouseMoveHandler();
	registerWidgetContainerMouseUpHandler();

	function onContentMouseDownHandler(mouseEvent, widget) {
		console.log("in onContentMouseDownHandler");
		console.log("widget :");
		console.log(widget);
		console.log("mouseEvent :");
		console.log(mouseEvent);
	}

	function onMouseUpHandler(mouseEvent, widget) {
		console.log("in onMouseUpHandler");
		console.log("widget :");
		console.log(widget);
		console.log("mouseEvent :");
		console.log(mouseEvent);
		controller.selectedWidget = undefined;
	}

	function onTabMouseDownHandler(mouseEvent, widget, tabIndex) {
		console.log("onTabMouseDownHandler");
		console.log("widget :");
		console.log(widget);
		console.log("tabIndex :");
		console.log(tabIndex);
		
		controller.selectedTabWidget = widget;
		controller.selectedTabIndex = tabIndex;

		const widgetBoundingRectangle = controller.selectedTabWidget.node.getBoundingClientRect();

		controller.selectedTabDragPositionOffset = {
			x: event.x - widgetBoundingRectangle.left,
			y: event.y - widgetBoundingRectangle.top
		}

		console.log("controller.selectedTabWidget");
		console.log(controller.selectedTabWidget);
	}

	function registerWidgetsMouseEventHandlers(controller) {

		const widgets = controller.widgetContainer.toWidgetArray();

		console.log("widgets");
		console.log(widgets);

		for (let i=0; i < widgets.length; i++) {
			const widget = widgets[i];
			widget.onMouseUp(onMouseUpHandler);
			widget.onContentMouseDown(onContentMouseDownHandler);
			widget.onTabMouseDown(onTabMouseDownHandler);			
		}
	}

	function registerWidgetContainerMouseMoveHandler() {
		controller.widgetContainer.rootDiv.addEventListener("mousemove", (event) => {
			
			if (!controller.selectedTabWidget) {
				return;
			}

			const widgetContainerBoundingRectangle = controller.widgetContainer.rootDiv.getBoundingClientRect(); 

			const x = (event.clientX - widgetContainerBoundingRectangle.left) - controller.selectedTabDragPositionOffset.x;
			const y = (event.clientY - widgetContainerBoundingRectangle.top) - controller.selectedTabDragPositionOffset.y;

			// console.log("x = " + x + ", y=" + y);
			// console.log("mouse to container x offset  = " + (event.clientX - widgetContainerBoundingRectangle.left) + ", mouse to container y offset  = " + (event.clientY - widgetContainerBoundingRectangle.top));

			if (controller.draggingTabNode) {


				controller.draggingTabNode.style.setProperty("left", x+"px");
				controller.draggingTabNode.style.setProperty("top", y+"px");
			} else {
				createDraggingTabNode(controller.selectedTabWidget);
				console.log("removing selected tab");
				console.log(controller.selectedTabIndex);
				controller.selectedTabWidget.removeTab(controller.selectedTabIndex);
			}

		}, true);	
	}

	function registerWidgetContainerMouseUpHandler() {
		controller.widgetContainer.rootDiv.addEventListener("mouseup", (event) => {
			
			console.log("mouse up on widget container");

			const targetWidget = controller.widgetContainer.getWidgetFromPoint(event.clientX, event.clientY);

			if (targetWidget) {

				const targetWidgetBoundingRectangle = targetWidget.node.getBoundingClientRect(); 
				const x = event.clientX - targetWidgetBoundingRectangle.left;
				const y = event.clientY - targetWidgetBoundingRectangle.top;

				const newWidget = createWidgetFromDraggingTabNode();

				targetWidget.insertWidget(newWidget, x, y);

				controller.draggingTabNode.remove();
			}

		}, true);	
	}

	function createWidgetFromDraggingTabNode() {

		const tabTitle = controller.draggingTabNode.querySelectorAll(`.widget-tabs svg g text`)[0].textContent;
		const tabContent = controller.draggingTabNode.querySelectorAll(`.widget-content .widget-content-border div`)[0];

		const width = controller.draggingTabNode.style.width;
		const height = controller.draggingTabNode.style.height;

		const newWidget = new Widget("insertedWidget", 0, 0, width, height,
			[{
				title: tabTitle,
				contentNode: tabContent
			}]
		);

		return newWidget;
	}

	function createDraggingTabNode(selectedWidget) {

		if (!selectedWidget) {
			return;
		}

		if (controller.draggingTabNode) {
			return;
		}

		console.log("selectedWidget");
		console.log(selectedWidget);

		console.log("controller.selectedTabIndex");
		console.log(controller.selectedTabIndex);

		controller.draggingTabNode = selectedWidget.node.cloneNode(true);

		console.log("draggingTabNode");
		console.log(controller.draggingTabNode);

		controller.draggingTabNode.querySelectorAll(`.widget-tabs svg .not-selected`).forEach( n => {
			n.remove();
		});

		controller.widgetContainer.rootDiv.append(controller.draggingTabNode);
	}

}

export {WidgetTabDragController};