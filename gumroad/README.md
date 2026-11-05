# Gumroad landing page: Trickologue Book + App (unkcjb)

`landing.html` is the custom product page for the €49 bundle, built from the Trickologue website design. It is one self-contained file: the brand fonts (Cinzel, Barlow, Barlow Condensed, subset to the page's English and Lithuanian characters) and the three images are inlined, so nothing loads from outside Gumroad. It follows the viewer's light or dark setting.

`landing.src.html` is the same page before inlining, easier to read and edit. `{{FONTS}}` and `{{IMG_…}}` mark where the fonts and images go. Never edit `landing.html` by hand.

## What's on the page

- **English and Lithuanian.** An EN / LT switch sits in the nav. Every string is written twice, as `<span lang="en">` and `<span lang="lt">`; the script shows one. First visit follows the browser language, and the choice is remembered (`trickologue:lang`) where the sandbox allows storage. Without the script the page is English. Trick names stay in English in both, as in the apps.
- **Booking on the first screen.** A strip above the nav and a box under the hero buy button link straight to Calendly: group training (`trickologue-group`) and private session (`akro`). The same two links repeat in the authors section, the FAQ, the closing band and the footer.
- **Level quiz.** "Find your level" shows six signature tricks per level; five of six ticked moves you up. The result names your level (I to IV, or the variations), then offers three next steps: buy the bundle, join a group training, book a private session. Without the script a short fallback with the two Calendly links shows instead.
- **Authors.** Tomas Noruševičius and Šarūnas Pupelis, each with an Instagram link (@trickologue, @trick3ris), in the hero byline, the authors section and the footer.
- **The app as it ships.** The browser version for any phone, and the iPhone version in Scriptable with widgets, the EN / LT switch and iCloud Drive saving (`scriptable/`). Level names follow `data/curriculum.json`.

## What Gumroad fills in

- Four buy buttons (nav, hero, quiz result, closing band) carry `data-gumroad-action="buy"`.
- Four price spots carry `data-gumroad-field="price"` and the eyebrow carries `data-gumroad-field="name"`, so a price change on Gumroad shows here without editing the page.
- No prices are typed by hand except the €49 fallback inside those fields.

## Build

```sh
python3 tools/subset-fonts.py     # only when new characters appear in the copy (needs: pip install fonttools brotli)
node tools/build-landing.mjs      # writes gumroad/landing.html; warns if a character is missing from the font subset
```

## Publish

Live since 5 November 2026 at https://tomnorush.gumroad.com/l/trickologue-bundle.

Needs the Gumroad CLI, signed in to Tomas's account (`gumroad auth login`), and network access to gumroad.com.

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

Gumroad's sanitizer always removes the `<meta>` and `<title>` tags (Gumroad supplies its own page head) and the `pathLength` and `open` attributes; the script puts the last two back. Anything else in `.sanitization_report` needs a look.

Check in the report that these survived:

- the `data-gumroad-*` attributes and the `<button>` elements;
- the `lang` attributes on the spans (without them both languages show at once);
- the `<script>` (language switch, quiz, nav ring; without it the page is English and shows the quiz fallback);
- the `id`, `hidden`, `aria-pressed` and inline `style` attributes the quiz uses;
- the `@font-face` rules.

On the live page, also switch to LT, finish the quiz and check that the result's buy button opens checkout and the Calendly buttons open in a new tab.
