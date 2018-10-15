const BoardTypeSelector =  function (left, top, width) {

	this.left = left;
	this.top = top;
	this.width = width;

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
	selectorRootDiv.style.setProperty("width", boardTypeSelector.width + "px");

	const searchBox = document.createElement("input");
	searchBox.setAttribute("type", "text");
	searchBox.setAttribute("placeholder", "Search for Board Type...");
	selectorRootDiv.appendChild(searchBox);

	const options = document.createElement("ul");
	selectorRootDiv.appendChild(options);

	for (let i=0; i<boardTypeSelector.options.length; i++) {
		const option = boardTypeSelector.options[i];
		const optionItem = document.createElement("li");
		optionItem.setAttribute("id", option.value);
		optionItem.innerText = option.label;

		optionItem.addEventListener("mousemove", (event) => {
			console.log(event.target);
			event.target.classList.add("selected");
		});

		optionItem.addEventListener("mouseleave", (event) => {
			console.log(event.target);
			event.target.classList.remove("selected");
		});

		options.appendChild(optionItem);
	}

	return selectorRootDiv;
}

BoardTypeSelector.prototype.render = function() {
	const selector = createDOM(this);
	document.body.appendChild(selector);
};
     
export {BoardTypeSelector};
require("whiteboard/select-board-type.css")