import { Widget } from "../layout/widget/widget.js";
import { CONSTANTS } from "./constants.js";

function WidgetContainer(children, direction, parentWidgetContainer, left, top, width, height) {

    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.children = children;
    this.childrenRatios = null;
    this.parentWidgetContainer = parentWidgetContainer;
    this.direction = direction;
    this.rootDiv = document.createElement("div");
}

WidgetContainer.prototype.validateRendering = function(renderingValues) {
    
    const widgetContainer = this;
    const childrenRenderingValues = getChildrenRenderingValues(widgetContainer, renderingValues);

    for (let i = 0; i < widgetContainer.children.length; i++) {
        const child = widgetContainer.children[i];
        const result = child.validateRendering(childrenRenderingValues[i]);
        if (!result) {
            return false;
        }
    }

    return true;
}


WidgetContainer.prototype.render = function(parentNode) {

    // check parent node
    if (parentNode) {
        this.parentNode = parentNode;
    }

    if (!this.parentNode) {
        console.log("no parent node, returning");
        return false;
    }

    // render
    renderWidgetContainer(this, this.parentNode);
};


WidgetContainer.prototype.remove = function() {
    this.rootDiv.remove();
}

WidgetContainer.prototype.onMouseDown = function(callback) {
    this.rootDiv.addEventListener("mousedown", callback, true);
}

WidgetContainer.prototype.toWidgetArray = function() {
    let widgets = [];
    if (!this.children) {
        return widgets;
    }

    for (let i = 0; i < this.children.length; i++) {

        if (Widget.prototype.isPrototypeOf(this.children[i])) {
            widgets = widgets.concat(this.children[i]);
        } else {
            widgets = widgets.concat(this.children[i].toWidgetArray());
        }
    }

    return widgets;
}

WidgetContainer.prototype.getWidgetFromPoint = function(clientX, clientY) {

    const widgets = this.toWidgetArray();
    for (let i = 0; i < widgets.length; i++) {
        const widget = widgets[i];
        const widgetBoundingRectangle = widget.node.getBoundingClientRect();

        if ((clientX >= widgetBoundingRectangle.left && clientX <= widgetBoundingRectangle.right) && (clientY >= widgetBoundingRectangle.top && clientY <= widgetBoundingRectangle.bottom)) {
            return widget;
        }
    }

    return null;
}

WidgetContainer.prototype.makeNonSelectable = function() {
    this.rootDiv.classList.add("noselect");
};

WidgetContainer.prototype.makeSelectable = function() {
    this.rootDiv.classList.remove("noselect");
};

WidgetContainer.prototype.getParent = function() {
    return this.parentWidgetContainer;
};

function renderWidgetContainer(widgetContainer, parentNode) {

    widgetContainer.parentNode = parentNode;
    parentNode.appendChild(widgetContainer.rootDiv);

    widgetContainer.rootDiv.setAttribute("class", "widget");
    widgetContainer.rootDiv.style.setProperty("top", widgetContainer.top + "px");
    widgetContainer.rootDiv.style.setProperty("left", widgetContainer.left + "px");
    widgetContainer.rootDiv.style.setProperty("width", widgetContainer.width + "px");
    widgetContainer.rootDiv.style.setProperty("height", widgetContainer.height + "px");
    widgetContainer.rootDiv.setAttribute("class", "widget-container");

    sizeAndPositionChildren(widgetContainer);
    for (let i = 0; i < widgetContainer.children.length; i++) {
        const child = widgetContainer.children[i];

        if (child instanceof Widget) {
            child.render(widgetContainer.rootDiv);
        } else if (child instanceof WidgetContainer) {
            renderWidgetContainer(child, widgetContainer.rootDiv)
        }
    }
}

function sizeAndPositionChildren(widgetContainer) {

    const childRatios = getChildrenRatios(widgetContainer);

    const renderingValues = {
        width: widgetContainer.width,
        height: widgetContainer.height,
        left: widgetContainer.left,
        top: widgetContainer.top
    };

    const childrenRenderingValues = getChildrenRenderingValues(widgetContainer, renderingValues);

    for (let i = 0; i < widgetContainer.children.length; i++) {
        widgetContainer.children[i].left = childrenRenderingValues[i].left;
        widgetContainer.children[i].top = childrenRenderingValues[i].top;
        widgetContainer.children[i].width = childrenRenderingValues[i].width;
        widgetContainer.children[i].height = childrenRenderingValues[i].height;
    }
}

function getChildrenRenderingValues(widgetContainer, renderingValues) {

    const childrenRenderingValues = [];

    const childRatios = getChildrenRatios(widgetContainer);

    if (widgetContainer.direction === CONSTANTS.LEFT_TO_RIGHT) {

        const childHeight = renderingValues.height;
        let sumWidth = 0;

        for (let i = 0; i < widgetContainer.children.length; i++) {

            childrenRenderingValues.push({
                left: sumWidth,
                top: 0,
                width: renderingValues.width * childRatios[i],
                height: childHeight
            });

            sumWidth += childrenRenderingValues[i].width;
        }
    } else if (widgetContainer.direction === CONSTANTS.TOP_TO_BOTTOM) {

        const childWidth = renderingValues.width;
        let sumHeight = 0;

        for (let i = 0; i < widgetContainer.children.length; i++) {
            childrenRenderingValues.push({
                left: 0,
                top: sumHeight,
                width: childWidth,
                height: renderingValues.height * childRatios[i]
            });

            sumHeight += childrenRenderingValues[i].height;
        }
    }

    return childrenRenderingValues;
}

function getChildrenRatios(widgetContainer) {

    const childrenRatios = [];
    let sum = 0;
    for (let i = 0; i < widgetContainer.children.length; i++) {
        const widthOrHeight = widgetContainer.direction === CONSTANTS.LEFT_TO_RIGHT ? widgetContainer.children[i].width : widgetContainer.children[i].height;
        if (widthOrHeight) {
            sum += widthOrHeight
        }
    }

    if (sum !== 0) {
        for (let i = 0; i < widgetContainer.children.length; i++) {
            const widthOrHeight = widgetContainer.direction === CONSTANTS.LEFT_TO_RIGHT ? widgetContainer.children[i].width : widgetContainer.children[i].height;
            childrenRatios.push(widthOrHeight / sum);
        }
    } else {
        for (let i = 0; i < widgetContainer.children.length; i++) {
            childrenRatios.push(1 / widgetContainer.children.length);
        }
    }


    return childrenRatios;
}

export { WidgetContainer };