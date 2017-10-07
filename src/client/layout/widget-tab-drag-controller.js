import { Widget } from "../layout/widget/widget.js";

function WidgetTabDragController(widgetContainer) {

    const controller = this;

    controller.widgetContainer = widgetContainer;
    registerWidgetsMouseEventHandlers();
    registerWidgetContainerMouseMoveHandler();
    registerWidgetContainerMouseUpHandler();

    function onMouseUpHandler(mouseEvent, widget) {
        controller.selectedWidget = undefined;
    }

    function onWidgetContentMouseMoveHandler(mouseEvent, widget) {

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
    }

    function registerWidgetsMouseEventHandlers() {

        const widgets = controller.widgetContainer.toWidgetArray();

        for (let i = 0; i < widgets.length; i++) {
            const widget = widgets[i];
            registerWidgetMouseEventHandlers(widget);
        }
    }

    function registerWidgetMouseEventHandlers(widget) {
        widget.addMouseUpOnWidgetHandler(onMouseUpHandler);
        widget.addMouseMoveOnContentHandler(onWidgetContentMouseMoveHandler);
    }

    function registerWidgetContainerMouseMoveHandler() {
        controller.widgetContainer.rootDiv.addEventListener("mousemove", (event) => {

            if (!controller.draggingTabWidget) {
                return;
            }

            const widgetContainerBoundingRectangle = controller.widgetContainer.rootDiv.getBoundingClientRect();

            const x = (event.clientX - widgetContainerBoundingRectangle.left) - controller.selectedTabDragPositionOffset.x;
            const y = (event.clientY - widgetContainerBoundingRectangle.top) - controller.selectedTabDragPositionOffset.y;

            if (controller.clonedWidgetForTab) {
                controller.clonedWidgetForTab.node.style.setProperty("left", x + "px");
                controller.clonedWidgetForTab.node.style.setProperty("top", y + "px");
            } else {
                controller.clonedWidgetForTab = controller.draggingTabWidget.createWidgetFromTab(controller.draggingTabIndex);
                controller.clonedWidgetForTab.render(controller.widgetContainer.rootDiv);

                controller.draggingTabWidget.removeTab(controller.draggingTabIndex);

                // if dragged tab is the only remainig tab, remove the whole widget and re-render parent
                if (controller.draggingTabWidget.tabs.length == 0) {

                    for (let i = 0; i < controller.draggingTabWidget.widgetContainer.children.length; i++) {
                        if (controller.draggingTabWidget.widgetContainer.children[i] == controller.draggingTabWidget) {
                            controller.draggingTabWidget.widgetContainer.children.splice(i, 1);
                            break;
                        }
                    }

                    controller.draggingTabWidget.remove();
                    controller.draggingTabWidget.widgetContainer.remove();

                    controller.draggingTabWidget.widgetContainer.render(controller.draggingTabWidget.widgetContainer.parentWidgetContainer.rootDiv);
                }

            }
        }, true);
    }

    function registerWidgetContainerMouseUpHandler() {
        controller.widgetContainer.rootDiv.addEventListener("mouseup", (event) => {

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

export { WidgetTabDragController };