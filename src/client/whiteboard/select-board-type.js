const BoardTypeSelector =  function (parent, width, onSelectCallback) {

	this.parent = parent;
	this.width = width;
	this.onSelectCallback = onSelectCallback;
	this.shown = false;

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
	console.log("inside render");
	const selector = createDOM(this);
	this.parent.appendChild(selector);
	this.shown = true;

	registerClickOutOfSelectorEventListner(this);
};

BoardTypeSelector.prototype.remove = function() {
    this.selectorRootDiv.remove();
    document.body.removeEventListener("click", this.clickHandler);
    this.shown = false;
};

BoardTypeSelector.prototype.isShown = function() {
	return this.shown;
};

function createDOM (boardTypeSelector) {

	boardTypeSelector.selectorRootDiv = document.createElement("div");
	boardTypeSelector.selectorRootDiv.setAttribute("class", "board-type-select");

	boardTypeSelector.selectorRootDiv.style.setProperty("left", boardTypeSelector.left + "px");
	boardTypeSelector.selectorRootDiv.style.setProperty("top", boardTypeSelector.top + "px");
	boardTypeSelector.selectorRootDiv.style.setProperty("width", boardTypeSelector.width + "px");

	const searchBox = document.createElement("input");
	searchBox.setAttribute("type", "text");
	searchBox.setAttribute("placeholder", "Search Content Type...");

	searchBox.addEventListener("keyup", (event) => {
		if (searchBox.value !== "") {
			const matchingOptions = boardTypeSelector.options.filter(option	=> option.label.toLowerCase().startsWith(searchBox.value.toLowerCase()));
			console.log(matchingOptions);
			updateMachingOptions(boardTypeSelector, matchingOptions);
		} else {
			updateMachingOptions(boardTypeSelector, boardTypeSelector.options);
		}
	});

	boardTypeSelector.selectorRootDiv.appendChild(searchBox);

	boardTypeSelector.matchingOptionsRoot = document.createElement("ul");
	boardTypeSelector.selectorRootDiv.appendChild(boardTypeSelector.matchingOptionsRoot);

	updateMachingOptions(boardTypeSelector, boardTypeSelector.options);

	return boardTypeSelector.selectorRootDiv;
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

		optionItem.addEventListener("click", (event) => {
			removeMatchingOptions(boardTypeSelector);
			console.log(event.target.id);
			boardTypeSelector.onSelectCallback(event.target.id);
		});

		boardTypeSelector.matchingOptionsRoot.appendChild(optionItem);
	}
}

function removeMatchingOptions(boardTypeSelector) {
    while (boardTypeSelector.matchingOptionsRoot.firstChild) {
        boardTypeSelector.matchingOptionsRoot.removeChild(boardTypeSelector.matchingOptionsRoot.firstChild);
    }
}


function registerClickOutOfSelectorEventListner(boardTypeSelector) {

	boardTypeSelector.clickHandler = function(event) {

		// remove selector if click was outside of the selector
		if (!event.target.closest(".board-type-select")) {
			boardTypeSelector.remove();
		}
	}

	// wrapping in setTimeout to avoid removing immediately after adding the selector.
	setTimeout(() => {
		document.body.addEventListener("click", boardTypeSelector.clickHandler);
	}, 0);
}

export {BoardTypeSelector};
require("whiteboard/select-board-type.css")