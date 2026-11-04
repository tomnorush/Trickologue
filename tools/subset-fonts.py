#!/usr/bin/env python3
"""Writes gumroad/assets/fonts.css: the brand fonts, subset to the characters the
Gumroad page uses (English and Lithuanian), as inline WOFF2 @font-face rules.

Run it again after copy changes add new characters; tools/build-landing.mjs warns when that is needed.
Needs: pip install fonttools brotli
Usage: python3 tools/subset-fonts.py
"""
import base64
import io
import re
import urllib.request
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "gumroad" / "landing.src.html"
OUT = ROOT / "gumroad" / "assets" / "fonts.css"

CSS_URL = (
    "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700"
    "&family=Barlow:ital,wght@0,400;0,600;1,600&family=Cinzel:wght@500;600&display=swap"
)

# Always kept, whatever the copy says: printable ASCII, Latin-1, every Lithuanian letter in both cases,
# and the punctuation the brand uses.
BASE = "".join(chr(c) for c in range(0x20, 0x7F)) + "".join(chr(c) for c in range(0xA0, 0x100))
BASE += "ĄąČčĘęĖėĮįŠšŲųŪūŽž" + "–—‘’‚“”„•…€→×∞"


def page_text():
    html = SRC.read_text(encoding="utf-8")
    html = re.sub(r"<style>.*?</style>", "", html, flags=re.S)
    html = re.sub(r"<script>.*?</script>", "", html, flags=re.S)
    # Strings the script writes (titles, alt text) live inside the script; keep their characters too.
    script = re.search(r"<script>(.*?)</script>", SRC.read_text(encoding="utf-8"), flags=re.S)
    return html + (script.group(1) if script else "")


def main():
    chars = sorted(set(BASE) | {c for c in page_text() if ord(c) >= 0x20})
    text = "".join(chars)
    req = urllib.request.Request(CSS_URL)  # no User-Agent: Google serves full TTF files, which subset cleanly
    css = urllib.request.urlopen(req).read().decode()
    faces = re.findall(r"@font-face\s*{(.*?)}", css, flags=re.S)
    rules = []
    for face in faces:
        family = re.search(r"font-family:\s*'([^']+)'", face).group(1)
        style = re.search(r"font-style:\s*(\w+)", face).group(1)
        weight = re.search(r"font-weight:\s*(\d+)", face).group(1)
        url = re.search(r"url\((https://[^)]+)\)", face).group(1)
        raw = urllib.request.urlopen(url).read()
        font = TTFont(io.BytesIO(raw))
        opts = subset.Options()
        opts.flavor = "woff2"
        opts.layout_features = ["kern", "liga", "calt", "ccmp", "locl", "mark", "mkmk", "tnum", "lnum"]
        opts.name_IDs = [0, 1, 2, 3, 4, 5, 6]
        opts.notdef_outline = True
        sub = subset.Subsetter(opts)
        sub.populate(text=text)
        sub.subset(font)
        buf = io.BytesIO()
        font.flavor = "woff2"
        font.save(buf)
        b64 = base64.b64encode(buf.getvalue()).decode()
        print(f"{family} {style} {weight}: {len(buf.getvalue())} bytes")
        rules.append(
            f'@font-face{{font-family:"{family}";font-style:{style};font-weight:{weight};font-display:swap;'
            f'src:url(data:font/woff2;base64,{b64}) format("woff2");}}'
        )
    covered = "".join(c for c in chars if not c.isspace())
    header = "/* Brand fonts subset for the Gumroad page by tools/subset-fonts.py. Characters: " + covered.replace("*/", "* /") + " */"
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(header + "\n" + "\n".join(rules) + "\n", encoding="utf-8")
    print(f"{OUT.relative_to(ROOT)} written ({OUT.stat().st_size} bytes, {len(chars)} characters)")


if __name__ == "__main__":
    main()
