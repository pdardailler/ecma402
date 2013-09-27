define([], function() {

	var toUpperCaseIdentifier = function(/* String */identifier) {
		// summary:
		var result = "";
		for( var i = 0; i<identifier.length; i++){
			var cp = identifier.charCodeAt(i);
			if(cp>=0x0061&&cp<=0x007A){ // 'a' through 'z'
				result += identifier[i].toUpperCase();
			}else{
				result += identifier[i];
			}
		}
		return result; // String
	};

	var Intl = {
		// summary:

		IsStructurallyValidLanguageTag : function(/* String */locale) {
			// summary:
			return true; // Boolean
		},

		CanonicalizeLanguageTag : function(/* String */locale) {
			// summary:
			return locale; // String
		},

		DefaultLocale : function() {
			// summary:
			return "und"; // String
		},

		IsWellFormedCurrencyCode : function(/* Object */currency) {
			// summary:
			var c = currency.toString();
			var normalized = toUpperCaseIdentifier(c);
			var wellFormed = /^[A-Z]{3}$/;
			return(wellFormed.test(normalized)); // Boolean
		}
	};
	return Intl;

});