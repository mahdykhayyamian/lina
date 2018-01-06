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

            console.log("mousemove");

            if (controller.isResizing === true) {

                console.log("direction : " + controller.direction);

                console.log("resizingSibling1 : ");
                console.log(controller.resizingSibling1);

                console.log("resizingSibling2 : ");
                console.log(controller.resizingSibling2);

                const deltaX = mouseEvent.clientX - controller.previousMouseEvent.clientX;
                const deltaY = mouseEvent.clientY - controller.previousMouseEvent.clientY;

                console.log("deltaX : " + deltaX + ", deltaY : " + deltaY);

                if (controller.direction === CONSTANTS.HORIZONTAL_RESIZING) {

                    controller.resizingSibling1.width += deltaX;
                    controller.resizingSibling2.width -= deltaX;
                    controller.resizingSibling2.left += deltaX;

                } else if (controller.direction === CONSTANTS.VERTICAL_RESIZING) {
                    controller.resizingSibling1.height += deltaY;
                    controller.resizingSibling2.height -= deltaY;
                    controller.resizingSibling2.top += deltaY;
                }

                controller.previousMouseEvent = mouseEvent;

                controller.resizingSibling1.render(controller.resizingSibling1.getParent().rootDiv);
                controller.resizingSibling2.render(controller.resizingSibling2.getParent().rootDiv);
            } else {
                updateCursorStyleIfResizing(mouseEvent);
            }

        });
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

                console.log("getSiblingAncestors");
                console.log(firstSiblingAncestors);

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