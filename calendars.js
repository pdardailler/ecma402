// Copyright 2013 International Business Machines Corporation. All rights reserved.
define(
	[],
	function() {
		function LocalTimeGregorian(date, timeZone) {
			var result = {};
			var dt = new Date(date);
			result.weekday = timeZone=="UTC"?dt.getUTCDay():dt.getDay();
			result.year = timeZone=="UTC"?dt.getUTCFullYear():dt.getFullYear();
			if(result.year<=0){
				result.era=0;
				result.year-=1; // Compensate for fact that year 0 doesn't exist.
				result.year*=-1;
			}else{
				result.era=1;
			}
			result.month = timeZone=="UTC"?dt.getUTCMonth():dt.getMonth();
			result.day = timeZone=="UTC"?dt.getUTCDate():dt.getDate();
			result.hour = timeZone=="UTC"?dt.getUTCHours():dt.getHours();
			result.minute = timeZone=="UTC"?dt.getUTCMinutes():dt.getMinutes();
			result.second = timeZone=="UTC"?dt.getUTCSeconds():dt.getSeconds();
			var localMinutes = dt.getHours()*60+dt.getMinutes();
			var UTCMinutes = dt.getUTCHours()*60+dt.getUTCMinutes();
			result.inDST = timeZone=="UTC"?false:localMinutes+dt.getTimezoneOffset()!=UTCMinutes;
			return result;
		}
		var calendars = {};
		calendars.ToLocalTime = function (date, calendar, timeZone) {
			switch (calendar) {
				default: return LocalTimeGregorian(date,timeZone);
			}
		};
		return calendars;
	});