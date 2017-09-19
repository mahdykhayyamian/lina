
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

			if (controller.draggingTabNode) {
				controller.draggingTabNode.style.setProperty("left", x+"px");
				controller.draggingTabNode.style.setProperty("top", y+"px");
			} else {
				createDraggingTabNode(controller.draggingTabWidget);
				console.log("removing dragging tab");
				console.log(controller.draggingTabIndex);
				controller.draggingTabWidget.removeTab(controller.draggingTabIndex);
			}

		}, true);	
	}

	function registerWidgetContainerMouseUpHandler() {
		controller.widgetContainer.rootDiv.addEventListener("mouseup", (event) => {
			
			console.log("mouse up on widget container");

			if (!controller.draggingTabNode) {
				return;
			}

			const targetWidget = controller.widgetContainer.getWidgetFromPoint(event.clientX, event.clientY);

			if (targetWidget) {

				console.log("targetWidget");
				console.log(targetWidget);

				const targetWidgetBoundingRectangle = targetWidget.node.getBoundingClientRect(); 
				const x = event.clientX - targetWidgetBoundingRectangle.left;
				const y = event.clientY - targetWidgetBoundingRectangle.top;

				const newWidget = createWidgetFromDraggingTabNode();
				targetWidget.insertWidget(newWidget, x, y);

				registerWidgetMouseEventHandlers(controller.draggingTabWidget);
				registerWidgetMouseEventHandlers(targetWidget);
				registerWidgetMouseEventHandlers(newWidget);

				controller.draggingTabNode.remove();
				controller.draggingTabNode = null;
				controller.draggingTabWidget = null;
				controller.draggingTabIndex = null;
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

		console.log("controller.draggingTabIndex");
		console.log(controller.draggingTabIndex);

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