// Copyright 2013 International Business Machines Corporation. All rights reserved.
define(
	[],
	function() {
		// Implementation of the Record abstract data type from ECMA 402.
		function Record() {
			this.length = 0;
		}

		Record.prototype.set = function(field,val) {
			Object.defineProperty(this,field,{value:val});
		};

		function LocalTimeGregorian(date, timeZone) {
			var result = new Record();
			var dt = new Date(date);
			result.set("weekday",timeZone=="UTC"?dt.getUTCDay():dt.getDay());
			var year = timeZone=="UTC"?dt.getUTCFullYear():dt.getFullYear();
			if(year<=0){
				result.set("era",0);
				year--; // Compensate for fact that year 0 doesn't exist.
				year = -year;;
			}else{
				result.set("era",1);
			}
			result.set("year",year);
			result.set("month",timeZone=="UTC"?dt.getUTCMonth():dt.getMonth());
			result.set("day",timeZone=="UTC"?dt.getUTCDate():dt.getDate());
			result.set("hour",timeZone=="UTC"?dt.getUTCHours():dt.getHours());
			result.set("minute",timeZone=="UTC"?dt.getUTCMinutes():dt.getMinutes());
			result.set("second",timeZone=="UTC"?dt.getUTCSeconds():dt.getSeconds());
			var localMinutes = dt.getHours()*60+dt.getMinutes();
			var UTCMinutes = dt.getUTCHours()*60+dt.getUTCMinutes();
			result.set("inDST",timeZone=="UTC"?false:localMinutes+dt.getTimezoneOffset()!=UTCMinutes);
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