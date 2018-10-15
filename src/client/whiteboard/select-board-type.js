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

BoardTypeSelector.prototype.render = function() {
	const selector = createDOM(this);
	document.body.appendChild(selector);
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

	searchBox.addEventListener("keyup", (event) => {
		console.log(event);
		console.log("searchBox.value = " + searchBox.value);
		if (searchBox.value !== "") {
			const matchingOptions = boardTypeSelector.options.filter(option	=> option.label.toLowerCase().startsWith(searchBox.value.toLowerCase()));
			console.log(matchingOptions);
			updateMachingOptions(boardTypeSelector, matchingOptions);
		} else {
			updateMachingOptions(boardTypeSelector, boardTypeSelector.options);
		}
	});

	selectorRootDiv.appendChild(searchBox);

	boardTypeSelector.matchingOptionsRoot = document.createElement("ul");
	selectorRootDiv.appendChild(boardTypeSelector.matchingOptionsRoot);

	updateMachingOptions(boardTypeSelector, boardTypeSelector.options);

	return selectorRootDiv;
}

function updateMachingOptions(boardTypeSelector, matchingOptions) {

	removeMatchingOptions(boardTypeSelector);

	for (let i=0; i<matchingOptions.length; i++) {
		const option = matchingOptions[i];
		const optionItem = document.createElement("li");
		optionItem.setAttribute("id", option.value);
		optionItem.innerText = option.label;

		optionItem.addEventListener("mousemove", (event) => {
			event.target.classList.add("selected");
		});

		optionItem.addEventListener("mouseleave", (event) => {
			event.target.classList.remove("selected");
		});

		boardTypeSelector.matchingOptionsRoot.appendChild(optionItem);
	}
}

function removeMatchingOptions(boardTypeSelector) {
    while (boardTypeSelector.matchingOptionsRoot.firstChild) {
        boardTypeSelector.matchingOptionsRoot.removeChild(boardTypeSelector.matchingOptionsRoot.firstChild);
    }
}

export {BoardTypeSelector};
require("whiteboard/select-board-type.css")