import 'regenerator-runtime/runtime.js';

import * as d3 from 'd3';
import ajax from '@fdaciuk/ajax';
import * as ss from 'simple-statistics';
import dateFormat from 'dateformat';
import { Dropdown } from 'src/climate/dropdown.js';

const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

window.onload = async function() {
	let searchParams = new URLSearchParams(window.location.search);

	let stationCode = searchParams.get('stationCode');
	const month = searchParams.get('month');
	const day = searchParams.get('day');

	let dayAndMonth = new Date();
	dayAndMonth.setDate(day);
	dayAndMonth.setMonth(month - 1);

	dayAndMonth = dateFormat(dayAndMonth, 'mmm, dd');

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
		'code',
		code => {
			stationCode = code;
			insertUrlParam('stationCode', stationCode);
			removeCharts();
			drawCharts();
		},
		stationCode
	);

	locationDropdown.render();

	drawCharts();

	async function drawCharts() {
		const stationMap = {};
		for (let i = 0; i < stations.length; i++) {
			stationMap[stations[i].code] = stations[i];
		}

		const currentStation = stationMap[stationCode];
		const chartsDiv = document.getElementById('charts');

		let measures = null;
		if (day) {
			measures = await request.get(
				`/api/climate/getYearlyTrends?stationCode=${stationCode}&month=${month}&day=${day}`
			);

			// min daily temp
			const minTempChartDiv = document.createElement('div');
			minTempChartDiv.id = 'minTempChart';
			chartsDiv.append(minTempChartDiv);

			let lineData = getLineDate(measures, 'day', 'min');
			console.log(lineData);

			drawLineChart(
				lineData,
				`${currentStation.name} Min Daily Temperature Historical Trend on ${dayAndMonth}`,
				minTempChartDiv
			);

			// max daily temp
			const maxTempChartDiv = document.createElement('div');
			maxTempChartDiv.id = 'maxTempChart';
			chartsDiv.append(maxTempChartDiv);

			lineData = getLineDate(measures, 'day', 'max');
			console.log(lineData);

			drawLineChart(
				lineData,
				`${currentStation.name} Max Daily Temperature Historical Trend on ${dayAndMonth}`,
				minTempChartDiv
			);
		} else {
			measures = await request.get(
				`/api/climate/getYearlyTrends?stationCode=${stationCode}&month=${month}`
			);

			// monthly avg of min daily temp
			const avgMinDailyTempChartDiv = document.createElement('div');
			avgMinDailyTempChartDiv.id = 'minTempChart';
			chartsDiv.append(avgMinDailyTempChartDiv);

			let lineData = getLineDate(measures, 'month', 'min');

			drawLineChart(
				lineData,
				`${
					currentStation.name
				} Avg Min Daily Temperature Historical Trend Month of ${
					monthNames[month - 1]
				}`,
				avgMinDailyTempChartDiv
			);

			// monthly avg of max daily temp
			const avgMaxDailyTempChartDiv = document.createElement('div');
			avgMaxDailyTempChartDiv.id = 'maxTempChart';
			chartsDiv.append(avgMaxDailyTempChartDiv);

			lineData = getLineDate(measures, 'month', 'max');

			drawLineChart(
				lineData,
				`${
					currentStation.name
				} Avg Max Daily Temperature Historical Trend for The Month of ${
					monthNames[month - 1]
				}`,
				avgMaxDailyTempChartDiv
			);
		}
	}

	function removeCharts() {
		let node = document.getElementById('minTempChart');
		node.parentNode.removeChild(node);

		node = document.getElementById('maxTempChart');
		node.parentNode.removeChild(node);
	}
};

function getLineDate(measures, compareBy, minOrMax) {
	let lineData = measures.map(measure => {
		let value;
		let date;

		if (compareBy === 'day') {
			date = d3.timeParse('%b %d, %Y')(measure.date);
			value = minOrMax === 'min' ? measure.minTemp : measure.maxTemp;
		} else {
			date = d3.timeParse('%Y')(measure.year);
			value =
				minOrMax === 'min'
					? measure.avgMinDailyTemp
					: measure.avgMaxDailyTemp;
		}

		value = Number(value.toFixed(1));

		return {
			date,
			value
		};
	});

	lineData = lineData.filter(d => d.value > 0);
	lineData.sort(function(a, b) {
		return new Date(b.date) - new Date(a.date);
	});

	return lineData;
}

function drawLineChart(lineData, title, parentDiv) {
	var height = 600;
	var width = 1400;
	var hEach = 40;

	var margin = { top: 40, right: 60, bottom: 100, left: 40 };

	width = width - margin.left - margin.right;
	height = height - margin.top - margin.bottom;

	var svg = d3
		.select(`#${parentDiv.id}`)
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	// set the ranges
	var x = d3.scaleTime().range([0, width]);
	x.domain(
		d3.extent(lineData, function(d) {
			return d.date;
		})
	);

	var y = d3.scaleLinear().range([height, 0]);

	y.domain([
		d3.min(lineData, function(d) {
			return d.value;
		}) - 5,
		d3.max(lineData, function(d) {
			return d.value;
		}) + 5
	]);

	var valueline = d3
		.line()
		.x(function(d) {
			return x(d.date);
		})
		.y(function(d) {
			return y(d.value);
		})
		.curve(d3.curveMonotoneX);

	svg.append('path')
		.data([lineData])
		.attr('class', 'line')
		.attr('d', valueline);

	var xAxis = d3
		.axisBottom(x)
		.tickFormat(date => {
			const year = date.getFullYear();
			if (year % 5 == 0) {
				return year;
			} else {
				return '';
			}
		})
		.tickValues(lineData.map(d => d.date));

	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + height + ')')
		.call(xAxis)
		.selectAll('text')
		.style('text-anchor', 'end')
		.attr('dx', '-.8em')
		.attr('dy', '.15em')
		.attr('transform', 'rotate(-75)');

	svg.append('g').call(d3.axisLeft(y));

	svg.selectAll('.dot')
		.data(lineData)
		.enter()
		.append('circle') // Uses the enter().append() method
		.attr('class', 'dot') // Assign a class for styling
		.attr('cx', function(d) {
			return x(d.date);
		})
		.attr('cy', function(d) {
			return y(d.value);
		})
		.attr('r', 3);

	svg.selectAll('.text')
		.data(lineData)
		.enter()
		.append('text') // Uses the enter().append() method
		.attr('class', 'label') // Assign a class for styling
		.attr('x', function(d, i) {
			return x(d.date);
		})
		.attr('y', function(d) {
			return y(d.value);
		})
		.attr('dy', '-5')
		.text(function(d) {
			return d.value;
		});

	svg.append('text')
		.attr('x', 10)
		.attr('y', -5)
		.text(title);

	// trend line
	const regData = lineData.map(function(d) {
		return [+d.date.getFullYear(), d.value];
	});

	const regression = ss.linearRegression(regData);

	let trendLineCssClass = 'trend-line';
	if (regression.m > 0) {
		trendLineCssClass = 'trend-line warming';
	} else if (regression.m < 0) {
		trendLineCssClass = 'trend-line cooling';
	}

	const lin = ss.linearRegressionLine(regression);

	var linRegdata = x.domain().map(function(x) {
		return {
			date: x,
			value: lin(x.getFullYear())
		};
	});

	svg.append('path')
		.data([linRegdata])
		.attr('class', trendLineCssClass)
		.attr('d', valueline);
}

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

require('src/climate/climateTrends.css');
