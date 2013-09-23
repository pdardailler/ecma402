define([], function(){

	var Intl = {
		// summary:

		_toUpperCaseIdentifier : function(/* String */identifier) {
			// summary:
			var result = "";
			for (var i=0;i<identifier.length;i++) {
				var cp = identifier.charCodeAt(i);
				if (cp >= 0x0061 && cp <= 0x007A) { // 'a' through 'z'
                    result += identifier[i].toUpperCase();				
				} else {
					result += identifier[i];
				}
			}
			return result; // String
		},
		
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
			var normalized = this._toUpperCaseIdentifier(c);
			if (normalized.length != 3) {
				return false; // Boolean
			}
			for (var i=0;i<normalized.length;i++) {
				var cp=normalized.charCodeAt(i);
				if (cp<0x0041||cp>0x005A) { // between 'A' and 'Z'
					return false; // Boolean
				}
			}
			return true; // Boolean
		}
	};
	return Intl;
});