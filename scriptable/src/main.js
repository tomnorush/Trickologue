// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: medal;

// TRICKOLOGUE for Scriptable: every trick, in order.
// Source: github.com/tomnorush/Trickologue (scriptable/src/main.js, app/ and data/).
// Do not edit Trickologue.js by hand: change the sources, then run
// `node tools/build.mjs`.
//
// Run the script to tick off tricks and to add your own. Add it as a widget to
// see your next trick.
// Widget parameter (optional): "lt" or "en" forces the widget language.

const CURRICULUM = __CURRICULUM__;
const I18N = __I18N__;
// Descriptions and coach's cues from the book. Empty in the public build.
const DESCRIPTIONS = __DESCRIPTIONS__;
const BUILD = "__BUILD__";

const LINKS = {
  training: "https://calendly.com/tomas-norusevicius/akro",
  book: "https://tomnorush.gumroad.com/l/jlpas",
  instagram: "https://www.instagram.com/trickologue/",
};
const SCHEME = "trickologue://";

const COLORS = {
  mat: "#0a0a0b",
  matRaised: "#141416",
  line: "#2e2b25",
  ink: "#f2f0ea",
  inkMuted: "#a39f95",
  gold: "#e3b341",
  goldSoft: "#2a2212",
  onGold: "#0a0a0b",
};

// ---------- Curriculum (shared by app, page and widget) ----------

__CORE_FN__

const CORE = tqCore(CURRICULUM);

function computeStats(state) {
  const cur = CORE.merge(state.custom);
  const has = (id) => !!state.landed[id];
  const levels = cur.levels.map((lvl) => {
    const fams = lvl.families.map((f) => ({
      id: f.id,
      total: f.tricks.length,
      done: f.tricks.filter((t) => has(t.id)).length,
    }));
    const total = fams.reduce((a, f) => a + f.total, 0);
    const done = fams.reduce((a, f) => a + f.done, 0);
    return { id: lvl.id, numeral: lvl.numeral, total, done, fams };
  });
  const varTricks = cur.variations.families.flatMap((f) => f.tricks);
  const variations = { total: varTricks.length, done: varTricks.filter((t) => has(t.id)).length };
  const total = levels.reduce((a, l) => a + l.total, 0) + variations.total;
  const done = levels.reduce((a, l) => a + l.done, 0) + variations.done;
  const nx = CORE.nextTrick(cur, has);
  const next = nx ? { ...nx.trick, setId: nx.lvl.id, numeral: nx.lvl.numeral, familyId: nx.fam.id } : null;
  return { cur, levels, variations, total, done, next };
}

function defaultLang() {
  try {
    const l = (Device.language() || "").toLowerCase();
    if (l.startsWith("lt")) return "lt";
  } catch (e) {}
  return "en";
}

function fmt(str, vars) {
  return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ""));
}

// ---------- Storage: iCloud Drive when available, so progress survives reinstalls ----------

function openStore() {
  let fm;
  let icloud = false;
  try {
    fm = FileManager.iCloud();
    fm.documentsDirectory();
    icloud = true;
  } catch (e) {
    fm = FileManager.local();
  }
  const dir = fm.joinPath(fm.documentsDirectory(), "Trickologue");
  return { fm, icloud, dir, file: fm.joinPath(dir, "progress.json") };
}

function emptyState() {
  return { v: 2, lang: null, landed: {}, custom: { levels: [], tricks: [] }, updated: null };
}

// Keep only ticks for tricks that exist: the book's and the tricker's own.
function knownLanded(ids, custom) {
  const known = new Set([...CORE.order, ...custom.tricks.map((t) => t.id)]);
  const landed = {};
  for (const id of ids) if (known.has(id)) landed[id] = true;
  return landed;
}

async function loadState(store) {
  const { fm, icloud, file } = store;
  try {
    if (!fm.fileExists(file)) return emptyState();
    if (icloud && !fm.isFileDownloaded(file)) await fm.downloadFileFromiCloud(file);
    const data = JSON.parse(fm.readString(file));
    const custom = CORE.cleanCustom(data.custom);
    const ticked = Object.keys(data.landed || {}).filter((id) => data.landed[id]);
    return { ...emptyState(), ...data, v: 2, custom, landed: knownLanded(ticked, custom) };
  } catch (e) {
    return emptyState();
  }
}

function saveState(store, state) {
  const { fm, dir, file } = store;
  if (!fm.fileExists(dir)) fm.createDirectory(dir, true);
  state.updated = new Date().toISOString();
  fm.writeString(file, JSON.stringify(state, null, 1));
}

// Apply a message from the page. The page always sends its full state,
// so a dropped or merged message never loses a tick or an added trick.
//   p = ticked book tricks as base-36 indexes into the book order
//   c = ticked own tricks, by id            (v2)
//   d = the tricker's own tricks and levels (v2, JSON)
function applyMessage(state, url) {
  const q = url.slice(url.indexOf("?") + 1);
  const params = {};
  for (const part of q.split("&")) {
    const i = part.indexOf("=");
    const k = i === -1 ? part : part.slice(0, i);
    try {
      params[k] = i === -1 ? "" : decodeURIComponent(part.slice(i + 1));
    } catch (e) {
      params[k] = "";
    }
  }
  if (params.lang && I18N[params.lang] && !params.lang.startsWith("_")) state.lang = params.lang;
  if (params.v === "2" && params.d !== undefined) {
    try {
      state.custom = CORE.cleanCustom(JSON.parse(params.d));
    } catch (e) {}
  }
  if (params.p !== undefined) {
    const ids = [];
    for (const s of params.p.split(".")) {
      const i = parseInt(s, 36);
      if (!isNaN(i) && CORE.order[i]) ids.push(CORE.order[i]);
    }
    if (params.c) ids.push(...params.c.split("."));
    state.landed = knownLanded(ids, state.custom);
  }
  return state;
}

// ---------- App (WebView) ----------

async function presentApp() {
  const store = openStore();
  const state = await loadState(store);
  if (!state.lang) state.lang = defaultLang();

  const wv = new WebView();
  let ready = false;

  wv.shouldAllowRequest = (req) => {
    const url = (req && req.url) || "";
    if (url.startsWith(SCHEME)) {
      handleBridge(url);
      return false;
    }
    if (ready && /^https?:\/\//.test(url)) {
      Safari.open(url);
      return false;
    }
    return true;
  };

  function handleBridge(url) {
    const action = url.slice(SCHEME.length).split("?")[0];
    if (action === "state") {
      applyMessage(state, url);
      saveState(store, state);
    } else if (action === "reset") {
      confirmReset();
    }
  }

  async function confirmReset() {
    const t = I18N[state.lang];
    const a = new Alert();
    a.title = t.resetTitle;
    a.message = t.resetBody;
    a.addDestructiveAction(t.resetConfirm);
    a.addCancelAction(t.cancel);
    const choice = await a.presentAlert();
    if (choice === 0) {
      state.landed = {};
      saveState(store, state);
      await wv.evaluateJavaScript("window.tqApplyReset && window.tqApplyReset()");
    }
  }

  await wv.loadHTML(appHTML(state, store.icloud));
  ready = true;
  await wv.present(true);

  // Safety net: read the page state once more after it closes and save it.
  try {
    const last = await Promise.race([
      wv.evaluateJavaScript("window.tqMessage ? window.tqMessage() : ''"),
      new Promise((resolve) => Timer.schedule(1500, false, () => resolve(""))),
    ]);
    if (typeof last === "string" && last.startsWith(SCHEME + "state")) {
      applyMessage(state, last);
      saveState(store, state);
    }
  } catch (e) {}
}

function appHTML(state, icloud) {
  const payload = {
    curriculum: CURRICULUM,
    i18n: I18N,
    desc: DESCRIPTIONS,
    links: LINKS,
    scheme: SCHEME,
    store: icloud ? "icloud" : "local",
    state: { lang: state.lang, landed: Object.keys(state.landed), custom: state.custom },
  };
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");
  return (
    '<!doctype html><html lang="' + state.lang + '"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">' +
    '<meta name="color-scheme" content="dark">' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">' +
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:ital,wght@0,400;0,600;1,600&family=Cinzel:wght@500;600&display=swap">' +
    "<style>" + APP_CSS + "</style></head><body>" +
    '<div id="app"></div>' +
    "<script>(function(){var D=" + json + ";(" + pageMain.toString() + ")(D,(" + tqCore.toString() + ")(D.curriculum));})();</script>" +
    "</body></html>"
  );
}

const APP_CSS = __PAGE_CSS__;

__PAGE_FN__

// ---------- Widget ----------

function hex(c) { return new Color(c); }

function arcPath(cx, cy, r, fromDeg, toDeg) {
  const path = new Path();
  const steps = Math.max(2, Math.ceil(Math.abs(toDeg - fromDeg) / 4));
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const a = ((fromDeg + ((toDeg - fromDeg) * i) / steps) * Math.PI) / 180;
    pts.push(new Point(cx + r * Math.cos(a), cy + r * Math.sin(a)));
  }
  path.addLines(pts);
  return path;
}

// LevelBadge as an image: the ring fills clockwise from 12 o'clock; a full level is a gold disc.
function ringImage(p, label, size, opts = {}) {
  const lw = opts.lineWidth || Math.max(3, Math.round(size / 11));
  const ctx = new DrawContext();
  ctx.size = new Size(size, size);
  ctx.opaque = false;
  ctx.respectScreenScale = true;
  const c = size / 2;
  const r = size / 2 - lw / 2 - 1;
  const gold = hex(opts.gold || COLORS.gold);
  if (p >= 1) {
    ctx.setFillColor(gold);
    ctx.fillEllipse(new Rect(1, 1, size - 2, size - 2));
  } else {
    ctx.setLineWidth(lw);
    ctx.setStrokeColor(hex(opts.track || COLORS.line));
    ctx.addPath(arcPath(c, c, r, -90, 270));
    ctx.strokePath();
    if (p > 0) {
      ctx.setStrokeColor(gold);
      ctx.addPath(arcPath(c, c, r, -90, -90 + 360 * p));
      ctx.strokePath();
    }
  }
  if (label) {
    const fs = opts.fontSize || Math.round(size * 0.32);
    ctx.setFont(opts.font || new Font("Baskerville-SemiBold", fs));
    ctx.setTextColor(p >= 1 ? hex(COLORS.onGold) : hex(opts.textColor || COLORS.gold));
    ctx.setTextAlignedCenter();
    ctx.drawTextInRect(label, new Rect(0, c - fs * 0.62, size, fs * 1.4));
  }
  return ctx.getImage();
}

// The mark (the Spot): an open ring with the landing dot in its gap.
function markImage(size, color) {
  const ctx = new DrawContext();
  ctx.size = new Size(size, size);
  ctx.opaque = false;
  ctx.respectScreenScale = true;
  const s = size / 64;
  ctx.setStrokeColor(hex(color));
  ctx.setLineWidth(6 * s);
  ctx.addPath(arcPath(32 * s, 32 * s, 22 * s, 88, 392));
  ctx.strokePath();
  ctx.setFillColor(hex(color));
  ctx.fillEllipse(new Rect((43 - 4) * s, (51.05 - 4) * s, 8 * s, 8 * s));
  return ctx.getImage();
}

const WFONT = {
  display: (n) => new Font("Baskerville-SemiBold", n),
  condensed: (n) => new Font("AvenirNextCondensed-Bold", n),
  condensedMedium: (n) => new Font("AvenirNextCondensed-DemiBold", n),
};

function addLogo(w, size) {
  const row = w.addStack();
  row.layoutHorizontally();
  row.centerAlignContent();
  const img = row.addImage(markImage(size * 2, COLORS.gold));
  img.imageSize = new Size(size * 1.3, size * 1.3);
  row.addSpacer(5);
  const t = row.addText("TRICKOLOGUE");
  t.font = WFONT.display(size);
  t.textColor = hex(COLORS.gold);
  t.lineLimit = 1;
  t.minimumScaleFactor = 0.7;
  return row;
}

function addNext(stack, T, s, nameSize) {
  if (!s.next) {
    const done = stack.addText(T.allLanded);
    done.font = WFONT.condensedMedium(13);
    done.textColor = hex(COLORS.ink);
    return;
  }
  const label = stack.addText((T.next + " · " + fmt(T.level, { n: s.next.numeral })).toUpperCase());
  label.font = WFONT.condensedMedium(11);
  label.textColor = hex(COLORS.inkMuted);
  label.lineLimit = 1;
  const name = stack.addText(s.next.name.toUpperCase());
  name.font = WFONT.condensed(nameSize);
  name.textColor = hex(COLORS.ink);
  name.lineLimit = 2;
  name.minimumScaleFactor = 0.6;
}

async function buildWidget(family, param) {
  const store = openStore();
  const state = await loadState(store);
  const p = (param || "").trim().toLowerCase();
  const lang = I18N[p] && !p.startsWith("_") ? p : state.lang || defaultLang();
  const T = I18N[lang];
  const s = computeStats(state);
  const w = new ListWidget();
  w.url = URLScheme.forRunningScript();

  if (family === "accessoryCircular") {
    w.addAccessoryWidgetBackground = true;
    const img = w.addImage(ringImage(s.done / s.total, String(s.done), 64, { gold: "#ffffff", track: "#555555", textColor: "#ffffff", fontSize: 18, font: WFONT.condensed(18) }));
    img.centerAlignImage();
    return w;
  }
  if (family === "accessoryRectangular") {
    const top = w.addText(("Trickologue · " + s.done + " / " + s.total).toUpperCase());
    top.font = WFONT.condensedMedium(11);
    addNext(w, T, s, 17);
    return w;
  }
  if (family === "accessoryInline") {
    w.addText(s.next ? T.next + ": " + s.next.name.toUpperCase() : s.done + " / " + s.total);
    return w;
  }

  w.backgroundColor = hex(COLORS.mat);
  const pad = family === "small" ? 14 : 16;
  w.setPadding(pad, pad, pad, pad);

  if (family === "small") {
    addLogo(w, 11);
    w.addSpacer();
    const n = w.addText(s.done + " / " + s.total);
    n.font = WFONT.condensed(26);
    n.textColor = hex(COLORS.gold);
    n.minimumScaleFactor = 0.7;
    w.addSpacer(6);
    addNext(w, T, s, 17);
    return w;
  }

  // medium / large / extraLarge
  const top = w.addStack();
  top.layoutHorizontally();
  top.centerAlignContent();
  addLogo(top, 12);
  top.addSpacer();
  const n = top.addText(s.done + " / " + s.total);
  n.font = WFONT.condensed(20);
  n.textColor = hex(COLORS.gold);
  w.addSpacer();

  const rings = w.addStack();
  rings.layoutHorizontally();
  // Up to six rings fit; with more levels of your own, show the six around the current one.
  let shown = s.levels;
  if (shown.length > 6) {
    const at = Math.max(0, shown.findIndex((l) => s.next && l.id === s.next.setId));
    const from = Math.min(Math.max(0, at - 2), shown.length - 6);
    shown = shown.slice(from, from + 6);
  }
  const ringSize = shown.length > 5 ? 30 : shown.length > 4 ? 34 : 40;
  for (let i = 0; i < shown.length; i++) {
    const l = shown[i];
    const col = rings.addStack();
    col.layoutVertically();
    col.centerAlignContent();
    const img = col.addImage(ringImage(l.done / l.total, l.numeral, 88));
    img.imageSize = new Size(ringSize, ringSize);
    img.centerAlignImage();
    col.addSpacer(3);
    const c = col.addText(l.done + "/" + l.total);
    c.font = WFONT.condensedMedium(11);
    c.textColor = hex(COLORS.inkMuted);
    c.centerAlignText();
    if (i < shown.length - 1) rings.addSpacer();
  }
  w.addSpacer();

  const nx = w.addStack();
  nx.layoutHorizontally();
  nx.backgroundColor = hex(COLORS.goldSoft);
  nx.cornerRadius = 8;
  nx.borderColor = hex(COLORS.gold);
  nx.borderWidth = 1;
  nx.setPadding(8, 10, 8, 10);
  const nxText = nx.addStack();
  nxText.layoutVertically();
  addNext(nxText, T, s, 18);
  nx.addSpacer();

  if (family === "large" || family === "extraLarge") {
    w.addSpacer(12);
    const lvl = s.cur.levels.find((l) => s.next && l.id === s.next.setId);
    if (lvl) {
      for (const f of lvl.families) {
        const row = w.addStack();
        row.layoutHorizontally();
        const name = row.addText((T.families[f.id] || f.id).toUpperCase());
        name.font = WFONT.display(12);
        name.textColor = hex(COLORS.gold);
        row.addSpacer();
        const done = f.tricks.filter((t) => state.landed[t.id]).length;
        const cnt = row.addText(done + " / " + f.tricks.length);
        cnt.font = WFONT.condensedMedium(12);
        cnt.textColor = hex(COLORS.inkMuted);
        const open = f.tricks.filter((t) => !state.landed[t.id]).slice(0, 3).map((t) => t.name.toUpperCase()).join("  ·  ");
        const line = w.addText(open || "✓");
        line.font = WFONT.condensedMedium(13);
        line.textColor = hex(COLORS.ink);
        line.lineLimit = 1;
        line.minimumScaleFactor = 0.7;
        w.addSpacer(6);
      }
    }
  }
  return w;
}

// ---------- Entry ----------

async function run() {
  if (config.runsInWidget || config.runsInAccessoryWidget) {
    const w = await buildWidget(config.widgetFamily || "medium", args.widgetParameter);
    Script.setWidget(w);
  } else {
    await presentApp();
  }
  Script.complete();
}

await run();
