// Copyright 2012 Mozilla Corporation. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
define(
	[ 'intern!object', 'intern/chai!assert', 'g11n4js/Intl', 'g11n4js/tests/intl402/harness/testIntl' ], function(registerSuite, assert, Intl, testIntl) {
	registerSuite({
		name : '9.2',
		/**
		 * @description Tests that canonicalization of locale lists treats undefined and empty lists the same.
		 * @author Norbert Lindenberg
		 */
		Test_9_2_1_1 : function() {
			testIntl.testWithIntlConstructors(function (Constructor) {
			    var supportedForUndefined = Constructor.supportedLocalesOf(undefined);
			    var supportedForEmptyList = Constructor.supportedLocalesOf([]);
			    assert.strictEqual(supportedForUndefined.length,supportedForEmptyList.length,"Supported locales differ between undefined and empty list input.");
			    // we don't compare the elements because length should be 0 - let's just verify that
			    assert.strictEqual(supportedForUndefined.length,0,"Internal test error: Assumption about length being 0 is invalid.");
			});
		}
	});
});