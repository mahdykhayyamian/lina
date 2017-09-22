
import {Widget} from "../layout/widget/widget.js";

function WidgetTabDragController(widgetContainer) {

	const controller = this;

	controller.widgetContainer = widgetContainer;
	registerWidgetsMouseEventHandlers();
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

	function onWidgetContentMouseMoveHandler(mouseEvent, widget) {
		console.log("onWidgetContentMouseMoveHandler");
		console.log("widget :");
		console.log(widget);

		// don't allow dragging a widget with one tab (for now)
		if (widget.tabs.length === 1) {
			return;
		}

		if (widget.draggingTabIndex === undefined) {
			return;
		}

		controller.draggingTabWidget = widget;
		controller.draggingTabIndex = widget.draggingTabIndex;
		widget.draggingTabIndex = undefined;

		const widgetBoundingRectangle = controller.draggingTabWidget.node.getBoundingClientRect();

		controller.selectedTabDragPositionOffset = {
			x: event.x - widgetBoundingRectangle.left,
			y: event.y - widgetBoundingRectangle.top
		}

		console.log("controller.draggingTabWidget");
		console.log(controller.draggingTabWidget);
	}

	function registerWidgetsMouseEventHandlers() {

		const widgets = controller.widgetContainer.toWidgetArray();

		console.log("widgets");
		console.log(widgets);

		for (let i=0; i < widgets.length; i++) {
			const widget = widgets[i];
			registerWidgetMouseEventHandlers(widget);
		}
	}

	function registerWidgetMouseEventHandlers(widget) {
		widget.addMouseUpOnWidgetHandler(onMouseUpHandler);
		widget.addMouseDownOnContentHandler(onContentMouseDownHandler);
		widget.addMouseMoveOnContentHandler(onWidgetContentMouseMoveHandler);			
	}

	function registerWidgetContainerMouseMoveHandler() {
		controller.widgetContainer.rootDiv.addEventListener("mousemove", (event) => {
			
			console.log("in widgetContainer mousemove");

			console.log("controller.draggingTabWidget :")
			console.log(controller.draggingTabWidget);

			if (!controller.draggingTabWidget) {
				return;
			}

			const widgetContainerBoundingRectangle = controller.widgetContainer.rootDiv.getBoundingClientRect(); 

			const x = (event.clientX - widgetContainerBoundingRectangle.left) - controller.selectedTabDragPositionOffset.x;
			const y = (event.clientY - widgetContainerBoundingRectangle.top) - controller.selectedTabDragPositionOffset.y;

			if (controller.clonedWidgetForTab) {
				controller.clonedWidgetForTab.node.style.setProperty("left", x+"px");
				controller.clonedWidgetForTab.node.style.setProperty("top", y+"px");
			} else {
				controller.clonedWidgetForTab = controller.draggingTabWidget.createWidgetFromTab(controller.draggingTabIndex);
				controller.clonedWidgetForTab.render(controller.widgetContainer.rootDiv);

				console.log("after creation, clonedWidgetForTab.node.children.length : " + controller.clonedWidgetForTab.node.children.length);

				console.log("removing dragging tab");
				console.log(controller.draggingTabIndex);
				controller.draggingTabWidget.removeTab(controller.draggingTabIndex);
			}

		}, true);	
	}

	function registerWidgetContainerMouseUpHandler() {
		controller.widgetContainer.rootDiv.addEventListener("mouseup", (event) => {
			
			console.log("mouse up on widget container");

			if (!controller.clonedWidgetForTab) {
				return;
			}

			const targetWidget = controller.widgetContainer.getWidgetFromPoint(event.clientX, event.clientY);

			if (targetWidget) {

				const targetWidgetBoundingRectangle = targetWidget.node.getBoundingClientRect(); 
				const x = event.clientX - targetWidgetBoundingRectangle.left;
				const y = event.clientY - targetWidgetBoundingRectangle.top;

				controller.clonedWidgetForTab.remove();

				targetWidget.insertWidget(controller.clonedWidgetForTab, x, y);

				registerWidgetMouseEventHandlers(targetWidget);

				controller.clonedWidgetForTab = null;
				controller.draggingTabWidget = null;
				controller.draggingTabIndex = null;
			}

		}, true);	
	}
}

export {WidgetTabDragController};