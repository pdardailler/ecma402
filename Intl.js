define(
		[ "dojo/request", ],
	function(request) {

		var aliases = getCLDRJson("supplemental", "aliases").supplemental.metadata.alias;
		var localeAliases = getCLDRJson("supplemental", "localeAliases").supplemental.metadata.alias;
		var parentLocales = getCLDRJson("supplemental", "parentLocales").supplemental.parentLocales;
		var unicodeLocaleExtensions = /-u(-[a-z0-9]{2,8})+/g;

		var numberingSystems = getCLDRJson("supplemental", "numberingSystems").supplemental.numberingSystems;
		var availableNumberingSystems = ["latn"];
		for (var ns in numberingSystems){
			if(numberingSystems[ns]._type == "numeric"&&ns!="latn"){
				availableNumberingSystems.push(ns);
			}
		}
		// Utility function for Synchronous JSON loading using Dojo require.
		function getCLDRJson(locale, path) {
			var url = require.toUrl("g11n4js/cldr/"+locale+"/"+path+".json");
			var options = {
				sync : true,
				handleAs : "json"
			};
			var result = undefined;
			request(url, options).then(function(data) {
				result = data;
			}, function(error) {
				result = null;
			});
			return result;
		}

		// Utility function to determine the available locales list.
		// TODO: Determine this dynamically from the JSON files that are there.
		function getAvailableLocales() {
			return Array("ar", "ca", "cs", "da", "de", "el", "en", "en-AU", "en-CA", "en-GB", "en-HK", "en-IN",
				"en-US", "es", "fi", "fr", "he", "hi", "hr", "hu", "it", "ja", "ko", "nb", "nl", "pl", "pt", "pt-PT",
				"ro", "root", "ru", "sk", "sl", "sr", "sv", "th", "tr", "uk", "vi", "zh", "zh-Hant");
		}

		// ECMA 262 Section 9.1
		function IsPrimitive(x) {
			return (typeof x).test(/undefined|null|boolean|string|number/);
		}

		function ToPrimitive(input, PreferredType) {
			switch(typeof x) {
				case "undefined":
				case "null":
				case "boolean":
				case "string":
				case "number":
					return input;
					break;
				default: // ECMA 262 Section 8.12.8
					var toString, valueOf;
					var str, val;
					if(PreferredType=="String"||(PreferredType===undefined)){
						toString = input["toString"];
						if(typeof toString=="function"){
							str = input.toString();
							if(IsPrimitive(str)){
								return str;
							}
						}
						valueOf = input["valueOf"];
						if(typeof valueOf=="function"){
							val = input.valueOf();
							if(IsPrimitive(val)){
								return val;
							}
						}
						throw new TypeError;
					}
					if(PreferredType=="Number"||PreferredType===undefined){
						valueOf = input["valueOf"];
						if(typeof valueOf=="function"){
							val = input.valueOf();
							if(IsPrimitive(val)){
								return val;
							}
						}
						toString = input["toString"];
						if(typeof toString=="function"){
							str = input.toString();
							if(IsPrimitive(str)){
								return str;
							}
						}
						throw new TypeError;
					}
					break;
			}
		}

		// ECMA 262 Section 9.2
		function ToBoolean(x) {
			switch(typeof x) {
				case "undefined":
				case "null":
					return false;
					break;
				case "boolean":
					return x;
					break;
				case "string":
					return x.length>0;
					break;
				case "number":
					return !(isNan(x)||x==0);
					break;
				default:
					return true;
			}
		}

		// ECMA 262 Section 9.8
		function ToString(x) {
			switch(typeof x) {
				case "undefined":
					return "undefined";
					break;
				case "null":
					return "null";
					break;
				case "boolean":
					return x ? "true" : "false";
					break;
				case "string":
					return x;
					break;
				case "number":
					return NumberToString(x);
					break;
				default:
					var primValue = ToPrimitive(x, "String");
					return ToString(primValue);
			}
		}

		// ECMA 262 Section 9.8.1
		// Note: This implementation only requires integers for ToString(x),
		// so we use an abbreviated version of the algorithm defined in
		// ECMA 262. It will not work as expected if you pass a non-integer.
		function NumberToString(m) {
			if(isNaN(m)){ // 9.8.1.1
				return "NaN";
			}
			if(m==+0||m==-0){ // 9.8.1.2
				return "0";
			}
			if(m<0){ // 9.8.1.3
				return "-"+NumberToString(-m);
			}
			if(m==Number.POSITIVE_INFINITY){ // 9.8.1.4
				return "Infinity";
			}
			var result = "";
			m = Math.floor(m);
			while (m>=1){
				result = String.fromCharCode(0x0030+m%10)+result;
				m /= 10;
			}
			return result;

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

		// ECMA 402 Section 6.1
		function _toUpperCaseIdentifier(/* String */identifier) {
			var match = /[a-z]/g;
			return identifier.replace(match, function(m) {
				return m.toUpperCase();
			}); // String
		}

		// ECMA 402 Section 6.1
		function _toLowerCaseIdentifier(/* String */identifier) {
			var match = /[A-Z]/g;
			return identifier.replace(match, function(m) {
				return m.toLowerCase();
			}); // String
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
					var lookupAlias = aliases.languageAlias[m];
					if(lookupAlias){
						m = lookupAlias._replacement ? lookupAlias._replacement : m;
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
						var lookupAlias = aliases.scriptAlias[script];
						if(lookupAlias){
							m = lookupAlias._replacement ? "-"+lookupAlias._replacement : m;
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
						var lookupAlias = aliases.territoryAlias[region];
						if(lookupAlias){
							var repl = lookupAlias._replacement;
							if(repl.indexOf(" ")>=0){
								repl = repl.substring(0, repl.indexOf(" "));
							}
							m = repl ? "-"+repl : m;
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
					var lookupAlias = aliases.variantAlias[variant];
					if(lookupAlias){
						var repl = lookupAlias._replacement;
						m = repl ? "-"+_toLowerCaseIdentifier(repl) : m;
					}
				}
				return m;
			}); // String
			// Canonicalize any whole tag combinations or grandfathered tags
			result = result.replace(result, function(m) {
				if(aliases!=null){
					var lookupAlias = aliases.languageAlias[m];
					if(lookupAlias){
						m = lookupAlias._replacement ? lookupAlias._replacement : m;
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
				var lookupAlias = localeAliases.localeAlias[candidate];
				if(lookupAlias){
					candidate = lookupAlias._replacement;
				}
				if(availableLocales.indexOf(candidate)>=0){
					return candidate;
				}
				var parentLocale = parentLocales.parentLocale[candidate];
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

		// ECMA 402 Section 9.2.5
		function ResolveLocale(availableLocales, requestedLocales, options, relevantExtensionKeys, localeData) {
			var matcher = options.localeMatcher;
			var r = matcher=="lookup" ? LookupMatcher(availableLocales, requestedLocales) : BestFitMatcher(
				availableLocales, requestedLocales);
			var foundLocale = r.locale;
			var extensionSubtags = "";
			var extensionSubtagsLength = 0;
			var extensionIndex = 0;
			if(r.extension!==undefined){
				var extension = r.extension;
				extensionIndex = r.extensionIndex;
				extensionSubtags = extension.split("-");
				extensionSubtagsLength = extensionSubtags["length"];
			}
			var result = new Object();
			result.dataLocale = foundLocale;
			var supportedExtension = "-u";
			var i = 0;
			var len = relevantExtensionKeys["length"];
			while (i<len){
				var key = relevantExtensionKeys[ToString(i)];
				var foundLocaleData = localeData[foundLocale];
				var keyLocaleData = foundLocaleData[key];
				var value = keyLocaleData["0"];
				var supportedExtensionAddition = "";
				if(typeof extensionSubtags!="undefined"){
					var keyPos = extensionSubtags.indexOf(key);
					var valuePos;
					if(keyPos!=-1){
						if(keyPos+1<extensionSubtagsLength&&extensionSubtags[ToString(keyPos+1)].length>2){
							var requestedValue = extensionSubtags[ToString(keyPos+1)];
							valuePos = keyLocaleData.indexOf(requestedValue);
							if(valuePos!=-1){
								value = requestedValue;
								supportedExtensionAddition = "-"+key+"-"+value;
							}
						}else{
							valuePos = keyLocaleData.indexOf("true");
							if(valuePos!=-1){
								value = "true";
							}
						}
					}
				}
				if(keyinoptions){
					var optionsValue = options[key];
					if(keyLocaleData.indexOf(optionsValue)!=-1){
						if(optionsValue!=value){
							value = optionsValue;
							supportedExtensionAddition = "";
						}
					}
				}
				result[key] = value;
				supportedExtension += supportedExtensionAddition;
				i++;
			}
			if(supportedExtension.length>2){
				var preExtension = foundLocale.substring(0, extensionIndex);
				var postExtension = foundLocale.substring(extensionIndex);
				foundLocale = preExtension+supportedExtension+postExtension;
			}
			result.locale = foundLocale;
			return result;
		}

		// ECMA 402 Section 9.2.6
		function LookupSupportedLocales(availableLocales, requestedLocales) {
			var len = requestedLocales.length;
			var subset = new Array();
			var k = 0;
			while (k<len){
				var locale = requestedLocales[k];
				var noExtensionsLocale = locale.replace(unicodeLocaleExtensions, "");
				var availableLocale = BestAvailableLocale(availableLocales, noExtensionsLocale);
				if(availableLocale!==undefined){
					subset.push(locale);
				}
				k++;
			}
			return subset;
		}

		// ECMA 402 Section 9.2.7
		function BestFitSupportedLocales(availableLocales, requestedLocales) {
			var len = requestedLocales.length;
			var subset = new Array();
			var k = 0;
			while (k<len){
				var locale = requestedLocales[k];
				var noExtensionsLocale = locale.replace(unicodeLocaleExtensions, "");
				var availableLocale = BestFitAvailableLocale(availableLocales, noExtensionsLocale);
				if(availableLocale!==undefined){
					subset.concat(locale);
				}
				k++;
			}
			return subset;
		}

		// ECMA 402 Section 9.2.8
		function SupportedLocales(availableLocales, requestedLocales, options) {
			var matcher = undefined;
			var subset;
			if(options!==undefined){
				options = ToObject(options);
				matcher = options["localeMatcher"];
				if(matcher!==undefined){
					matcher = ToString(matcher);
					if(matcher!=="lookup"&&matcher!=="best fit"){
						throw new RangeError("Matching algorithm must be 'lookup' or 'best fit'.");
					}
				}
			}
			if(matcher===undefined||matcher==="best fit"){
				subset = BestFitSupportedLocales(availableLocales, requestedLocales);
			}else{
				subset = LookupSupportedLocales(availableLocales, requestedLocales);
			}
			for( var P in Object.getOwnPropertyNames(subset)){
				var desc = Object.getOwnPropertyDescriptor(subset, P);
				desc.Writable = false;
				desc.Configurable = false;
				Object.defineProperty(subset, P, desc);
			}
			return subset;
		}

		// ECMA 402 Section 9.2.9
		function GetOption(options, property, type, values, fallback) {
			var value = options[property];
			if(type=="boolean"){
				value = ToBoolean(value);
			}
			if(type=="string"){
				value = ToString(value);
			}
			if(values!==undefined){
				for( var v in values){
					if(values[v]===value){
						return value;
					}
				}
				throw new RangeError("The specified value "+value+" is invalid.");
			}
			return fallback;
		}

		// ECMA 402 Section 9.2.10
		function GetNumberOption(options, property, minimum, maximum, fallback) {
			var value = options[property];
			if(value!==undefined){
				value = ToNumber(value);
				if(isNaN(value)||value<minimum||value>maximum){
					throw new RangeError("The specified number value "+value+" is not in the allowed range");
				}
				return Math.floor(value);
			}
			return fallback;
		}

		var Intl = {
			Collator : function(/* String */locale) {
				throw new TypeError("Intl.Collator is not supported.");
			},
			NumberFormat : function(/* String */locale) {
				var al = getAvailableLocales();
				this.availableLocales = CanonicalizeLocaleList(al);
				this.relevantExtensionKeys = [ "nu" ];
				var localeData = new Object();
				for (var loc in this.availableLocales){
					localeData[this.availableLocales[loc]] = { "nu" : availableNumberingSystems };
				}
				this.localeData = localeData;
				this.resolvedOptions = function() {
					return {
						"locale" : this.bestfit.locale,
						"lookup" : this.lookup,
						"bestfit" : this.bestfit,
						
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
			// These shouldn't be part of the Intl object when we finish, but are here simply so we can unit test
			// the underlying abstract operations easily.
			// TODO: Remove them.
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
			},
			ToString : function(x) {
				return ToString(x);
			},
			GetOption : function(options, property, type, values, fallback) {
				return GetOption(options, property, type, values, fallback);
			}

		};

		return Intl;
	});