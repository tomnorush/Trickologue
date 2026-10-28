// Runs scriptable/Trickologue.js in Node against a minimal mock of the Scriptable API.
// Checks that every widget size builds, that the app page saves ticks and language
// through the bridge, and writes the page HTML to tools/out/app.html for a visual check.
// Usage: node tools/test-scriptable.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import assert from "node:assert/strict";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "scriptable/Trickologue.js"), "utf8");
const outDir = join(root, "tools/out");
mkdirSync(outDir, { recursive: true });

function makeEnv({ mode, family, param, files, onWebView }) {
  const calls = [];
  const fsStore = files;
  class Color { constructor(h) { this.hex = h; } }
  class Font { constructor(n, s) { this.name = n; this.size = s; } }
  class Size { constructor(w, h) { this.w = w; this.h = h; } }
  class Rect { constructor(x, y, w, h) { Object.assign(this, { x, y, w, h }); } }
  class Point { constructor(x, y) { this.x = x; this.y = y; } }
  class Path { constructor() { this.pts = []; } addLines(p) { this.pts.push(...p); } }
  class DrawContext {
    constructor() { this.ops = []; }
    setFillColor(c) { this.ops.push(["fill", c.hex]); } setStrokeColor(c) { this.ops.push(["stroke", c.hex]); }
    setLineWidth() {} addPath(p) { assert.ok(p.pts.length >= 2); } strokePath() {} fillEllipse() {}
    setFont(f) { assert.ok(f instanceof Font); } setTextColor() {} setTextAlignedCenter() {} drawTextInRect(t) { assert.equal(typeof t, "string"); }
    getImage() { return { image: true }; }
  }
  class Element { constructor(kind, v) { this.kind = kind; this.v = v; this.children = []; }
    addStack() { const s = new Element("stack"); this.children.push(s); return s; }
    addText(t) { assert.equal(typeof t, "string"); const e = new Element("text", t); this.children.push(e); return e; }
    addImage(i) { assert.ok(i && i.image); const e = new Element("image"); this.children.push(e); return e; }
    addSpacer(n) { this.children.push(new Element("spacer", n)); }
    layoutHorizontally() {} layoutVertically() {} centerAlignContent() {} centerAlignImage() {} centerAlignText() {} setPadding() {}
  }
  class ListWidget extends Element { constructor() { super("widget"); } }
  class FileManagerMock {
    static iCloud() { return new FileManagerMock(); } static local() { return new FileManagerMock(); }
    documentsDirectory() { return "/icloud/Documents"; } joinPath(a, b) { return a + "/" + b; }
    fileExists(p) { return p in fsStore || Object.keys(fsStore).some((k) => k.startsWith(p + "/")) || p === "/icloud/Documents/Trickologue" && "__dir" in fsStore; }
    isFileDownloaded() { return true; } async downloadFileFromiCloud() {}
    readString(p) { return fsStore[p]; } writeString(p, s) { fsStore[p] = s; calls.push(["write", p]); }
    createDirectory() { fsStore.__dir = true; }
  }
  class WebView {
    constructor() { this.shouldAllowRequest = null; }
    async loadHTML(html) { this.html = html; }
    async present() { await onWebView(this); }
    async evaluateJavaScript(js) { return this.evalResult || ""; }
  }
  class Alert { addDestructiveAction() {} addCancelAction() {} async presentAlert() { return 0; } }
  let widget = null;
  const env = {
    Color, Font, Size, Rect, Point, Path, DrawContext, ListWidget, FileManager: FileManagerMock, WebView, Alert,
    Device: { language: () => "lt" },
    URLScheme: { forRunningScript: () => "scriptable:///run/Trickologue" },
    Safari: { open: (u) => calls.push(["safari", u]) },
    Timer: { schedule: (ms, rep, cb) => setTimeout(cb, 5) },
    Script: { setWidget: (w) => { widget = w; }, complete: () => calls.push(["complete"]) },
    config: { runsInWidget: mode === "widget", runsInAccessoryWidget: false, widgetFamily: family },
    args: { widgetParameter: param || null },
  };
  return { env, calls, getWidget: () => widget };
}

async function runScript(envObj) {
  const names = Object.keys(envObj);
  const body = src.replace(/^await run\(\);\s*$/m, "return run();");
  const fn = new Function(...names, `return (async () => {\n${body}\n})();`);
  await fn(...names.map((n) => envObj[n]));
}

function texts(el, acc = []) { if (el.kind === "text") acc.push(el.v); for (const c of el.children || []) texts(c, acc); return acc; }

const curriculum = JSON.parse(readFileSync(join(root, "data/curriculum.json"), "utf8"));
const ids = [...curriculum.levels, curriculum.variations].flatMap((s) => s.families.flatMap((f) => f.tricks.map((t) => t.id)));
assert.equal(ids.length, 126, "126 tricks including variations");
assert.equal(new Set(ids).size, 126, "trick ids are unique");

const progressPath = "/icloud/Documents/Trickologue/progress.json";

// 1. Widgets with no saved progress, every family.
for (const family of ["small", "medium", "large", "extraLarge", "accessoryCircular", "accessoryRectangular", "accessoryInline"]) {
  const t = makeEnv({ mode: "widget", family, files: {} });
  await runScript(t.env);
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
  await runScript(t.env);
  const all = texts(t.getWidget()).join(" | ");
  assert.match(all, /24 \/ 126/);
  assert.match(all, /NEXT · LEVEL II/);
  console.log("widget level I done   ok  " + all);
}

// 3. App: tick two tricks, switch language, then close. Check what was saved.
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
  await runScript(t.env);
  const saved = JSON.parse(files[progressPath]);
  assert.equal(saved.lang, "en");
  assert.deepEqual(Object.keys(saved.landed).sort(), [ids[0], ids[5], ids[16]].sort());
  assert.ok(t.calls.some((c) => c[0] === "safari" && c[1].includes("calendly")), "external links open in Safari");
  console.log("app bridge            ok  saved " + Object.keys(saved.landed).join(", "));
}

// 4. Reset clears everything.
{
  const files = { [progressPath]: JSON.stringify({ v: 1, lang: "lt", landed: { [ids[0]]: true } }), __dir: true };
  const t = makeEnv({
    mode: "app", files,
    onWebView: async (wv) => {
      wv.shouldAllowRequest({ url: "trickologue://reset" });
      await new Promise((r) => setTimeout(r, 20));
    },
  });
  await runScript(t.env);
  assert.deepEqual(JSON.parse(files[progressPath]).landed, {});
  console.log("app reset             ok");
}
console.log("All checks passed.");
