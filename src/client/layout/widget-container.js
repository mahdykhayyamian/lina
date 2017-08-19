import {Widget} from "../layout/widget/widget.js";

const DIRECTION_TOP = "DIRECTION_TOP";
const DIRECTION_RIGHT = "DIRECTION_RIGHT";
const DIRECTION_BOTTOM = "DIRECTION_BOTTOM";
const DIRECTION_LEFT = "DIRECTION_LEFT";

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

	console.log("in render");

	console.log(this);

	this.rootDiv.setAttribute("class", "widget");
	this.rootDiv.style.setProperty("top", this.top+"px");
	this.rootDiv.style.setProperty("left", this.left+"px");
	this.rootDiv.style.setProperty("width", this.width+"px");
	this.rootDiv.style.setProperty("height", this.height+"px");
	this.rootDiv.setAttribute("class", "widget-container");

	if (Widget.prototype.isPrototypeOf(this)) {
		this.render(this.rootDiv);
	} else if (WidgetContainer.prototype.isPrototypeOf(this)) {
		console.log("children");		
		console.log(this.children);		
		for (let i=0; i < this.children.length; i++) {
			console.log("rendering child");
			console.log(this.children[i]);
			console.log("this.rootDiv");
			console.log(this.rootDiv);
			this.children[i].render(this.rootDiv);
		}
	}

	parent.appendChild(this.rootDiv);
}

WidgetContainer.prototype.remove = function(parent) {
	this.rootDive.remove();
	this.rootDiv = document.createElement("div");
}

WidgetContainer.prototype.insertWidget = function (widgetToInsert, x, y) {

	console.log("widgetToInsert");
	console.log(widgetToInsert);

	const targetWidget = locateWidgetByPosition(this, x, y);

	console.log("targetWidget");
	console.log(targetWidget);

	if (targetWidget === null) {
		return;
	}

	const direction = determineDirectonToInsert(this, x, y);

	console.log(direction);

	let childIndex, containerNode, targetWidgetContainer;

    childIndex = findMyChildIndex(targetWidget);
    targetWidgetContainer = targetWidget.widgetContainer;

	switch (direction) {

		case DIRECTION_TOP:
            containerNode = new WidgetContainer(targetWidget.left, targetWidget.top, targetWidget.width, targetWidget.height, [widgetToInsert, targetWidget], targetWidget.widgetContainer);

            widgetToInsert.left = 0;
            widgetToInsert.top = 0;
            widgetToInsert.width = containerNode.width;
            widgetToInsert.height = containerNode.height/2;            

            targetWidget.left = 0;
            targetWidget.top = containerNode.height/2;
            targetWidget.width = containerNode.width;
            targetWidget.height = containerNode.height/2;

			break;
		case DIRECTION_RIGHT:
            containerNode = new WidgetContainer(targetWidget.left, targetWidget.top, targetWidget.width, targetWidget.height, [targetWidget, widgetToInsert], targetWidget.widgetContainer);

            widgetToInsert.left = containerNode.width/2;
            widgetToInsert.top = 0;
            widgetToInsert.width = containerNode.width/2;
            widgetToInsert.height = containerNode.height;            

            targetWidget.left = 0;
            targetWidget.top = 0;
            targetWidget.width = containerNode.width/2;
            targetWidget.height = containerNode.height;

			break;
		case DIRECTION_BOTTOM:
            containerNode = new WidgetContainer(targetWidget.left, targetWidget.top, targetWidget.width, targetWidget.height, [targetWidget, widgetToInsert], targetWidget.widgetContainer);

            widgetToInsert.left = 0;
            widgetToInsert.top = containerNode.height/2;
            widgetToInsert.width = containerNode.width;
            widgetToInsert.height = containerNode.height/2;

            targetWidget.left = 0;
            targetWidget.top = 0;
            targetWidget.width = containerNode.width;
            targetWidget.height = containerNode.height/2;

			break;
		case DIRECTION_LEFT:
            containerNode = new WidgetContainer(targetWidget.left, targetWidget.top, targetWidget.width, targetWidget.height, [widgetToInsert, targetWidget], targetWidget.widgetContainer);

            widgetToInsert.left = 0;
            widgetToInsert.top = 0;
            widgetToInsert.width = containerNode.width / 2;
            widgetToInsert.height = containerNode.height;

            targetWidget.left = containerNode.width/2;
            targetWidget.top = 0;
            targetWidget.width = containerNode.width/2;
            targetWidget.height = containerNode.height;

			break;
		default:
			return;
	}

	targetWidget.node.remove();
	targetWidget.widgetContainer = containerNode;
	widgetToInsert.widgetContainer = containerNode;
	targetWidgetContainer.children[childIndex] = containerNode;
	containerNode.render(targetWidgetContainer.rootDiv);
};

function locateWidgetByPosition(node, x, y) {

	console.log("node");
	console.log(node);

	// widget
	if (Widget.prototype.isPrototypeOf(node)) {

		console.log("it is a widget node");

		if ((x >= node.left && x <= node.left + node.width) && (y >= node.top && y <= node.top + node.height)) {
			return node;
		}
		return null;
	}

	// widget container
	for (let i=0; i<node.children.length; i++) {

		const widget = locateWidgetByPosition(node.children[i], x, y);

		if (widget !== null) {
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

function findMyChildIndex(node) {

	console.log('node');
	console.log(node);

	if (!node.widgetContainer) {
		return null;
	}

	const children = node.widgetContainer.children;

	console.log('children');
	console.log(children);

	if (Array.isArray(children)) {
		for (let i=0; i<children.length; i++) {
			if (children[i] === node) {
				return i;
			}
		}			
	}

	return null;
}

export {WidgetContainer};