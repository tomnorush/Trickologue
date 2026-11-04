# Gumroad landing page: Trickologue Book + App (unkcjb)

`landing.html` is the custom product page for the €49 bundle, built from the Trickologue website design. It is one self-contained file: the brand fonts (Cinzel, Barlow, Barlow Condensed, subset) and the three images are inlined, so nothing loads from outside Gumroad. It follows the viewer's light or dark setting.

`landing.src.html` is the same page before inlining, easier to read and edit. `{{FONTS}}` and `{{IMG_…}}` mark where the fonts and images go.

## What Gumroad fills in

- Three buy buttons (nav, hero, closing band) carry `data-gumroad-action="buy"`.
- Three price spots carry `data-gumroad-field="price"` and the eyebrow carries `data-gumroad-field="name"`, so a price change on Gumroad shows here without editing the page.
- No prices are typed by hand except the €49 fallback inside those fields.

## Publish

Needs the Gumroad CLI, signed in to Tomas's account (`gumroad auth login`).

```sh
# 1. Run Gumroad's sanitizer without publishing; read .sanitization_report and .warning
gumroad products page preview unkcjb ./gumroad/landing.html --json --no-input --non-interactive

# 2. Publish once the report is clean
gumroad products page publish unkcjb ./gumroad/landing.html --json --no-input --non-interactive

# 3. Get the live URL, then open it and click "I want this" through to checkout
gumroad products page url unkcjb --json --jq '.product.landing_url' --no-input --non-interactive

# Undo: restore Gumroad's default product page
gumroad products page clear unkcjb --yes --json --no-input --non-interactive
```

Check in the report that these survived: the `data-gumroad-*` attributes, the `<button>` elements, the `<script>` (it only colours the nav button and fills the logo ring; the page works without it) and the `@font-face` rules.
