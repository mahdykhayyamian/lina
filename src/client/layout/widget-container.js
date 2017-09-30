import {Widget} from "../layout/widget/widget.js";
import {CONSTANTS} from "./constants.js";

function WidgetContainer(children, direction, parentWidgetContainer, left, top, width, height) {

	this.left = left;
	this.top = top;
	this.width = width;
	this.height = height;
	this.children = children;
	this.parentWidgetContainer = parentWidgetContainer;
	this.direction = direction;

	this.rootDiv = document.createElement("div");
}

WidgetContainer.prototype.render = function(parent) {

	this.rootDiv.setAttribute("class", "widget");
	this.rootDiv.style.setProperty("top", this.top+"px");
	this.rootDiv.style.setProperty("left", this.left+"px");
	this.rootDiv.style.setProperty("width", this.width+"px");
	this.rootDiv.style.setProperty("height", this.height+"px");
	this.rootDiv.setAttribute("class", "widget-container");

	parent.appendChild(this.rootDiv);

	if (Widget.prototype.isPrototypeOf(this)) {
		this.render(this.rootDiv);
	} else if (WidgetContainer.prototype.isPrototypeOf(this)) {
		sizeAndPositionChildren(this);
		for (let i=0; i < this.children.length; i++) {
			this.children[i].render(this.rootDiv);
		}
	}
}

WidgetContainer.prototype.remove = function(parent) {
	this.rootDiv.remove();
	this.rootDiv = document.createElement("div");
}

WidgetContainer.prototype.onMouseDown = function (callback) {
	this.rootDiv.addEventListener("mousedown", callback, true);	
}

WidgetContainer.prototype.toWidgetArray = function() {

	let widgets = [];

	if (!this.children) {
		return widgets;
	}

	for (let i=0; i<this.children.length; i++) {
		console.log("children i");
		console.log(this.children[i]);

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
	for (let i=0; i<widgets.length; i++) {
		const widget = widgets[i];
		const widgetBoundingRectangle = widget.node.getBoundingClientRect();
		if ( (clientX >= widgetBoundingRectangle.left && clientX <= widgetBoundingRectangle.right)  && (clientY >= widgetBoundingRectangle.top && clientY <= widgetBoundingRectangle.bottom) ) {
			return widget;
		} 
	}

	return null;
}


function sizeAndPositionChildren(widgetContainer) {

	if (widgetContainer.direction === CONSTANTS.LEFT_TO_RIGHT) {

		const childWidth = widgetContainer.width / widgetContainer.children.length; 
		const childHeight = widgetContainer.height;

		for (let i=0; i<widgetContainer.children.length; i++) {
			widgetContainer.children[i].left = i * childWidth;
			widgetContainer.children[i].top = 0;
			widgetContainer.children[i].width = childWidth;
			widgetContainer.children[i].height = childHeight;
		}
	} else if (widgetContainer.direction === CONSTANTS.TOP_TO_BOTTOM) {

		const childWidth = widgetContainer.width; 
		const childHeight = widgetContainer.height / widgetContainer.children.length;

		for (let i=0; i<widgetContainer.children.length; i++) {
			widgetContainer.children[i].left = 0;
			widgetContainer.children[i].top = i * childHeight;
			widgetContainer.children[i].width = childWidth;
			widgetContainer.children[i].height = childHeight;
		}
	}
}


export {WidgetContainer};