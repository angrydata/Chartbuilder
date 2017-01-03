// Separate a flat array of `{ column: value }` objects into a multi-array, one
// for each column. Each object contains a `values` array, with each entry
// looking like:
// ```
// { entry: <rowName>, value: <callValue> }
// ```

import {clone} from 'lodash';

const datePattern = /date|time|year/i;
const parseDelimInput = require("./parse-delimited-input").parser;

// Parse data by series. Options:
// checkForDate: bool | tell parser to return dates if key column is date/time/year
function dataBySeries(input, opts) {

	console.log('parse by series');

	var series;
	opts = opts || {};

	var parsedInput = parseDelimInput(input, {
		checkForDate: opts.checkForDate,
		type: opts.type
	});

	const columnNames = parsedInput.columnNames;
	const allColumns = clone(columnNames);
	const keyColumn = columnNames.shift();

	if (columnNames.length === 0) {
		series = [{
			name: keyColumn,
			values: parsedInput.data.map(function(d) {
				return {
					name: keyColumn,
					value: d[keyColumn]
				};
			})
		}];
	} else {
		series = columnNames.map(function(header, i) {
			return {
				name: header,
				values: parsedInput.data.map(function(d) {
					return {
						name: header,
						entry: d[keyColumn],
						value: d[header]
					};
				})
			};
		});
	}

	return {
		series: series,
    data: parsedInput,
    allColumns: allColumns,
		input: { raw: input, type: opts.type },
		hasDate: parsedInput.hasDate && (!opts.type || opts.type == "date"),
		isNumeric: parsedInput.isNumeric && (!opts.type || opts.type == "numeric")
	};
}

module.exports = dataBySeries;
