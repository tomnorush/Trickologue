# Trickologue for Scriptable

The Trickologue tracker as one script for [Scriptable](https://scriptable.app) on iPhone and iPad: all four levels and the 30 variations, the coach's reminders, an EN / LT language switch, and home-screen and lock-screen widgets that show your next trick.

## Install

1. Install Scriptable from the App Store.
2. Open `Trickologue.js` in this folder, tap **Raw**, select all and copy.
3. In Scriptable, tap **+**, paste, and name the script `Trickologue`.
4. Run it. Tap a trick once you land it clean five times in a row.

Progress is saved to `iCloud Drive/Scriptable/Trickologue/progress.json`, so it survives clearing Safari and moves with your Apple ID. Without iCloud it is saved on the device.

## Widget

1. Long-press the home screen, tap **+** and pick Scriptable.
2. Choose small, medium or large and add it.
3. Long-press the widget, **Edit Widget**, set **Script** to `Trickologue`.
4. Optional: set **Parameter** to `lt` or `en` to force the widget's language. Without it the widget follows the language chosen in the app.

Small shows your total and next trick. Medium adds the four level rings. Large adds the open tricks of your current level. Lock-screen circular, rectangular and inline widgets also work.

## How "next trick" is chosen

The lowest level that is not finished, then the family in it with the fewest landed tricks, then that family's first open trick. Families grow together, as the book asks.

## Develop

The script is built from `src/main.js` and the shared data in `../data/`:

```sh
node tools/build-scriptable.mjs   # writes scriptable/Trickologue.js
node tools/test-scriptable.mjs    # runs it against a mock of the Scriptable API
```

The test builds every widget size, ticks tricks through the page bridge, checks the saved file and writes `tools/out/app.html` so the page can be opened in a browser.
