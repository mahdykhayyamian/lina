const { Pool, Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'lina',
  password: 'auGAJygb73Uh',
  port: 1111,
})
client.connect()


const fs = require('fs'),
	readline = require('readline');


// copied from https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
function CSVtoArray(text) {
	var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
	var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
	// Return NULL if input string is not well formed CSV string.
	if (!re_valid.test(text)) return null;
	var a = [];                     // Initialize array to receive values.
	text.replace(re_value, // "Walk" the string using replace with callback.
		function(m0, m1, m2, m3) {
			// Remove backslash from \' in single quoted values.
			if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
			// Remove backslash from \" in double quoted values.
			else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
			else if (m3 !== undefined) a.push(m3);
			return ''; // Return empty string.
		});
	// Handle special case of empty last value.
	if (/,\s*$/.test(text)) a.push('');
	return a;
};



async function main() {

	const lineByLine = require('n-readlines');
	const liner = new lineByLine('../../data/climate/Boulder-colorado-temp-daily.csv');

	let line;
	let lineNumber = 0;

	while (line = liner.next()) {
	    line = line.toString('ascii')
	   	console.log('Line ' + lineNumber + ': ' + line);
	    lineNumber++;

		if (lineNumber == 2) {
			let data = CSVtoArray(line)
			station = {
				code : data[0],
				name: data[1],
				lat: data[2],
				long: data[3],
				elevation: data[4]
			}
			console.log(station)

			const query = `INSERT into climate.station (code, name, latitude, longitude, elevation, created) values`  
				+  `('${station.code}', '${station.name}', ${station.lat}, ${station.long}, ${station.elevation}, '${new Date().toISOString()}') RETURNING id`
			const res = await client.query(query)

			station.id = res.rows[0].id
		} 

		if (lineNumber > 1) {
			let data = CSVtoArray(line)

			const measurements = {
				date: data[5],
				avgTemp: null,
				maxTemp: data[6] || null,
				minTemp: data[7] || null,
			}

			const query = `INSERT into climate.DAILY_MEASURES (station_id, date, avg_temp, max_temp, min_temp, created) values`  
				+  `('${station.id}', '${measurements.date}', ${measurements.avgTemp}, ${measurements.maxTemp}, ${measurements.minTemp}, '${new Date().toISOString()}')`

			console.log(station)

			console.log(query)
			const res = await client.query(query)
		}
	}
}

main()