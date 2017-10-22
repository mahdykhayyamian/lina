import { domUtils } from "../../utils/dom-utils.js";
import { CONSTANTS } from "../constants.js";

import { WidgetContainer } from "../widget-container.js";

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

    function Widget(id, tabs, widgetContainer, left, top, width, height, tabsBaseXOffset) {
        this.id = id;
        this.top = top;
        this.left = left
        this.width = width;
        this.height = height;
        this.tabs = tabs;
        this.selectedTabIndex = 0;
        this.widgetContainer = widgetContainer;

        this.tabsBaseXOffset = tabsBaseXOffset !== undefined ? tabsBaseXOffset : 0;

        this.node = document.createElement("div");
        this.contentDiv = document.createElement("div");

        this.eventHandlers = {
            mouseDownOnContentHandlers: [],
            mouseUpOnWidgetHandlers: [],
            mouseMoveOnContentHandlers: [],
            mouseMoveOnTabsHandlers: [],
            mouseDownOnTabsHandlers: []
        };
    };

    Widget.prototype.render = function(parent) {

        // first clean up from dom to start fresh
        this.remove();

        this.node.setAttribute("id", this.id);
        this.node.setAttribute("class", "widget");
        this.node.style.setProperty("top", this.top + "px");
        this.node.style.setProperty("left", this.left + "px");
        this.node.style.setProperty("width", this.width + "px");
        this.node.style.setProperty("height", this.height + "px");
        this.node.style.setProperty("padding", WIDGET_PADDING + "px");
        this.node.style.setProperty("margin", WIDGET_MARGIN + "px");

        this.tabsDiv = document.createElement("div");
        this.tabsDiv.setAttribute("class", "widget-tabs");
        this.tabsDiv.style.setProperty("width", this.width + "px");
        this.tabsDiv.style.setProperty("height", TAB_HEIGHT + "px");

        this.tabsSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.tabsSVG.style.setProperty("width", this.width + "px");
        this.tabsSVG.style.setProperty("height", TAB_HEIGHT + "px");

        this.tabsDiv.appendChild(this.tabsSVG);
        this.node.appendChild(this.tabsDiv);

        this.contentDiv.setAttribute("class", "widget-content");
        this.contentDiv.style.setProperty("width", this.width + "px");
        this.contentDiv.style.setProperty("height", this.height - TAB_HEIGHT + "px");
        this.node.appendChild(this.contentDiv);

        this.contentBorderDiv = document.createElement("div");
        this.contentBorderDiv.setAttribute("class", "widget-content-border");
        this.contentDiv.appendChild(this.contentBorderDiv);

        // event handlers
        this.addMouseUpOnWidgetHandler(mouseUpEventHandler);
        this.addMouseMoveOnTabsHandler(mouseMoveOnTabsEventHandler);
        attachMouseMoveOnContentEventHandlers(this);

        drawTabs(this);

        parent.appendChild(this.node);
    };

    Widget.prototype.remove = function(parent) {

        while (this.contentDiv.firstChild) {
            this.contentDiv.removeChild(this.contentDiv.firstChild);
        }
        this.contentDiv.remove();

        while (this.node.firstChild) {
            this.node.removeChild(this.node.firstChild);
        }
        this.node.remove();

        this.node = document.createElement("div");
        this.contentDiv = document.createElement("div");
    };

    Widget.prototype.addMouseUpOnWidgetHandler = function(callback) {
        this.eventHandlers.mouseUpOnWidgetHandlers.push(callback);
        this.node.addEventListener("mouseup", (event) => {
            callback(event, this);
        }, true);
    };

    Widget.prototype.addMouseMoveOnContentHandler = function(callback) {
        this.eventHandlers.mouseMoveOnContentHandlers.push(callback);
        this.contentDiv.addEventListener("mousemove", (event) => {
            callback(event, this);
        }, true);
    };

    Widget.prototype.addMouseMoveOnTabsHandler = function(callback) {
        this.eventHandlers.mouseMoveOnTabsHandlers.push(callback);
        this.tabsDiv.addEventListener("mousemove", (event) => {
            callback(event, this);
        }, true);
    };

    Widget.prototype.addMouseDownOnTabsHandler = function(callback) {
        this.eventHandlers.mouseDownOnTabsHandlers.push(callback);
        for (let i = 0; i < this.tabs.length; i++) {
            this.tabs[i].tabNode.addEventListener("mousedown", (event) => {
                callback(event, this, i);
            }, true);
        }
    };

    Widget.prototype.insertWidget = function(widgetToInsert, x, y) {

        const targetWidget = this;
        if (targetWidget === null) {
            return;
        }

        const direction = targetWidget.determineDirectonToInsert(x, y);

        let childIndex, containerNode, targetWidgetContainer;

        childIndex = findMyChildIndex(targetWidget);
        targetWidgetContainer = targetWidget.widgetContainer;

        switch (direction) {

            case DIRECTION_TOP:
                containerNode = new WidgetContainer([widgetToInsert, targetWidget], CONSTANTS.TOP_TO_BOTTOM, targetWidget.widgetContainer, targetWidget.left, targetWidget.top, targetWidget.width, targetWidget.height);
                break;
            case DIRECTION_RIGHT:
                containerNode = new WidgetContainer([targetWidget, widgetToInsert], CONSTANTS.LEFT_TO_RIGHT, targetWidget.widgetContainer, targetWidget.left, targetWidget.top, targetWidget.width, targetWidget.height);
                break;
            case DIRECTION_BOTTOM:
                containerNode = new WidgetContainer([targetWidget, widgetToInsert], CONSTANTS.TOP_TO_BOTTOM, targetWidget.widgetContainer, targetWidget.left, targetWidget.top, targetWidget.width, targetWidget.height);
                break;
            case DIRECTION_LEFT:
                containerNode = new WidgetContainer([widgetToInsert, targetWidget], CONSTANTS.LEFT_TO_RIGHT, targetWidget.widgetContainer, targetWidget.left, targetWidget.top, targetWidget.width, targetWidget.height);
                break;
            default:
                return;
        }

        targetWidget.remove();
        targetWidget.widgetContainer = containerNode;
        widgetToInsert.widgetContainer = containerNode;
        widgetToInsert.tabsBaseXOffset = 0;
        targetWidgetContainer.children[childIndex] = containerNode;
        containerNode.render(targetWidgetContainer.rootDiv);
    };

    Widget.prototype.removeTab = function(tabIndex) {

        if (this.selectedTabIndex === this.tabs.length - 1) {
            this.selectedTabIndex = this.selectedTabIndex - 1;
        }

        this.tabs.splice(tabIndex, 1);

        while (this.tabsSVG.firstChild) {
            this.tabsSVG.removeChild(this.tabsSVG.firstChild);
        }

        while (this.contentBorderDiv.firstChild) {
            this.contentBorderDiv.removeChild(this.contentBorderDiv.firstChild);
        }

        if (this.tabs.length > 0) {
            drawTabs(this);
        }
    };

    Widget.prototype.createWidgetFromTab = function(tabIndex) {

        const widgetOfTab = new Widget(this.id + "_tab_" + tabIndex, [{
                title: this.tabs[tabIndex].title,
            }],
            null,
            this.left,
            this.top,
            this.width,
            this.height,
            this.tabs[tabIndex].startX
        );

        if (this.tabs[tabIndex].contentNode) {
            widgetOfTab.tabs[0].contentNode = this.tabs[tabIndex].contentNode.cloneNode(true);
        }

        widgetOfTab.eventHandlers = this.eventHandlers;

        return widgetOfTab;
    };

    Widget.prototype.addOverlay = function(direction) {

        console.log("direction : " + direction);

        const height = this.height - TAB_HEIGHT;
        const width = this.width;
        const left = this.left + WIDGET_PADDING
        const top = TAB_HEIGHT + WIDGET_PADDING;

        switch (direction) {
            case (DIRECTION_TOP):
                addOverlayTop(this);
                break;
            case (DIRECTION_RIGHT):
                addOverlayRight(this);
                break;
            case (DIRECTION_BOTTOM):
                addOverlayBottom(this);
                break;
            case (DIRECTION_LEFT):
                addOverlayLeft(this);
                break;
        }

        this.overlayDiv.setAttribute("class", "drag-target-widget-overlay");
        this.contentDiv.parentNode.appendChild(this.overlayDiv);

        function addOverlayTop(widget) {
            console.log("in addOverlayTop");
            widget.overlayDiv = document.createElement("div");
            widget.overlayDiv.style.setProperty("width", width + "px");
            widget.overlayDiv.style.setProperty("height", (height / 2) + "px");
            widget.overlayDiv.style.setProperty("left", left + "px");
            widget.overlayDiv.style.setProperty("top", top + "px");
        }

        function addOverlayRight(widget) {
            console.log("in addOverlayRight");
            widget.overlayDiv = document.createElement("div");
            widget.overlayDiv.style.setProperty("width", (width / 2) + "px");
            widget.overlayDiv.style.setProperty("height", height + "px");
            widget.overlayDiv.style.setProperty("left", (left + (width / 2)) + "px");
            widget.overlayDiv.style.setProperty("top", top + "px");
        }

        function addOverlayBottom(widget) {
            console.log("in addOverlayBottom");
            widget.overlayDiv = document.createElement("div");
            widget.overlayDiv.style.setProperty("width", width + "px");
            widget.overlayDiv.style.setProperty("height", (height / 2) + "px");
            widget.overlayDiv.style.setProperty("left", left + "px");
            widget.overlayDiv.style.setProperty("top", top + (height / 2) + "px");
            console.log(widget.overlayDiv);
        }

        function addOverlayLeft(widget) {
            console.log("in addOverlayLeft");
            widget.overlayDiv = document.createElement("div");
            widget.overlayDiv.style.setProperty("width", (width / 2) + "px");
            widget.overlayDiv.style.setProperty("height", height + "px");
            widget.overlayDiv.style.setProperty("left", left + "px");
            widget.overlayDiv.style.setProperty("top", top + "px");
        }
    };

    Widget.prototype.removeOverlay = function() {
        if (this.overlayDiv) {
            this.overlayDiv.remove();
            this.overlayDiv = undefined;
        }
    };

    Widget.prototype.determineDirectonToInsert = function(x, y) {

        const distToLeft = Math.abs(x);
        const distToRight = Math.abs(this.width - x);
        const distToTop = Math.abs(y);
        const distToBottom = Math.abs(this.height - y);

        const distances = [distToLeft, distToRight, distToTop, distToBottom];

        const min = Math.min.apply(Math, distances);

        switch (min) {
            case (distToTop):
                return DIRECTION_TOP;
            case (distToRight):
                return DIRECTION_RIGHT;
            case (distToBottom):
                return DIRECTION_BOTTOM;
            case (distToLeft):
                return DIRECTION_LEFT;
            default:
                return null;
        }
    };

    function findMyChildIndex(widget) {

        if (!widget.widgetContainer) {
            return null;
        }

        const children = widget.widgetContainer.children;

        if (Array.isArray(children)) {
            for (let i = 0; i < children.length; i++) {
                if (children[i] === widget) {
                    return i;
                }
            }
        }

        return null;
    }


    function drawNotSelectedTab(self, tabIndex, startX) {

        const tab = document.createElementNS('http://www.w3.org/2000/svg', 'path');
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

        const leftPadding = 5;
        const tabText = createTebText(self, tabIndex, p2[0] + leftPadding, (p2[1] + p4[1]) / 2);

        const tabNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        tabNode.setAttribute('class', 'tabs-outline not-selected');

        tabNode.appendChild(tab);
        tabNode.appendChild(tabText);
        self.tabsSVG.appendChild(tabNode);
        self.tabs[tabIndex].tabNode = tabNode;
        self.tabs[tabIndex].startX = startX;
        self.tabs[tabIndex].startY = 0;

        addEventHandlers(self, tabIndex);
    }

    function drawSelectedTab(self, tabIndex, startX) {

        const tab = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        const tabSize = getDynamicTabSize(self);

        const p1 = [0, TAB_HEIGHT];
        const p2 = [startX, TAB_HEIGHT];
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

        const leftPadding = 5;
        const tabText = createTebText(self, tabIndex, p3[0] + leftPadding, (p3[1] + p5[1]) / 2)

        const tabNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        tabNode.setAttribute('class', 'tabs-outline selected');

        tabNode.appendChild(tab);
        tabNode.appendChild(tabText);
        self.tabsSVG.appendChild(tabNode);
        self.tabs[tabIndex].tabNode = tabNode;
        self.tabs[tabIndex].startX = startX;
        self.tabs[tabIndex].startY = 0;

        // show content if available
        if (self.tabs[tabIndex].contentNode) {
            self.contentBorderDiv.appendChild(self.tabs[tabIndex].contentNode);
        }

        addEventHandlers(self, tabIndex);
    }

    function getDynamicTabSize(self) {
        const maxTabSize = 100;
        const tabSize = Math.min(self.width / self.tabs.length, maxTabSize);
        return tabSize;
    }

    function createTebText(self, tabIndex, x, y) {
        const tabText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tabText.setAttribute('x', x);
        tabText.setAttribute('y', y);
        var textNode = document.createTextNode(self.tabs[tabIndex].title);
        tabText.appendChild(textNode);
        return tabText;
    }

    function addEventHandlers(self, tabIndex) {
        attachOnTabsMouseDownEventHandlers(self, tabIndex);
    }

    function getTabClickableAreaSVGPath(self, tabIndex) {

        const maxTabSize = 100;
        const tabSize = Math.min(self.width / self.tabs.length, maxTabSize);

        const p1 = [tabIndex * (tabSize - TAB_OVERLAP), TAB_HEIGHT];
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

    function attachOnTabsMouseDownEventHandlers(widget, tabIndex) {

        // internal handers
        widget.tabs[tabIndex].tabNode.addEventListener("mousedown", function(event) {
            widget.draggingTabIndex = tabIndex;

            const widgetBoundingRectangle = widget.node.getBoundingClientRect();
            widget.draggingStartPositionRelativeToWidget = {
                x: event.x - widgetBoundingRectangle.left,
                y: event.y - widgetBoundingRectangle.top
            }

            widget.tabs[tabIndex].drag = {
                mouseX: event.x,
                mouseY: event.y
            }
        }, true);

        // passed in handlers
        widget.tabs[tabIndex].tabNode.addEventListener("mousedown", (event) => {
            for (let i = 0; i < widget.eventHandlers.mouseDownOnTabsHandlers.length; i++) {
                let callback = widget.eventHandlers.mouseDownOnTabsHandlers[i];
                callback(event, widget, tabIndex);
            }
        }, true);
    }

    function attachMouseMoveOnContentEventHandlers(widget) {
        widget.contentDiv.addEventListener("mousemove", (event) => {
            for (let i = 0; i < widget.eventHandlers.mouseMoveOnContentHandlers.length; i++) {
                let callback = widget.eventHandlers.mouseMoveOnContentHandlers[i];
                callback(event, widget);
            }
        }, true);
    }

    function mouseMoveOnTabsEventHandler(event, widget) {

        // return if no tab is being dragged
        if (widget.draggingTabIndex === undefined) {
            return;
        }

        // apply new position
        widget.tabs[widget.draggingTabIndex].startX += (event.x - widget.tabs[widget.draggingTabIndex].drag.mouseX);
        widget.tabs[widget.draggingTabIndex].drag.mouseX = event.x;
        widget.tabs[widget.draggingTabIndex].startY += (event.y - widget.tabs[widget.draggingTabIndex].drag.mouseY);
        widget.tabs[widget.draggingTabIndex].drag.mouseY = event.y;

        // update dom
        widget.tabs[widget.draggingTabIndex].tabNode.remove();
        if (widget.draggingTabIndex === widget.selectedTabIndex) {
            drawSelectedTab(widget, widget.draggingTabIndex, widget.tabs[widget.draggingTabIndex].startX, widget.tabs[widget.draggingTabIndex].startY);
        } else {
            drawNotSelectedTab(widget, widget.draggingTabIndex, widget.tabs[widget.draggingTabIndex].startX);
        }

        // swap if necessary
        let tabIndexToSwap = getTabIndexToSwap(widget);
        if (tabIndexToSwap !== undefined) {
            swapTabs(widget, tabIndexToSwap);
        }
    }

    function mouseUpEventHandler(event, widget) {

        if (widget.draggingTabIndex !== undefined) {

            widget.tabs[widget.draggingTabIndex].tabNode.remove();
            const startX = getTabDefaultStartXPosition(widget, widget.draggingTabIndex);
            drawSelectedTab(widget, widget.draggingTabIndex, startX, 0);

            updateSelectedTabTo(widget, widget.draggingTabIndex);
            widget.draggingTabIndex = undefined;
            widget.draggingStartPositionRelativeToWidget = null;
        }
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
            drawSelectedTab(self, tabIndexToSwap, startX, 0);
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

        while (self.contentBorderDiv.firstChild) {
            self.contentBorderDiv.removeChild(self.contentBorderDiv.firstChild);
        }

        drawNotSelectedTab(self, self.selectedTabIndex, self.tabs[self.selectedTabIndex].startX);

        self.selectedTabIndex = tabIndex;
        drawSelectedTab(self, self.selectedTabIndex, self.tabs[self.selectedTabIndex].startX, self.tabs[self.selectedTabIndex].startY);
    }

    function drawTabs(widget) {

        const tabSize = getDynamicTabSize(widget);

        for (let tabIndex = 0; tabIndex < widget.tabs.length; tabIndex++) {
            if (tabIndex !== widget.selectedTabIndex) {
                var startX = tabIndex * (tabSize - TAB_OVERLAP) + widget.tabsBaseXOffset;
                drawNotSelectedTab(widget, tabIndex, startX);
            }
        }

        var startX = widget.selectedTabIndex * (tabSize - TAB_OVERLAP) + widget.tabsBaseXOffset;
        drawSelectedTab(widget, widget.selectedTabIndex, startX, 0);
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

    function isValidTabIndex(widget, tabIndex) {
        if (tabIndex >= 0 && tabIndex < widget.tabs.length) {
            return true;
        } else {
            return false;
        }
    }

    function getMiddleXOfTab(widget, tabIndex) {
        return (widget.tabs[tabIndex].startX + getDynamicTabSize(widget) / 2);
    }

    return Widget;
}());

export { Widget };
require("./widget.css")