import {domUtils} from "../../utils/dom-utils.js";

import {WidgetContainer} from "../widget-container.js";

const Widget = (function() {

	const TAB_HEIGHT = 25;
	const TAB_OVERLAP = 5;
	const TAB_HORIZONTAL_SIDE_LENGTH = 8;
	const WIDGET_PADDING = 10;
	const WIDGET_MARGIN = 10;

	const DIRECTION_TOP = "DIRECTION_TOP";
	const DIRECTION_RIGHT = "DIRECTION_RIGHT";
	const DIRECTION_BOTTOM = "DIRECTION_BOTTOM";
	const DIRECTION_LEFT = "DIRECTION_LEFT";

	const pointInSvgPolygon = require("point-in-svg-polygon");
	
	function Widget(id, left, top, width, height, tabs, widgetContainer) {
		this.id = id;
		this.top = top;
		this.left = left
		this.width = width;
		this.height = height;
		this.tabs = tabs;
		this.selectedTabIndex = 0;
		this.widgetContainer = widgetContainer;	

		this.node = document.createElement("div");
		this.contentDiv = document.createElement("div");

	};

	Widget.prototype.render = function(parent) {

		this.node.setAttribute("id", this.id);
		this.node.setAttribute("class", "widget");
		this.node.style.setProperty("top", this.top+"px");
		this.node.style.setProperty("left", this.left+"px");
		this.node.style.setProperty("width", this.width+"px");
		this.node.style.setProperty("height", this.height+"px");
		this.node.style.setProperty("padding", WIDGET_PADDING + "px");
		this.node.style.setProperty("margin", WIDGET_MARGIN + "px");

		this.tabsDiv = document.createElement("div");
		this.tabsDiv.setAttribute("class", "widget-tabs");
		this.tabsDiv.style.setProperty("width", this.width+"px");
		this.tabsDiv.style.setProperty("height", TAB_HEIGHT+"px");

		this.tabsSVG = document.createElementNS('http://www.w3.org/2000/svg','svg');
		this.tabsSVG.style.setProperty("width", this.width+"px");

		this.tabsDiv.appendChild(this.tabsSVG);
		this.node.appendChild(this.tabsDiv);

		this.contentDiv.setAttribute("class", "widget-content");
		this.contentDiv.style.setProperty("width", this.width+"px");
		this.contentDiv.style.setProperty("height", this.height - TAB_HEIGHT+"px");
		this.node.appendChild(this.contentDiv);

		this.contentBorderDiv = document.createElement("div");
		this.contentBorderDiv.setAttribute("class", "widget-content-border");
		this.contentDiv.appendChild(this.contentBorderDiv);

		addMouseMoveOnWidgetEventHandling(this);
		addMouseUpOnWidgetEventHandling(this);
		drawTabs(this);

		parent.appendChild(this.node);
	}

	Widget.prototype.remove = function(parent) {
		
		while (this.contentDiv.firstChild) {
    		this.contentDiv.removeChild(this.contentDiv.firstChild);
		}
		this.contentDiv.remove();

		while (this.node.firstChild) {
    		this.node.removeChild(this.node.firstChild);
		}
		this.node.remove();
	}

	Widget.prototype.onContentMouseDown = function (callback) {
		this.contentDiv.addEventListener("mousedown", (event) => {
			callback(event, this);
		}, true);	
	}

	Widget.prototype.onMouseUp = function (callback) {
		this.node.addEventListener("mouseup", (event) => {
			callback(event, this);
		}, true);	
	}

	Widget.prototype.insertWidget = function (widgetToInsert, x, y) {

		const targetWidget = this;
		if (targetWidget === null) {
			return;
		}

		const direction = determineDirectonToInsert(targetWidget, x, y);

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

		console.log(targetWidget.node);

		targetWidget.remove();
		targetWidget.widgetContainer = containerNode;
		widgetToInsert.widgetContainer = containerNode;
		targetWidgetContainer.children[childIndex] = containerNode;
		containerNode.render(targetWidgetContainer.rootDiv);
	};

	function determineDirectonToInsert(widget, x, y) {
		console.log("x = " + x + ", y=" + y);
		const distToLeft = Math.abs(x);
		const distToRight = Math.abs(widget.width - x);
		const distToTop = Math.abs(y);
		const distToBottom = Math.abs(widget.height - y);

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


	function findMyChildIndex(widget) {

		if (!widget.widgetContainer) {
			return null;
		}

		const children = widget.widgetContainer.children;

		if (Array.isArray(children)) {
			for (let i=0; i<children.length; i++) {
				if (children[i] === widget) {
					return i;
				}
			}			
		}

		return null;
	}


	function drawNotSelectedTab(self, tabIndex, startX) {

		const tab = document.createElementNS('http://www.w3.org/2000/svg','path');
		const tabSize = getDynamicTabSize(self);

		const p1 = [startX, TAB_HEIGHT];
		const p2 = [startX + TAB_HORIZONTAL_SIDE_LENGTH, 0];
		const p3 = [startX + tabSize - TAB_HORIZONTAL_SIDE_LENGTH, 0];
		const p4 = [startX + tabSize, TAB_HEIGHT];

		let tabData = 
							'M ' + p1[0] + ' ' + p1[1] + 
		 					' L ' + p2[0] + ' ' + p2[1] +
		 					' L ' + p3[0] + ' ' + p3[1] + 
		 					' L ' + p4[0] + ' ' + p4[1];
		 					
		tab.setAttribute('d', tabData);
		tab.setAttribute('class', 'tabs-outline');

		const leftPadding = 5;
		const tabText = createTebText(self, tabIndex, p2[0] + leftPadding,(p2[1] + p4[1])/2);

		const tabNode = document.createElementNS('http://www.w3.org/2000/svg','g');
		tabNode.appendChild(tab);
		tabNode.appendChild(tabText);
		self.tabsSVG.appendChild(tabNode);
		self.tabs[tabIndex].tabNode = tabNode;
		self.tabs[tabIndex].startX = startX;

		addEventHandlers(self, tabIndex);
	}

	function drawSelectedTab(self, tabIndex, startX) {
		const tab = document.createElementNS('http://www.w3.org/2000/svg','path');

		const tabSize = getDynamicTabSize(self);

		const p1 = [0 , TAB_HEIGHT];
		const p2 = [startX , TAB_HEIGHT];
		const p3 = [startX + TAB_HORIZONTAL_SIDE_LENGTH, 0];
		const p4 = [startX + tabSize - TAB_HORIZONTAL_SIDE_LENGTH, 0];
		const p5 = [startX + tabSize, TAB_HEIGHT];
		const p6 = [self.width, TAB_HEIGHT];

		const tabData = 
							'M ' + p1[0] + ' ' + p1[1] + 
		 					' L ' + p2[0] + ' ' + p2[1] +
		 					' L ' + p3[0] + ' ' + p3[1] + 
		 					' L ' + p4[0] + ' ' + p4[1] +
		 					' L ' + p5[0] + ' ' + p5[1] +
		 					' L ' + p6[0] + ' ' + p6[1];
		 					
		tab.setAttribute('d', tabData);
		tab.setAttribute('class', 'tabs-outline selected');
		
		const leftPadding = 5;
		const tabText = createTebText(self, tabIndex, p3[0] + leftPadding, (p3[1] + p5[1])/2 )

		const tabNode = document.createElementNS('http://www.w3.org/2000/svg','g');
		tabNode.appendChild(tab);
		tabNode.appendChild(tabText);
		self.tabsSVG.appendChild(tabNode);
		self.tabs[tabIndex].tabNode = tabNode;
		self.tabs[tabIndex].startX = startX;
		
		addEventHandlers(self, tabIndex);
	}

	function getDynamicTabSize(self) {
		const maxTabSize = 100;
		const tabSize = Math.min(self.width/self.tabs.length, maxTabSize);
		return tabSize;		
	}

	function createTebText(self, tabIndex, x, y) {
		const tabText = document.createElementNS('http://www.w3.org/2000/svg','text');
		tabText.setAttribute('x', x);
		tabText.setAttribute('y', y);
		var textNode = document.createTextNode(self.tabs[tabIndex].title);
		tabText.appendChild(textNode);
		return tabText;	
	}

	function addEventHandlers(self, tabIndex) {
		addTabClickEventHandling(self, tabIndex);
		addMouseDownEventHandling(self, tabIndex);
	}

	function getTabClickableAreaSVGPath(self, tabIndex) {

		const maxTabSize = 100;
		const tabSize = Math.min(self.width/self.tabs.length, maxTabSize);

		const p1 = [tabIndex * (tabSize - TAB_OVERLAP) , TAB_HEIGHT];
		const p2 = [tabIndex * (tabSize - TAB_OVERLAP) + TAB_HORIZONTAL_SIDE_LENGTH, 0];
		const p3 = [tabIndex * (tabSize - TAB_OVERLAP) + tabSize - TAB_HORIZONTAL_SIDE_LENGTH, 0];
		const p4 = [tabIndex * (tabSize - TAB_OVERLAP) + tabSize, TAB_HEIGHT];

		const path = 'M ' + p1[0] + ' ' + p1[1] + 
	 				' L ' + p2[0] + ' ' + p2[1] +
	 				' L ' + p3[0] + ' ' + p3[1] + 
	 				' L ' + p4[0] + ' ' + p4[1] +
	 				' L' + p1[0] + ' ' + p1[1];

	 	return path;
	}

	function addTabClickEventHandling(self, tabIndex) {
		self.tabs[tabIndex].tabNode.addEventListener("click", function( event ) {
			const clickedElement = document.elementFromPoint(event.offsetX, event.offsetY);
			
			var pathString = getTabClickableAreaSVGPath(self, tabIndex);
			var clicked = pointInSvgPolygon.isInside([event.offsetX, event.offsetY], pathString);
			
			if (clicked) {
				updateSelectedTabTo(self, tabIndex);
			}

		}, false);
	}

	function addMouseDownEventHandling(self, tabIndex) {
		self.tabs[tabIndex].tabNode.addEventListener("mousedown", function(event) {
			console.log('drag started on tab #' + tabIndex);
			self.draggingTabIndex = tabIndex;
			self.tabs[tabIndex].drag = {
				mouseX: event.x 
			}

		}, true);
	}

	function addMouseMoveOnWidgetEventHandling(self) {
		self.node.addEventListener("mousemove", function(event) {

			// return if no tab is being dragged
			if (self.draggingTabIndex === undefined) {
				return;
			}

			// apply new position
			self.tabs[self.draggingTabIndex].startX += (event.x - self.tabs[self.draggingTabIndex].drag.mouseX);
			self.tabs[self.draggingTabIndex].drag.mouseX = event.x;

			// update dom
			self.tabs[self.draggingTabIndex].tabNode.remove();
			if (self.draggingTabIndex === self.selectedTabIndex) {
				drawSelectedTab(self, self.draggingTabIndex, self.tabs[self.draggingTabIndex].startX);
			} else {
				drawNotSelectedTab(self, self.draggingTabIndex, self.tabs[self.draggingTabIndex].startX);			
			}

			// swap if necessary
			let tabIndexToSwap = getTabIndexToSwap(self);
			if (tabIndexToSwap !== undefined) {
				swapTabs(self, tabIndexToSwap);
			}

		}, false);
	}

	function addMouseUpOnWidgetEventHandling(self) {
		self.node.addEventListener("mouseup", function( event ) {
			
			if (self.draggingTabIndex !== undefined) {

				self.tabs[self.draggingTabIndex].tabNode.remove();
				const startX = getTabDefaultStartXPosition(self, self.draggingTabIndex);
				drawSelectedTab(self, self.draggingTabIndex, startX);

				updateSelectedTabTo(self, self.draggingTabIndex);
				self.draggingTabIndex = undefined;
			}

		}, false);
	}

	function swapTabs(self, tabIndexToSwap) {

		const temp = self.tabs[tabIndexToSwap];
		self.tabs[tabIndexToSwap] = self.tabs[self.draggingTabIndex];
		self.tabs[self.draggingTabIndex] = temp;

		const tempIndex = tabIndexToSwap;
		tabIndexToSwap = self.draggingTabIndex;
		self.draggingTabIndex = tempIndex;

		// update selected tab index if needed
		if (self.selectedTabIndex === self.draggingTabIndex) {
			self.selectedTabIndex = tabIndexToSwap;
		} else if (self.selectedTabIndex == tabIndexToSwap) {
			self.selectedTabIndex = self.draggingTabIndex;
		}

		// draw the swapped tab
		self.tabs[tabIndexToSwap].tabNode.remove();
		const startX = getTabDefaultStartXPosition(self, tabIndexToSwap);

		if (tabIndexToSwap === self.selectedTabIndex) {
			drawSelectedTab(self, tabIndexToSwap, startX);
		} else {
			drawNotSelectedTab(self, tabIndexToSwap, startX);			
		}
	}

	function getTabDefaultStartXPosition(self, tabIndex) {
		const tabSize = getDynamicTabSize(self);
		return tabIndex * (tabSize - TAB_OVERLAP);
	}

	function updateSelectedTabTo(self, tabIndex) {

		if (tabIndex === self.selectedTabIndex) {
			return;
		}

		self.tabs[self.selectedTabIndex].tabNode.remove();
		self.tabs[tabIndex].tabNode.remove();

		drawNotSelectedTab(self, self.selectedTabIndex, self.tabs[self.selectedTabIndex].startX);

		self.selectedTabIndex = tabIndex;
		drawSelectedTab(self, self.selectedTabIndex, self.tabs[self.selectedTabIndex].startX);
	}

	function drawTabs(self) {
		const tabSize = getDynamicTabSize(self);

		for (let tabIndex=0; tabIndex < self.tabs.length; tabIndex++) {
			if (tabIndex !== self.selectedTabIndex) {				
				var startX = tabIndex * (tabSize - TAB_OVERLAP);
				drawNotSelectedTab(self, tabIndex, startX);
			}
		}

		var startX = self.selectedTabIndex * (tabSize - TAB_OVERLAP);
		drawSelectedTab(self, self.selectedTabIndex, startX);
	}

	function getTabIndexToSwap(self) {

		const preTabIndex = self.draggingTabIndex - 1;
		const nextTabIndex = self.draggingTabIndex + 1;

		const tabSize = getDynamicTabSize(self);

		if (isValidTabIndex(self, preTabIndex) && self.tabs[self.draggingTabIndex].startX < getMiddleXOfTab(self, preTabIndex)) {
			return preTabIndex;
		} else if (isValidTabIndex(self, nextTabIndex) && self.tabs[self.draggingTabIndex].startX + tabSize > getMiddleXOfTab(self, nextTabIndex)) {
			return nextTabIndex
		} 

		return undefined;
	}

	function isValidTabIndex(self, tabIndex) {
		if (tabIndex >= 0 && tabIndex < self.tabs.length) {
			return true;
		} else {
			return false;
		}
	}

	function getMiddleXOfTab(self, tabIndex) {
		return (self.tabs[tabIndex].startX + getDynamicTabSize(self)/2); 
	}

	return Widget;
}());

export {Widget};
require("./widget.css")