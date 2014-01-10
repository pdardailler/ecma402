// Copyright 2012 Mozilla Corporation. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
define(
	[ 'intern!object', 'intern/chai!assert', 'g11n4js/Intl', 'g11n4js/tests/intl402/harness/testIntl' ], function(registerSuite, assert, Intl, testIntl) {
	registerSuite({
		name : '9.2',
		Test_9_2_1_1 : function() {
			/**
			 * @description Tests that canonicalization of locale lists treats undefined and empty lists the same.
			 * @author Norbert Lindenberg
			 */
			testIntl.testWithIntlConstructors(function (Constructor) {
			    var supportedForUndefined = Constructor.supportedLocalesOf(undefined);
			    var supportedForEmptyList = Constructor.supportedLocalesOf([]);
			    assert.strictEqual(supportedForUndefined.length,supportedForEmptyList.length,"Supported locales differ between undefined and empty list input.");
			    // we don't compare the elements because length should be 0 - let's just verify that
			    assert.strictEqual(supportedForUndefined.length,0,"Internal test error: Assumption about length being 0 is invalid.");
			});
		},
		Test_9_2_1_2 : function() {
			/**
			 * @description Tests that the behavior of a List is not affected by adversarial
			 *     changes to Array.prototype.
			 * @author Norbert Lindenberg
			 */
			// TODO: Deal with this properly...!
			// testIntl.taintArray();
			testIntl.testWithIntlConstructors(function (Constructor) {
			    var defaultLocale = new Constructor().resolvedOptions().locale;
			    var canonicalized = Constructor.supportedLocalesOf([defaultLocale, defaultLocale]);
			    assert(canonicalized.length<=1,"Canonicalization didn't remove duplicate language tags from locale list.");
			});
		},
		Test_9_2_1_3 : function() {
			/**
			 * @description Tests that a single string instead of a locale list is treated
			 *     as the locale list containing that string.
			 * @author Norbert Lindenberg
			 */
			var validAndInvalidLanguageTags = [
			    "de", // ISO 639 language code
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
			    "i", // singleton alone
			    "x", // private use without subtag
			    "u", // extension singleton in first place
			    "419", // region code in first place
			    "u-nu-latn-cu-bob", // extension sequence without language
			    "hans-cmn-cn", // "hans" could theoretically be a 4-letter language code,
			                   // but those can't be followed by extlang codes.
			    "cmn-hans-cn-u-u", // duplicate singleton
			    "cmn-hans-cn-t-u-ca-u", // duplicate singleton
			    "de-gregory-gregory" // duplicate variant
			];

			testIntl.testWithIntlConstructors(function (Constructor) {
			    validAndInvalidLanguageTags.forEach(function (locale) {
			        var obj1, obj2, locale1, locale2, error1, error2;
			        try {
			            obj1 = new Constructor(locale);
			            locale1 = obj1.resolvedOptions().locale;
			        } catch (e) {
			            error1 = e;
			        }
			        try {
			            obj2 = new Constructor([locale]);
			            locale2 = obj2.resolvedOptions().locale;
			        } catch (e) {
			            error2 = e;
			        }

			        if ((error1 === undefined) !== (error2 === undefined)) {
			            assert.isUndefined(error1,"Single locale string " + locale +
			                    " was accepted, but locale list containing that string wasn't.");
			            assert(false,"Single locale string " + locale +
			                    " was rejected, but locale list containing that string wasn't.");
			        } else if (error1 === undefined) {
			             assert.strictEqual(locale1,locale2,"Single locale string " + locale + " results in " + locale1 +
			                    ", but locale list [" + locale + "] results in " + locale2 + ".");
			        } else {
			            assert.strictEqual(error1.name,error2.name,
			                "Single locale string " + locale + " results in error " + error1.name +
			                    ", but locale list [" + locale + "] results in error " + error2.name + ".");
			        }
			    });
			});
		},
		Test_9_2_1_4 : function() {
			/**
			 * @description Tests that non-objects are converted to objects before canonicalization.
			 * @author Norbert Lindenberg
			 */
			testIntl.testWithIntlConstructors(function (Constructor) {
				    // undefined is handled separately
				    
				    // null should result in a TypeError
				    var error;
				    try {
				        var supportedForNull = Constructor.supportedLocalesOf(null);
				    } catch (e) {
				        error = e;
				    }
				    assert.isDefined(error,"Null as locale list was not rejected.");
				    assert.strictEqual(error.name,"TypeError",
			        "Null as locale list was rejected with wrong error " + error.name + ".");
			    
			    // let's use an empty list for comparison
			    var supportedForEmptyList = Constructor.supportedLocalesOf([]);
			    // we don't compare the elements because length should be 0 - let's just verify that
			    assert.strictEqual(supportedForEmptyList.length,0,
			    	"Internal test error: Assumption about length being 0 is invalid.");

			    // most non-objects will be interpreted as empty lists because a missing length property is interpreted as 0
			    var supportedForNumber = Constructor.supportedLocalesOf(5);
			    assert.strictEqual(supportedForNumber.length,supportedForEmptyList.length,
			        "Supported locales differ between numeric and empty list input.");
			    var supportedForBoolean = Constructor.supportedLocalesOf(true);
			    assert.strictEqual(supportedForBoolean.length,supportedForEmptyList.length,
			        "Supported locales differ between boolean and empty list input.");
			});

		}
	});
});