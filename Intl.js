define(
		[
			"dojo/text!./cldr/supplemental/aliases.json",
			"dojo/text!./cldr/supplemental/localeAliases.json",
			"dojo/text!./cldr/supplemental/parentLocales.json" ],
	function(aliasesJson, localeAliasesJson, parentLocalesJson) {
		var aliases = JSON.parse(aliasesJson);
		var localeAliases = JSON.parse(localeAliasesJson);
		var parentLocales = JSON.parse(parentLocalesJson);
		function getAvailableLocales() {
			return Array("ar", "ca", "cs", "da", "de", "el", "en", "en-AU", "en-CA", "en-GB", "en-HK", "en-IN",
				"en-US", "es", "fi", "fr", "he", "hi", "hr", "hu", "it", "ja", "ko", "nb", "nl", "pl", "pt", "pt-PT",
				"ro", "root", "ru", "sk", "sl", "sr", "sv", "th", "tr", "uk", "vi", "zh", "zh-Hant");
		}
		// ECMA 262 Section 9.9
		function ToObject(x) {
			switch(typeof x) {
				case "undefined":
				case "null":
					throw new TypeError;
					break;
				case "boolean":
					return new Boolean(x);
					break;
				case "string":
					return new String(x);
					break;
				case "number":
					return new Number(x);
					break;
				default:
					return x;
			}
		}
		function _toUpperCaseIdentifier(/* String */identifier) {
			var match = /[a-z]/g;
			return identifier.replace(match, function(m) {
				return m.toUpperCase();
			}); // String
		}

		function _toLowerCaseIdentifier(/* String */identifier) {
			var match = /[A-Z]/g;
			return identifier.replace(match, function(m) {
				return m.toLowerCase();
			}); // String
		}

		function ToUint32(x) {
			return x>>>0;
		}

		// ECMA 402 Section 6.2.2
		function IsStructurallyValidLanguageTag(/* String */locale) {
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
					return identifier.indexOf(element)>firstSingletonPosition
						||identifier.indexOf(element)==identifier.lastIndexOf(element, firstSingletonPosition); // Boolean
				}
				return identifier.indexOf(element)==identifier.lastIndexOf(element); // Boolean
			}

			function _isUniqueSingleton(element, index, array) {
				var firstXPosition = identifier.search(/-x-/);
				if(firstXPosition>0){
					return identifier.indexOf(element)==identifier.lastIndexOf(element, firstXPosition); // Boolean
				}
				return identifier.indexOf(element)==identifier.lastIndexOf(element); // Boolean
			}

			if(langtag.test(identifier)){ // represents a well-formed BCP 47 language tag
				var varianttag = /-[a-z0-9]{5,8}|\d[a-z0-9]{3}/g;
				var variants = varianttag.exec(identifier);
				var singletontag = /-[a-wyz0-9]-/g;
				var singletons = singletontag.exec(identifier);
				var variantsOK = !variants||variants.every(_isUniqueVariant); // has no duplicate variant tags
				var singletonsOK = !singletons||singletons.every(_isUniqueSingleton); // has no duplicate singleton tags
				return variantsOK&&singletonsOK;
			}
			return false; // Boolean
		}

		// ECMA 402 Section 6.2.3
		function CanonicalizeLanguageTag(/* String */locale) {
			var result = locale.toLowerCase();
			var firstSingletonPosition = result.search(/(^|-)[a-z0-9]-/);
			var languageTag = /^([a-z]{2,3}(-[a-z]{3}){0,3}|[a-z]{4,8})(?=(-|$))/;
			var scriptTag = /(?:-)([a-z]{4})(?=(-|$))/;
			var regionTag = /(?:-)([a-z]{2})(?=(-|$))/g;
			var variantTag = /(?:-)([a-z0-9]{5,8}|\d[a-z0-9]{3})/;
			// Canonicalize the Language Tag
			result = result.replace(languageTag, function(m) {
				if(aliases!=null){
					var lookupAlias = aliases.supplemental.metadata.alias.languageAlias[m];
					if(lookupAlias){
						m = lookupAlias._replacement;
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
							m = "-"+lookupAlias._replacement;
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
							if(repl.indexOf(" ")>=0){
								repl = repl.substring(0, repl.indexOf(" "));
							}
							m = "-"+repl;
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
						m = lookupAlias._replacement;
					}
				}
				return m;
			}); // String
			return result; // String
		}

		// ECMA 402 Section 6.3.1
		function IsWellFormedCurrencyCode(/* Object */currency) {
			var wellFormed = /^[A-Za-z]{3}$/;
			return wellFormed.test(currency.toString()); // Boolean
		}

		// ECMA 402 Section 6.4
		function DefaultLocale() {
			if(IsStructurallyValidLanguageTag(navigator.language)){
				return CanonicalizeLanguageTag(navigator.language);
			}
			if(IsStructurallyValidLanguageTag(navigator.userLanguage)){
				return CanonicalizeLanguageTag(navigator.userLanguage);
			}
			return "root";
		}

		// ECMA 402 Section 9.2.1
		function CanonicalizeLocaleList(locales) {
			if(typeof locales=="undefined"){
				return new Array();
			}
			var seen = new Array();
			if(typeof locales=="string"){
				locales = new Array(locales);
			}
			var O = ToObject(locales);
			for(Pk in O){
				var kValue = O[Pk];
				if(typeof kValue!="string"&&typeof kValue!="object"){
					throw new TypeError(kValue+" must be a string or an object.");
				}
				var tag = kValue.toString();
				if(!IsStructurallyValidLanguageTag(tag)){
					throw new RangeError(tag+" is not a structurally valid language tag.");
				}
				tag = CanonicalizeLanguageTag(tag);
				if(seen.indexOf(tag)<0){
					seen.push(tag);
				}
			}
			return seen;
		}

		// ECMA 402 Section 9.2.2
		function BestAvailableLocale(availableLocales, locale) {
			var candidate = locale;
			while (true){
				if(availableLocales.indexOf(candidate)>=0){
					return candidate;
				}
				var pos = candidate.lastIndexOf("-");
				if(pos<0){
					return undefined;
				}
				if(pos>=2&&candidate.charAt(pos-2)=="-"){
					pos -= 2;
				}
				candidate = candidate.substring(0, pos);
			}
		}

		// ECMA 402 Section 9.2.3
		function LookupMatcher(availableLocales, requestedLocales) {
			var i = 0;
			var len = requestedLocales.length;
			var availableLocale = undefined;
			var locale = undefined;
			var noExtensionsLocale = undefined;
			var unicodeLocaleExtensions = /-u(-[a-z0-9]{2,8})+/g;
			while (i<len&&availableLocale===undefined){
				locale = requestedLocales[i];
				noExtensionsLocale = locale.replace(unicodeLocaleExtensions, "");
				availableLocale = BestAvailableLocale(availableLocales, noExtensionsLocale);
				i++;
			}
			var result = new Object();
			if(availableLocale){
				result.locale = availableLocale;
				if(locale!=noExtensionsLocale){
					result.extension = locale.match(unicodeLocaleExtensions);
					result.extensionIndex = locale.search(unicodeLocaleExtensions);
				}
			}else{
				result.locale = DefaultLocale();
			}
			return result;
		}

		// Algorithm is similar to BestAvailableLocale, as in Section 9.2.2
		// except that known locale aliases, such as zh-TW = zh-Hant-TW, are resolved,
		// and explicit parent locales from CLDR's supplemental data are also considered.
		// This data for the former is not currently in CLDR see http://unicode.org/cldr/trac/ticket/5949,
		// but should be there in a future release.

		function BestFitAvailableLocale(availableLocales, locale) {
			var candidate = locale;
			while (true){
				var lookupAlias = localeAliases.supplemental.metadata.alias.localeAlias[candidate];
				if(lookupAlias){
					candidate = lookupAlias._replacement;
				}
				if(availableLocales.indexOf(candidate)>=0){
					return candidate;
				}
				var parentLocale = parentLocales.supplemental.parentLocales.parentLocale[candidate];
				if(parentLocale){
					candidate = parentLocale;
				}else{
					var pos = candidate.lastIndexOf("-");
					if(pos<0){
						return undefined;
					}
					if(pos>=2&&candidate.charAt(pos-2)=="-"){
						pos -= 2;
					}
					candidate = candidate.substring(0, pos);
				}
			}
		}

		// ECMA 402 Section 9.2.4
		function BestFitMatcher(availableLocales, requestedLocales) {
			var i = 0;
			var len = requestedLocales.length;
			var availableLocale = undefined;
			var locale = undefined;
			var noExtensionsLocale = undefined;
			var unicodeLocaleExtensions = /-u(-[a-z0-9]{2,8})+/g;
			while (i<len&&availableLocale===undefined){
				locale = requestedLocales[i];
				noExtensionsLocale = locale.replace(unicodeLocaleExtensions, "");
				availableLocale = BestFitAvailableLocale(availableLocales, noExtensionsLocale);
				i++;
			}
			var result = new Object();
			if(availableLocale){
				result.locale = availableLocale;
				if(locale!=noExtensionsLocale){
					result.extension = locale.match(unicodeLocaleExtensions);
					result.extensionIndex = locale.search(unicodeLocaleExtensions);
				}
			}else{
				result.locale = "root";
			}
			return result;
		}

		var Intl = {
			Collator : function(/* String */locale) {
				throw new TypeError("Intl.Collator is not supported.");
			},
			NumberFormat : function(/* String */locale) {
				var al = getAvailableLocales();
				this.availableLocales = CanonicalizeLocaleList(al);
				this.resolvedOptions = function() {
					return {
						"locale" : this.bestfit.locale,
						"lookup" : this.lookup,
						"bestfit" : this.bestfit
					};
				};
				if(!locale){
					locale = DefaultLocale();
				}
				if(!IsStructurallyValidLanguageTag(locale)){
					throw new RangeError(locale+" is not a structurally valid language tag");
				}
				this.lookup = LookupMatcher(this.availableLocales, CanonicalizeLocaleList(locale));
				this.bestfit = BestFitMatcher(this.availableLocales, CanonicalizeLocaleList(locale));
			},
			DateTimeFormat : function(/* String */locale) {
				this.availableLocales = CanonicalizeLocaleList(new Array(DefaultLocale()));
				this.resolvedOptions = function() {
					return {
						"locale" : locale
					};
				};
				if(!locale){
					locale = DefaultLocale();
				}
				if(!IsStructurallyValidLanguageTag(locale)){
					throw new RangeError(locale+"is not a structurally valid language tag");
				}
				this.locale = locale;
			},
			// These shouldn't be part of the Intl object when we finish, but are here simply so we can unit test
			// the underlying abstract operations easily.
			DefaultLocale : function() {
				return DefaultLocale();
			},
			IsStructurallyValidLanguageTag : function(locale) {
				return IsStructurallyValidLanguageTag(locale);
			},
			CanonicalizeLanguageTag : function(locale) {
				return CanonicalizeLanguageTag(locale);
			},
			IsWellFormedCurrencyCode : function(code) {
				return IsWellFormedCurrencyCode(code);
			}

		};

		return Intl;
	});