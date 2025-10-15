// Timezone abbreviation to UTC offset map
const tzOffsetMap = {
	'EDT': '-04:00',
	'EST': '-05:00',
	'PDT': '-07:00',
	'PST': '-08:00',
	'GMT': '+00:00',
	'UTC': '+00:00'
};


// Import parse, format, and isValid from date-fns
const { parse, format, isValid } = require('date-fns');

function convertToLocalTime(dateString) {
	// Pre-process timezone abbreviations to UTC offsets
	let processedDateString = dateString;
		for (const abbr in tzOffsetMap) {
			// Match abbreviation at the end, possibly with trailing space or punctuation
			const regex = new RegExp(`\\b${abbr}\\b[. ]*$`);
			if (regex.test(processedDateString)) {
				processedDateString = processedDateString.replace(regex, tzOffsetMap[abbr]);
				break;
			}
		}

		// Debug: log the processed date string
		console.log('Processed date string:', processedDateString);
		// Patterns to support
	const patterns = [
		// US long date with time and UTC offset
		"MMMM d, yyyy 'at' h:mm a xxx",
		// European date with slashes
		'dd/MM/yyyy HH:mm',
		// European date with dashes
		'dd-MM-yyyy HH:mm',
		// US long date without time
		'MMMM d, yyyy',
		// ISO format
		"yyyy-MM-dd'T'HH:mm:ssX",
		"yyyy-MM-dd'T'HH:mm:ss'Z'",
		"yyyy-MM-dd'T'HH:mm:ssXXX",
		"yyyy-MM-dd'T'HH:mm:ss.SSSX",
		"yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
	];

	// Try each pattern
	for (const pattern of patterns) {
		let parsedDate;
		try {
			parsedDate = parse(processedDateString, pattern, new Date());
		} catch (e) {
			continue;
		}
		if (isValid(parsedDate)) {
			// Format as 'MMMM d, yyyy at h:mm:ss a zzz' (zzz will not show zone, so append local zone manually)
			const formatted = format(parsedDate, "MMMM d, yyyy 'at' h:mm:ss a");
			// Get local timezone abbreviation
			const tz = new Date(parsedDate).toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ').pop();
			return `${formatted} ${tz}`;
		}
	}
	return 'Unrecognized date';
}

module.exports = { convertToLocalTime };
