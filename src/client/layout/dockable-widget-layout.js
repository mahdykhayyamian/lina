const DockableWidgetLayout = (function() {

	let self;

	const WIDGET_NODE = "WIDGET_NODE";
	const CONTAINER_NODE = "CONTAINER_NODE";

	const DIRECTION_TOP = "DIRECTION_TOP";
	const DIRECTION_RIGHT = "DIRECTION_RIGHT";
	const DIRECTION_BOTTOM = "DIRECTION_BOTTOM";
	const DIRECTION_LEFT = "DIRECTION_LEFT";

	function DockableWidgetLayout(type, left, top, width, height, content) {
		self = this;

		self.type = type;
		self.left = left;
		self.top = top;
		self.width = width;
		self.height = height;
		self.content = content;
	}

    DockableWidgetLayout.prototype.render = function(parent) {

		self.rootDiv = document.createElement("div");
		self.rootDiv.setAttribute("class", "widget");
		self.rootDiv.style.setProperty("top", self.top+"px");
		self.rootDiv.style.setProperty("left", self.left+"px");
		self.rootDiv.style.setProperty("width", self.width+"px");
		self.rootDiv.style.setProperty("height", self.height+"px");

		if (self.type === WIDGET_NODE) {
			const widget = self.content;
			widget.render(self.rootDiv);
		} else if (self.type === CONTAINER_NODE) {
			const children = self.content;
			console.log("children");		
			console.log(children);		
			for (let i=0; i < children.length; i++) {
				console.log("rendering child");
				console.log(children[i]);
				console.log("self.rootDiv");
				console.log(self.rootDiv);
				children[i].render(self.rootDiv);
			}
		}

		parent.appendChild(self.rootDiv);
    }
	
	DockableWidgetLayout.prototype.insertWidget = function (insertedWidget, x, y) {

		// do nothing on a container node
		if (self.type === CONTAINER_NODE) {
			return;
		}

		const direction = determineDirectonToInsert(x, y);

		let childIndex, containerNode; 

		switch (direction) {

			case DIRECTION_TOP:
                containerNode = new DockableWidgetLayout(CONTAINER_NODE, self.left, self.top, self.width, self.height/2, [insertedWidget, self], self.parent);
				break;
			case DIRECTION_RIGHT:
                containerNode = new DockableWidgetLayout(CONTAINER_NODE, self.left + self.width/2, self.top, self.width/2, self.height, [self, insertedWidget], self.parent);
				break;
			case DIRECTION_BOTTOM:
                containerNode = new DockableWidgetLayout(CONTAINER_NODE, self.left, self.top + self.height/2, self.width, self.height/2, [self, insertedWidget], self.parent);
				break;
			case DIRECTION_LEFT:
                containerNode = new DockableWidgetLayout(CONTAINER_NODE, self.left, self.top, self.width/2, self.height, [insertedWidget, self], self.parent);
				break;
			default:
				return;
		}

        childIndex = self.findMyChildIndex();

        if (childIndex != null) {
	        self.parent.content[childIndex] = containerNode;
	        containerNode.render(containerNode.parent.rootDiv);        	
        }
	};


	function determineDirectonToInsert(x, y) {
		const distToLeft = Math.abs(x-self.left);
		const distToRight = Math.abs(self.left + self.width - x);
		const distToTop = Math.abs(y - self.top);
		const distToBottom = Math.abs(self.top + self.height - y);

		const distances = [distToLeft, distToRight, distToTop, distToBottom];

		const min = distances.min();

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

	function findMyChildIndex() {

		if (!self.parent) {
			return null;
		}

		const children = self.parent.content;

		if (Array.isArray(children)) {
			for (let i=0; i<children.length; i++) {
				if (parent.content[i] === self) {
					return i;
				}
			}			
		}

		return null;
	}

	DockableWidgetLayout.prototype.locateWidgetByPosition = function (x, y) {

		// widget node
		if (self.type === WIDGET_NODE) {
			if ((x >= left && x <= self.left + width) && (y >= top && y <= self.left + height)) {
				return self;
			}
			return null;
		}

		// container node
		for (let i=0; i<self.children; i++) {
			const widget = children[i].locateWidgetByPosition(x, y);

			if (widget !== null) {
				return widget;
			}
		}

		return null;
	}

	return DockableWidgetLayout;
}());

export {DockableWidgetLayout};