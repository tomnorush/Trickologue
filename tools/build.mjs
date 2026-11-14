// Builds every Trickologue app from the shared sources in app/ and data/.
//
//   node tools/build.mjs          public build: no book text
//   node tools/build.mjs --full   also embeds the book's descriptions and coach's
//                                 cues, if data/descriptions.private.json exists
//                                 (see tools/extract-descriptions.py)
//
// Outputs
//   scriptable/Trickologue.js                   the Scriptable script (public build)
//   android/app/src/main/assets/index.html      the page the Android app shows
//   dist/Trickologue.full.js                    Scriptable script with book text (--full)
//
// The public repository only ever holds the public build: dist/ and the Android
// assets are git-ignored, and CI builds the APK from a public build.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const write = (p, s) => {
  mkdirSync(dirname(join(root, p)), { recursive: true });
  writeFileSync(join(root, p), s);
  console.log(`${p} written (${s.length} bytes)`);
};
const full = process.argv.includes("--full");

const curriculum = JSON.parse(read("data/curriculum.json"));
const i18n = JSON.parse(read("data/i18n.json"));
delete i18n._note;

// The apps only need ids, names and alternative names.
const slimFamily = (f) => ({ id: f.id, tricks: f.tricks.map(({ id, name, aka }) => (aka ? { id, name, aka } : { id, name })) });
const slim = {
  levels: curriculum.levels.map((l) => ({ id: l.id, numeral: l.numeral, theme: l.theme, families: l.families.map(slimFamily) })),
  variations: { id: curriculum.variations.id, families: curriculum.variations.families.map(slimFamily) },
};

const privatePath = "data/descriptions.private.json";
const descriptions = full && existsSync(join(root, privatePath)) ? JSON.parse(read(privatePath)) : {};
if (full && !Object.keys(descriptions).length) console.warn(`--full: ${privatePath} not found, building without book text`);

const build = new Date().toISOString().slice(0, 10);
const coreFn = read("app/core.js").trim();
const pageFn = read("app/page.js").trim();
const css = read("app/page.css").trim();
const links = {
  training: "https://calendly.com/tomas-norusevicius/akro",
  book: "https://tomnorush.gumroad.com/l/jlpas",
  instagram: "https://www.instagram.com/trickologue/",
};

function scriptable(desc) {
  return read("scriptable/src/main.js")
    .replace("__CURRICULUM__", () => JSON.stringify(slim))
    .replace("__I18N__", () => JSON.stringify(i18n))
    .replace("__DESCRIPTIONS__", () => JSON.stringify(desc))
    .replace("__BUILD__", build)
    .replace("__CORE_FN__", () => coreFn)
    .replace("__PAGE_FN__", () => pageFn)
    .replace("__PAGE_CSS__", () => "`\n" + css.replace(/[`\\]|\$\{/g, (m) => "\\" + m) + "\n`");
}

// One self-contained page for Android and the browser.
function standalone(desc, fontCss) {
  const payload = { curriculum: slim, i18n, desc, links, scheme: null, store: "local", state: null, build };
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");
  return (
    '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">' +
    '<meta name="color-scheme" content="dark"><meta name="theme-color" content="#0a0a0b">' +
    "<title>Trickologue</title>" +
    "<style>" + fontCss + css + "</style></head><body>" +
    '<div id="app"></div>' +
    "<script>" + coreFn + "\n" + pageFn + "\npageMain(" + json + ", tqCore(" + JSON.stringify(slim).replace(/</g, "\\u003c") + "));</script>" +
    "</body></html>\n"
  );
}

// The brand fonts as data URIs, so the stand-alone page is one file and needs no network.
const RANGES = {
  latin: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
  "latin-ext": "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF",
};
function fontFaces() {
  const dir = join(root, "app/fonts");
  if (!existsSync(dir)) return "";
  let cssText = "";
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".woff2")).sort()) {
    // <family>-<subset>-<weight>-<style>.woff2, e.g. barlow-condensed-latin-ext-700-normal.woff2
    const m = file.match(/^(.+?)-(latin-ext|latin)-(\d{3})-(normal|italic)\.woff2$/);
    if (!m) throw new Error(`app/fonts/${file}: unexpected file name`);
    const family = m[1].split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
    const data = readFileSync(join(dir, file)).toString("base64");
    cssText += `@font-face{font-family:"${family}";font-style:${m[4]};font-weight:${m[3]};font-display:swap;` +
      `src:url(data:font/woff2;base64,${data}) format("woff2");unicode-range:${RANGES[m[2]]}}`;
  }
  return cssText;
}

write("scriptable/Trickologue.js", scriptable({}));
write("android/app/src/main/assets/index.html", standalone(descriptions, fontFaces()));
if (full && Object.keys(descriptions).length) write("dist/Trickologue.full.js", scriptable(descriptions));
