// Copyright 2013 International Business Machines Corporation. All rights reserved.
define([ 'intern!object', 'intern/chai!assert', 'g11n4js/Intl', "g11n4js/List" ], function(registerSuite, assert, Intl, List) {
	registerSuite({
		name : 'Intl',
		matcherFunctions : function() {
			var testLanguageTags = [ {
				"input" : "en-US",
				"lookup" : "en-US",
				"bestfit" : "en-US",
			}, {
				"input" : "en-BS",
				"lookup" : "en",
				"bestfit" : "en",
			}, {
				"input" : "foo",
				"lookup" : "en-US",
				"bestfit" : "en-US",
			}, {
				"input" : "de-de",
				"lookup" : "de",
				"bestfit" : "de",
			}, {
				"input" : "de-ch",
				"lookup" : "de",
				"bestfit" : "de",
			}, {
				"input" : "ja-jp",
				"lookup" : "ja",
				"bestfit" : "ja",
			}, {
				"input" : "iw-il",
				"lookup" : "he",
				"bestfit" : "he",
			}, {
				"input" : "zh-CN",
				"lookup" : "zh",
				"bestfit" : "zh",
			}, {
				"input" : "zh-TW",
				"lookup" : "zh",
				"bestfit" : "zh-Hant",
			}, {
				"input" : "zh-MO",
				"lookup" : "zh",
				"bestfit" : "zh-Hant",
			}, {
				"input" : "zh-HK-VARIANT",
				"lookup" : "zh",
				"bestfit" : "zh-Hant",
			}, {
				"input" : "sr-ME",
				"lookup" : "sr",
				"bestfit" : "root",
			}, {
				"input" : "sr-YU",
				"lookup" : "sr",
				"bestfit" : "sr",
			}, {
				"input" : "pt-AO",
				"lookup" : "pt",
				"bestfit" : "pt-PT",
			}, {
				"input" : "en-GB-u-co-phonebk",
				"lookup" : "en-GB",
				"bestfit" : "en-GB",
			}, {
				"input" : "en-NZ-u-ca-japanese",
				"lookup" : "en",
				"bestfit" : "en-GB",
			} ];

			testLanguageTags.forEach(function(currentTag) {
				var nf = new Intl.NumberFormat(currentTag.input);
				assert.strictEqual(nf.resolvedOptions().locale, currentTag.bestfit,
					'BestFitMatcher() should return the correct locale for language tag "'+currentTag.input+'"');
			});
		},
		currencyFormat : function() {
			var testCases = [ {
				"locales" : "ar",
				"style" : "currency",
				"currency" : "jpy",
				"input" : 12345.678,
				"expected" : "JP¥ ١٢٬٣٤٦"
			}, {
				"locales" : "ar-u-nu-latn",
				"style" : "currency",
				"currency" : "jpy",
				"input" : 12345.678,
				"expected" : "JP¥ 12,346"
			}, {
				"locales" : "ar",
				"style" : "currency",
				"currency" : "eur",
				"input" : 12345.678,
				"expected" : "€ ١٢٬٣٤٥٫٦٨"
			}, {
				"locales" : "ar-u-nu-latn",
				"style" : "currency",
				"currency" : "eur",
				"input" : 12345.678,
				"expected" : "€ 12,345.68"
			}, {
				"locales" : "en-US",
				"style" : "currency",
				"currency" : "eur",
				"input" : 12345.678,
				"expected" : "€12,345.68"
			} ];
			testCases.forEach(function(currentTest) {
				var nfOptions = {
					style : currentTest.style
				};
				if(currentTest.style=="currency"){
					nfOptions.currency = currentTest.currency;
				}
				var nf = new Intl.NumberFormat(currentTest.locales, nfOptions);
				assert.strictEqual(nf.format(currentTest.input), currentTest.expected,
					'Intl.NumberFormat.format() should return expected string for locale"'+currentTest.locales
						+'" style:'+currentTest.style);
			});
		},
		dateTimeFormat : function() {
			var testCases = [ {
				"locales" : "en-US",
				"options" : {era: "short", year:"numeric", month:"short", day:"numeric", weekday:"short"},
				"input" : new Date("1970-01-01T00:00:00").getTime(),
				"expected" : "Thu, Jan 1, 1970 AD"
			},
			{
				"locales" : "zh-Hant",
				"options" : {year:"numeric", month:"short", day:"numeric", timeZone:"UTC"},
				"input" : new Date("1970-01-01T00:00:00Z").getTime(),
				"expected" : "1970年1月1日"
			},
			{
				"locales" : "en-US",
				"options" : {hour: "numeric", minute: "numeric", second: "numeric"},
				"input" : new Date("1970-01-01T00:00:00").getTime(),
				"expected" : "12:00:00 AM"
			},
			{
				"locales" : "en-US",
				"options" : {hour: "numeric", minute: "numeric", second: "numeric"},
				"input" : new Date("1970-01-01T00:00:00").getTime(),
				"expected" : "12:00:00 AM"
			},
			{
				"locales" : "el",
				"options" : {hour: "numeric", minute: "numeric", second: "numeric", timeZone:"UTC"},
				"input" : new Date("1970-01-01T00:00:00Z").getTime(),
				"expected" : "12:00:00 π.μ."
			}];
			testCases.forEach(function(currentTest) {
				var df = new Intl.DateTimeFormat(currentTest.locales, currentTest.options);
				assert.strictEqual(df.format(currentTest.input), currentTest.expected,
					'Intl.DateTimeFormat.format() should return expected string for locale"'+currentTest.locales);
			});
		},
		testList : function() {
			var aList = new List();
		}
	});
});
