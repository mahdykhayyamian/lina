import {Widget} from "../layout/widget/widget.js";

function WidgetContainer(left, top, width, height, children, widgetContainer) {

	this.left = left;
	this.top = top;
	this.width = width;
	this.height = height;
	this.children = children;
	this.widgetContainer = widgetContainer;

	this.rootDiv = document.createElement("div");
}

WidgetContainer.prototype.render = function(parent) {

	this.rootDiv.setAttribute("class", "widget");
	this.rootDiv.style.setProperty("top", this.top+"px");
	this.rootDiv.style.setProperty("left", this.left+"px");
	this.rootDiv.style.setProperty("width", this.width+"px");
	this.rootDiv.style.setProperty("height", this.height+"px");
	this.rootDiv.setAttribute("class", "widget-container");

	if (Widget.prototype.isPrototypeOf(this)) {
		this.render(this.rootDiv);
	} else if (WidgetContainer.prototype.isPrototypeOf(this)) {
		for (let i=0; i < this.children.length; i++) {
			this.children[i].render(this.rootDiv);
		}
	}

	parent.appendChild(this.rootDiv);
}

WidgetContainer.prototype.remove = function(parent) {
	this.rootDive.remove();
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

function determineDirectonToInsert(widget, x, y) {
	const distToLeft = Math.abs(x-widget.left);
	const distToRight = Math.abs(widget.left + widget.width - x);
	const distToTop = Math.abs(y - widget.top);
	const distToBottom = Math.abs(widget.top + widget.height - y);

	const distances = [distToLeft, distToRight, distToTop, distToBottom];

	const min = Math.min.apply(Math, distances);

	switch(min) {
		case(distToTop) : 
			return DIRECTION_TOP;
		case(distToRight):
			return DIRECTION_RIGHT;
		case(distToBottom):
			return DIRECTION_BOTTOM;
		case(distToLeft):
			return DIRECTION_LEFT;
		default:
			return null;
	}
}

export {WidgetContainer};