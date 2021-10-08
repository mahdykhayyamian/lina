const LocationDropdownWidth = 250;

const LocationDropdown = function(parentDiv, options, idProp, onChange) {
	this.parentDiv = parentDiv;
	this.options = options;
	this.onChange = onChange;
	this.idProp = idProp;
};

LocationDropdown.prototype.render = function() {
	const dropdown = createDOM(this);
	this.parentDiv.appendChild(dropdown);
};

LocationDropdown.prototype.remove = function() {
	this.dropdownRootDiv.remove();
	document.body.removeEventListener('click', this.clickHandler);
};

function createDOM(locationDropdown) {
	locationDropdown.dropdownRootDiv = document.createElement('div');
	locationDropdown.dropdownRootDiv.setAttribute('class', 'location-dropdown');

	locationDropdown.dropdownRootDiv.style.setProperty(
		'left',
		locationDropdown.left + 'px'
	);
	locationDropdown.dropdownRootDiv.style.setProperty(
		'top',
		locationDropdown.top + 'px'
	);
	locationDropdown.dropdownRootDiv.style.setProperty(
		'width',
		LocationDropdownWidth + 'px'
	);

	const dropdownHeaderDiv = document.createElement('div');
	dropdownHeaderDiv.setAttribute('class', 'dropdown-header');

	locationDropdown.dropdownRootDiv.appendChild(dropdownHeaderDiv);

	const searchBox = document.createElement('input');
	searchBox.setAttribute('type', 'text');
	searchBox.setAttribute('placeholder', 'Search Location...');

	const matchingOptions = locationDropdown.options.filter(option =>
		option.name.toLowerCase().startsWith(searchBox.value.toLowerCase())
	);

	searchBox.addEventListener('keyup', event => {
		if (searchBox.value !== '') {
			updateMachingOptions(locationDropdown, matchingOptions);
		} else {
			updateMachingOptions(locationDropdown, locationDropdown.options);
		}
	});

	locationDropdown.searchBox = searchBox;
	dropdownHeaderDiv.appendChild(searchBox);

	const dropDownIcon = document.createElement('img');
	dropDownIcon.src = '/src/resources/icons/drop-down.png';
	dropDownIcon.setAttribute('class', 'drag-down');
	dropDownIcon.addEventListener('click', event => {
		updateMachingOptions(locationDropdown, matchingOptions);
	});

	dropdownHeaderDiv.appendChild(dropDownIcon);

	locationDropdown.matchingOptionsRoot = document.createElement('ul');
	locationDropdown.dropdownRootDiv.appendChild(
		locationDropdown.matchingOptionsRoot
	);

	return locationDropdown.dropdownRootDiv;
}

function updateMachingOptions(locationDropdown, matchingOptions) {
	removeMatchingOptions(locationDropdown);

	for (let i = 0; i < matchingOptions.length; i++) {
		const option = matchingOptions[i];
		const optionItem = document.createElement('li');
		console.log(option);
		console.log(locationDropdown.idProp);
		optionItem.setAttribute('id', option[locationDropdown.idProp]);
		optionItem.setAttribute('type', option.type);
		optionItem.innerText = option.name;

		optionItem.addEventListener('mousemove', event => {
			event.target.classList.add('selected');
		});

		optionItem.addEventListener('mouseleave', event => {
			event.target.classList.remove('selected');
		});

		optionItem.addEventListener('click', event => {
			console.log('clicked...');
			console.log(event.target);
			removeMatchingOptions(locationDropdown);
			locationDropdown.searchBox.value = event.target.textContent;
			console.log(locationDropdown);
			locationDropdown.onChange(event.target.id);
		});

		locationDropdown.matchingOptionsRoot.appendChild(optionItem);
	}
}

function removeMatchingOptions(locationDropdown) {
	while (locationDropdown.matchingOptionsRoot.firstChild) {
		locationDropdown.matchingOptionsRoot.removeChild(
			locationDropdown.matchingOptionsRoot.firstChild
		);
	}
}

export { LocationDropdown };
require('src/climate/location-dropdown.css');
