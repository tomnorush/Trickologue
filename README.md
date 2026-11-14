# Trickologue

Every trick, in order. A tricking progression system by Tomas Noruševičius: four levels of 24 tricks, 30 variations, and the coach's reminders.

## What's here

| Path | What |
|---|---|
| `scriptable/Trickologue.js` | The tracker for the Scriptable app on iPhone: tick tricks, add your own tricks and levels, widgets, EN / LT switch. Install steps in `scriptable/README.md`. |
| `android/` | The same tracker as an Android app. How to get or build the APK is in `android/README.md`. |
| `app/` | The page both apps show (`page.js`, `page.css`), the curriculum logic they share (`core.js`) and the bundled fonts. |
| `data/curriculum.json` | The 126 tricks by level and family, with the book's spelling, alternative names and the matching Lovable progress key. |
| `data/i18n.json` | Every UI string and the eight reminders in English and Lithuanian. Trick names stay in English. |
| `gumroad/` | The custom Gumroad product page. |
| `lovable/add-lithuanian.md` | A ready-to-paste prompt that adds the same EN / LT switch to the Lovable app. |
| `docs/app-decision.md` | Why the Lovable version is the base, checked against the brand book. |
| `tools/` | Build and test scripts: `build.mjs` builds both apps, `test-scriptable.mjs` and `test-page.mjs` check them. |

## Live versions

- Web app: https://trickologue.lovable.app
- Book and app: https://tomnorush.gumroad.com/l/jlpas
- Trainings in Vilnius: https://calendly.com/tomas-norusevicius/akro

The book's text and illustrations are not in this repository; it is public. Builds that carry the book's trick descriptions are made locally with `node tools/build.mjs --full` and are git-ignored.
