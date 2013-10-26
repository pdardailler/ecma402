define(
	[ 'intern!object', 'intern/chai!assert', 'g11n4js/Intl' ], function(registerSuite, assert, Intl) {
	registerSuite({
		name : 'Intl',
		showDefaultLocale : function() {
			console.log("Default locale is ==> "+Intl.DefaultLocale());
		},
		wellFormedCurrency : function() {
			var wellFormedCurrencyCodes =
				[ "BOB", "EUR", "usd", "XdR", "xTs" ];
			wellFormedCurrencyCodes.forEach(function(code) {
				assert.strictEqual(Intl.IsWellFormedCurrencyCode(code), true,
					'IsWellFormedCurrencyCode() should return true for valid currency code "'+code+'"');
			});
		},
		notWellFormedCurrency : function() {
			var invalidCurrencyCodes =
				[ "", "€", "$", "SFr.", "DM", "KR₩", "702", "ßP", "ınr" ];
			invalidCurrencyCodes.forEach(function(code) {
				assert.strictEqual(Intl.IsWellFormedCurrencyCode(code), false,
					'IsWellFormedCurrencyCode() should return false for invalid currency code "'+code+'"');
			});
		},
		structurallyValidLanguageTag : function() {
			var structurallyValidLanguageTags =
				[ "de", // ISO 639 language code
				"de-DE", // + ISO 3166-1 country code
				"DE-de", // tags are case-insensitive
				"cmn", // ISO 639 language code
				"cmn-Hans", // + script code
				"CMN-hANS", // tags are case-insensitive
				"cmn-hans-cn", // + ISO 3166-1 country code
				"es-419", // + UN M.49 region code
				"es-419-u-nu-latn-cu-bob", // + Unicode locale extension sequence
				"i-klingon", // grandfathered tag
				"cmn-hans-cn-t-ca-u-ca-x-t-u", // singleton subtags can also be used as private use subtags
				"enochian-enochian", // language and variant subtags may be the same
				"de-gregory-u-ca-gregory", // variant and extension subtags may be the same
				"aa-a-foo-x-a-foo-bar", // variant subtags can also be used as private use subtags
				"x-en-US-12345", // anything goes in private use tags
				"x-12345-12345-en-US", "x-en-US-12345-12345", "x-en-u-foo", "x-en-u-foo-u-bar" ];

			structurallyValidLanguageTags.forEach(function(code) {
				assert.strictEqual(Intl.IsStructurallyValidLanguageTag(code), true,
					'IsStructurallyValidLanguageTag() should return true for valid language tag "'+code+'"');
			});
		},
		notStructurallyValidLanguageTag : function() {
			var structurallyInvalidLanguageTags =
				[
					"de_DE",
					"DE_de",
					"cmn_Hans",
					"cmn-hans_cn",
					"es_419",
					"es-419-u-nu-latn-cu_bob",
					"i_klingon",
					"cmn-hans-cn-t-ca-u-ca-x_t-u",
					"enochian_enochian",
					"de-gregory_u-ca-gregory",
					"", // empty tag
					"i", // singleton alone
					"x", // private use without subtag
					"u", // extension singleton in first place
					"419", // region code in first place
					"u-nu-latn-cu-bob", // extension sequence without language
					"hans-cmn-cn", // "hans" could theoretically be a 4-letter language code,
					// but those can't be followed by extlang codes.
					"cmn-hans-cn-u-u", // duplicate singleton
					"cmn-hans-cn-t-u-ca-u", // duplicate singleton
					"cmn-hans-cn-u-foo-u-bar", // duplicate singleton
					"de-gregory-gregory", // duplicate variant
					"*", // language range
					"de-*", // language range
					"中文", // non-ASCII letters
					"en-ß", // non-ASCII letters
					"ıd" // non-ASCII letters
				];
			structurallyInvalidLanguageTags.forEach(function(code) {
				assert.strictEqual(Intl.IsStructurallyValidLanguageTag(code), false,
					'IsStructurallyValidLanguageTag() should return false for invalid language tag "'+code+'"');
			});
		},
		canonicalizeLanguageTag : function() {
			var testLanguageTags =
				[ {
					"input" : "en-qaai-us",
					"expected" : "en-Zinh-US"
				}, {
					"input" : "cmn-hans-cn",
					"expected" : "zh-Hans-CN"
				}, {
					"input" : "iw",
					"expected" : "he"
				}, {
					"input" : "cmn-hans-cn-t-ca-u-ca-x-t-u",
					"expected" : "zh-Hans-CN-t-ca-u-ca-x-t-u"
				}, {
					"input" : "de",
					"expected" : "de"
				}, {
					"input" : "de-DE",
					"expected" : "de-DE"
				}, {
					"input" : "de-DD",
					"expected" : "de-DE"
				}, {
					"input" : "my-BU",
					"expected" : "my-MM"
				}, {
					"input" : "DE-de",
					"expected" : "de-DE"
				}, {
					"input" : "cmn",
					"expected" : "zh"
				}, {
					"input" : "cmn-Hans",
					"expected" : "zh-Hans"
				}, {
					"input" : "CMN-hANS",
					"expected" : "zh-Hans"
				}, {
					"input" : "es-419",
					"expected" : "es-419"
				}, {
					"input" : "es-cL-u-nu-latn-cu-bob",
					"expected" : "es-CL-u-nu-latn-cu-bob"
				}, {
					"input" : "i-klingon",
					"expected" : "tlh"
				}, {
					"input" : "sgn-be-nl",
					"expected" : "vgt"
				}, {
					"input" : "zh-hakka",
					"expected" : "hak"
				}, {
					"input" : "zh-min-nan",
					"expected" : "nan"
				}, {
					"input" : "sr-latn-yu",
					"expected" : "sr-Latn-RS"
				}, {
					"input" : "art-lojban",
					"expected" : "jbo"
				}, {
					"input" : "ja-latn-jp-heploc",
					"expected" : "ja-Latn-JP-alalc97"
				}, {
					"input" : "x-en-u-foo-u-bar",
					"expected" : "x-en-u-foo-u-bar"
				} ];

			testLanguageTags.forEach(function(currentTag) {
				assert.strictEqual(Intl.CanonicalizeLanguageTag(currentTag.input), currentTag.expected,
					'CanonicalizeLanguageTag() should return the properly canonicalized tag for language tag "'
						+currentTag.input+'"');
			});
		},
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
					"bestfit" : "root",
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
					"extension" : "-u-co-phonebk",
				}, {
					"input" : "en-NZ-u-ca-japanese",
					"lookup" : "en",
					"bestfit" : "en-GB",
					"extension" : "-u-ca-japanese",
				} ];

			testLanguageTags.forEach(function(currentTag) {
				var nf = new Intl.NumberFormat(currentTag.input);
				assert.strictEqual(nf.resolvedOptions().lookup.locale, currentTag.lookup,
					'LookupMatcher() should return the correct locale for language tag "'+currentTag.input+'"');
				assert.equal(nf.resolvedOptions().lookup.extension, currentTag.extension,
					'LookupMatcher() should return the correct extension for language tag "'+currentTag.input+'"');
				assert.strictEqual(nf.resolvedOptions().bestfit.locale, currentTag.bestfit,
					'BestFitMatcher() should return the correct locale for language tag "'+currentTag.input+'"');
				assert.equal(nf.resolvedOptions().bestfit.extension, currentTag.extension,
					'BestFitMatcher() should return the correct extension for language tag "'+currentTag.input+'"');
			});
		}
	});
});
