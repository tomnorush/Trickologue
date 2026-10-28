// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: medal;

// TRICKOLOGUE for Scriptable: every trick, in order.
// Source: github.com/tomnorush/Trickologue (scriptable/src/main.js + data/).
// Do not edit Trickologue.js by hand: change src/main.js or data/, then run
// `node tools/build-scriptable.mjs`.
//
// Run the script to tick off tricks. Add it as a widget to see your next trick.
// Widget parameter (optional): "lt" or "en" forces the widget language.

const CURRICULUM = __CURRICULUM__;
const I18N = __I18N__;
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

// ---------- Curriculum helpers (shared by app and widget) ----------

function allSets() {
  return [...CURRICULUM.levels, CURRICULUM.variations];
}

function allTricks() {
  const out = [];
  for (const set of allSets()) {
    for (const fam of set.families) {
      for (const t of fam.tricks) out.push({ ...t, setId: set.id, familyId: fam.id, numeral: set.numeral || null });
    }
  }
  return out;
}

function computeStats(landed) {
  const levels = CURRICULUM.levels.map((lvl) => {
    const fams = lvl.families.map((f) => ({
      id: f.id,
      total: f.tricks.length,
      done: f.tricks.filter((t) => landed[t.id]).length,
    }));
    const total = fams.reduce((a, f) => a + f.total, 0);
    const done = fams.reduce((a, f) => a + f.done, 0);
    return { id: lvl.id, numeral: lvl.numeral, total, done, fams };
  });
  const varTricks = CURRICULUM.variations.families.flatMap((f) => f.tricks);
  const variations = { total: varTricks.length, done: varTricks.filter((t) => landed[t.id]).length };
  const total = levels.reduce((a, l) => a + l.total, 0) + variations.total;
  const done = levels.reduce((a, l) => a + l.done, 0) + variations.done;
  const levelsDone = levels.filter((l) => l.done === l.total).length;
  return { levels, variations, total, done, levelsDone, next: nextTrick(landed) };
}

// The one trick to train now: in the lowest unfinished level, take the family
// with the fewest landed tricks (families grow together), then its first open trick.
function nextTrick(landed) {
  for (const lvl of CURRICULUM.levels) {
    const open = lvl.families
      .map((f, i) => ({ f, i, done: f.tricks.filter((t) => landed[t.id]).length }))
      .filter((x) => x.done < x.f.tricks.length);
    if (!open.length) continue;
    open.sort((a, b) => a.done - b.done || a.i - b.i);
    const fam = open[0].f;
    const trick = fam.tricks.find((t) => !landed[t.id]);
    return { ...trick, setId: lvl.id, numeral: lvl.numeral, familyId: fam.id };
  }
  return null;
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

async function loadState(store) {
  const empty = { v: 1, lang: null, landed: {}, updated: null };
  const { fm, icloud, file } = store;
  try {
    if (!fm.fileExists(file)) return empty;
    if (icloud && !fm.isFileDownloaded(file)) await fm.downloadFileFromiCloud(file);
    const data = JSON.parse(fm.readString(file));
    const known = new Set(allTricks().map((t) => t.id));
    const landed = {};
    for (const id of Object.keys(data.landed || {})) if (known.has(id) && data.landed[id]) landed[id] = true;
    return { ...empty, ...data, landed };
  } catch (e) {
    return empty;
  }
}

function saveState(store, state) {
  const { fm, dir, file } = store;
  if (!fm.fileExists(dir)) fm.createDirectory(dir, true);
  state.updated = new Date().toISOString();
  fm.writeString(file, JSON.stringify(state, null, 1));
}

// Apply a message from the page. The page always sends its full state,
// so a dropped or merged message never loses a tick.
function applyMessage(state, url) {
  const q = url.slice(url.indexOf("?") + 1);
  const params = {};
  for (const part of q.split("&")) {
    const [k, v = ""] = part.split("=");
    params[k] = decodeURIComponent(v);
  }
  if (params.lang && I18N[params.lang]) state.lang = params.lang;
  if (params.p !== undefined) {
    const tricks = allTricks();
    const landed = {};
    for (const s of params.p.split(".")) {
      const i = parseInt(s, 36);
      if (!isNaN(i) && tricks[i]) landed[tricks[i].id] = true;
    }
    state.landed = landed;
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
  const tricks = allTricks();
  const payload = {
    curriculum: CURRICULUM,
    i18n: I18N,
    order: tricks.map((t) => t.id),
    landed: Object.keys(state.landed),
    lang: state.lang,
    icloud,
    links: LINKS,
    scheme: SCHEME,
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
    "<script>(" + pageMain.toString() + ")(" + json + ");</script>" +
    "</body></html>"
  );
}

const MARK_SVG =
  '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32.77 53.99A22 22 0 1 1 50.66 43.66" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="43" cy="51.05" r="4" fill="currentColor"/></svg>';

const APP_CSS = `
:root{--mat:#0a0a0b;--mat-raised:#141416;--line:#2e2b25;--ink:#f2f0ea;--ink-muted:#a39f95;--gold:#e3b341;--gold-text:#e3b341;--gold-soft:#2a2212;--on-gold:#0a0a0b;--bail:#ff6b3d;
--display:Cinzel,"Trajan Pro","Times New Roman",serif;--condensed:"Barlow Condensed","Avenir Next Condensed","Arial Narrow",sans-serif;--sans:Barlow,-apple-system,"Segoe UI",system-ui,sans-serif;
--s1:4px;--s2:8px;--s3:12px;--s4:16px;--s6:24px;--s8:32px;--s12:48px;--r-sm:3px;--r-md:8px}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html{scroll-behavior:smooth}
body{margin:0;background:var(--mat);color:var(--ink);font:400 16px/24px var(--sans);padding-bottom:env(safe-area-inset-bottom)}
button{font:inherit;color:inherit}
:focus-visible{outline:2px solid var(--gold-text);outline-offset:2px}
.bar{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:var(--s3);padding:var(--s3) var(--s4);background:rgba(10,10,11,.94);border-bottom:1px solid var(--line);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.logo{display:inline-flex;align-items:center;gap:.4em;color:var(--gold-text);font:600 17px/1 var(--display);letter-spacing:.12em;text-transform:uppercase;white-space:nowrap}
.logo svg{width:1.3em;height:1.3em;flex:none}
.lang{display:inline-flex;border:1px solid var(--line);border-radius:var(--r-sm);overflow:hidden}
.lang button{min-width:40px;height:30px;border:0;background:transparent;color:var(--ink-muted);font:600 12px/1 var(--condensed);letter-spacing:.12em;cursor:pointer}
.lang button[aria-pressed=true]{background:var(--gold-soft);color:var(--gold-text)}
main{max-width:560px;margin:0 auto;padding:0 var(--s4)}
.label{font:600 12px/16px var(--condensed);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-muted);font-variant-numeric:tabular-nums}
.summary{padding:var(--s6) 0 var(--s4);display:grid;gap:var(--s3)}
.sub{margin:0;color:var(--ink-muted);font:600 12px/16px var(--condensed);letter-spacing:.2em;text-transform:uppercase}
.overall{display:flex;align-items:baseline;justify-content:space-between;gap:var(--s3)}
.big{margin:0;color:var(--gold-text);font:700 44px/1 var(--condensed);letter-spacing:-.01em;font-variant-numeric:tabular-nums}
.big small{color:var(--ink-muted);font-size:22px;letter-spacing:.02em}
.progress{height:4px;border-radius:2px;background:var(--line);overflow:hidden}
.progress>i{display:block;height:100%;width:calc(var(--p,0)*100%);background:var(--gold-text)}
.next{display:grid;gap:2px;width:100%;padding:var(--s3) var(--s4);text-align:left;background:var(--gold-soft);border:1px solid var(--gold-text);border-radius:var(--r-md);cursor:pointer}
.next .label{color:var(--gold-text)}
.next b{font:700 20px/1.2 var(--condensed);letter-spacing:.06em;text-transform:uppercase;color:var(--ink)}
.rings{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--s2);padding:var(--s2) 0}
.ringbtn{display:grid;justify-items:center;gap:var(--s1);padding:var(--s2) 0;border:0;background:none;cursor:pointer}
.level{--p:0;position:relative;display:inline-grid;place-items:center;width:52px;height:52px;border-radius:999px;color:var(--gold-text);font:600 17px/1 var(--display);letter-spacing:.04em}
.level::before{content:"";position:absolute;inset:0;border-radius:inherit;background:conic-gradient(var(--gold-text) calc(var(--p)*360deg),var(--line) 0);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 4px),#000 calc(100% - 3.5px));mask:radial-gradient(farthest-side,transparent calc(100% - 4px),#000 calc(100% - 3.5px))}
.level.done{background:var(--gold);color:var(--on-gold)}
.level.done::before{display:none}
.level.lg{width:88px;height:88px;font-size:28px}
section.lvl{padding:var(--s12) 0 var(--s4);scroll-margin-top:60px}
.lvl-head{display:grid;justify-items:center;gap:var(--s3);text-align:center;margin-bottom:var(--s6)}
.lvl-title{margin:0;color:var(--gold-text);font:500 40px/1 var(--display);letter-spacing:.06em;text-transform:uppercase}
.tag{display:inline-block;padding:2px var(--s2);border:1px solid var(--gold-text);border-radius:var(--r-sm);background:var(--gold-soft);color:var(--gold-text);font:600 12px/16px var(--condensed);letter-spacing:.1em;text-transform:uppercase}
.note{margin:0;max-width:34ch;color:var(--ink-muted);font:400 14px/20px var(--sans)}
.list{background:var(--mat-raised);border:1px solid var(--line);border-radius:var(--r-md);padding:var(--s2) var(--s4) var(--s1);margin-bottom:var(--s4)}
.list-head{display:flex;justify-content:space-between;align-items:baseline;gap:var(--s3);padding:var(--s2) 0;border-bottom:1px solid var(--line)}
.list-title{margin:0;color:var(--gold-text);font:600 15px/1.2 var(--display);letter-spacing:.14em;text-transform:uppercase}
.tricks{list-style:none;margin:0;padding:0}
.trick{display:flex;align-items:center;gap:var(--s3);width:100%;min-height:46px;padding:var(--s2) 0;border:0;background:none;text-align:left;cursor:pointer;font:700 16px/1.25 var(--condensed);letter-spacing:.06em;text-transform:uppercase;color:var(--ink)}
li+li .trick{border-top:1px solid var(--line)}
.trick .aka{margin-left:auto;padding-left:var(--s2);color:var(--ink-muted);font:600 12px/16px var(--condensed);letter-spacing:.08em;text-align:right}
.check{display:grid;place-items:center;flex:none;width:22px;height:22px;border:2px solid var(--ink-muted);border-radius:var(--r-sm);color:transparent;font:800 14px/1 var(--sans)}
.trick[aria-checked=true] .check{background:var(--gold);border-color:var(--gold-text);color:var(--on-gold)}
.trick.is-next{margin:0 calc(-1*var(--s2));padding-inline:var(--s2);width:calc(100% + var(--s4));background:var(--gold-soft);border-radius:var(--r-sm);color:var(--gold-text)}
.trick.is-next .aka{color:var(--gold-text)}
.cue{display:grid;gap:var(--s3);margin:var(--s12) 0 var(--s4);padding-top:var(--s3);border-top:2px solid var(--gold-text);scroll-margin-top:60px}
.cue summary{list-style:none;display:flex;justify-content:space-between;align-items:center;cursor:pointer;color:var(--gold-text);font:600 14px/1 var(--display);letter-spacing:.16em;text-transform:uppercase;min-height:32px}
.cue summary::-webkit-details-marker{display:none}
.cue summary .label{color:var(--ink-muted)}
.cue p{margin:0 0 var(--s3);font:italic 600 17px/26px var(--sans);letter-spacing:.02em}
.cue strong{color:var(--gold-text);font-style:italic}
footer{display:grid;gap:var(--s3);padding:var(--s6) 0 var(--s12)}
.btn{display:flex;align-items:center;justify-content:center;height:44px;padding:0 var(--s6);border:1px solid var(--line);border-radius:var(--r-md);background:transparent;color:var(--ink);font:700 15px/1 var(--condensed);letter-spacing:.08em;text-transform:uppercase;text-decoration:none}
.small{margin:0;color:var(--ink-muted);font:400 13px/18px var(--sans)}
.reset{justify-self:start;padding:var(--s2) 0;border:0;background:none;color:var(--ink-muted);font:600 12px/16px var(--condensed);letter-spacing:.12em;text-transform:uppercase;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
@media (prefers-reduced-motion:no-preference){.trick[aria-checked=true] .check{animation:pop 150ms ease-out}@keyframes pop{from{transform:scale(.6)}to{transform:scale(1)}}}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`;

// Runs inside the WebView. Must stay self-contained: it is injected with toString().
function pageMain(D) {
  const landed = new Set(D.landed);
  let lang = D.lang;
  const MARK = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32.77 53.99A22 22 0 1 1 50.66 43.66" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="43" cy="51.05" r="4" fill="currentColor"/></svg>';
  const sets = [...D.curriculum.levels, D.curriculum.variations];
  const t = () => D.i18n[lang];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => (v[k] !== undefined ? v[k] : ""));
  // One cue word per sentence is in capitals: set it in gold.
  const cue = (s) => esc(s).split(/(\s+)/).map((w) => {
    const core = w.replace(/[.,:;!?()]+$/g, "");
    const letters = core.replace(/[^A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž]/g, "");
    return letters.length >= 2 && letters === letters.toUpperCase() && letters !== letters.toLowerCase()
      ? "<strong>" + core + "</strong>" + w.slice(core.length)
      : w;
  }).join("");
  const count = (list) => list.filter((x) => landed.has(x.id)).length;

  function nextTrick() {
    for (const lvl of D.curriculum.levels) {
      const open = lvl.families
        .map((f, i) => ({ f, i, done: count(f.tricks) }))
        .filter((x) => x.done < x.f.tricks.length);
      if (!open.length) continue;
      open.sort((a, b) => a.done - b.done || a.i - b.i);
      const f = open[0].f;
      return { trick: f.tricks.find((x) => !landed.has(x.id)), lvl, fam: f };
    }
    return null;
  }

  function message() {
    const idx = [];
    D.order.forEach((id, i) => { if (landed.has(id)) idx.push(i.toString(36)); });
    return D.scheme + "state?v=1&lang=" + lang + "&p=" + idx.join(".");
  }
  let timer = null;
  function send(url) { window.location.href = url; }
  function persist() {
    clearTimeout(timer);
    timer = setTimeout(() => send(message()), 120);
  }
  window.tqMessage = message;
  window.tqApplyReset = () => { landed.clear(); render(); };
  window.tqSend = send;

  function levelBadge(done, total, numeral, lg) {
    const p = total ? done / total : 0;
    const cls = "level" + (lg ? " lg" : "") + (total && done === total ? " done" : "");
    return '<span class="' + cls + '" style="--p:' + p.toFixed(3) + '">' + numeral + "</span>";
  }

  function trickRow(tr, nextId) {
    const on = landed.has(tr.id);
    const isNext = tr.id === nextId;
    return '<li><button class="trick' + (isNext ? " is-next" : "") + '" role="checkbox" aria-checked="' + on +
      '" data-id="' + esc(tr.id) + '" id="t-' + esc(tr.id).replace(/[^a-z0-9-]/gi, "_") + '">' +
      '<span class="check" aria-hidden="true">✓</span><span>' + esc(tr.name) + "</span>" +
      (isNext ? '<span class="aka">' + esc(t().next) + "</span>" : "") +
      "</button></li>";
  }

  function render() {
    const T = t();
    document.documentElement.lang = lang;
    const allT = sets.flatMap((s) => s.families.flatMap((f) => f.tricks));
    const doneAll = count(allT);
    const nx = nextTrick();
    const nextId = nx ? nx.trick.id : null;
    let h = "";
    h += '<header class="bar"><span class="logo">' + MARK + "<span>Trickologue</span></span>" +
      '<span class="lang" role="group" aria-label="' + esc(T.language) + '">' +
      Object.keys(D.i18n).filter((k) => !k.startsWith("_")).map((k) =>
        '<button data-lang="' + k + '" aria-pressed="' + (k === lang) + '" title="' + esc(D.i18n[k].langName) + '">' + k.toUpperCase() + "</button>"
      ).join("") + "</span></header>";
    h += "<main>";
    h += '<section class="summary"><p class="sub">' + esc(T.appSubtitle) + "</p>";
    h += '<div class="overall"><span class="label">' + esc(T.overall) + '</span><p class="big">' + doneAll + " <small>/ " + allT.length + "</small></p></div>";
    h += '<div class="progress" style="--p:' + (doneAll / allT.length).toFixed(3) + '"><i></i></div>';
    if (nx) {
      h += '<button class="next" data-goto="' + esc(nx.trick.id) + '"><span class="label">' + esc(T.nextTrick) + " · " +
        esc(fmt(T.level, { n: nx.lvl.numeral })) + " · " + esc(T.families[nx.fam.id] || nx.fam.id) + "</span><b>" + esc(nx.trick.name) + "</b></button>";
    } else {
      h += '<p class="note">' + esc(T.allLanded) + "</p>";
    }
    h += '<div class="rings">' + D.curriculum.levels.map((l) => {
      const ts = l.families.flatMap((f) => f.tricks);
      return '<button class="ringbtn" data-goto-level="' + l.id + '" aria-label="' + esc(fmt(T.level, { n: l.numeral })) + '">' +
        levelBadge(count(ts), ts.length, l.numeral) + '<span class="label">' + count(ts) + " / " + ts.length + "</span></button>";
    }).join("") + "</div>";
    h += '<p class="small">' + esc(T.tapToTick) + "</p></section>";

    for (const l of D.curriculum.levels) {
      const ts = l.families.flatMap((f) => f.tricks);
      h += '<section class="lvl" id="' + l.id + '"><div class="lvl-head">' + levelBadge(count(ts), ts.length, l.numeral, true) +
        '<h2 class="lvl-title">' + esc(fmt(T.level, { n: l.numeral })) + '</h2><span class="label">' +
        esc(l.theme[lang] || l.theme.en) + " · " + count(ts) + " / " + ts.length + "</span></div>";
      for (const f of l.families) {
        h += '<div class="list"><div class="list-head"><h3 class="list-title">' + esc(T.families[f.id] || f.id) +
          '</h3><span class="label">' + count(f.tricks) + " / " + f.tricks.length + '</span></div><ul class="tricks">' +
          f.tricks.map((tr) => trickRow(tr, nextId)).join("") + "</ul></div>";
      }
      h += "</section>";
    }
    const v = D.curriculum.variations;
    const vts = v.families.flatMap((f) => f.tricks);
    h += '<section class="lvl" id="variations"><div class="lvl-head"><span class="tag">' + esc(T.variations) + '</span><h2 class="lvl-title">' +
      esc(T.variations) + '</h2><span class="label">' + count(vts) + " / " + vts.length + '</span><p class="note">' + esc(T.variationsNote) + "</p></div>";
    for (const f of v.families) {
      h += '<div class="list"><div class="list-head"><h3 class="list-title">' + esc(T.families[f.id] || f.id) +
        '</h3><span class="label">' + count(f.tricks) + " / " + f.tricks.length + '</span></div><ul class="tricks">' +
        f.tricks.map((tr) => trickRow(tr, null)).join("") + "</ul></div>";
    }
    h += "</section>";

    h += '<details class="cue" id="reminder"><summary><span>' + esc(T.reminder) + '</span><span class="label">' + esc(T.tips) + "</span></summary>" +
      T.reminders.map((r) => "<p>" + cue(r) + "</p>").join("") + "</details>";

    h += "<footer>" +
      '<a class="btn" href="' + esc(D.links.training) + '">' + esc(T.bookTraining) + "</a>" +
      '<a class="btn" href="' + esc(D.links.book) + '">' + esc(T.getBook) + "</a>" +
      '<p class="small">' + esc(T.safety) + "</p>" +
      '<p class="small">' + esc(D.icloud ? T.savedICloud : T.savedLocal) + "</p>" +
      '<button class="reset" data-reset="1">' + esc(T.reset) + "</button></footer></main>";

    const keepOpen = document.getElementById("reminder");
    const wasOpen = keepOpen ? keepOpen.open : false;
    document.getElementById("app").innerHTML = h;
    if (wasOpen) document.getElementById("reminder").open = true;
  }

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-id],[data-lang],[data-goto],[data-goto-level],[data-reset]");
    if (!el) return;
    if (el.dataset.id) {
      const id = el.dataset.id;
      if (landed.has(id)) landed.delete(id); else landed.add(id);
      const y = window.scrollY;
      render();
      window.scrollTo(0, y);
      persist();
    } else if (el.dataset.lang) {
      lang = el.dataset.lang;
      const y = window.scrollY;
      render();
      window.scrollTo(0, y);
      persist();
    } else if (el.dataset.goto) {
      const target = document.getElementById("t-" + el.dataset.goto.replace(/[^a-z0-9-]/gi, "_"));
      if (target) target.scrollIntoView({ block: "center" });
    } else if (el.dataset.gotoLevel) {
      const target = document.getElementById(el.dataset.gotoLevel);
      if (target) target.scrollIntoView({ block: "start" });
    } else if (el.dataset.reset) {
      send(D.scheme + "reset");
    }
  });
  window.addEventListener("pagehide", () => send(message()));
  render();
}

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
  const name = stack.addText(s.next.name);
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
  const s = computeStats(state.landed);
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
    w.addText(s.next ? T.next + ": " + s.next.name : s.done + " / " + s.total);
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
  for (let i = 0; i < s.levels.length; i++) {
    const l = s.levels[i];
    const col = rings.addStack();
    col.layoutVertically();
    col.centerAlignContent();
    const img = col.addImage(ringImage(l.done / l.total, l.numeral, 88));
    img.imageSize = new Size(40, 40);
    img.centerAlignImage();
    col.addSpacer(3);
    const c = col.addText(l.done + "/" + l.total);
    c.font = WFONT.condensedMedium(11);
    c.textColor = hex(COLORS.inkMuted);
    c.centerAlignText();
    if (i < s.levels.length - 1) rings.addSpacer();
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
    const lvl = CURRICULUM.levels.find((l) => s.next && l.id === s.next.setId);
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
        const open = f.tricks.filter((t) => !state.landed[t.id]).slice(0, 3).map((t) => t.name).join("  ·  ");
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
