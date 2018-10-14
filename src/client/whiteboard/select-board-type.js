const BoardTypeSelector =  function (left, top) {
	this.left = left;
	this.top = top;

	this.options = [{
		value: "bar-chart",
		label: "Bar Chart"
	}, {
		value: 'simple-shapes',
		label: 'Simple Shapes'
	}, {
		value: 'graph',
		label: 'Graph'
	}, {
		value: 'sequence-diagram',
		label: 'Sequence Diagram'
	}];
};

function createDOM (boardTypeSelector) {

	const selectorRootDiv = document.createElement("div");
	selectorRootDiv.setAttribute("class", "board-type-select");

	selectorRootDiv.style.setProperty("left", boardTypeSelector.left + "px");
	selectorRootDiv.style.setProperty("top", boardTypeSelector.top + "px");

	const listElem = document.createElement("ul");
	selectorRootDiv.appendChild(listElem);

	for (let i=0; i<boardTypeSelector.options.length; i++) {
		const option = boardTypeSelector.options[i];
		const listItem = document.createElement("li");
		listItem.setAttribute("id", option.value);
		listItem.innerText = option.label;
		listElem.appendChild(listItem);
	}

	return selectorRootDiv;
}

BoardTypeSelector.prototype.render = function() {
	const selector = createDOM(this);
	document.body.appendChild(selector);
};
     
export {BoardTypeSelector};
require("whiteboard/select-board-type.css")