# Fonts

The brand fonts, bundled so the Android app works with no connection:
Cinzel, Barlow and Barlow Condensed, Latin and Latin Extended subsets (the
second carries the Lithuanian letters). Files come from the `@fontsource`
packages, version 5.3.0.

All three families are licensed under the SIL Open Font License 1.1
(https://openfontlicense.org): Cinzel © The Cinzel Project Authors, Barlow and
Barlow Condensed © The Barlow Project Authors.

`tools/build.mjs` embeds them in the stand-alone page. The Scriptable script
loads the same families from Google Fonts instead, to stay small.
