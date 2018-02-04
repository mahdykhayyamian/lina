import { Widget } from "../layout/widget/widget.js";
import { CONSTANTS } from "./constants.js";

function WidgetResizeController(widgetContainer) {
    const controller = this;
    controller.widgetContainer = widgetContainer;

    controller.isResizing = false;
    controller.direction = null;
    controller.resizingSibling1 = null;
    controller.resizingSibling2 = null;
    controller.previousMouseEvent = null;

    handleMouseMove();
    handleMouseDown();
    handleMouseUp();

    function handleMouseMove() {
        controller.widgetContainer.rootDiv.addEventListener("mousemove", (mouseEvent) => {

            if (controller.isResizing === true) {

                const deltaX = mouseEvent.clientX - controller.previousMouseEvent.clientX;
                const deltaY = mouseEvent.clientY - controller.previousMouseEvent.clientY;

                controller.previousMouseEvent = mouseEvent;

                if (validateRendering(deltaX, deltaY)) {

                    if (controller.direction === CONSTANTS.HORIZONTAL_RESIZING) {
                        controller.resizingSibling1.width += deltaX;
                        controller.resizingSibling2.width -= deltaX;
                        controller.resizingSibling2.left += deltaX;
                    } else if (controller.direction === CONSTANTS.VERTICAL_RESIZING) {
                        controller.resizingSibling1.height += deltaY;
                        controller.resizingSibling2.height -= deltaY;
                        controller.resizingSibling2.top += deltaY;
                    }

                    controller.resizingSibling1.render(controller.resizingSibling1.getParent().rootDiv);
                    controller.resizingSibling2.render(controller.resizingSibling2.getParent().rootDiv);
                } else {
                    console.log("rendering is not valid any more");
                    controller.isResizing = false;
                    updateCursorStyleIfResizing(mouseEvent);
                }

            } else {
                updateCursorStyleIfResizing(mouseEvent);
            }

        });
    }

    function validateRendering(deltaX, deltaY) {

        const renderingValues1 =  {
            width: controller.resizingSibling1.width,
            height: controller.resizingSibling1.height,
            left: controller.resizingSibling1.left,
            top: controller.resizingSibling1.top
        };

        const renderingValues2 =  {
            width: controller.resizingSibling2.width,
            height: controller.resizingSibling2.height,
            left: controller.resizingSibling2.left,
            top: controller.resizingSibling2.top
        };

        if (controller.direction === CONSTANTS.HORIZONTAL_RESIZING) {
            renderingValues1.width += deltaX;
            renderingValues2.width -= deltaX;
            renderingValues2.left += deltaX;
        } else if (controller.direction === CONSTANTS.VERTICAL_RESIZING) {
            renderingValues1.height += deltaY;
            renderingValues2.height -= deltaY;
            renderingValues2.top += deltaY;
        }

        const validRendering1 = controller.resizingSibling1.validateRendering(renderingValues1);
        const validRendering2 = controller.resizingSibling2.validateRendering(renderingValues2);

        return validRendering1 && validRendering2;
    }

    function updateCursorStyleIfResizing(mouseEvent) {
        const resizeInfo = getResizingInfo(mouseEvent);
        if (resizeInfo != null) {            
            if (resizeInfo.direction === CONSTANTS.HORIZONTAL_RESIZING) {
                controller.direction = CONSTANTS.HORIZONTAL_RESIZING;
                controller.widgetContainer.rootDiv.style.cursor = "col-resize";
            } else if (resizeInfo.direction === CONSTANTS.VERTICAL_RESIZING) {
                controller.direction = CONSTANTS.VERTICAL_RESIZING;
                controller.widgetContainer.rootDiv.style.cursor = "row-resize";
            }
        } else {
                controller.direction = null;
                controller.widgetContainer.rootDiv.style.cursor = "default";            
        }              
    }

    function handleMouseDown() {
        controller.widgetContainer.rootDiv.addEventListener("mousedown", (mouseEvent) => {
            const resizeInfo = getResizingInfo(mouseEvent);

            if (resizeInfo != null) {

                controller.isResizing = true;
                controller.previousMouseEvent = mouseEvent;
                const firstSiblingAncestors = getSiblingAncestors(resizeInfo.widget1, resizeInfo.widget2);

                controller.resizingSibling1 = firstSiblingAncestors.parent1;
                controller.resizingSibling2 = firstSiblingAncestors.parent2;

                if (resizeInfo.direction === CONSTANTS.HORIZONTAL_RESIZING) {
                    controller.direction = CONSTANTS.HORIZONTAL_RESIZING;
                    controller.widgetContainer.rootDiv.style.cursor = "col-resize";
                } else if (resizeInfo.direction === CONSTANTS.VERTICAL_RESIZING) {
                    controller.direction = CONSTANTS.VERTICAL_RESIZING;
                    controller.widgetContainer.rootDiv.style.cursor = "row-resize";
                }
            }                
        });
    }

    function handleMouseUp() {
        controller.widgetContainer.rootDiv.addEventListener("mouseup", (mouseEvent) => {
            controller.isResizing = false;                                            
        });
    }

    function getResizingInfo(mouseEvent) {
        
        // check for horizontal resizing
        const widgetToTheRight = controller.widgetContainer.getWidgetFromPoint(mouseEvent.clientX + CONSTANTS.BORDER_DETECTION_JITTER_IN_PIXELS, mouseEvent.clientY);
        const widgetToTheLeft = controller.widgetContainer.getWidgetFromPoint(mouseEvent.clientX - CONSTANTS.BORDER_DETECTION_JITTER_IN_PIXELS, mouseEvent.clientY);

        if (widgetToTheRight !== null && widgetToTheLeft !== null && widgetToTheRight !== widgetToTheLeft) {
            return {
                widget1: widgetToTheLeft,
                widget2: widgetToTheRight,
                direction: CONSTANTS.HORIZONTAL_RESIZING      
            } 
        }

        // check for vertical resizing
        const widgetToTheTop = controller.widgetContainer.getWidgetFromPoint(mouseEvent.clientX, mouseEvent.clientY - CONSTANTS.BORDER_DETECTION_JITTER_IN_PIXELS);
        const widgetBelow = controller.widgetContainer.getWidgetFromPoint(mouseEvent.clientX, mouseEvent.clientY + CONSTANTS.BORDER_DETECTION_JITTER_IN_PIXELS);

        if (widgetToTheTop !== null && widgetBelow !== null && widgetToTheTop !== widgetBelow) {
            return {
                widget1: widgetToTheTop,
                widget2: widgetBelow,
                direction: CONSTANTS.VERTICAL_RESIZING      
            } 
        }

        return null;
    }

    function getSiblingAncestors(widget1, widget2) {
        const parentList1 = [];
        let pointer = widget1;
        while (pointer !== null) {
            parentList1.push(pointer);
            pointer = pointer.getParent();
        }

        const parentList2 = [];
        pointer = widget2;
        while (pointer !== null) {
            parentList2.push(pointer);
            pointer = pointer.getParent();
        }

        let i=parentList1.length-1;
        let j=parentList2.length-1;

        while (parentList1[i] === parentList2[j]) {
            i--;
            j--;
        }

        return {
            parent1: parentList1[i],
            parent2: parentList2[j]            
        }        
    }
}

export { WidgetResizeController };