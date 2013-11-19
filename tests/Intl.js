define(
	[ 'intern!object', 'intern/chai!assert', 'g11n4js/Intl' ], function(registerSuite, assert, Intl) {
	registerSuite({
		name : 'Intl',
		matcherFunctions : function() {
			var testLanguageTags =
				[ {
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
			var testCases =
				[ {
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
		}
	});
});
