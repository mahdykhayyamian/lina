const Dropdown = function(
	parentDiv,
	options,
	placeholder,
	idProp,
	onChange,
	selectedId,
	width
) {
	this.parentDiv = parentDiv;
	this.options = options;
	this.placeholder = placeholder;
	this.onChange = onChange;
	this.idProp = idProp;
	this.selectedId = selectedId;
	this.width = width;
};

Dropdown.prototype.render = function() {
	const dropdown = createDOM(this);
	this.parentDiv.appendChild(dropdown);
};

Dropdown.prototype.remove = function() {
	this.dropdownRootDiv.remove();
	document.body.removeEventListener('click', this.clickHandler);
};

function createDOM(dropdown) {
	dropdown.dropdownRootDiv = document.createElement('div');
	dropdown.dropdownRootDiv.setAttribute('class', 'dropdown');

	dropdown.dropdownRootDiv.style.setProperty('left', dropdown.left + 'px');
	dropdown.dropdownRootDiv.style.setProperty('top', dropdown.top + 'px');
	dropdown.dropdownRootDiv.style.setProperty('width', dropdown.width + 'px');

	const dropdownHeaderDiv = document.createElement('div');
	dropdownHeaderDiv.setAttribute('class', 'dropdown-header');

	dropdownHeaderDiv.addEventListener('click', event => {
		updateMachingOptions(dropdown, matchingOptions);
	});

	dropdown.dropdownRootDiv.appendChild(dropdownHeaderDiv);

	const searchBox = document.createElement('input');
	searchBox.setAttribute('type', 'text');
	searchBox.setAttribute('placeholder', dropdown.placeholder);

	let matchingOptions = dropdown.options.filter(option =>
		option.name.toLowerCase().startsWith(searchBox.value.toLowerCase())
	);

	searchBox.addEventListener('keyup', event => {
		matchingOptions = dropdown.options.filter(option =>
			option.name.toLowerCase().startsWith(searchBox.value.toLowerCase())
		);

		if (searchBox.value !== '') {
			updateMachingOptions(dropdown, matchingOptions);
		} else {
			updateMachingOptions(dropdown, dropdown.options);
		}
	});

	dropdown.searchBox = searchBox;
	dropdownHeaderDiv.appendChild(searchBox);

	const dropDownIcon = document.createElement('img');
	dropDownIcon.src = '/src/resources/icons/drop-down.png';
	dropDownIcon.setAttribute('class', 'drag-down');

	dropdownHeaderDiv.appendChild(dropDownIcon);

	dropdown.matchingOptionsRoot = document.createElement('ul');
	dropdown.dropdownRootDiv.appendChild(dropdown.matchingOptionsRoot);

	// preselect if passed
	if (dropdown.selectedId) {
		const selectedOption = dropdown.options.find(
			option => option[dropdown.idProp] == dropdown.selectedId
		);

		if (selectedOption) {
			dropdown.searchBox.value = selectedOption.name;
		}
	}

	registerClickOutOfSelectorEventListner(dropdown);

	return dropdown.dropdownRootDiv;
}

function registerClickOutOfSelectorEventListner(dropdown) {
	const handler = function(event) {
		if (!event.target.closest('.dropdown')) {
			removeMatchingOptions(dropdown);
		}
	};

	// wrapping in setTimeout to avoid removing immediately after adding the selector.
	setTimeout(() => {
		document.body.addEventListener('click', handler);
	}, 0);
}

function updateMachingOptions(dropdown, matchingOptions) {
	removeMatchingOptions(dropdown);

	for (let i = 0; i < matchingOptions.length; i++) {
		const option = matchingOptions[i];
		const optionItem = document.createElement('li');
		optionItem.setAttribute('id', option[dropdown.idProp]);
		optionItem.setAttribute('type', option.type);
		optionItem.innerText = option.name;

		optionItem.addEventListener('mousemove', event => {
			event.target.classList.add('selected');
		});

		optionItem.addEventListener('mouseleave', event => {
			event.target.classList.remove('selected');
		});

		optionItem.addEventListener('click', event => {
			removeMatchingOptions(dropdown);
			dropdown.searchBox.value = event.target.textContent;
			dropdown.onChange(event.target.id);
		});

		dropdown.matchingOptionsRoot.appendChild(optionItem);
	}
}

function removeMatchingOptions(dropdown) {
	while (dropdown.matchingOptionsRoot.firstChild) {
		dropdown.matchingOptionsRoot.removeChild(
			dropdown.matchingOptionsRoot.firstChild
		);
	}
}

export { Dropdown };
require('src/common/dropdown.css');
