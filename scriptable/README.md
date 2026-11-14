# Trickologue for Scriptable

The Trickologue tracker as one script for [Scriptable](https://scriptable.app) on iPhone and iPad: all four levels and the 30 variations, your own tricks and levels, the coach's reminders, an EN / LT language switch, and home-screen and lock-screen widgets that show your next trick.

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

## Your own tricks and levels

Tap **+ Add a trick**, or the **+** on any list to add straight to it.

- Choose **Trick** or **Variation**.
- A trick has a type (kick, setup, flip or twist) and a level. Pick **New level** to start Level V and beyond; give it a name if you like.
- A variation goes in one of the four variation groups.
- Name it, and add other names, a description and a coach's cue if you want them.

Your tricks carry a **Yours** tag. Tap the arrow on a row to read its details, and on your own tricks to **Edit** or **Delete** (delete asks for a second tap). A level of your own disappears when its last trick is moved or deleted. Your tricks count towards the totals, the rings, the next trick and the widgets, and they are saved in the same file as your progress. **Reset progress** clears the ticks and keeps your tricks.

## Descriptions from the book

The arrow on a row shows the trick's other names. The book's description and coach's cue for each trick are paid content, so the script in this public repository points to the book instead. A build with the book's text is made locally:

```sh
python3 tools/extract-descriptions.py book-en.txt book-lt.txt   # writes data/descriptions.private.json (git-ignored)
node tools/build.mjs --full                                      # writes dist/Trickologue.full.js (git-ignored)
```

## Develop

The script is built from `src/main.js`, the page in `../app/` and the shared data in `../data/`:

```sh
node tools/build.mjs             # writes scriptable/Trickologue.js and the Android page
node tools/test-scriptable.mjs   # runs the script against a stand-in for the Scriptable API
node tools/test-page.mjs         # drives the page in headless Chrome (needs Playwright)
```

The first test checks the curriculum logic, builds every widget size and checks what the script saves. The second ticks tricks, adds, edits and deletes own tricks and levels, switches language and resets, on the Scriptable page and on the stand-alone page, and writes screenshots to `tools/out/`.
