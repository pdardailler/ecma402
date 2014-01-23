// Copyright 2012 Mozilla Corporation & Google Inc. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
define(
	[ 'intern!object', 'intern/chai!assert', 'ecma402/Intl', 'ecma402/tests/intl402/harness/testIntl', 'ecma402/tests/intl402/harness/testBuiltInObject' ], 
	function(registerSuite, assert, Intl, testIntl, testBuiltInObject) {
	registerSuite({
		name : '11.3',
		Test_11_3_a : function() {
			/**
			 * @description Tests that Intl.NumberFormat.prototype is an object that
			 * has been initialized as an Intl.NumberFormat.
			 * @author: Roozbeh Pournader
			 */
			// test by calling a function that would fail if "this" were not an object
			// initialized as an Intl.NumberFormat
			assert.strictEqual(typeof Intl.NumberFormat.prototype.format(0),"string",
			    "Intl.NumberFormat's prototype is not an object that has been " +
			        "initialized as an Intl.NumberFormat");
		},
		Test_11_3_b : function() {
			/**
			 * @description Tests that Intl.NumberFormat.prototype functions throw a
			 *     TypeError if called on a non-object value or an object that hasn't been
			 *     initialized as a NumberFormat.
			 * @author Norbert Lindenberg
			 */

			var functions = {
			    "format getter": Object.getOwnPropertyDescriptor(Intl.NumberFormat.prototype, "format").get,
			    resolvedOptions: Intl.NumberFormat.prototype.resolvedOptions
			};
			var invalidTargets = [undefined, null, true, 0, "NumberFormat", [], {}];

			Object.getOwnPropertyNames(functions).forEach(function (functionName) {
			    var f = functions[functionName];
			    invalidTargets.forEach(function (target) {
			        var error;
			        try {
			            f.call(target);
			        } catch (e) {
			            error = e;
			        }
			        assert.isDefined(error,
			            "Calling " + functionName + " on " + target + " was not rejected.");
			        assert.strictEqual(error.name,"TypeError",
			            "Calling " + functionName + " on " + target + " was rejected with wrong error " + error.name + ".");
			    });
			});
		},
		Test_11_3_L15 : function() {
			/**
			 * @description Tests that Intl.NumberFormat.prototype
			 *     meets the requirements for built-in objects defined by the introduction of
			 *     chapter 15 of the ECMAScript Language Specification.
			 * @author Norbert Lindenberg
			 */
			testBuiltInObject(Intl.NumberFormat.prototype, false, false, ["constructor", "format", "resolvedOptions"]);

		},
		Test_11_3_1 : function() {
			/**
			 * @description Tests that Intl.NumberFormat.prototype.constructor is the
			 * Intl.NumberFormat.
			 * @author: Roozbeh Pournader
			 */

			assert.strictEqual(Intl.NumberFormat.prototype.constructor,Intl.NumberFormat,
			    "Intl.NumberFormat.prototype.constructor is not the same as " +
			          "Intl.NumberFormat");
		},
		Test_11_3_2_1_a_ii : function() {
			/**
			 * @description Tests that Intl.NumberFormat.prototype.format
			 * converts other types to numbers.
			 * @author: Roozbeh Pournader
			 */
			var formatter = new Intl.NumberFormat();
			var testData = [undefined, null, true, '0.6666666', {valueOf: function () { return '0.1234567';}}];
			var number;
			var i, input, correctResult, result;

			for (i in testData) {
			    input = testData[i];
			    number = +input;
			    correctResult = formatter.format(number);
			    
			    result = formatter.format(input);
			    assert.strictEqual(result,correctResult,
			        'Intl.NumberFormat does not convert other ' +
			            'types to numbers. Input: "'+input+'" Output: "'+result+'" '+
			            'Expected output: "'+correctResult+'"');
			}

		},
		Test_11_3_2_1_a_L15 : function() {
			/**
			 * @description Tests that the function returned by Intl.NumberFormat.prototype.format
			 *     meets the requirements for built-in objects defined by the introduction of
			 *     chapter 15 of the ECMAScript Language Specification.
			 * @author Norbert Lindenberg
			 */
			testBuiltInObject(new Intl.NumberFormat().format, true, false, [], 1);
		},
		Test_11_3_2_1_c : function() {
			/**
			 * @description Tests that format function is bound to its Intl.NumberFormat.
			 * @author Norbert Lindenberg
			 */
			var numbers = [0, -0, 1, -1, 5.5, 123, -123, -123.45, 123.44501, 0.001234,
			    -0.00000000123, 0.00000000000000000000000000000123, 1.2, 0.0000000012344501,
			    123445.01, 12344501000000000000000000000000000, -12344501000000000000000000000000000,
			    Infinity, -Infinity, NaN];
			var locales = [undefined, ["de"], ["th-u-nu-thai"], ["en"], ["ja-u-nu-jpanfin"], ["ar-u-nu-arab"]];
			var options = [
			    undefined,
			    {style: "percent"},
			    {style: "currency", currency: "EUR", currencyDisplay: "symbol"},
			    {style: "currency", currency: "IQD", currencyDisplay: "symbol"},
			    {style: "currency", currency: "KMF", currencyDisplay: "symbol"},
			    {style: "currency", currency: "CLF", currencyDisplay: "symbol"},
			    {useGrouping: false, minimumIntegerDigits: 3, minimumFractionDigits: 1, maximumFractionDigits: 3}
			];

			locales.forEach(function (locales) {
			    options.forEach(function (options) {
			        var formatObj = new Intl.NumberFormat(locales, options);
			        var formatFunc = formatObj.format;
			        numbers.forEach(function (number) {
			            var referenceFormatted = formatObj.format(number);
			            var formatted = formatFunc(number);
			            assert.strictEqual(referenceFormatted,formatted,
			                "format function produces different result than format method for locales " +
			                    locales + "; options: " + (options ? JSON.stringify(options) : options) +
			                    " : " + formatted + " vs. " + referenceFormatted + ".");
			        });
			    });
			});

		},
		Test_11_3_2_FN_1 : function() {
		},
		Test_11_3_2_FN_2 : function() {
		},
		Test_11_3_2_FN_3_b : function() {
		},
		Test_11_3_2_FN_3_e : function() {
		},
		Test_11_3_2_L15 : function() {
		},
		Test_11_3_2_TRF : function() {
		},
		Test_11_3_2_TRP : function() {
		},
		Test_11_3_3_L15 : function() {
		},
		Test_11_3_3 : function() {
		},
	});
});