// Curriculum logic shared by the Scriptable script, its widgets and the app page.
// It is injected into the page with toString(), so it must stay self-contained.
function tqCore(BASE) {
  const TYPES = ["kick", "setup", "flip", "twist"];
  const VAR_FAMILIES = BASE.variations.families.map((f) => f.id);
  const LIMITS = { name: 60, aka: 80, level: 40, desc: 600, cue: 400, tricks: 300, levels: 20 };
  const order = [...BASE.levels, BASE.variations].flatMap((s) => s.families.flatMap((f) => f.tricks.map((t) => t.id)));

  function roman(n) {
    const map = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    let out = "";
    for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
    return out;
  }

  const text = (v, max) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

  // The tricker's own tricks and levels, as read from disk or sent by the page.
  // Anything malformed is dropped, so a bad file never breaks the app.
  function cleanCustom(raw) {
    const out = { levels: [], tricks: [] };
    if (!raw || typeof raw !== "object") return out;
    const baseLevels = new Set(BASE.levels.map((l) => l.id));
    const levels = [];
    const levelIds = new Set();
    for (const l of Array.isArray(raw.levels) ? raw.levels : []) {
      if (levels.length >= LIMITS.levels) break;
      if (!l || typeof l.id !== "string" || !/^clevel-[a-z0-9]{1,24}$/.test(l.id) || levelIds.has(l.id)) continue;
      levelIds.add(l.id);
      levels.push({ id: l.id, name: text(l.name, LIMITS.level) });
    }
    const seen = new Set();
    for (const t of Array.isArray(raw.tricks) ? raw.tricks : []) {
      if (out.tricks.length >= LIMITS.tricks) break;
      if (!t || typeof t.id !== "string" || !/^custom-[a-z0-9]{1,24}$/.test(t.id) || seen.has(t.id)) continue;
      const name = text(t.name, LIMITS.name);
      if (!name) continue;
      const isVariation = t.set === "variations";
      if (!isVariation && !baseLevels.has(t.set) && !levelIds.has(t.set)) continue;
      if (!(isVariation ? VAR_FAMILIES : TYPES).includes(t.family)) continue;
      seen.add(t.id);
      const entry = { id: t.id, name, set: t.set, family: t.family };
      const aka = text(t.aka, LIMITS.aka);
      const desc = text(t.desc, LIMITS.desc);
      const cue = text(t.cue, LIMITS.cue);
      if (aka) entry.aka = aka;
      if (desc) entry.desc = desc;
      if (cue) entry.cue = cue;
      out.tricks.push(entry);
    }
    // A level of your own exists only while it holds a trick.
    out.levels = levels.filter((l) => out.tricks.some((t) => t.set === l.id));
    return out;
  }

  // The book's curriculum with the tricker's own tricks and levels added.
  function merge(custom) {
    const copy = (f) => ({ id: f.id, tricks: f.tricks.slice() });
    const levels = BASE.levels.map((l) => ({ id: l.id, numeral: l.numeral, theme: l.theme, families: l.families.map(copy) }));
    ((custom && custom.levels) || []).forEach((l, i) => {
      levels.push({ id: l.id, numeral: roman(BASE.levels.length + i + 1), theme: { en: l.name, lt: l.name }, custom: true, families: [] });
    });
    const variations = { id: BASE.variations.id, families: BASE.variations.families.map(copy) };
    for (const t of (custom && custom.tricks) || []) {
      const set = t.set === "variations" ? variations : levels.find((l) => l.id === t.set);
      if (!set) continue;
      let fam = set.families.find((f) => f.id === t.family);
      if (!fam) {
        fam = { id: t.family, tricks: [] };
        const at = set.families.findIndex((f) => TYPES.indexOf(f.id) > TYPES.indexOf(t.family));
        if (at === -1) set.families.push(fam); else set.families.splice(at, 0, fam);
      }
      fam.tricks.push({ id: t.id, name: t.name, aka: t.aka, desc: t.desc, cue: t.cue, custom: true });
    }
    return { levels, variations };
  }

  // The one trick to train now: in the lowest unfinished level, take the family
  // with the fewest landed tricks (families grow together), then its first open trick.
  function nextTrick(cur, has) {
    for (const lvl of cur.levels) {
      const open = lvl.families
        .map((f, i) => ({ f, i, done: f.tricks.filter((t) => has(t.id)).length }))
        .filter((x) => x.done < x.f.tricks.length);
      if (!open.length) continue;
      open.sort((a, b) => a.done - b.done || a.i - b.i);
      const fam = open[0].f;
      return { trick: fam.tricks.find((t) => !has(t.id)), lvl, fam };
    }
    return null;
  }

  function ids(cur) {
    return [...cur.levels, cur.variations].flatMap((s) => s.families.flatMap((f) => f.tricks.map((t) => t.id)));
  }

  return { TYPES, VAR_FAMILIES, LIMITS, order, roman, cleanCustom, merge, nextTrick, ids };
}
