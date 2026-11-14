// Runs scriptable/Trickologue.js in Node against a stand-in for the Scriptable API.
// Checks the shared curriculum logic, that every widget size builds, and that the
// script saves what the page sends it: ticks, language, and the tricker's own
// tricks and levels. Writes the page HTML to tools/out/app.html.
// Usage: node tools/build.mjs && node tools/test-scriptable.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import assert from "node:assert/strict";
import { makeEnv, runScript, texts, progressPath } from "./mock-scriptable.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "scriptable/Trickologue.js"), "utf8");
const outDir = join(root, "tools/out");
mkdirSync(outDir, { recursive: true });
const run = (envObj) => runScript(src, envObj);

const curriculum = JSON.parse(readFileSync(join(root, "data/curriculum.json"), "utf8"));
const ids = [...curriculum.levels, curriculum.variations].flatMap((s) => s.families.flatMap((f) => f.tricks.map((t) => t.id)));
assert.equal(ids.length, 126, "126 tricks including variations");
assert.equal(new Set(ids).size, 126, "trick ids are unique");

// The public build must not carry the book's text.
assert.match(src, /const DESCRIPTIONS = \{\};/, "public build has no book descriptions");

// 0. Shared curriculum logic.
{
  const tqCore = new Function(readFileSync(join(root, "app/core.js"), "utf8") + "\nreturn tqCore;")();
  const core = tqCore(curriculum);
  assert.deepEqual([1, 4, 5, 9, 14, 40].map(core.roman), ["I", "IV", "V", "IX", "XIV", "XL"]);
  assert.deepEqual(core.cleanCustom(null), { levels: [], tricks: [] });
  const dirty = {
    levels: [{ id: "clevel-a", name: "  Legends  " }, { id: "clevel-empty", name: "Unused" }, { id: "bad id" }, { id: "clevel-a", name: "dup" }],
    tricks: [
      { id: "custom-1", name: "  Jack   knife ", set: "clevel-a", family: "twist", desc: " A ".repeat(400), junk: 1 },
      { id: "custom-2", name: "Ghost", set: "clevel-missing", family: "kick" },
      { id: "custom-3", name: "Wrong family", set: "level1", family: "landing" },
      { id: "custom-4", name: "", set: "level1", family: "kick" },
      { id: "level1.kick.front", name: "Hijack", set: "level1", family: "kick" },
      { id: "custom-5", name: "Soft land", set: "variations", family: "landing", aka: "Softy" },
      { id: "custom-6", name: "L1 twist", set: "level1", family: "twist" },
      { id: "custom-1", name: "Duplicate id", set: "level1", family: "kick" },
      "nonsense",
    ],
  };
  const clean = core.cleanCustom(dirty);
  assert.deepEqual(clean.levels, [{ id: "clevel-a", name: "Legends" }], "empty and malformed levels are dropped");
  assert.deepEqual(clean.tricks.map((t) => t.id), ["custom-1", "custom-5", "custom-6"]);
  assert.equal(clean.tricks[0].name, "Jack knife");
  assert.equal(clean.tricks[0].desc.length, core.LIMITS.desc);
  assert.equal("junk" in clean.tricks[0], false);
  const cur = core.merge(clean);
  assert.equal(cur.levels.length, 5);
  assert.equal(cur.levels[4].numeral, "V");
  assert.deepEqual(cur.levels[4].families.map((f) => f.id), ["twist"]);
  assert.deepEqual(cur.levels[0].families.map((f) => f.id), ["kick", "setup", "flip", "twist"], "a new family joins in kick, setup, flip, twist order");
  assert.equal(cur.variations.families.find((f) => f.id === "landing").tricks.at(-1).name, "Soft land");
  assert.equal(core.ids(cur).length, 129);
  assert.equal(curriculum.levels[0].families.length, 3, "merge does not change the book curriculum");
  // Next trick: Level I first; once the book tricks are landed, the lone twist the tricker added.
  const landed = new Set();
  assert.equal(core.nextTrick(cur, (id) => landed.has(id)).trick.id, "level1.kick.front");
  for (const f of curriculum.levels[0].families) for (const t of f.tricks) landed.add(t.id);
  assert.equal(core.nextTrick(cur, (id) => landed.has(id)).trick.id, "custom-6");
  console.log("core                  ok  clean, merge, next trick");
}

// 1. Widgets with no saved progress, every family.
for (const family of ["small", "medium", "large", "extraLarge", "accessoryCircular", "accessoryRectangular", "accessoryInline"]) {
  const t = makeEnv({ mode: "widget", family, files: {} });
  await run(t.env);
  const w = t.getWidget();
  assert.ok(w, `widget built for ${family}`);
  const all = texts(w).join(" | ");
  if (family !== "accessoryCircular") assert.match(all, /FRONT|SPYRIAI|Toliau|TOLIAU/i, `${family} shows the next trick`);
  console.log(`widget ${family.padEnd(21)} ok  ${all.slice(0, 110)}`);
}

// 2. Widget with Level I complete and a forced English parameter.
{
  const landed = {};
  for (const f of curriculum.levels[0].families) for (const tr of f.tricks) landed[tr.id] = true;
  const files = { [progressPath]: JSON.stringify({ v: 1, lang: "lt", landed }), __dir: true };
  const t = makeEnv({ mode: "widget", family: "medium", param: "en", files });
  await run(t.env);
  const all = texts(t.getWidget()).join(" | ");
  assert.match(all, /24 \/ 126/);
  assert.match(all, /NEXT · LEVEL II/);
  console.log("widget level I done   ok  " + all);
}

// 3. App: tick two tricks, switch language, then close. Check what was saved.
//    These are version 1 messages, as an older page would send them.
{
  const files = {};
  const t = makeEnv({
    mode: "app", files,
    onWebView: async (wv) => {
      writeFileSync(join(outDir, "app.html"), wv.html);
      assert.ok(wv.shouldAllowRequest, "bridge installed");
      assert.equal(wv.shouldAllowRequest({ url: "about:blank" }), true);
      // ids 0 and 5 (FRONT kick, HOOK kick) in lang en
      assert.equal(wv.shouldAllowRequest({ url: "trickologue://state?v=1&lang=en&p=0.5" }), false);
      assert.equal(wv.shouldAllowRequest({ url: "https://calendly.com/tomas-norusevicius/akro" }), false);
      wv.evalResult = "trickologue://state?v=1&lang=en&p=0.5.g";
    },
  });
  await run(t.env);
  const saved = JSON.parse(files[progressPath]);
  assert.equal(saved.lang, "en");
  assert.equal(saved.v, 2);
  assert.deepEqual(saved.custom, { levels: [], tricks: [] });
  assert.deepEqual(Object.keys(saved.landed).sort(), [ids[0], ids[5], ids[16]].sort());
  assert.ok(t.calls.some((c) => c[0] === "safari" && c[1].includes("calendly")), "external links open in Safari");
  console.log("app bridge            ok  saved " + Object.keys(saved.landed).join(", "));
}

// 4. Reset clears the ticks and keeps the tricker's own tricks.
{
  const mine = { levels: [], tricks: [{ id: "custom-a1", name: "Jackknife", set: "level2", family: "kick" }] };
  const files = { [progressPath]: JSON.stringify({ v: 2, lang: "lt", landed: { [ids[0]]: true, "custom-a1": true }, custom: mine }), __dir: true };
  const t = makeEnv({
    mode: "app", files,
    onWebView: async (wv) => {
      wv.shouldAllowRequest({ url: "trickologue://reset" });
      await new Promise((r) => setTimeout(r, 20));
      assert.ok(wv.evaluated.some((js) => js.includes("tqApplyReset")), "the page is told to clear its ticks");
    },
  });
  await run(t.env);
  const saved = JSON.parse(files[progressPath]);
  assert.deepEqual(saved.landed, {});
  assert.deepEqual(saved.custom, mine);
  console.log("app reset             ok  ticks cleared, own tricks kept");
}

// 5. Own tricks and a new level arrive from the page, are saved, and show in the widget.
{
  const custom = {
    levels: [{ id: "clevel-x1", name: "Legends" }],
    tricks: [
      { id: "custom-t1", name: "Jackknife", aka: "540 hook + round", set: "level1", family: "kick", desc: "A 540 with a round kick after the hook.", cue: "Snap the hook, then turn the hip over." },
      { id: "custom-t2", name: "Triple cork", set: "clevel-x1", family: "twist" },
      { id: "custom-t3", name: "Ninja land", set: "variations", family: "landing" },
    ],
  };
  const files = {};
  // Level I book tricks: indexes 0..23, all ticked, plus the tricker's Level I kick and the variation.
  const p = Array.from({ length: 24 }, (_, i) => i.toString(36)).join(".");
  const url = "trickologue://state?v=2&lang=en&p=" + p + "&c=custom-t1.custom-t3.custom-unknown&d=" + encodeURIComponent(JSON.stringify(custom));
  const t = makeEnv({
    mode: "app", files,
    onWebView: async (wv) => {
      assert.equal(wv.shouldAllowRequest({ url }), false);
      // A garbled message must not wipe what is saved.
      wv.shouldAllowRequest({ url: "trickologue://state?v=2&lang=en&d=%7Bnot-json" });
      wv.shouldAllowRequest({ url: "trickologue://state?v=2&lang=xx&d=%E0%A4%A" });
    },
  });
  await run(t.env);
  const saved = JSON.parse(files[progressPath]);
  assert.deepEqual(saved.custom, custom);
  assert.equal(Object.keys(saved.landed).length, 26);
  assert.ok(saved.landed["custom-t1"] && saved.landed["custom-t3"] && !saved.landed["custom-unknown"]);
  assert.equal(saved.lang, "en");

  // The page gets the saved tricks back the next time the script runs.
  const t2 = makeEnv({ mode: "app", files, onWebView: async (wv) => {
    assert.match(wv.html, /"name":"Triple cork"/);
    assert.match(wv.html, /"custom-t1","custom-t3"|"custom-t3","custom-t1"/);
    assert.equal(/<\/script>/.test(wv.html.replace(/<\/script><\/body><\/html>$/, "")), false, "page script cannot be cut short");
  } });
  await run(t2.env);

  for (const family of ["medium", "large", "accessoryRectangular"]) {
    const w = makeEnv({ mode: "widget", family, param: "en", files });
    await run(w.env);
    const all = texts(w.getWidget()).join(" | ");
    assert.match(all, /26 \/ 129/, `${family} counts own tricks`);
    assert.match(all, /NEXT · LEVEL II/, `${family} moves on once Level I and its added kick are landed`);
    if (family === "medium") assert.match(all, /\| V \||0\/1/, "the new level has a ring");
    console.log(`widget own ${family.padEnd(17)} ok  ${all.slice(0, 120)}`);
  }

  // With every book level landed, the next trick is the one in the tricker's own level.
  const landed = { ...saved.landed };
  for (const l of curriculum.levels) for (const f of l.families) for (const tr of f.tricks) landed[tr.id] = true;
  const files2 = { [progressPath]: JSON.stringify({ ...saved, landed }), __dir: true };
  const w = makeEnv({ mode: "widget", family: "large", param: "en", files: files2 });
  await run(w.env);
  const all = texts(w.getWidget()).join(" | ");
  assert.match(all, /NEXT · LEVEL V \| TRIPLE CORK/);
  console.log("widget own level      ok  " + all.slice(0, 120));

  // Eight levels of the tricker's own: the widget still builds.
  const many = { levels: [], tricks: [] };
  for (let i = 0; i < 8; i++) {
    many.levels.push({ id: "clevel-m" + i, name: "" });
    many.tricks.push({ id: "custom-m" + i, name: "Move " + i, set: "clevel-m" + i, family: "flip" });
  }
  const files3 = { [progressPath]: JSON.stringify({ v: 2, lang: "en", landed, custom: many }), __dir: true };
  const w3 = makeEnv({ mode: "widget", family: "medium", files: files3 });
  await run(w3.env);
  assert.match(texts(w3.getWidget()).join(" | "), /NEXT · LEVEL V \| MOVE 0/);
  console.log("widget twelve levels  ok");
}

// 6. A damaged progress file never stops the app.
for (const bad of ["{not json", JSON.stringify({ v: 2, landed: "x", custom: { tricks: [null, 5, { id: "custom-ok", name: "Fine", set: "level1", family: "flip" }] } }), "null", "[]"]) {
  const files = { [progressPath]: bad, __dir: true };
  const t = makeEnv({ mode: "widget", family: "small", files });
  await run(t.env);
  assert.ok(t.getWidget());
}
console.log("damaged file          ok");
console.log("All checks passed.");
