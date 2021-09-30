import ajax from '@fdaciuk/ajax';

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
		});
};
