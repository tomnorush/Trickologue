// Builds scriptable/Trickologue.js: src/main.js with the curriculum and strings inlined.
// Usage: node tools/build-scriptable.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const curriculum = JSON.parse(read("data/curriculum.json"));
const i18n = JSON.parse(read("data/i18n.json"));
delete i18n._note;

// The app only needs ids, names and alternative names.
const slim = {
  levels: curriculum.levels.map((l) => ({
    id: l.id,
    numeral: l.numeral,
    theme: l.theme,
    families: l.families.map((f) => ({ id: f.id, tricks: f.tricks.map(({ id, name, aka }) => (aka ? { id, name, aka } : { id, name })) })),
  })),
  variations: {
    id: curriculum.variations.id,
    families: curriculum.variations.families.map((f) => ({ id: f.id, tricks: f.tricks.map(({ id, name, aka }) => (aka ? { id, name, aka } : { id, name })) })),
  },
};

const build = new Date().toISOString().slice(0, 10);
const out = read("scriptable/src/main.js")
  .replace("__CURRICULUM__", () => JSON.stringify(slim))
  .replace("__I18N__", () => JSON.stringify(i18n))
  .replace("__BUILD__", build);

writeFileSync(join(root, "scriptable/Trickologue.js"), out);
console.log(`scriptable/Trickologue.js written (${out.length} bytes, build ${build})`);
