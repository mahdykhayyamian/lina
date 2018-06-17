import { Widget } from "smartframes";

const instructorWidget = new Widget("instructorWidget", [{
    title: 'instructions',
}, {
    title: 'orange'
}, {
    title: 'navyblue'
}]);

const tabContent = document.createElement("div");

// create brace
const braceImg = document.createElement("img");
braceImg.src = "/resources/icons/Accolade_dessous.png";
braceImg.setAttribute("class", "brace");
const braceDiv = document.createElement("div");
braceDiv.appendChild(braceImg);

// shuffle tab text
const shuffleTabsTextDiv = document.createElement("div");
shuffleTabsTextDiv.textContent = "Shuffle tabs!";
shuffleTabsTextDiv.setAttribute("class", "shuffle-tabs-txt");
braceDiv.appendChild(shuffleTabsTextDiv);
tabContent.appendChild(braceDiv);

// create drag down image
const dragDownImg = document.createElement("img");
dragDownImg.src = "/resources/icons/drag-down.png";
dragDownImg.setAttribute("class", "drag-down");
const dragDownDiv = document.createElement("div");
dragDownDiv.appendChild(dragDownImg);

// drag down text
const dragDownTextDiv = document.createElement("div");
dragDownTextDiv.textContent = "Drag this tab and drop it on some other frame!";
dragDownTextDiv.setAttribute("class", "drag-tab-txt");
dragDownDiv.appendChild(dragDownTextDiv);
tabContent.appendChild(dragDownDiv);

// create resize left image
const resizeLeftImg = document.createElement("img");
resizeLeftImg.src = "/resources/icons/resize-left.png";
resizeLeftImg.setAttribute("class", "resize-left");
const resizeLeftDiv = document.createElement("div");
resizeLeftDiv.appendChild(resizeLeftImg);
tabContent.appendChild(resizeLeftDiv);

// resize left text
const resizeLeftTextDiv = document.createElement("div");
resizeLeftTextDiv.textContent = "Drag left to resize!";
resizeLeftTextDiv.setAttribute("class", "resize-left-txt");
tabContent.appendChild(resizeLeftTextDiv);

// create resize right image
const resizeRightImg = document.createElement("img");
resizeRightImg.src = "/resources/icons/resize-right.png";
resizeRightImg.setAttribute("class", "resize-right");
const resizeRightDiv = document.createElement("div");
resizeRightDiv.appendChild(resizeRightImg);
tabContent.appendChild(resizeRightDiv);

// resize right text
const resizeRightTextDiv = document.createElement("div");
resizeRightTextDiv.textContent = "Drag right to resize!";
resizeRightTextDiv.setAttribute("class", "resize-right-txt");
tabContent.appendChild(resizeRightTextDiv);


const renderInstructions = function(widget) {
    if (widget.tabs.length >= 2) {
        braceDiv.style.setProperty("display", "block");
        braceImg.style.setProperty("width", widget.getTabSize() * 2 + "px");
        braceImg.style.setProperty("height", "30px");
    } else {
        braceDiv.style.setProperty("display", "none");
    }

    if (widget.tabs.length >= 3) {
        dragDownDiv.style.setProperty("display", "block");
        dragDownImg.style.setProperty("left", widget.getTabSize() * 2.2 + "px");
        dragDownTextDiv.style.setProperty("left", widget.getTabSize() * 2 + "px");
    } else {
        dragDownDiv.style.setProperty("display", "none");
    }

    resizeLeftImg.style.setProperty("top", widget.contentHeight / 2 + "px");
    resizeLeftTextDiv.style.setProperty("top", widget.contentHeight / 2 + 10 + "px");

    resizeRightImg.style.setProperty("top", widget.contentHeight * 2 / 3 + "px");
    resizeRightTextDiv.style.setProperty("top", widget.contentHeight * 2 / 3 + 10 + "px");
};

// set tabs content
instructorWidget.tabs[0].contentNode = tabContent;
instructorWidget.tabs[0].onRenderCallback = renderInstructions;

const orangeDiv = document.createElement("div");
orangeDiv.setAttribute("class", "orange");
orangeDiv.style.setProperty("width", "100%");
orangeDiv.style.setProperty("height", "100%");    
instructorWidget.tabs[1].contentNode = orangeDiv;

const navyblueDiv = document.createElement("div");
navyblueDiv.setAttribute("class", "navy-blue")
navyblueDiv.style.setProperty("width", "100%");
navyblueDiv.style.setProperty("height", "100%");    
instructorWidget.tabs[2].contentNode = navyblueDiv;


export { instructorWidget };
require("demo/smartframes/demo.css")