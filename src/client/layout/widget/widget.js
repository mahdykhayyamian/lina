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

		drawTabs();
	};

	function drawNotSelectedTab(tabIndex) {
		const tab = document.createElementNS('http://www.w3.org/2000/svg','path');
		const maxTabSize = 100;
		const tabSize = Math.min(self.width/self.tabs.length, maxTabSize);

		const p1 = [tabIndex * (tabSize - TAB_OVERLAP) , TAB_HEIGHT];
		const p2 = [tabIndex * (tabSize - TAB_OVERLAP) + TAB_HORIZONTAL_SIDE_LENGTH, 0];
		const p3 = [tabIndex * (tabSize - TAB_OVERLAP) + tabSize - TAB_HORIZONTAL_SIDE_LENGTH, 0];
		const p4 = [tabIndex * (tabSize - TAB_OVERLAP) + tabSize, TAB_HEIGHT];

		let tabData = 
							'M ' + p1[0] + ' ' + p1[1] + 
		 					' L ' + p2[0] + ' ' + p2[1] +
		 					' L ' + p3[0] + ' ' + p3[1] + 
		 					' L ' + p4[0] + ' ' + p4[1];
		 					
		tab.setAttribute('d', tabData);
		tab.setAttribute('class', 'tabs-outline');

		const tabText = document.createElementNS('http://www.w3.org/2000/svg','text');

		const leftPadding = 5;
		tabText.setAttribute('x', p2[0] + leftPadding);
		tabText.setAttribute('y', (p2[1] + p4[1])/2);
		var textNode = document.createTextNode(self.tabs[tabIndex].title);
		tabText.appendChild(textNode);

		self.tabsSVG.appendChild(tab);
		self.tabs[tabIndex].pathNode = tab;

		self.tabsSVG.appendChild(tabText);
		addTabClickEventHandling(tabIndex);	
	}

	function drawSelectedTab(tabIndex) {
		const tab = document.createElementNS('http://www.w3.org/2000/svg','path');
		const maxTabSize = 100;
		const tabSize = Math.min(self.width/self.tabs.length, maxTabSize);

		const p1 = [0 , TAB_HEIGHT];
		const p2 = [tabIndex * (tabSize - TAB_OVERLAP) , TAB_HEIGHT];
		const p3 = [tabIndex * (tabSize - TAB_OVERLAP) + TAB_HORIZONTAL_SIDE_LENGTH, 0];
		const p4 = [tabIndex * (tabSize - TAB_OVERLAP) + tabSize - TAB_HORIZONTAL_SIDE_LENGTH, 0];
		const p5 = [tabIndex * (tabSize - TAB_OVERLAP) + tabSize, TAB_HEIGHT];
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
		
		const tabText = document.createElementNS('http://www.w3.org/2000/svg','text');

		const leftPadding = 5;
		tabText.setAttribute('x', p3[0] + leftPadding);
		tabText.setAttribute('y', (p3[1] + p5[1])/2);
		var textNode = document.createTextNode(self.tabs[tabIndex].title);
		tabText.appendChild(textNode);

		self.tabsSVG.appendChild(tab);
		self.tabs[tabIndex].pathNode = tab;

		self.tabsSVG.appendChild(tabText);
		
		addTabClickEventHandling(tabIndex);
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

		console.log(self.tabs[tabIndex]);

		self.node.addEventListener("click", function( event ) {
			const clickedElement = document.elementFromPoint(event.offsetX, event.offsetY);
			
			var pathString = getTabClickableAreaSVGPath(tabIndex);
			var clicked = pointInSvgPolygon.isInside([event.offsetX, event.offsetY], pathString);

			console.log([event.offsetX, event.offsetY]);
			
			if (clicked) {
				console.log("tab #" + tabIndex + " was clicked");

				updateSelectedTabTo(tabIndex);
			}

		}, false);
	}

	function updateSelectedTabTo(tabIndex) {
		// self.tabs[self.selectedTabIndex].pathNode.setAttribute('class', 'tabs-outline');
		// self.selectedTabIndex = tabIndex;
		//drawSelectedTab(self.selectedTabIndex);
	}

	function drawTabs() {
		for (let i=0; i < self.tabs.length; i++) {
			if (i !== self.selectedTabIndex) {
				drawNotSelectedTab(i);
			}
		}
		drawSelectedTab(self.selectedTabIndex);
	}

	Widget.prototype.addTab = function(title, content, position) {

	};


	return Widget;
}());

export {Widget};
require("./widget.css")