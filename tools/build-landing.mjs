// Builds gumroad/landing.html: landing.src.html with the subset fonts and the three images inlined,
// so the page loads nothing from outside Gumroad.
// Usage: node tools/build-landing.mjs   (run python3 tools/subset-fonts.py first if it warns about characters)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p, enc = "utf8") => readFileSync(join(root, p), enc);

const src = read("gumroad/landing.src.html");
const fonts = read("gumroad/assets/fonts.css");
const img = (name) => "data:image/jpeg;base64," + read(`gumroad/assets/${name}.jpg`, null).toString("base64");

// Warn when the copy uses a character the font subset does not hold (it would render in a fallback font).
const covered = new Set((fonts.match(/Characters: (.*?) \*\//s) || ["", ""])[1]);
const text = src.replace(/<style>[\s\S]*?<\/style>/, "");
const missing = [...new Set([...text].filter((c) => c.codePointAt(0) > 0x7e && !/\s/.test(c) && !covered.has(c)))];
if (missing.length) console.warn(`Not in the font subset: ${missing.join(" ")}. Run: python3 tools/subset-fonts.py`);

const out = src
  .replace("{{FONTS}}", () => fonts.replace(/^\/\*.*?\*\/\n/s, ""))
  .replace("{{IMG_COVER}}", () => img("cover"))
  .replace("{{IMG_PHONE}}", () => img("phone"))
  .replace("{{IMG_REMINDERS}}", () => img("reminders"));

const left = out.match(/\{\{[A-Z_]+\}\}/g);
if (left) throw new Error(`Unfilled placeholders: ${left.join(", ")}`);
writeFileSync(join(root, "gumroad/landing.html"), out);
console.log(`gumroad/landing.html written (${Buffer.byteLength(out)} bytes)`);
