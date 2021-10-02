import * as d3 from 'd3';
import ajax from '@fdaciuk/ajax';
import * as ss from 'simple-statistics';

function drawLineChart(measures, metric, title) {
	const parseTime = d3.timeParse('%b %d, %Y');
	let lineData = measures.map(measure => {
		return {
			date: parseTime(measure.date),
			value: measure[metric]
		};
	});

	lineData = lineData.filter(d => d.value > 0);

	lineData.sort(function(a, b) {
		return new Date(b.date) - new Date(a.date);
	});

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
			return d.value;
		}) - 5,
		100
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
		.tickFormat(date => date.getFullYear())
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
	const lin = ss.linearRegressionLine(regression);

	var linRegdata = x.domain().map(function(x) {
		return {
			date: x,
			value: lin(x.getFullYear())
		};
	});

	svg.append('path')
		.data([linRegdata])
		.attr('class', 'trend-line')
		.attr('d', valueline);
}

window.onload = function() {
	let searchParams = new URLSearchParams(window.location.search);

	const stationCode = searchParams.get('stationCode');
	const month = searchParams.get('month');
	const day = searchParams.get('day');

	const title = `Max Temperature Historical Trend for Month=${month}, Day=${day}`;

	const request = ajax({
		headers: {
			'content-type': 'application/json'
		}
	});

	request
		.get(
			`/api/climate/getYearlyTrends?stationCode=${stationCode}&month=${month}&day=${day}`
		)
		.then(measures => {
			console.log(measures);
			drawLineChart(
				measures,
				'maxTemp',
				`Max Temperature Historical Trend for Month=${month}, Day=${day}`
			);
			drawLineChart(
				measures,
				'minTemp',
				`Min Temperature Historical Trend for Month=${month}, Day=${day}`
			);
			drawLineChart(
				measures,
				'avgTemp',
				`Avg Temperature Historical Trend for Month=${month}, Day=${day}`
			);
		});
};

require('src/climate/climateTrends.css');
