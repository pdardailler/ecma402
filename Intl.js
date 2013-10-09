define(
		[ "dojo/text!g11n4js/cldr/supplemental/aliases.json" ],
	function(aliasesJson) {

		var _toUpperCaseIdentifier = function(/* String */identifier) {
			var match = /[a-z]/g;
			return identifier.replace(match, function(m) {
				return m.toUpperCase();
			}); // String
		};

		var _toLowerCaseIdentifier = function(/* String */identifier) {
			var match = /[A-Z]/g;
			return identifier.replace(match, function(m) {
				return m.toLowerCase();
			}); // String
		};

		var DefaultLocale = function() {
			return(navigator.language||navigator.userLanguage||"root");
		};

		var Intl = {
			IsWellFormedCurrencyCode : function(/* Object */currency) {
				var wellFormed = /^[A-Za-z]{3}$/;
				return(wellFormed.test(currency.toString())); // Boolean
			},

			IsStructurallyValidLanguageTag : function(/* String */locale) { // Section 6.2.2
				if(typeof locale!=="string"){
					return false; // Boolean
				}
				var identifier = _toLowerCaseIdentifier(locale);
				var langtag = /^([a-z]{2,3}(-[a-z]{3}){0,3}|[a-z]{4,8})(-[a-z]{4})?(-([a-z]{2}|\d{3}))?(-([a-z0-9]{5,8}|\d[a-z0-9]{3}))*(-[a-wyz0-9](-[a-z0-9]{2,8})+)*(-x(-[a-z0-9]{1,8})+)?$/;
				var privateuse = /x(-[a-z0-9]{1,8})+/;
				var grandfathered = /en-gb-oed|(i-(ami|bnn|default|enochian|hak|klingon|lux|mingo|navajo|pwn|tao|tay|tsu))|sgn-((be-(fr|nl))|(ch-de))/;
				if(privateuse.test(identifier)||grandfathered.test(identifier)){
					return true; // Boolean
				}

				function _isUniqueVariant(element, index, array) {
					var firstSingletonPosition = identifier.search(/-[a-z0-9]-/);
					if(firstSingletonPosition>0){
						return(identifier.indexOf(element)==identifier.lastIndexOf(element, firstSingletonPosition)); // Boolean
					}else{
						return(identifier.indexOf(element)==identifier.lastIndexOf(element)); // Boolean
					}
					;
				}

				function _isUniqueSingleton(element, index, array) {
					var firstXPosition = identifier.search(/-x-/);
					if(firstXPosition>0){
						return(identifier.indexOf(element)==identifier.lastIndexOf(element, firstXPosition)); // Boolean
					}else{
						return(identifier.indexOf(element)==identifier.lastIndexOf(element)); // Boolean
					}
					;
				}

				if(langtag.test(identifier)){ // represents a well-formed BCP 47 language tag
					var varianttag = /-[a-z0-9]{5,8}|\d[a-z0-9]{3}/g;
					var variants = varianttag.exec(identifier);
					var singletontag = /-[a-wyz0-9]-/g;
					var singletons = singletontag.exec(identifier);
					return((!variants||variants.every(_isUniqueVariant))&&(!singletons||singletons.every(_isUniqueSingleton))); // has no duplicate variant or
					// singleton tags
				}
				return false; // Boolean
			},
			CanonicalizeLanguageTag : function(/* String */locale) {
				var result = locale.toLowerCase();
				var firstSingletonPosition = result.search(/(^|-)[a-z0-9]-/);
				var languageTag = /^([a-z]{2,3}(-[a-z]{3}){0,3}|[a-z]{4,8})(?=(-|$))/;
				var scriptTag = /(?:-)([a-z]{4})(?=(-|$))/;
				var regionTag = /(?:-)([a-z]{2})(?=(-|$))/g;
				var variantTag = /(?:-)([a-z0-9]{5,8}|\d[a-z0-9]{3})/;
				var aliases = JSON.parse(aliasesJson);
				// Canonicalize the Language Tag
				result = result.replace(languageTag, function(m) {
					if(aliases!=null){
						var lookupAlias = aliases.supplemental.metadata.alias.languageAlias[m];
						if(lookupAlias){
							var repl = lookupAlias._replacement;
							if(typeof repl=="string"){
								m = repl;
							}
						}
					}
					return m;
				}); // String
				// Canonicalize the Script Tag
				result = result.replace(scriptTag, function(m) {
					if(firstSingletonPosition==-1||result.indexOf(m)<firstSingletonPosition){
						m = m.substring(0, 2).toUpperCase()+m.substring(2);
						var script = m.substring(1);
						if(aliases!=null){
							var lookupAlias = aliases.supplemental.metadata.alias.scriptAlias[script];
							if(lookupAlias){
								var repl = lookupAlias._replacement;
								if(typeof repl=="string"){
									m = "-"+repl;
								}
							}
						}
					}
					return m;
				}); // String
				// Canonicalize the Region Tag
				result = result.replace(regionTag, function(m) {
					if(firstSingletonPosition==-1||result.indexOf(m)<firstSingletonPosition){
						m = m.toUpperCase();
						var region = m.substring(1);
						if(aliases!=null){
							var lookupAlias = aliases.supplemental.metadata.alias.territoryAlias[region];
							if(lookupAlias){
								var repl = lookupAlias._replacement;
								if(typeof repl=="string"){
									if(repl.indexOf(" ")>=0){
										repl = repl.substring(0, repl.indexOf(" "));
									}
									m = "-"+repl;
								}
							}
						}
					}
					return m;
				}); // String
				// Canonicalize the Variant Tag
				result = result.replace(variantTag, function(m) {
					// Variant tags are upper case in CLDR's data.
					var variant = _toUpperCaseIdentifier(m.substring(1));
					if(aliases!=null){
						var lookupAlias = aliases.supplemental.metadata.alias.variantAlias[variant];
						if(lookupAlias){
							var repl = lookupAlias._replacement;
							if(typeof repl=="string"){
								m = "-"+_toLowerCaseIdentifier(repl);
							}
						}
					}
					return m;
				}); // String
				// Canonicalize any whole tag combinations or grandfathered tags
				result = result.replace(result, function(m) {
					if(aliases!=null){
						var lookupAlias = aliases.supplemental.metadata.alias.languageAlias[m];
						if(lookupAlias){
							var repl = lookupAlias._replacement;
							if(typeof repl=="string"){
								m = repl;
							}
						}
					}
					return m;
				}); // String
				return result; // String
			}
		};
		return Intl;
	});