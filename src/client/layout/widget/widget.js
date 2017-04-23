const Widget = (function() {

	const TAB_HEIGHT = 25;
	const TAB_OVERLAP = 5;
	const TAB_HORIZONTAL_SIDE_LENGTH = 8; 
	const pointInSvgPolygon = require("point-in-svg-polygon");

	let self;
	
	function Widget(id, top, left, width, height) {
		self = this;

		self.id = id;
		self.top = top;
		self.left = left
		self.width = width;
		self.height = height;

		self.tabs = [{
			title: 'Judy/Nikki',
		}, {
			title: 'Lina' 
		}, {
			title: 'Mahdy'
		}];
		self.selectedTabIndex = 1;

		self.node = document.createElement("div");
		self.node.setAttribute("id", id);
		self.node.setAttribute("class", "widget");
		self.node.style.setProperty("top", self.top+"px");
		self.node.style.setProperty("left", self.left+"px");
		self.node.style.setProperty("width", self.width+"px");
		self.node.style.setProperty("height", self.height+"px");

		self.tabsDiv = document.createElement("div");
		self.tabsDiv.setAttribute("class", "widget-tabs");
		self.tabsDiv.style.setProperty("width", self.width+"px");
		self.tabsDiv.style.setProperty("height", TAB_HEIGHT+"px");

		self.tabsSVG = document.createElementNS('http://www.w3.org/2000/svg','svg');
		self.tabsSVG.style.setProperty("width", self.width+"px");

		self.tabsDiv.appendChild(self.tabsSVG);
		self.node.appendChild(self.tabsDiv);

		self.contentDiv = document.createElement("div");
		self.contentDiv.setAttribute("class", "widget-content");
		self.contentDiv.style.setProperty("width", self.width+"px");
		self.contentDiv.style.setProperty("height", self.height - TAB_HEIGHT+"px");
		self.node.appendChild(self.contentDiv);

		self.contentBorderDiv = document.createElement("div");
		self.contentBorderDiv.setAttribute("class", "widget-content-border");
		self.contentDiv.appendChild(self.contentBorderDiv);

		addMouseMoveEventHandling();

		drawTabs();


		// self.circle = document.createElementNS('http://www.w3.org/2000/svg','circle');	
		// self.circle.setAttribute('cx', 200);
		// self.circle.setAttribute('cy', 200);
		// self.circle.setAttribute('r', 10);
		// self.tabsSVG.appendChild(self.circle);
	};

	function drawNotSelectedTab(tabIndex, startX) {

		const tab = document.createElementNS('http://www.w3.org/2000/svg','path');
		const tabSize = getDynamicTabSize();

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
		const tabText = createTebText(tabIndex, p2[0] + leftPadding,(p2[1] + p4[1])/2);

		const tabNode = document.createElementNS('http://www.w3.org/2000/svg','g');
		tabNode.appendChild(tab);
		tabNode.appendChild(tabText);
		self.tabsSVG.appendChild(tabNode);
		self.tabs[tabIndex].tabNode = tabNode;
		self.tabs[tabIndex].startX = startX;

		addEventHandlers(tabIndex);
	}

	function drawSelectedTab(tabIndex, startX) {
		const tab = document.createElementNS('http://www.w3.org/2000/svg','path');

		const tabSize = getDynamicTabSize();

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
		const tabText = createTebText(tabIndex, p3[0] + leftPadding, (p3[1] + p5[1])/2 )

		const tabNode = document.createElementNS('http://www.w3.org/2000/svg','g');
		tabNode.appendChild(tab);
		tabNode.appendChild(tabText);
		self.tabsSVG.appendChild(tabNode);
		self.tabs[tabIndex].tabNode = tabNode;
		self.tabs[tabIndex].startX = startX;
		
		addEventHandlers(tabIndex);
	}

	function getDynamicTabSize() {
		const maxTabSize = 100;
		const tabSize = Math.min(self.width/self.tabs.length, maxTabSize);
		return tabSize;		
	}

	function createTebText(tabIndex, x, y) {
		const tabText = document.createElementNS('http://www.w3.org/2000/svg','text');
		tabText.setAttribute('x', x);
		tabText.setAttribute('y', y);
		var textNode = document.createTextNode(self.tabs[tabIndex].title);
		tabText.appendChild(textNode);
		return tabText;	
	}

	function addEventHandlers(tabIndex) {
		addTabClickEventHandling(tabIndex);
		addMouseUpEventHandling(tabIndex);
		addMouseDownEventHandling(tabIndex);
	}

	function getTabClickableAreaSVGPath(tabIndex) {

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

	function addTabClickEventHandling(tabIndex) {
		self.tabs[tabIndex].tabNode.addEventListener("click", function( event ) {
			const clickedElement = document.elementFromPoint(event.offsetX, event.offsetY);
			
			var pathString = getTabClickableAreaSVGPath(tabIndex);
			var clicked = pointInSvgPolygon.isInside([event.offsetX, event.offsetY], pathString);
			
			if (clicked) {
				updateSelectedTabTo(tabIndex);
			}

		}, false);
	}

	function addMouseUpEventHandling(tabIndex) {
		self.tabs[tabIndex].tabNode.addEventListener("mouseup", function( event ) {
			
			console.log('mouse up on tab# :' + tabIndex);

			if (self.draggingTabIndex !== undefined) {
				updateSelectedTabTo(self.draggingTabIndex);
				console.log("drag end on tab #" + self.draggingTabIndex);
				self.draggingTabIndex = undefined;
			}

		}, false);
	}

	function addMouseDownEventHandling(tabIndex) {
		self.tabs[tabIndex].tabNode.addEventListener("mousedown", function( event ) {
			console.log('drag started on tab #' + tabIndex);
			self.draggingTabIndex = tabIndex;
			self.tabs[tabIndex].drag = {
				mouseX: event.x 
			}

		}, false);
	}

	function addMouseMoveEventHandling() {
		self.tabsSVG.addEventListener("mousemove", function( event ) {

			if (self.draggingTabIndex !== undefined) {
				console.log(self.draggingTabIndex);
				dragTabTo(event.x, event.y);
				self.tabs[self.draggingTabIndex].startX += (event.x - self.tabs[self.draggingTabIndex].drag.mouseX);
				self.tabs[self.draggingTabIndex].drag.mouseX = event.x;				
			}	

		}, false);
	}

	function dragTabTo(x, y) {
		console.log('x = ' + x, ', y = ' + y);

		console.log('self.draggingTabIndex:' + self.draggingTabIndex);

		console.log(self.tabs[self.draggingTabIndex].tabNode);

		self.tabs[self.draggingTabIndex].tabNode.remove();

		if (self.draggingTabIndex === self.selectedTabIndex) {
			console.log('drawing slected tab');
			drawSelectedTab(self.draggingTabIndex, self.tabs[self.draggingTabIndex].startX);
		} else {
			console.log('drawing not slected tab');
			drawNotSelectedTab(self.draggingTabIndex, self.tabs[self.draggingTabIndex].startX);			
		}
	}

	function updateSelectedTabTo(tabIndex) {

		if (tabIndex === self.selectedTabIndex) {
			return;
		}

		console.log("selected tab index" + self.selectedTabIndex);
		console.log(self.tabs[self.selectedTabIndex].tabNode);

		self.tabs[self.selectedTabIndex].tabNode.remove();

		console.log("new tab index" + tabIndex);
		console.log(self.tabs[tabIndex].tabNode);
		self.tabs[tabIndex].tabNode.remove();

		drawNotSelectedTab(self.selectedTabIndex, self.tabs[self.selectedTabIndex].startX);

		self.selectedTabIndex = tabIndex;
		drawSelectedTab(self.selectedTabIndex, self.tabs[self.selectedTabIndex].startX);
	}

	function drawTabs() {
		const tabSize = getDynamicTabSize();

		for (let tabIndex=0; tabIndex < self.tabs.length; tabIndex++) {
			if (tabIndex !== self.selectedTabIndex) {				
				var startX = tabIndex * (tabSize - TAB_OVERLAP);
				drawNotSelectedTab(tabIndex, startX);
			}
		}

		var startX = self.selectedTabIndex * (tabSize - TAB_OVERLAP);
		drawSelectedTab(self.selectedTabIndex, startX);
	}

	Widget.prototype.addTab = function(title, content, position) {

	};


	return Widget;
}());

export {Widget};
require("./widget.css")