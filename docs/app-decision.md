# Which app version is the base

Two versions of the tracker were live on 28 October 2026. Both hold the same 126 tricks and the same eight reminders. The Lovable version is the base for everything that follows, including the Scriptable port.

| Brand book rule | Lovable (trickologue.lovable.app) | Base44 (trick-master…base44.app) |
|---|---|---|
| Name is Trickologue; "Tricking Academy" is not a name of the brand | TRICKOLOGUE in the header and the title | Header reads TRICKING ACADEMY |
| Black and gold only; no coloured stat tiles | Black ground, gold text and ticks | Brown, blue and green stat tiles with trophy, target and star icons |
| Cinzel for display, condensed caps for trick names | Cinzel for titles; trick names in tracked caps | Serif title; system sans for the rest |
| Reset is not the most visible control | Reset sits in the footer behind a confirm | "Reset All Progress" button sits above Level I |
| Trick order matches the book | Same families and tricks, older spellings | Same families, lists run in reverse order |

What the Lovable version still misses against the book and brand book:

- Gold is drawn as a gradient with a glow; the brand book asks for flat gold.
- Body text is Inter instead of Barlow.
- Nine trick names use older spellings (see `lovable/add-lithuanian.md`).
- Progress lives in the browser only, under the old `tricking-academy:v1` key.

The Scriptable app fixes these: flat gold, the brand fonts, the book's spellings, and progress saved to iCloud Drive.
