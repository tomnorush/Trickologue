// The app page. It runs inside Scriptable's WebView, the Android WebView and any browser.
// It is injected with toString(), so it must stay self-contained.
//   D.scheme set   -> Scriptable: state goes to the script through trickologue:// requests.
//   window.TQAndroid -> Android: state goes to the app's own file through the JS bridge.
//   otherwise      -> browser: state goes to localStorage.
function pageMain(D, core) {
  const standalone = !D.scheme;
  const KEY = "trickologue:v2";
  const MARK = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32.77 53.99A22 22 0 1 1 50.66 43.66" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="43" cy="51.05" r="4" fill="currentColor"/></svg>';
  const CHEVRON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function loadSaved() {
    if (D.state) return D.state;
    try {
      const raw = window.TQAndroid && window.TQAndroid.load ? window.TQAndroid.load() : window.localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw) || {};
    } catch (e) {}
    return {};
  }
  const saved = loadSaved();
  let custom = core.cleanCustom(saved.custom);
  let cur = core.merge(custom);
  const savedLanded = Array.isArray(saved.landed) ? saved.landed : Object.keys(saved.landed || {});
  const known = new Set(core.ids(cur));
  const landed = new Set(savedLanded.filter((id) => known.has(id)));
  let lang = saved.lang && D.i18n[saved.lang] && saved.lang[0] !== "_"
    ? saved.lang
    : ((navigator.language || "").toLowerCase().indexOf("lt") === 0 && D.i18n.lt ? "lt" : "en");

  const open = new Set(); // trick ids whose details are showing
  let form = null;        // the add / edit sheet, when open
  let armedDelete = null; // trick id waiting for the second tap
  let armedReset = false;

  const t = () => D.i18n[lang];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => (v[k] !== undefined ? v[k] : ""));
  const domId = (id) => "t-" + String(id).replace(/[^a-z0-9-]/gi, "_");
  const has = (id) => landed.has(id);
  const count = (list) => list.filter((x) => landed.has(x.id)).length;
  const uid = () => Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36);
  // One cue word per sentence is in capitals: set it in gold.
  const cue = (s) => esc(s).split(/(\s+)/).map((w) => {
    const coreWord = w.replace(/[.,:;!?()]+$/g, "");
    const letters = coreWord.replace(/[^A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž]/g, "");
    return letters.length >= 2 && letters === letters.toUpperCase() && letters !== letters.toLowerCase()
      ? "<strong>" + coreWord + "</strong>" + w.slice(coreWord.length)
      : w;
  }).join("");
  const levelName = (l) => fmt(t().level, { n: l.numeral });
  const themeOf = (l) => (l.theme && (l.theme[lang] || l.theme.en)) || "";

  // ---------- Saving ----------

  function message() {
    const idx = [];
    core.order.forEach((id, i) => { if (landed.has(id)) idx.push(i.toString(36)); });
    const mine = custom.tricks.filter((x) => landed.has(x.id)).map((x) => x.id);
    return D.scheme + "state?v=2&lang=" + lang + "&p=" + idx.join(".") + "&c=" + mine.join(".") +
      "&d=" + encodeURIComponent(JSON.stringify(custom));
  }
  function snapshot() {
    return JSON.stringify({ v: 2, lang, landed: Array.from(landed), custom, updated: new Date().toISOString() });
  }
  function send(url) { window.location.href = url; }
  function push() {
    if (!standalone) return send(message());
    try {
      if (window.TQAndroid && window.TQAndroid.save) window.TQAndroid.save(snapshot());
      else window.localStorage.setItem(KEY, snapshot());
    } catch (e) {}
  }
  let timer = null;
  function persist() {
    clearTimeout(timer);
    timer = setTimeout(push, 120);
  }
  window.tqMessage = () => (standalone ? "" : message());
  window.tqSnapshot = snapshot;
  window.tqApplyReset = () => { landed.clear(); armedReset = false; render(); };
  window.tqFlush = () => { clearTimeout(timer); push(); };
  // Android's back button: close the sheet if it is open; false lets the app close.
  window.tqBack = () => { if (!form) return false; closeForm(); return true; };

  // ---------- Page ----------

  function levelBadge(done, total, numeral, lg) {
    const p = total ? done / total : 0;
    const cls = "level" + (lg ? " lg" : "") + (total && done === total ? " done" : "");
    return '<span class="' + cls + '" style="--p:' + p.toFixed(3) + '">' + esc(numeral) + "</span>";
  }

  function detailOf(tr) {
    if (tr.custom) return { aka: tr.aka || "", desc: tr.desc || "", cue: tr.cue || "", book: false };
    const all = D.desc && D.desc[tr.id];
    const b = all ? all[lang] || all.en : null;
    return { aka: (b && b.aka) || tr.aka || "", desc: b ? b.d : "", cue: b ? b.cue : "", book: !b };
  }

  function trickRow(tr, setId, nextId) {
    const T = t();
    const on = landed.has(tr.id);
    const isNext = tr.id === nextId;
    const isOpen = open.has(tr.id);
    let h = '<li><div class="rowline' + (isNext ? " is-next" : "") + '">' +
      '<button class="trick" role="checkbox" aria-checked="' + on + '" data-id="' + esc(tr.id) + '" id="' + domId(tr.id) + '">' +
      '<span class="check" aria-hidden="true">✓</span><span class="tname">' + esc(tr.name) + "</span>" +
      (tr.custom ? '<span class="mine">' + esc(T.yours) + "</span>" : "") +
      (isNext ? '<span class="aka">' + esc(T.next) + "</span>" : "") +
      "</button>" +
      '<button class="more" data-more="' + esc(tr.id) + '" aria-expanded="' + isOpen + '" aria-label="' + esc(T.details + ": " + tr.name) + '">' + CHEVRON + "</button></div>";
    if (isOpen) {
      const d = detailOf(tr);
      h += '<div class="detail">';
      if (d.aka) h += '<p class="alt">' + esc(T.alsoKnown) + ": " + esc(d.aka) + "</p>";
      if (d.desc) h += "<p>" + esc(d.desc) + "</p>";
      if (d.cue) h += '<p class="k">' + esc(setId === "variations" && !tr.custom ? T.tryIt : T.coachCue) + "</p><p>" + esc(d.cue) + "</p>";
      if (d.book) h += '<p class="muted">' + esc(T.inBook) + ' <a href="' + esc(D.links.book) + '"' + (standalone ? ' target="_blank" rel="noopener"' : "") + ">" + esc(T.getBook) + "</a></p>";
      if (tr.custom) {
        if (!d.aka && !d.desc && !d.cue) h += '<p class="muted">' + esc(T.noDetails) + "</p>";
        h += '<div class="acts"><button class="mini" data-edit="' + esc(tr.id) + '">' + esc(T.edit) + "</button>" +
          '<button class="mini' + (armedDelete === tr.id ? " danger" : "") + '" data-del="' + esc(tr.id) + '">' +
          esc(armedDelete === tr.id ? T.deleteConfirm : T.delete) + "</button></div>";
      }
      h += "</div>";
    }
    return h + "</li>";
  }

  function familyList(set, f, nextId) {
    const T = t();
    const title = T.families[f.id] || f.id;
    return '<div class="list"><div class="list-head"><h3 class="list-title">' + esc(title) + "</h3>" +
      '<span class="right"><span class="label">' + count(f.tricks) + " / " + f.tricks.length + "</span>" +
      '<button class="addfam" data-add="1" data-set="' + esc(set.id) + '" data-family="' + esc(f.id) + '" aria-label="' +
      esc(fmt(T.addHere, { name: title })) + '">+</button></span></div><ul class="tricks">' +
      f.tricks.map((tr) => trickRow(tr, set.id, nextId)).join("") + "</ul></div>";
  }

  function render() {
    const T = t();
    document.documentElement.lang = lang;
    const sets = [...cur.levels, cur.variations];
    const allT = sets.flatMap((s) => s.families.flatMap((f) => f.tricks));
    const doneAll = count(allT);
    const nx = core.nextTrick(cur, has);
    const nextId = nx ? nx.trick.id : null;
    const ext = standalone ? ' target="_blank" rel="noopener"' : "";
    let h = "";
    h += '<header class="bar"><span class="logo">' + MARK + "<span>Trickologue</span></span>" +
      '<span class="lang" role="group" aria-label="' + esc(T.language) + '">' +
      Object.keys(D.i18n).filter((k) => k[0] !== "_").map((k) =>
        '<button data-lang="' + k + '" aria-pressed="' + (k === lang) + '" title="' + esc(D.i18n[k].langName) + '">' + k.toUpperCase() + "</button>"
      ).join("") + "</span></header>";
    h += "<main>";
    h += '<section class="summary"><p class="sub">' + esc(T.appSubtitle) + "</p>";
    h += '<div class="overall"><span class="label">' + esc(T.overall) + '</span><p class="big">' + doneAll + " <small>/ " + allT.length + "</small></p></div>";
    h += '<div class="progress" style="--p:' + (allT.length ? doneAll / allT.length : 0).toFixed(3) + '"><i></i></div>';
    if (nx) {
      h += '<button class="next" data-goto="' + esc(nx.trick.id) + '"><span class="label">' + esc(T.nextTrick) + " · " +
        esc(levelName(nx.lvl)) + " · " + esc(T.families[nx.fam.id] || nx.fam.id) + "</span><b>" + esc(nx.trick.name) + "</b></button>";
    } else {
      h += '<p class="note">' + esc(T.allLanded) + "</p>";
    }
    const n = cur.levels.length <= 5 ? cur.levels.length : 4;
    h += '<div class="rings" style="--n:' + n + '">' + cur.levels.map((l) => {
      const ts = l.families.flatMap((f) => f.tricks);
      return '<button class="ringbtn" data-goto-level="' + esc(l.id) + '" aria-label="' + esc(levelName(l)) + '">' +
        levelBadge(count(ts), ts.length, l.numeral) + '<span class="label">' + count(ts) + " / " + ts.length + "</span></button>";
    }).join("") + "</div>";
    h += '<button class="btn gold" data-add="1">+ ' + esc(T.addTrick) + "</button>";
    h += '<p class="small">' + esc(T.tapToTick) + "</p></section>";

    for (const l of cur.levels) {
      const ts = l.families.flatMap((f) => f.tricks);
      const theme = themeOf(l);
      h += '<section class="lvl" id="' + esc(l.id) + '"><div class="lvl-head">' + levelBadge(count(ts), ts.length, l.numeral, true) +
        '<h2 class="lvl-title">' + esc(levelName(l)) + '</h2><span class="label">' +
        (theme ? esc(theme) + " · " : "") + count(ts) + " / " + ts.length + "</span></div>";
      for (const f of l.families) h += familyList(l, f, nextId);
      h += "</section>";
    }
    const v = cur.variations;
    const vts = v.families.flatMap((f) => f.tricks);
    h += '<section class="lvl" id="variations"><div class="lvl-head"><span class="tag">' + esc(T.variations) + '</span><h2 class="lvl-title">' +
      esc(T.variations) + '</h2><span class="label">' + count(vts) + " / " + vts.length + '</span><p class="note">' + esc(T.variationsNote) + "</p></div>";
    for (const f of v.families) h += familyList(v, f, null);
    h += "</section>";

    h += '<details class="cue" id="reminder"><summary><span>' + esc(T.reminder) + '</span><span class="label">' + esc(T.tips) + "</span></summary>" +
      T.reminders.map((r) => "<p>" + cue(r) + "</p>").join("") + "</details>";

    h += "<footer>" +
      '<a class="btn" href="' + esc(D.links.training) + '"' + ext + ">" + esc(T.bookTraining) + "</a>" +
      '<a class="btn" href="' + esc(D.links.book) + '"' + ext + ">" + esc(T.getBook) + "</a>" +
      '<p class="small">' + esc(T.safety) + "</p>" +
      '<p class="small">' + esc(D.store === "icloud" ? T.savedICloud : T.savedLocal) + (custom.tricks.length ? " " + esc(T.customNote) : "") + "</p>" +
      '<button class="reset' + (armedReset ? " danger" : "") + '" data-reset="1">' + esc(armedReset ? T.resetConfirmTap : T.reset) + "</button></footer></main>";

    const keepOpen = document.getElementById("reminder");
    const wasOpen = keepOpen ? keepOpen.open : false;
    document.getElementById("app").innerHTML = h;
    if (wasOpen) document.getElementById("reminder").open = true;
  }

  function rerender() {
    const y = window.scrollY;
    render();
    window.scrollTo(0, y);
  }

  // ---------- Add / edit sheet ----------

  function sheetRoot() {
    let el = document.getElementById("sheet");
    if (!el) {
      el = document.createElement("div");
      el.id = "sheet";
      el.className = "sheet";
      el.hidden = true;
      document.body.appendChild(el);
    }
    return el;
  }

  function openForm(init) {
    const nx = core.nextTrick(cur, has);
    form = Object.assign({
      mode: "add", id: null, kind: "trick", name: "", aka: "",
      family: core.TYPES[0], set: nx ? nx.lvl.id : cur.levels[cur.levels.length - 1].id, levelName: "",
      vfam: core.VAR_FAMILIES[0], desc: "", cue: "", error: "",
    }, init || {});
    renderForm();
    if (form.mode === "add") {
      const el = sheetRoot().querySelector("[name=name]");
      if (el) try { el.focus(); } catch (e) {}
    }
  }

  function closeForm() {
    form = null;
    renderForm();
  }

  function renderForm() {
    const root = sheetRoot();
    if (!form) {
      root.innerHTML = "";
      root.hidden = true;
      document.body.style.overflow = "";
      return;
    }
    const T = t();
    const label = (text, optional) => '<span class="label">' + esc(text) + (optional ? "<em>" + esc(T.optional) + "</em>" : "") + "</span>";
    const seg = (field, opts) => '<div class="seg" role="group">' + opts.map((o) =>
      '<button type="button" data-set-field="' + field + '" data-value="' + esc(o[0]) + '" aria-pressed="' + (form[field] === o[0]) + '">' + esc(o[1]) + "</button>"
    ).join("") + "</div>";
    const select = (name, opts) => '<select name="' + name + '">' + opts.map((o) =>
      '<option value="' + esc(o[0]) + '"' + (form[name] === o[0] ? " selected" : "") + ">" + esc(o[1]) + "</option>"
    ).join("") + "</select>";

    let h = '<form novalidate role="dialog" aria-modal="true" aria-labelledby="f-title"><h2 id="f-title">' + esc(form.mode === "edit" ? T.editTrick : T.addTrick) + "</h2>";
    h += '<div class="field">' + label(T.kind) + seg("kind", [["trick", T.kindTrick], ["variation", T.kindVariation]]) + "</div>";
    h += '<label class="field">' + label(T.fieldName) + '<input name="name" maxlength="' + core.LIMITS.name + '" autocomplete="off" autocapitalize="words" placeholder="' + esc(T.fieldNamePh) + '" value="' + esc(form.name) + '"></label>';
    h += '<label class="field">' + label(T.fieldAka, true) + '<input name="aka" maxlength="' + core.LIMITS.aka + '" autocomplete="off" value="' + esc(form.aka) + '"></label>';
    if (form.kind === "trick") {
      h += '<div class="field">' + label(T.fieldType) + seg("family", core.TYPES.map((id) => [id, T.types[id]])) + "</div>";
      const levels = cur.levels.map((l) => [l.id, levelName(l) + (themeOf(l) ? " · " + themeOf(l) : "")]);
      levels.push(["__new", "+ " + fmt(T.newLevel, { n: fmt(T.level, { n: core.roman(cur.levels.length + 1) }) })]);
      h += '<label class="field">' + label(T.fieldLevel) + select("set", levels) + "</label>";
      if (form.set === "__new") {
        h += '<label class="field">' + label(T.fieldLevelName, true) + '<input name="levelName" maxlength="' + core.LIMITS.level + '" autocomplete="off" value="' + esc(form.levelName) + '"></label>';
      }
    } else {
      h += '<label class="field">' + label(T.fieldGroup) + select("vfam", core.VAR_FAMILIES.map((id) => [id, T.families[id] || id])) + "</label>";
    }
    h += '<label class="field">' + label(T.fieldDesc, true) + '<textarea name="desc" maxlength="' + core.LIMITS.desc + '">' + esc(form.desc) + "</textarea></label>";
    h += '<label class="field">' + label(T.fieldCue, true) + '<textarea name="cue" maxlength="' + core.LIMITS.cue + '">' + esc(form.cue) + "</textarea></label>";
    if (form.error) h += '<p class="err" role="alert">' + esc(form.error) + "</p>";
    h += '<div class="actions"><button type="button" class="btn" data-cancel="1">' + esc(T.cancel) + '</button><button type="submit" class="btn solid">' + esc(T.save) + "</button></div></form>";
    root.innerHTML = h;
    root.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function saveForm() {
    const T = t();
    const fail = (msg) => { form.error = msg; renderForm(); };
    const name = form.name.replace(/\s+/g, " ").trim();
    if (!name) return fail(T.errName);
    const next = { levels: custom.levels.map((l) => Object.assign({}, l)), tricks: custom.tricks.map((x) => Object.assign({}, x)) };
    let set;
    let family;
    if (form.kind === "variation") {
      set = "variations";
      family = form.vfam;
    } else {
      set = form.set;
      family = form.family;
      if (set === "__new") {
        set = "clevel-" + uid();
        next.levels.push({ id: set, name: form.levelName });
      }
    }
    const target = set === "variations" ? cur.variations : cur.levels.find((l) => l.id === set);
    const fam = target && target.families.find((f) => f.id === family);
    if (fam && fam.tricks.some((x) => x.id !== form.id && x.name.toLowerCase() === name.toLowerCase())) return fail(T.errDuplicate);
    const entry = { id: form.id || "custom-" + uid(), name, aka: form.aka, set, family, desc: form.desc, cue: form.cue };
    const at = next.tricks.findIndex((x) => x.id === entry.id);
    if (at === -1) next.tricks.push(entry); else next.tricks[at] = entry;
    custom = core.cleanCustom(next);
    cur = core.merge(custom);
    form = null;
    renderForm();
    open.add(entry.id);
    render();
    const row = document.getElementById(domId(entry.id));
    if (row) row.scrollIntoView({ block: "center" });
    persist();
  }

  function removeTrick(id) {
    custom = core.cleanCustom({ levels: custom.levels, tricks: custom.tricks.filter((x) => x.id !== id) });
    cur = core.merge(custom);
    landed.delete(id);
    open.delete(id);
    armedDelete = null;
    rerender();
    persist();
  }

  // ---------- Events ----------

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-id],[data-more],[data-lang],[data-goto],[data-goto-level],[data-reset],[data-add],[data-edit],[data-del],[data-set-field],[data-cancel]");
    const hadArmed = armedDelete !== null || armedReset;
    if (!el) {
      if (e.target.id === "sheet") closeForm();
      if (hadArmed) { armedDelete = null; armedReset = false; rerender(); }
      return;
    }
    const d = el.dataset;
    if (!d.del) armedDelete = null;
    if (!d.reset) armedReset = false;
    if (d.setField) {
      form[d.setField] = d.value;
      form.error = "";
      renderForm();
    } else if (d.cancel) {
      closeForm();
    } else if (d.id) {
      if (landed.has(d.id)) landed.delete(d.id); else landed.add(d.id);
      rerender();
      persist();
    } else if (d.more) {
      if (open.has(d.more)) open.delete(d.more); else open.add(d.more);
      rerender();
    } else if (d.lang) {
      lang = d.lang;
      rerender();
      if (form) renderForm();
      persist();
    } else if (d.goto) {
      if (hadArmed) rerender();
      const target = document.getElementById(domId(d.goto));
      if (target) target.scrollIntoView({ block: "center" });
    } else if (d.gotoLevel) {
      if (hadArmed) rerender();
      const target = document.getElementById(d.gotoLevel);
      if (target) target.scrollIntoView({ block: "start" });
    } else if (d.add) {
      if (hadArmed) rerender();
      if (d.set === "variations") openForm({ kind: "variation", vfam: d.family });
      else if (d.set) openForm({ kind: "trick", set: d.set, family: d.family });
      else openForm();
    } else if (d.edit) {
      const x = custom.tricks.find((c) => c.id === d.edit);
      if (!x) return;
      const isVar = x.set === "variations";
      openForm({
        mode: "edit", id: x.id, kind: isVar ? "variation" : "trick", name: x.name, aka: x.aka || "",
        family: isVar ? core.TYPES[0] : x.family, set: isVar ? cur.levels[0].id : x.set,
        vfam: isVar ? x.family : core.VAR_FAMILIES[0], desc: x.desc || "", cue: x.cue || "",
      });
    } else if (d.del) {
      if (armedDelete === d.del) removeTrick(d.del);
      else { armedDelete = d.del; rerender(); }
    } else if (d.reset) {
      if (!standalone) {
        send(D.scheme + "reset"); // the script asks with a native alert
      } else if (armedReset) {
        landed.clear();
        armedReset = false;
        rerender();
        persist();
      } else {
        armedReset = true;
        rerender();
      }
    }
  });
  document.addEventListener("input", (e) => {
    if (!form || !e.target.name || !(e.target.name in form)) return;
    form[e.target.name] = e.target.value;
    if (e.target.name === "set") renderForm();
  });
  document.addEventListener("submit", (e) => {
    e.preventDefault();
    if (form) saveForm();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && form) closeForm();
  });
  window.addEventListener("pagehide", push);
  render();
}
