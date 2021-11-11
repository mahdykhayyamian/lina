import 'regenerator-runtime/runtime.js';

import * as d3 from 'd3';
import ajax from '@fdaciuk/ajax';
import * as ss from 'simple-statistics';
import dateFormat from 'dateformat';
import { Dropdown } from 'src/common/dropdown.mobile.js';

window.onload = async function() {
	let searchParams = new URLSearchParams(window.location.search);

	let stationCode = searchParams.get('stationCode');
	let month = searchParams.get('month');

	const request = ajax({
		headers: {
			'content-type': 'application/json'
		}
	});

	const stations = await request.get(`/api/climate/getStations`);
	console.log(stations);

	const filtersDiv = document.getElementById('filters');
	const locationDropdown = new Dropdown(
		filtersDiv,
		stations,
		'Select Location...',
		'code',
		code => {
			stationCode = code;
			insertUrlParam('stationCode', stationCode);
		},
		stationCode
	);

	locationDropdown.render();
};

function insertUrlParam(key, value) {
	if (history.pushState) {
		let searchParams = new URLSearchParams(window.location.search);
		searchParams.set(key, value);
		let newurl =
			window.location.protocol +
			'//' +
			window.location.host +
			window.location.pathname +
			'?' +
			searchParams.toString();
		window.history.pushState({ path: newurl }, '', newurl);
	}
}
