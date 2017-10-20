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

    function getDraggingTabInfo() {

        const widgets = controller.widgetContainer.toWidgetArray();

        for (let i = 0; i < widgets.length; i++) {
            const widget = widgets[i];

            if (widget.draggingTabIndex !== undefined) {
                return {
                    "widget": widget,
                    "tabIndex": widget.draggingTabIndex
                }
            }
        }

        return null;
    }

    function isMouseOverWidgetTabs(widget, mouseEvent) {
        const widgetTabsBoundingRectangle = widget.tabsDiv.getBoundingClientRect();

        if (mouseEvent.x <= widgetTabsBoundingRectangle.right && mouseEvent.x >= widgetTabsBoundingRectangle.left &&
            mouseEvent.y >= widgetTabsBoundingRectangle.top && mouseEvent.y <= widgetTabsBoundingRectangle.bottom) {
            return true;
        }

        return false;
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
    }

    function registerWidgetContainerMouseMoveHandler() {
        controller.widgetContainer.rootDiv.addEventListener("mousemove", (event) => {

            // if there is already a dragging widget for the dragged tab
            if (controller.clonedWidgetForTab) {
                const widgetContainerBoundingRectangle = controller.widgetContainer.rootDiv.getBoundingClientRect();
                const x = (event.clientX - widgetContainerBoundingRectangle.left) - controller.draggingStartPositionRelativeToWidget.x;
                const y = (event.clientY - widgetContainerBoundingRectangle.top) - controller.draggingStartPositionRelativeToWidget.y;

                controller.clonedWidgetForTab.node.style.setProperty("left", x + "px");
                controller.clonedWidgetForTab.node.style.setProperty("top", y + "px");
            } else {
                const draggingTabInfo = getDraggingTabInfo();

                if (draggingTabInfo == null) {
                    return;
                }

                controller.draggingTabSourceWidget = draggingTabInfo.widget;
                if (isMouseOverWidgetTabs(controller.draggingTabSourceWidget, event)) {
                    console.log("dragging inside widget will be handled by widget itself, returning..");
                    return;
                }

                controller.draggingStartPositionRelativeToWidget = draggingTabInfo.widget.draggingStartPositionRelativeToWidget;
                controller.clonedWidgetForTab = controller.draggingTabSourceWidget.createWidgetFromTab(draggingTabInfo.tabIndex);
                controller.clonedWidgetForTab.render(controller.widgetContainer.rootDiv);
                controller.draggingTabSourceWidget.removeTab(draggingTabInfo.tabIndex);

                // if dragged tab is the only remainig tab, remove the whole widget and re-render parent
                if (controller.draggingTabSourceWidget.tabs.length == 0) {
                    removeSourceWidget();
                }
            }
        }, true);
    }

    function removeSourceWidget() {
        for (let i = 0; i < controller.draggingTabSourceWidget.widgetContainer.children.length; i++) {
            if (controller.draggingTabSourceWidget.widgetContainer.children[i] == controller.draggingTabSourceWidget) {
                controller.draggingTabSourceWidget.widgetContainer.children.splice(i, 1);
                break;
            }
        }

        controller.draggingTabSourceWidget.remove();
        controller.draggingTabSourceWidget.widgetContainer.remove();
        controller.draggingTabSourceWidget.widgetContainer.render(controller.draggingTabSourceWidget.widgetContainer.parentWidgetContainer.rootDiv);
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

                if (controller.draggingTabSourceWidget) {
                    controller.draggingTabSourceWidget.draggingTabIndex = undefined;
                }
            }

        }, true);
    }
}

export { WidgetTabDragController };