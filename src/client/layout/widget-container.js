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

WidgetContainer.prototype.render = function(parentNode) {

    if (parentNode) {
        this.parentNode = parentNode;
    }

    if (!this.parentNode) {
        return;
    }

    this.rootDiv.setAttribute("class", "widget");
    this.rootDiv.style.setProperty("top", this.top + "px");
    this.rootDiv.style.setProperty("left", this.left + "px");
    this.rootDiv.style.setProperty("width", this.width + "px");
    this.rootDiv.style.setProperty("height", this.height + "px");
    this.rootDiv.setAttribute("class", "widget-container");

    this.parentNode.appendChild(this.rootDiv);

    if (Widget.prototype.isPrototypeOf(this)) {
        this.render(this.rootDiv);
    } else if (WidgetContainer.prototype.isPrototypeOf(this)) {
        sizeAndPositionChildren(this);
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].render(this.rootDiv);
        }
    }
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

WidgetContainer.prototype.makeContentNonSelectable = function() {
    this.toWidgetArray().map(widget => widget.makeContentNonSelectable());
};

WidgetContainer.prototype.makeContentSelectable = function() {
    this.toWidgetArray().map(widget => widget.makeContentSelectable());
};

WidgetContainer.prototype.getParent = function() {
    return this.parentWidgetContainer;
};

function sizeAndPositionChildren(widgetContainer) {

    const childRatios = getChildrenRatios(widgetContainer);

    if (widgetContainer.direction === CONSTANTS.LEFT_TO_RIGHT) {

        const childHeight = widgetContainer.height;
        let sumWidth = 0;

        for (let i = 0; i < widgetContainer.children.length; i++) {
            widgetContainer.children[i].left = sumWidth;
            widgetContainer.children[i].top = 0;
            widgetContainer.children[i].width = widgetContainer.width * childRatios[i];
            sumWidth += widgetContainer.children[i].width;
            widgetContainer.children[i].height = childHeight;
        }
    } else if (widgetContainer.direction === CONSTANTS.TOP_TO_BOTTOM) {

        const childWidth = widgetContainer.width;
        let sumHeight = 0;

        for (let i = 0; i < widgetContainer.children.length; i++) {
            widgetContainer.children[i].left = 0;
            widgetContainer.children[i].top = sumHeight;
            widgetContainer.children[i].width = childWidth;
            widgetContainer.children[i].height = widgetContainer.height * childRatios[i];
            sumHeight += widgetContainer.children[i].height;
        }
    }
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