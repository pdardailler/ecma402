define(["doh/main", "g11n4js/Intl"], function(doh, Intl){
	doh.register("tests.Intl", [
		function test_wellFormedCurrencyCodes(t){
            var wellFormedCurrencyCodes = [
                "BOB",
                "EUR",
                "usd", // currency codes are case-insensitive
                "XdR",
                "xTs"
            ];
            wellFormedCurrencyCodes.forEach(function (code) {
                t.is(true,Intl.IsWellFormedCurrencyCode(code));
            });
		},
		function test_invalidCurrencyCodes(t){
            var invalidCurrencyCodes = [
                "",
                "€",
                "$",
                "SFr.",
                "DM",
                "KR₩",
                "702",
                "ßP",
                "ınr"
            ];
            invalidCurrencyCodes.forEach(function (code) {
                t.is(false,Intl.IsWellFormedCurrencyCode(code));
            });
		}
	]);
});

