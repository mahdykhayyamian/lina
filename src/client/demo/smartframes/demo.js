import {Widget} from "layout/widget/widget.js";
import {Pencil} from "toolbox/pencil.js";
import {WidgetContainer} from "layout/widget-container.js";
import {WidgetTabDragController} from "layout/widget-tab-drag-controller.js";
import {WidgetResizeController} from "layout/widget-resize-controller.js";
import {CONSTANTS} from "layout/constants.js";

window.onload = function () {

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

	const widgetA = new Widget("widgetA",
		[{
			title: 'Mahdy',
			contentNode: mahdyImage,
			onRenderCallback: function(widget) {
				mahdyImage.style.setProperty("height", (widget.contentHeight - 5) + "px");
				mahdyImage.style.setProperty("max-width", widget.width + "px");
			}
		},{
			title: 'Niki',
			contentNode: createTextDiv('mish mish mikh mikh mahan!') 
		},{
			title: 'Pencil',
			contentNode: createPencilNode()
		}]
	);

	const linaImage = createImage("/resources/images/lina.jpg");

	const widgetB = new Widget("widgetB",
		[{
			title: 'Lina',
			contentNode: linaImage,
			onRenderCallback: function(widget) {
				linaImage.style.setProperty("height", (widget.contentHeight - 5) + "px");
				linaImage.style.setProperty("max-width", widget.width + "px");
			}
		},{
			title: 'Mehrkish',
			contentNode: createTextDiv('Mehrkish!'),
		}]);

	const widgetC = new Widget("widgetC", 
		[{
			title: 'Judy',
			contentNode: createTextDiv('Jon Jon Jon')
		},{
			title: 'Home',
		}
	]);

	const widgetD = new Widget("widgetD", 
		[{
			title: 'Hashem'		
		}
	]);

	const smartFramesWidget = new Widget("smartFrames", 
		[{
			title: 'Smartframes',
			contentNode: createDiv(`<div id="description"><span class="emphasize">Smartframes</span>
					 is a javascript library that allows for flexible rendering of content on heavy web pages.
					 As users tend to have larger screens, and single page application are getting more popular,
					 there will be more need for better organization and consumption of content in such web applications.
					 Smartframes renders various frames on the page, with each frame having several tabs.
					 You can easily move tabs inside a frame or drag them from one frame to the other.
					 The frames can also be easily resized to fit user needs. Try Smartframes down below, and let me know what you think!</div>`)	
		}
	]);

	const screenSizeTrendImage = createImage("/resources/images/screen-size-trend.png");

	const screenSizeWidget = new Widget("screenSizeWidget", 
		[{
			title: 'screen size trend',
			contentNode: screenSizeTrendImage,
			onRenderCallback: function(widget) {
				screenSizeTrendImage.style.setProperty("height", (widget.contentHeight - 5) + "px");
				screenSizeTrendImage.style.setProperty("max-width", widget.width + "px");
			}		
		}
	]);


	const singlePageApplicationWidget = new Widget("SinglePageAppWidget",
		[{
			title: 'SPA',
			contentNode: createDiv(`<div id="description">A <span class="emphasize">single-page application (SPA)</span> is a web application or web site that interacts with the user
			 by dynamically rewriting the current page rather than loading entire new pages from a server.
			 This approach avoids interruption of the user experience between successive pages,
			 making the application behave more like a desktop application. In an SPA, either all necessary code
			 – HTML, JavaScript, and CSS – is retrieved with a single page load,[1] or the appropriate resources are dynamically loaded and added to the page as necessary,
			 usually in response to user actions. The page does not reload at any point in the process, nor does control transfer to another page,
			 although the location hash or the HTML5 History API can be used to provide the perception and navigability of separate logical pages in the application.
			 [2] Interaction with the single page application often involves dynamic communication with the web server behind the scenes.</div>`)
		}
	]);

	const widgetContainer1 = new WidgetContainer([widgetC, widgetD], CONSTANTS.TOP_TO_BOTTOM);
	const widgetContainer2 = new WidgetContainer([widgetB, widgetContainer1], CONSTANTS.LEFT_TO_RIGHT);
	const widgetContainer3 = new WidgetContainer([widgetA, widgetContainer2], CONSTANTS.LEFT_TO_RIGHT);
	const widgetContainer4 = new WidgetContainer([smartFramesWidget, screenSizeWidget, singlePageApplicationWidget], CONSTANTS.LEFT_TO_RIGHT);

	const topLevelContainer = new WidgetContainer([widgetContainer4, widgetContainer3], CONSTANTS.TOP_TO_BOTTOM);
	const widgetTabDragController = new WidgetTabDragController(topLevelContainer);
	const widgetResizeController = new WidgetResizeController(topLevelContainer);

	widgetA.widgetContainer = widgetContainer3;
	widgetB.widgetContainer = widgetContainer2;
	widgetC.widgetContainer = widgetContainer1;
	widgetD.widgetContainer = widgetContainer1;
	smartFramesWidget.widgetContainer = widgetContainer4;
	screenSizeWidget.widgetContainer = widgetContainer4;
	singlePageApplicationWidget.widgetContainer = widgetContainer4;

	widgetContainer1.parentWidgetContainer = widgetContainer2;
	widgetContainer2.parentWidgetContainer = widgetContainer3;
	widgetContainer3.parentWidgetContainer = topLevelContainer;
	widgetContainer4.parentWidgetContainer = topLevelContainer;
	topLevelContainer.parentWidgetContainer = null;

	function onResize() {
		const width = window.innerWidth  - 50;
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