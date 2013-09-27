define([ 'intern!object', 'intern/chai!assert', 'g11n4js/Intl' ], function(registerSuite, assert, Intl) {
	registerSuite({
		name : 'Intl',

		wellFormed : function() {
			var wellFormedCurrencyCodes = [ "BOB", "EUR", "usd", "XdR", "xTs" ];
			wellFormedCurrencyCodes.forEach(function(code) {
				assert.strictEqual(true, Intl.IsWellFormedCurrencyCode(code), 
						'IsWellFormedCurrencyCode() should return true for valid currency code "'+code+'"');
			});
		},
		notWellFormed : function() {
			var invalidCurrencyCodes = [ "", "€", "$", "SFr.", "DM", "KR₩", "702", "ßP", "ınr" ];
			invalidCurrencyCodes.forEach(function(code) {
				assert.strictEqual(false, Intl.IsWellFormedCurrencyCode(code),
						'IsWellFormedCurrencyCode() should return false for invalid currency code "'+code+'"');
			});
		}
	});
});
