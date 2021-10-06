const LocationDropdownWidth = 250;

const LocationDropdown = function(parentDiv, stations) {
	this.parentDiv = parentDiv;
	this.stations = stations;
	this.options = stations;
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

	const searchBox = document.createElement('input');
	searchBox.setAttribute('type', 'text');
	searchBox.setAttribute('placeholder', 'Search Location...');

	searchBox.addEventListener('keyup', event => {
		if (searchBox.value !== '') {
			const matchingOptions = LocationDropdown.options.filter(option =>
				option.name
					.toLowerCase()
					.startsWith(searchBox.value.toLowerCase())
			);
			updateMachingOptions(locationDropdown, matchingOptions);
		} else {
			updateMachingOptions(locationDropdown, locationDropdown.options);
		}
	});

	locationDropdown.searchBox = searchBox;
	locationDropdown.dropdownRootDiv.appendChild(searchBox);

	locationDropdown.matchingOptionsRoot = document.createElement('ul');
	locationDropdown.dropdownRootDiv.appendChild(
		locationDropdown.matchingOptionsRoot
	);

	updateMachingOptions(locationDropdown, locationDropdown.options);

	return locationDropdown.dropdownRootDiv;
}

function updateMachingOptions(locationDropdown, matchingOptions) {
	removeMatchingOptions(locationDropdown);

	for (let i = 0; i < matchingOptions.length; i++) {
		const option = matchingOptions[i];
		const optionItem = document.createElement('li');
		optionItem.setAttribute('id', option.id);
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
