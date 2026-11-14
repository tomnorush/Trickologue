#!/usr/bin/env python3
"""Pull each trick's description and coach's cue out of the book text.

The book is paid content and this repository is public, so the output is
written to data/descriptions.private.json, which is git-ignored. The build
script embeds it when the file exists and leaves descriptions out otherwise.

Usage:
  python3 tools/extract-descriptions.py book-en.txt book-lt.txt

Each input is the plain-text (markdown) export of the book's Google Doc in
that language. Trick entries are table rows of the form
  | ☐ | **NAME**   *Also known as*Description.**COACH'S CUE**   Cue text. |
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ROW = re.compile(
    r"^\| ☐ \| \\\*\\\*(?P<name>.+?)\\\*\\\*"      # **NAME**
    r"(?:\s+\\\*(?P<aka>.+?)\\\*)?"                 # *aka* (optional)
    r"(?P<desc>.*?)"
    r"\\\*\\\*(?P<label>[^*]+?)\\\*\\\*"            # **COACH'S CUE** / **TRY IT**
    r"\s*(?P<cue>.*?)\s*\|\s*$"
)


def clean(s):
    s = re.sub(r"\\([*_.\-()\[\]#!>~`+|\\])", r"\1", s or "")
    return re.sub(r"\s+", " ", s).strip()


def parse(path):
    rows = []
    for line in Path(path).read_text(encoding="utf8").split("\n"):
        m = ROW.match(line)
        if m:
            rows.append({k: clean(v) for k, v in m.groupdict().items()})
    return rows


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    books = {"en": parse(sys.argv[1]), "lt": parse(sys.argv[2])}
    cur = json.loads((ROOT / "data/curriculum.json").read_text(encoding="utf8"))
    tricks = []
    for s in cur["levels"] + [cur["variations"]]:
        for f in s["families"]:
            tricks += f["tricks"]

    out = {}
    for lang, rows in books.items():
        # Row 0 is the "how to read a trick entry" sample, so start after it
        # and walk the entries in curriculum order.
        pos = 1
        for t in tricks:
            want = t["name"].upper()
            hit = next((i for i in range(pos, len(rows)) if rows[i]["name"].upper() == want), None)
            if hit is None:
                sys.exit(f"{lang}: no entry for {t['name']} ({t['id']})")
            r = rows[hit]
            pos = hit + 1
            e = {"d": r["desc"], "cue": r["cue"]}
            if r["aka"] and r["aka"] != t.get("aka"):
                e["aka"] = r["aka"]
            out.setdefault(t["id"], {})[lang] = e
    dest = ROOT / "data/descriptions.private.json"
    dest.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf8")
    n = sum(len(v) for v in out.values())
    print(f"{dest.relative_to(ROOT)}: {len(out)} tricks, {n} entries")


if __name__ == "__main__":
    main()
