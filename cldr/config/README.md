#g11n4js - CLDR Configuration

This directory contains the configuration files for creating the JSON data for Dojo, using the Ldml2JsonConverter utility
which is published as part of Unicode CLDR.

CLDR Version = 24

## Covered Languages

Right now we are creating data only for the subset of CLDR languages in the "top tier".  We can expand the language list later if desired.
At present, we are generating data for Gregorian, Buddhist, Islamic, and ROC calendars, just for a reasonable start.  Here again,
adding more calendar data later is an easy thing to do.

Like ICU, we only use CLDR data if it is draft status "contributed" or "approved".

## How to Generate the JSON
Currently we create the data in three passes:

First pass : Currencies - Since the list of currencies is potentially quite large, we only are interested in currencies in the "modern" coverage level
for CLDR.

Ldml2JsonConverter -t main -r true -i false -k dojo_cldr_currencies_config.txt -s contributed -o false
  -m (ar|ca|cs|da|de|el|en|en_AU|en_CA|en_GB|en_HK|en_IN|es|fi|fr|he|hi|hr|hu|it|ja|ko|nb|nl|pl|pt|pt_PT|ro|root|ru|sk|sl|sr|sv|th|tr|uk|vi|zh|zh_Hant) -l modern

Second pass: Everything else in main...

Ldml2JsonConverter -t main -r true -i false -k dojo_cldr_config.txt -s contributed -o false
  -m (ar|ca|cs|da|de|el|en|en_AU|en_CA|en_GB|en_HK|en_IN|es|fi|fr|he|hi|hr|hu|it|ja|ko|nb|nl|pl|pt|pt_PT|ro|root|ru|sk|sl|sr|sv|th|tr|uk|vi|zh|zh_Hant)

Third pass: Supplemental data used by Dojo (supplemental currency data and language tag canonicalization data).

Ldml2JsonConverter -t supplemental -i false -k dojo_cldr_config.txt -s contributed -o false
  