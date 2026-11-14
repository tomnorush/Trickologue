// A minimal stand-in for the Scriptable API, enough to run scriptable/Trickologue.js in Node.
import assert from "node:assert/strict";

export const progressPath = "/icloud/Documents/Trickologue/progress.json";

export function makeEnv({ mode, family, param, files, onWebView, alertChoice = 0 }) {
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
    constructor() { this.shouldAllowRequest = null; this.evaluated = []; }
    async loadHTML(html) { this.html = html; }
    async present() { await onWebView(this); }
    async evaluateJavaScript(js) { this.evaluated.push(js); return this.evalResult || ""; }
  }
  class Alert { addDestructiveAction() {} addCancelAction() {} async presentAlert() { return alertChoice; } }
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

export async function runScript(src, envObj) {
  const names = Object.keys(envObj);
  const body = src.replace(/^await run\(\);\s*$/m, "return run();");
  const fn = new Function(...names, `return (async () => {\n${body}\n})();`);
  await fn(...names.map((n) => envObj[n]));
}

export function texts(el, acc = []) {
  if (el.kind === "text") acc.push(el.v);
  for (const c of el.children || []) texts(c, acc);
  return acc;
}
