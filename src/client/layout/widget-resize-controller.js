import { Widget } from "../layout/widget/widget.js";
import { CONSTANTS } from "./constants.js";

function WidgetResizeController(widgetContainer) {
    const controller = this;
    controller.widgetContainer = widgetContainer;
    controller.isResizing = false;

    handleMouseMove();

    function handleMouseMove() {
        controller.widgetContainer.rootDiv.addEventListener("mousemove", (mouseEvent) => {
            const resizeType = getResizingType(mouseEvent);

            if (resizeType != null) {
                
                if (resizeType === CONSTANTS.HORIZONTAL_RESIZING) {
                    controller.widgetContainer.rootDiv.style.cursor = "col-resize";
                } else if (resizeType === CONSTANTS.VERTICAL_RESIZING) {
                    controller.widgetContainer.rootDiv.style.cursor = "row-resize";
                }
            } else {
                controller.widgetContainer.rootDiv.style.cursor = "default";                
            }
        });
    }

    function getResizingType(mouseEvent) {
        
        // check for horizontal resizing
        const widgetToTheRight = controller.widgetContainer.getWidgetFromPoint(mouseEvent.clientX + CONSTANTS.BORDER_DETECTION_JITTER_IN_PIXELS, mouseEvent.clientY);
        const widgetToTheLeft = controller.widgetContainer.getWidgetFromPoint(mouseEvent.clientX - CONSTANTS.BORDER_DETECTION_JITTER_IN_PIXELS, mouseEvent.clientY);

        if (widgetToTheRight !== null && widgetToTheLeft !== null && widgetToTheRight !== widgetToTheLeft) {
            return CONSTANTS.HORIZONTAL_RESIZING;
        }

        // check for vertical resizing
        const widgetToTheTop = controller.widgetContainer.getWidgetFromPoint(mouseEvent.clientX, mouseEvent.clientY - CONSTANTS.BORDER_DETECTION_JITTER_IN_PIXELS);
        const widgetBelow = controller.widgetContainer.getWidgetFromPoint(mouseEvent.clientX, mouseEvent.clientY + CONSTANTS.BORDER_DETECTION_JITTER_IN_PIXELS);

        if (widgetToTheTop !== null && widgetBelow !== null && widgetToTheTop !== widgetBelow) {
            return CONSTANTS.VERTICAL_RESIZING
        }

        return null;
    }

}

export { WidgetResizeController };