// Copyright 2013 International Business Machines Corporation. All rights reserved.
define(
	[],
	function() {
		function LocalTimeGregorian(date, timeZone) {
			var result = {};
			var dt = new Date(date);
			result.weekday = dt.getUTCDay();
			result.year = dt.getUTCFullYear();
			if(result.year<=0){
				result.era=0;
				result.year-=1; // Compensate for fact that year 0 doesn't exist.
				result.year*=-1;
			}else{
				result.era=1;
			}
			result.month = dt.getUTCMonth();
			result.day = dt.getUTCDate();
			result.hour = dt.getUTCHours();
			result.minute = dt.getUTCMinutes();
			result.second = dt.getUTCSeconds();
			result.inDST = false;
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