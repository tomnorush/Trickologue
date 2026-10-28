# Add Lithuanian to the Lovable app

Paste the prompt below into the Lovable chat of the Trickologue project. It adds an EN / LT switch, keeps every trick name in English, and leaves saved progress alone so nobody loses their ticks. The strings are the same ones the Scriptable app uses (`data/i18n.json`).

---

**Prompt for Lovable**

Add a language switch with English and Lithuanian to the tracker.

1. Put a small two-button toggle, `EN` and `LT`, at the right end of the sticky top bar. The active one uses the gold text colour on a dark gold tint; the other is muted. Save the choice in localStorage under `trickologue:lang` (wrap reads and writes in try/catch). On the first visit, pick `lt` when `navigator.language` starts with "lt", otherwise `en`. Set `<html lang>` to the active language.
2. Do not change the progress storage key (`tricking-academy:v1`) or the progress key format. Trick names stay in English in both languages, exactly as they are now.
3. Translate every other piece of UI text with this table. `{n}` is the Roman numeral.

| Key | English | Lithuanian |
|---|---|---|
| Subtitle | Tricking progression tracker | Trikingo pažangos sekimas |
| Overall progress | Overall progress | Bendra pažanga |
| Level title | LEVEL {n} | {n} LYGIS |
| Nav level link | L{n} | {n} |
| Variations | Variations | Variacijos |
| Tips (nav) | Tips | Patarimai |
| Reminder (section title) | Reminder | Priminimas |
| KICK | Kick | Spyriai |
| SETUP | Setup | Įėjimai |
| FLIP | Flip | Salto |
| TWIST | Twist | Sukiniai |
| Reset button | Reset progress | Išvalyti pažangą |
| Reset confirm | Reset all progress? This cannot be undone. | Išvalyti visą pažangą? To atšaukti nebus galima. |
| Footer note | Your progress is saved locally on this device. | Pažanga saugoma tik šiame įrenginyje. |

4. Replace the eight reminder lines with these, in this order. Keep the words in capitals as they are (they are the coaching cue words).

English:
- Be sure to warm up before each training.
- It's natural to feel fear, but it's your job to be stronger and to control it. Fear shows the way.
- Always keep your eyes on the target and fully EXTEND your toes when kicking.
- When doing a flip, bring your legs together as fast as possible. Ideally, knees should HIT the shoulders. The flip only happens when you tilt your head. After the flips you wanted, first SPOT where you land, then release your legs as quickly as possible.
- When twisting, maximally TIGHTEN the axis: squeeze the glutes, straighten the body, bring the hands to the body.
- Make sure to STRETCH each day.
- There are anatomical limits to how you can enter or exit a trick, but the set of variations is limitless.
- MOVE safely, actively and with fun!

Lithuanian:
- Prieš kiekvieną treniruotę būtinai apšilk.
- Jausti baimę natūralu, bet tavo darbas – būti stipresniam ir ją valdyti. Baimė rodo kelią.
- Spiriant visada žiūrėk į taikinį ir iki galo IŠTEMPK pėdą.
- Darant salto, kuo greičiau prisitrauk kojas. Idealiu atveju keliai turi PALIESTI pečius. Salto įvyks tik tada, kai palenksi galvą. Atlikus norimą salto skaičių, pirmiausia PAŽIŪRĖK, kur nusileisi, tada kuo greičiau ištiesk kojas.
- Sukantis maksimaliai ĮTEMPK ašį: suspausk sėdmenis, ištiesk kūną, prispausk rankas prie kūno.
- Kasdien būtinai TEMPKIS.
- Įėjimą į triuką ir išėjimą iš jo riboja anatomija, bet variacijų aibė – beribė.
- JUDĖK saugiai, aktyviai ir smagiai!

5. Put all strings in one `translations` object keyed by `en` and `lt`, so a third language (German) can be added later by adding one more key.

---

## Separate fix, when you're ready

The Lovable board still uses older spellings for some tricks. The book is now the source of truth. Renaming changes the progress keys, so ask Lovable to migrate saved ticks from the old key to the new one when you do this.

| Lovable now | Book |
|---|---|
| Carrythough | Carry-through |
| Compaso | Compasso |
| Walk Over | Walkover |
| Webster (Looser) | Webster |
| Jacknife | Jackknife |
| Backside700 | Backside 720 |
| Cheat700 (C7) | Cheat 720 (C7) |
| Cheat1220 (C12) | Cheat 1260 (C12) |
| Spyder Man | Spider Man |
