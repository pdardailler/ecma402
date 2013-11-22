define(
	[ "dojo/request" ],
	function(request) {

		aliases = getCLDRJson("supplemental", "aliases").supplemental.metadata.alias;
		localeAliases = getCLDRJson("supplemental", "localeAliases").supplemental.metadata.alias;
		parentLocales = getCLDRJson("supplemental", "parentLocales").supplemental.parentLocales;
		unicodeLocaleExtensions = /-u(-[a-z0-9]{2,8})+/g;
		numberingSystems = getCLDRJson("supplemental", "numberingSystems").supplemental.numberingSystems;
		availableNumberingSystems = [ "latn" ];
		for( var ns in numberingSystems){
			if(numberingSystems[ns]._type=="numeric"&&ns!="latn"){
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
			var extlangTag = /^([a-z]{2,3}(-[a-z]{3}))(?=(-|$))/;
			// Canonicalize the Language Tag
			result = result.replace(languageTag, function(m) {
				if(aliases!=null){
					var lookupAlias = aliases.languageAlias[m];
					if(lookupAlias&&lookupAlias._reason!="macrolanguage"){
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
					if(lookupAlias&&lookupAlias._reason!="macrolanguage"){
						m = lookupAlias._replacement ? lookupAlias._replacement : m;
					}
				}
				return m;
			}); // String
			// Remove the prefix if an extlang tag exists
			if(extlangTag.test(result)){
				result = result.replace(/^[a-z]{2,3}-/, "");
			}
			return result; // String
		}

		// ECMA 402 Section 6.3.1
		function IsWellFormedCurrencyCode(currency) {
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
				return [];
			}
			var seen = [];
			if(typeof locales=="string"){
				locales = new Array(locales);
			}
			var O = Object(locales);
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
			var result = {};
			if(availableLocale){
				result.locale = availableLocale;
				if(locale!=noExtensionsLocale){
					result.extension = locale.match(unicodeLocaleExtensions)[0];
					result.extensionIndex = locale.search(unicodeLocaleExtensions);
				}
			}else{
				result.locale = DefaultLocale();
			}
			return result;
		}

		// Algorithm is similar to BestAvailableLocale, as in Section 9.2.2
		// except that the following additional operations are performed:
		// 1). CLDR macrolanguage replacements are done ( i.e. "cmn" becomes "zh" )
		// 2). Known locale aliases, such as zh-TW = zh-Hant-TW, are resolved,
		// 3). Explicit parent locales from CLDR's supplemental data are also considered.
		// This data for item #2 is not currently in CLDR see http://unicode.org/cldr/trac/ticket/5949,
		// but should be there in a future release.

		function BestFitAvailableLocale(availableLocales, locale) {
			var candidate = locale;
			while (true){
				var langtag = candidate.substring(0, candidate.indexOf("-"));
				var lookupAlias = aliases.languageAlias[langtag];
				if(lookupAlias&&lookupAlias._reason=="macrolanguage"){
					candidate = candidate.replace(langtag, lookupAlias._replacement);
				}
				lookupAlias = localeAliases.localeAlias[candidate];
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
			var result = {};
			if(availableLocale){
				result.locale = availableLocale;
				if(locale!=noExtensionsLocale){
					result.extension = locale.match(unicodeLocaleExtensions)[0];
					result.extensionIndex = locale.search(unicodeLocaleExtensions);
				}
			}else{
				result.locale = DefaultLocale();
			}
			return result;
		}

		// ECMA 402 Section 9.2.5
		function ResolveLocale(availableLocales, requestedLocales, options, relevantExtensionKeys, localeData) {
			var matcher = options.localeMatcher;
			var r = matcher=="lookup" ? LookupMatcher(availableLocales, requestedLocales) : BestFitMatcher(
				availableLocales, requestedLocales);
			var foundLocale = r.locale;
			var extension = "";
			var extensionSubtags = [];
			var extensionSubtagsLength = 0;
			var extensionIndex = 0;
			if(r.extension!==undefined){
				extension = r.extension;
				extensionIndex = r.extensionIndex;
				extensionSubtags = extension.split("-");
				extensionSubtagsLength = extensionSubtags["length"];
			}
			var result = {};
			result.dataLocale = foundLocale;
			var supportedExtension = "-u";
			var i = 0;
			var len = relevantExtensionKeys["length"];
			while (i<len){
				var key = relevantExtensionKeys[String(i)];
				var foundLocaleData = localeData[foundLocale];
				var keyLocaleData = foundLocaleData[key];
				var value = keyLocaleData["0"];
				var supportedExtensionAddition = "";
				if(typeof extensionSubtags!="undefined"){
					var keyPos = extensionSubtags.indexOf(key);
					var valuePos;
					if(keyPos!=-1){
						if(keyPos+1<extensionSubtagsLength&&extensionSubtags[String(keyPos+1)].length>2){
							var requestedValue = extensionSubtags[String(keyPos+1)];
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
				var optionsValue = options[key];
				if(optionsValue!==undefined){
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
			var subset = [];
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
			var subset = [];
			var k = 0;
			while (k<len){
				var locale = requestedLocales[k];
				var noExtensionsLocale = locale.replace(unicodeLocaleExtensions, "");
				var availableLocale = BestFitAvailableLocale(availableLocales, noExtensionsLocale);
				if(availableLocale!==undefined){
					subset.push(locale);
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
				options = Object(options);
				matcher = options["localeMatcher"];
				if(matcher!==undefined){
					matcher = String(matcher);
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
				var desc;
				desc = Object.getOwnPropertyDescriptor(subset, P);
				if(desc===undefined){
					desc = {};
				}
				desc.writable = false;
				desc.configurable = false;
				Object.defineProperty(subset, P, desc);
			}
			return subset;
		}

		// ECMA 402 Section 9.2.9
		function GetOption(options, property, type, values, fallback) {
			var value = options[property];
			if(value!==undefined){
				if(type=="boolean"){
					value = Boolean(value);
				}
				if(type=="string"){
					value = String(value);
				}
				if(values!==undefined){
					for( var v in values){
						if(values[v]===value){
							return value;
						}
					}
					throw new RangeError("The specified value "+value+" is invalid.");
				}
				return value;
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

		function CurrencyDigits(currency) {
			var currencyData = getCLDRJson("supplemental", "currencyData").supplemental.currencyData.fractions;
			if(currencyData[currency]){
				return currencyData[currency]._digits;
			}
			return 2;
		}

		// ECMA 402 Section 11.1.1.1
		function InitializeNumberFormat(numberFormat, locales, options) {
			if(numberFormat.initializedIntlObject){
				throw new TypeError("NumberFormat is already initialized.");
			}
			numberFormat.initializedIntlObject = true;
			var requestedLocales = CanonicalizeLocaleList(locales);
			if(options===undefined){
				options = {};
			}else{
				options = Object(options);
			}
			var opt = {};
			var matcher = GetOption(options, "localeMatcher", "string", [ "lookup", "best fit" ], "best fit");
			opt.localeMatcher = matcher;
			var localeData = numberFormat.localeData;
			var r = ResolveLocale(numberFormat.availableLocales, requestedLocales, opt,
				numberFormat.relevantExtensionKeys, localeData);
			numberFormat.locale = r.locale;
			numberFormat.dataLocale = r.dataLocale;
			numberFormat.numberingSystem = r.nu;
			var s = GetOption(options, "style", "string", [ "decimal", "percent", "currency" ], "decimal");
			numberFormat.style = s;
			var c = GetOption(options, "currency", "string");
			if(c!==undefined&&!IsWellFormedCurrencyCode(c)){
				throw new RangeError("Invalid currency code "+c);
			}
			if(s=="currency"&&c===undefined){
				throw new TypeError("No currency code specified.");
			}
			var cDigits = 2;
			if(s=="currency"){
				c = _toUpperCaseIdentifier(c);
				numberFormat.currency = c;
				numberFormat.currencySymbol = c;
				numberFormat.currencyDisplayName = c;
				cDigits = CurrencyDigits(c);
				var cd = GetOption(options, "currencyDisplay", "string", [ "code", "symbol", "name" ], "symbol");
				numberFormat.currencyDisplay = cd;
				if(cd=="symbol"||cd=="name"){
					var currencies = getCLDRJson(numberFormat.dataLocale, "currencies").main[numberFormat.dataLocale].numbers.currencies;
					if(currencies[numberFormat.currency]){
						numberFormat.currencySymbol = currencies[numberFormat.currency].symbol;
						numberFormat.currencyDisplayName = currencies[numberFormat.currency].displayName;
					}
				}
			}
			var mnid = GetNumberOption(options, "minimumIntegerDigits", 1, 21, 1);
			numberFormat.minimumIntegerDigits = mnid;
			var mnfdDefault;
			if(s=="currency"){
				mnfdDefault = cDigits;
			}else{
				mnfdDefault = 0;
			}
			var mnfd = GetNumberOption(options, "minimumFractionDigits", 0, 20, mnfdDefault);
			numberFormat.minimumFractionDigits = mnfd;
			var mxfdDefault;
			if(s=="currency"){
				mxfdDefault = Math.max(mnfd, cDigits);
			}else if(s=="percent"){
				mxfdDefault = Math.max(mnfd, 0);
			}else{
				mxfdDefault = Math.max(mnfd, 0);
			}
			var mxfd = GetNumberOption(options, "maximumFractionDigits", mnfd, 20, mxfdDefault);
			numberFormat.maximumFractionDigits = mxfd;
			var mnsd = options["minimumSignificantDigits"];
			var mxsd = options["maximumSignificantDigits"];
			if(mnsd!==undefined||mxsd!==undefined){
				mnsd = GetNumberOption(options, "minimumSignificantDigits", 1, 21, 1);
				mxsd = GetNumberOption(options, "maximumSignificantDigits", mnsd, 21, 1);
				numberFormat.minimumSignificantDigits = mnsd;
				numberFormat.maximumSignificantDigits = mxsd;
			}
			var g = GetOption(options, "useGrouping", "boolean", undefined, true);
			numberFormat.useGrouping = g;
			var numbers = getCLDRJson(numberFormat.dataLocale, "numbers").main[numberFormat.dataLocale].numbers;
			if(r.locale==r.dataLocale){
				numberFormat.numberingSystem = numbers.defaultNumberingSystem;
			}
			var numberInfo = _getNumberInfo(numbers, numberFormat.numberingSystem);
			numberFormat.localeData = {
				"symbols" : numberInfo.symbols,
				"patterns" : numberInfo.patterns[s],
			};
			numberFormat.boundFormat = undefined;
			numberFormat.initializedNumberFormat = true;
		}

		// Utility function to insert grouping separators into the proper locations in a string of digits
		// based on the CLDR pattern string.
		function doGrouping(n, pattern) {
			var numExp = /[0-9#.,]+/;
			var number = pattern.match(numExp)[0];
			var dPos = number.lastIndexOf(".");
			if(dPos!=-1){
				number = number.substring(0, dPos);
			}
			var groupings = number.split(",");
			groupings.reverse();
			groupings.pop();
			var currentGrouping = groupings.shift();
			var ungroupedDigits = n.match(/^\d+/);
			while (ungroupedDigits&&ungroupedDigits[0].length>currentGrouping.length){
				var digitsLeft = ungroupedDigits[0].length-currentGrouping.length;
				n = n.substr(0, digitsLeft)+","+n.substring(digitsLeft);
				if(groupings.length>1){
					currentGrouping = groupings.shift();
				}
				ungroupedDigits = n.match(/^\d+/);
			}
			return n;
		}
		// ECMA 402 Section 11.3.2
		function ToRawPrecision(x, minPrecision, maxPrecision) {
			var m = x.toPrecision(maxPrecision).toString();
			if(/\./.test(m)&&maxPrecision>minPrecision){
				var cut = maxPrecision-minPrecision;
				while (cut>0&&/0$/.test(m)){
					m = m.replace(/0$/, "");
					cut--;
				}
				if(m.test(/\.$/)){
					m = m.replace(/\.$/, "");
				}
			}
			return m;
		}
		// ECMA 402 Section 11.3.2
		function ToRawFixed(x, minInteger, minFraction, maxFraction) {
			var m = x.toFixed(maxFraction).toString();
			var cut = maxFraction-minFraction;
			while (cut>0&&/0$/.test(m)){
				m = m.replace(/0$/, "");
				cut--;
			}
			if(/\.$/.test(m)){
				m = m.replace(/\.$/, "");
			}

			var dPos = m.indexOf(".");
			var int = dPos>0 ? dPos : m.length;
			while (int<minInteger){
				m = "0"+m;
				int++;
			}
			return m;

		}
		// ECMA 402 Section 11.3.2
		function FormatNumber(numberFormat, x) {
			var negative = false;
			var n;
			if(!isFinite(x)){
				if(isNaN(x)){
					n = numberFormat.localeData.symbols.nan;
				}else{
					n = numberFormat.localeData.symbols.infinity;
					if(x<0){
						negative = true;
					}
				}
			}else{
				if(x<0){
					negative = true;
					x = -x;
				}
				if(numberFormat.style=="percent"){
					x *= 100;
				}
				if(numberFormat.minimumSignificantDigits!==undefined&&numberFormat.maximumSignificantDigits!==undefined){
					n = ToRawPrecision(x, numberFormat.minimumSignificantDigits, numberFormat.maximumSignificantDigits);
				}else{
					n = ToRawFixed(x, numberFormat.minimumIntegerDigits, numberFormat.minimumFractionDigits,
						numberFormat.maximumFractionDigits);
				}
				if(numberFormat.useGrouping){
					n = doGrouping(n, numberFormat.localeData.patterns.cldrPattern);
				}
				if(numberFormat.numberingSystem!="latn"){
					var alldigits = /\d/g;
					n = n.replace(alldigits, function(m) {
						return numberingSystems[numberFormat.numberingSystem]._digits.charAt(m);
					});
				}
				n = n.replace(/[.,]/g, function(m) {
					if(m=="."){
						return numberFormat.localeData.symbols.decimal ? numberFormat.localeData.symbols.decimal : m;
					}
					return numberFormat.localeData.symbols.group ? numberFormat.localeData.symbols.group : m;
				});
			}
			var result;
			if(negative){
				result = numberFormat.localeData.patterns.negativePattern;
			}else{
				result = numberFormat.localeData.patterns.positivePattern;
			}
			result = result.replace("-", numberFormat.localeData.symbols.minusSign);
			result = result.replace("%", numberFormat.localeData.symbols.percentSign);
			result = result.replace("{number}", n);
			if(numberFormat.style=="currency"){
				var currency = numberFormat.currency;
				var cd = currency;
				;
				if(numberFormat.currencyDisplay=="symbol"){
					cd = numberFormat.currencySymbol;
				}else if(numberFormat.currencyDisplay=="name"){
					cd = numberFormat.currencyDisplayName;
				}
				result = result.replace("{currency}", cd);
			}
			return result;
		}

		// Utility function to retrive necessary number fields from the CLDR data		
		function _getNumberInfo(numbers, numberingSystem) {
			result = {};
			result.symbols = {};
			var numberExp = /[0-9#.,]+/;
			key = "symbols-numberSystem-"+numberingSystem;
			altkey = "symbols-numberSystem-latn";
			var cldrSymbols = numbers[key] ? numbers[key] : numbers[altkey];
			result.symbols = cldrSymbols;

			result.patterns = {};
			var styles = [ "decimal", "percent", "currency" ];
			for( var s in styles){
				var style = styles[s];
				var key = style+"Formats-numberSystem-"+numberingSystem;
				var altkey = style+"Formats-numberSystem-latn";
				var cldrPattern = numbers[key] ? numbers[key].standard : numbers[altkey].standard;
				var patterns = cldrPattern.split(";");
				var positivePattern, negativePattern;
				positivePattern = patterns[0];
				if(patterns[length]==2){
					negativePattern = patterns[1];
				}else{
					negativePattern = "-"+positivePattern;
				}
				positivePattern = positivePattern.replace(numberExp, "{number}").replace(/\u00A4/, "{currency}");
				negativePattern = negativePattern.replace(numberExp, "{number}").replace(/\u00A4/, "{currency}");
				result.patterns[style] = {
					"cldrPattern" : cldrPattern,
					"positivePattern" : positivePattern,
					"negativePattern" : negativePattern
				};
			}
			return result;
		}

		var Intl = {};

		Intl.Collator = function(locales, options) {
			throw new TypeError("Intl.Collator is not supported.");
		};

		Intl.NumberFormat = function(locales, options) {
			var numberFormat = {};
			// ECMA 402 Section 11.3.2
			numberFormat.availableLocales = CanonicalizeLocaleList(getAvailableLocales());
			numberFormat.relevantExtensionKeys = [ "nu" ];
			var localeData = {};
			numberFormat.availableLocales.forEach(function(loc) {
				localeData[loc] = {
					"nu" : availableNumberingSystems
				};
			});
			numberFormat.localeData = localeData;

			numberFormat.supportedLocalesOf = Intl.NumberFormat.supportedLocalesOf;

			// ECMA 402 Section 11.3.2
			numberFormat.format = function(value) {
				if(this.boundFormat===undefined){
					var F = function(value) {
						var x = Number(value);
						return FormatNumber(this, x);
					};
					var bf = F.bind(this);
					this.boundFormat = bf;
				}
				return this.boundFormat(value);
			};

			// ECMA 402 Section 11.3.3
			numberFormat.resolvedOptions = function() {
				var fields = [
					"locale",
					"numberingSystem",
					"style",
					"currency",
					"currencyDisplay",
					"minimumIntegerDigits",
					"minimumFractionDigits",
					"maximumFractionDigits",
					"minimumSignificantDigits",
					"maximumSignificantDigits",
					"useGrouping" ];
				result = {};
				for( var f in fields){
					if(this[fields[f]]!==undefined){
						result[fields[f]] = this[fields[f]];
					}
				}
				return result;
			};

			// ECMA 402 Section 11.1.3.1
			numberFormat.prototype = Intl.NumberFormat.prototype;
			numberFormat.extensible = true;
			InitializeNumberFormat(numberFormat, locales, options);
			return numberFormat;
		};

		// ECMA 402 Section 11.1.2.1
		Intl.NumberFormat.call = function(thisObject, locales, options) {
			if(thisObject==Intl||thisObject===undefined){
				new Intl.NumberFormat(locales, options);
			}
			var obj = Object(thisObject);
			if(!obj.isExtensible()){
				throw new TypeError;
			}
			InitializeNumberFormat(obj, locales, options);
			return obj;
		};

		// ECMA 402 Section 11.2.2
		Intl.NumberFormat.supportedLocalesOf = function(locales, options) {
			var availableLocales = getAvailableLocales();
			var requestedLocales = CanonicalizeLocaleList(locales);
			return SupportedLocales(availableLocales, requestedLocales, options);
		};
		
		Intl.DateTimeFormat = function(locales, options) {
			throw new TypeError("Intl.DateTimeFormat is not supported.");
		};
		
		return Intl;
	});