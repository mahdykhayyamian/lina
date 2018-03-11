import { Widget } from "layout/widget/widget.js";
import { Pencil } from "toolbox/pencil.js";
import { WidgetContainer } from "layout/widget-container.js";
import { WidgetTabDragController } from "layout/widget-tab-drag-controller.js";
import { WidgetResizeController } from "layout/widget-resize-controller.js";
import { CONSTANTS } from "layout/constants.js";

window.onload = function() {

    const appDiv = document.getElementById("lina.app");
    appDiv.style.setProperty("position", "absolute");

    function createTextDiv(text) {
        const div = document.createElement("div");
        div.textContent = text;
        div.style["font-size"] = "12px";
        return div;
    }

    function createDiv(innerHtml) {
        const div = document.createElement("div");
        div.innerHTML = innerHtml;
        return div;
    }

    function createImage(source) {
        const image = document.createElement("img");
        image.src = source;
        return image;
    }

    const pencil = new Pencil();

    function createPencilNode() {
        const div = document.createElement("div");
        pencil.render();
        div.appendChild(pencil.svg);
        return div;
    }

    const mahdyImage = createImage("/resources/images/mahdy.jpg");

    const linaImage = createImage("/resources/images/lina.jpg");

    const widgetB = new Widget("widgetB", [{
        title: 'Lina',
        contentNode: linaImage,
        onRenderCallback: function(widget) {
            linaImage.style.setProperty("height", (widget.contentHeight - 5) + "px");
            linaImage.style.setProperty("max-width", widget.width + "px");
        }
    }, {
        title: 'Mahdy',
        contentNode: mahdyImage,
        onRenderCallback: function(widget) {
            mahdyImage.style.setProperty("height", (widget.contentHeight - 5) + "px");
            mahdyImage.style.setProperty("max-width", widget.width + "px");
        }
    }]);

    const smartFramesWidget = new Widget("smartFrames", [{
        title: 'Smartframes',
        contentNode: createDiv(`<div id="smartframes" class="smartframes-text"><span class="emphasize">Smartframes</span>
					 is a javascript library that allows for flexible rendering of content on heavy web pages.
					 As users tend to have larger screens, and single page application are getting more popular,
					 there will be more need for better organization and consumption of content in such web applications.
					 Smartframes renders various frames on the page, with each frame having several tabs.
					 You can easily move tabs inside a frame or drag them from one frame to the other.
					 The frames can also be easily resized to fit user needs. Try Smartframes down below, and let me know what you think!</div>`),
        onRenderCallback: function(widget) {
            const sfDiv = document.getElementById("smartframes");
            if (sfDiv) {
                sfDiv.style.setProperty("height", (widget.contentHeight - 5) + "px");
                sfDiv.style.setProperty("max-width", widget.width + "px");
            }
        }
    }]);

    const screenSizeTrendImage = createImage("/resources/images/screen-size-trend.png");

    const screenSizeAndSPAWidget = new Widget("screenSizeAndSPAWidget", [{
        title: 'screen size trend',
        contentNode: screenSizeTrendImage,
        onRenderCallback: function(widget) {
            screenSizeTrendImage.style.setProperty("height", (widget.contentHeight - 5) + "px");
            screenSizeTrendImage.style.setProperty("max-width", widget.width + "px");
        }
    }, {
        title: 'SPA',
        contentNode: createDiv(`<div id="SPA" class="spa-text">A <span class="emphasize">single-page application (SPA)</span> is a web application or web site that interacts with the user
			 by dynamically rewriting the current page rather than loading entire new pages from a server.
			 This approach avoids interruption of the user experience between successive pages,
			 making the application behave more like a desktop application. In an SPA, either all necessary code
			 – HTML, JavaScript, and CSS – is retrieved with a single page load,[1] or the appropriate resources are dynamically loaded and added to the page as necessary,
			 usually in response to user actions. The page does not reload at any point in the process, nor does control transfer to another page,
			 although the location hash or the HTML5 History API can be used to provide the perception and navigability of separate logical pages in the application.
			 [2] Interaction with the single page application often involves dynamic communication with the web server behind the scenes.</div>`),
        onRenderCallback: function(widget) {
            const spaDiv = document.getElementById("SPA");
            if (spaDiv) {
                spaDiv.style.setProperty("height", (widget.contentHeight - 5) + "px");
                spaDiv.style.setProperty("max-width", widget.width + "px");
            }
        }
    }, ]);


    const widgetPlaceholder1 = new Widget("widgetPlaceholder1", [{
        title: 'widgetPlaceholder1'
    }]);

    const widgetPlaceholder2 = new Widget("widgetPlaceholder2", [{
        title: 'widgetPlaceholder2'
    }]);

    const widgetContainer5 = new WidgetContainer([widgetPlaceholder1], CONSTANTS.LEFT_TO_RIGHT);
    const widgetContainer2 = new WidgetContainer([widgetB, widgetContainer5, widgetPlaceholder2], CONSTANTS.LEFT_TO_RIGHT);
    widgetContainer2.childrenRatios = [0.25, 0.5, 0.25];

    const widgetContainer3 = new WidgetContainer([widgetContainer2], CONSTANTS.LEFT_TO_RIGHT);
    const widgetContainer4 = new WidgetContainer([smartFramesWidget, screenSizeAndSPAWidget], CONSTANTS.LEFT_TO_RIGHT);
    widgetContainer4.childrenRatios = [0.75, 0.25];

    const topLevelContainer = new WidgetContainer([widgetContainer4, widgetContainer3], CONSTANTS.TOP_TO_BOTTOM);
    const widgetTabDragController = new WidgetTabDragController(topLevelContainer);
    const widgetResizeController = new WidgetResizeController(topLevelContainer);

    widgetB.widgetContainer = widgetContainer2;
    widgetPlaceholder1.widgetContainer = widgetContainer5;
    widgetPlaceholder2.widgetContainer = widgetContainer2;

    smartFramesWidget.widgetContainer = widgetContainer4;
    screenSizeAndSPAWidget.widgetContainer = widgetContainer4;

    widgetContainer2.parentWidgetContainer = widgetContainer3;
    widgetContainer3.parentWidgetContainer = topLevelContainer;
    widgetContainer4.parentWidgetContainer = topLevelContainer;
    widgetContainer5.parentWidgetContainer = widgetContainer2;
    topLevelContainer.parentWidgetContainer = null;

    function onResize() {
        const width = window.innerWidth - 50;
        const height = window.innerHeight - 50;
        const left = 10;
        const top = 10;

        topLevelContainer.left = left;
        topLevelContainer.top = top;
        topLevelContainer.width = width;
        topLevelContainer.height = height;

        topLevelContainer.render(appDiv);
    };

    window.onresize = onResize;
    onResize();
}