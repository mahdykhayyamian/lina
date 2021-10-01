import * as d3 from 'd3';
import ajax from '@fdaciuk/ajax';

function drawLineChart(measures) {
	const parseTime = d3.timeParse('%b %d, %Y');
	let lineData = measures.map(measure => {
		return {
			date: parseTime(measure.date),
			temp: measure.maxTemp
		};
	});

	lineData = lineData.filter(d => d.temp > 0);

	lineData.sort(function(a, b) {
		return new Date(b.date) - new Date(a.date);
	});

	console.log('lineData');
	console.log(lineData);

	var height = 800;
	var width = 1600;
	var hEach = 40;

	var margin = { top: 80, right: 60, bottom: 100, left: 100 };

	width = width - margin.left - margin.right;
	height = height - margin.top - margin.bottom;

	var svg = d3
		.select('body')
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
			return d.temp;
		}) - 5,
		100
	]);

	var valueline = d3
		.line()
		.x(function(d) {
			return x(d.date);
		})
		.y(function(d) {
			return y(d.temp);
		})
		.curve(d3.curveMonotoneX);

	svg.append('path')
		.data([lineData])
		.attr('class', 'line')
		.attr('d', valueline);

	var xAxis = d3
		.axisBottom(x)
		.tickFormat(date => date.toLocaleDateString('en-US'))
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
			return y(d.temp);
		})
		.attr('r', 5);

	svg.selectAll('.text')
		.data(lineData)
		.enter()
		.append('text') // Uses the enter().append() method
		.attr('class', 'label') // Assign a class for styling
		.attr('x', function(d, i) {
			return x(d.date);
		})
		.attr('y', function(d) {
			return y(d.temp);
		})
		.attr('dy', '-5')
		.text(function(d) {
			return d.temp;
		});

	svg.append('text')
		.attr('x', 10)
		.attr('y', -5)
		.text('Max Temperature Historical Trend');
}

window.onload = function() {
	console.log('we here man...');

	const request = ajax({
		headers: {
			'content-type': 'application/json'
		}
	});

	request
		.get(
			'/api/climate/getYearlyTrends?stationCode=USW00023174&month=2&day=1'
		)
		.then(measures => {
			console.log(measures);
			drawLineChart(measures);
		});
};

require('src/climate/climateTrends.css');
