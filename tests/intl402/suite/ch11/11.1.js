// Copyright 2012 Mozilla Corporation. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
define(
	[ 'intern!object', 'intern/chai!assert', 'ecma402/Intl', 'ecma402/tests/intl402/harness/testIntl', 'ecma402/tests/intl402/harness/testBuiltInObject' ], 
	function(registerSuite, assert, Intl, testIntl, testBuiltInObject) {
	registerSuite({
		name : '11.1',
		Test_11_1_L15 : function() {
			/**
			 * @description Tests that Intl.NumberFormat
			 *     meets the requirements for built-in objects defined by the introduction of
			 *     chapter 15 of the ECMAScript Language Specification.
			 * @author Norbert Lindenberg
			 */
			testBuiltInObject(Intl.NumberFormat, true, true, ["supportedLocalesOf"], 0);
		},
		Test_11_1_1_1 : function() {
			/**
			 * @description Tests that an object can't be re-initialized as a NumberFormat.
			 * @author Norbert Lindenberg
			 */
			testIntl.testWithIntlConstructors(function (Constructor) {
			    var obj, error;
			    
			    // variant 1: use constructor in a "new" expression
			    obj = new Constructor();
			    try {
			        Intl.NumberFormat.call(obj);
			    } catch (e) {
			        error = e;
			    }
			    assert.isDefined(error,"Re-initializing object created with \"new\" as NumberFormat was not rejected.");
			    assert.strictEqual(error.name,"TypeError","Re-initializing object created with \"new\" as NumberFormat was rejected with wrong error " + error.name + ".");
			    
			    // variant 2: use constructor as a function
			    obj = Constructor.call({});
			    error = undefined;
			    try {
			        Intl.NumberFormat.call(obj);
			    } catch (e) {
			        error = e;
			    }
			    assert.isDefined(error,"Re-initializing object created with constructor as function as NumberFormat was not rejected.");
			    assert.strictEqual(error.name,"TypeError","Re-initializing object created with constructor as function as NumberFormat was rejected with wrong error " + error.name + ".");
			});
		},
		Test_11_1_1_15 : function() {
			/**
			 * @description Tests that the option style is processed correctly.
			 * @author Norbert Lindenberg
			 */
			testIntl.testOption(Intl.NumberFormat, "style", "string", ["decimal", "percent", "currency"], "decimal",
			        {extra: {"currency": {currency: "CNY"}}});

		}
	});
});