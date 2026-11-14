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

const CURRICULUM = {"levels":[{"id":"level1","numeral":"I","theme":{"en":"Foundations","lt":"Pagrindai"},"families":[{"id":"kick","tricks":[{"id":"level1.kick.front","name":"FRONT","aka":"Front kick"},{"id":"level1.kick.back","name":"BACK","aka":"Back kick"},{"id":"level1.kick.side","name":"SIDE","aka":"Side kick"},{"id":"level1.kick.crescent-in-out","name":"CRESCENT (IN/OUT)","aka":"Inside and outside crescent"},{"id":"level1.kick.round","name":"ROUND","aka":"Roundhouse kick"},{"id":"level1.kick.hook","name":"HOOK","aka":"Hook kick"},{"id":"level1.kick.butterfly","name":"BUTTERFLY","aka":"Butterfly kick, B-kick"},{"id":"level1.kick.shant","name":"SHANT"}]},{"id":"setup","tricks":[{"id":"level1.setup.pop","name":"POP"},{"id":"level1.setup.punch","name":"PUNCH"},{"id":"level1.setup.front-sweep","name":"FRONT SWEEP"},{"id":"level1.setup.cartwheel","name":"CARTWHEEL"},{"id":"level1.setup.reverse-pop","name":"REVERSE POP"},{"id":"level1.setup.round-off","name":"ROUND OFF","aka":"Roundoff"},{"id":"level1.setup.back-sweep","name":"BACK SWEEP"},{"id":"level1.setup.carry-through","name":"CARRY-THROUGH","aka":"Carrythrough"}]},{"id":"flip","tricks":[{"id":"level1.flip.roll","name":"ROLL","aka":"Forward and backward roll"},{"id":"level1.flip.dive","name":"DIVE","aka":"Dive roll"},{"id":"level1.flip.handstand","name":"HANDSTAND","aka":"Bananeira in capoeira"},{"id":"level1.flip.front-flack","name":"FRONT FLACK","aka":"Front handspring, flic-flac"},{"id":"level1.flip.bridge","name":"BRIDGE","aka":"Ponte in capoeira"},{"id":"level1.flip.walkover","name":"WALKOVER","aka":"Back and front walkover"},{"id":"level1.flip.macaco","name":"MACACO"},{"id":"level1.flip.back-flack","name":"BACK FLACK","aka":"Back handspring, flic-flac"}]}]},{"id":"level2","numeral":"II","theme":{"en":"Building blocks","lt":"Kertiniai elementai"},"families":[{"id":"kick","tricks":[{"id":"level2.kick.compasso","name":"COMPASSO","aka":"Meia lua de compasso"},{"id":"level2.kick.tornado","name":"TORNADO"},{"id":"level2.kick.palm","name":"PALM","aka":"Palm kick"},{"id":"level2.kick.moon","name":"MOON","aka":"Moon kick"},{"id":"level2.kick.pop-360","name":"POP 360"},{"id":"level2.kick.feilong","name":"FEILONG"},{"id":"level2.kick.au-batido","name":"AU BATIDO","aka":"Aú batido, L-kick"},{"id":"level2.kick.flash","name":"FLASH","aka":"Flash kick"}]},{"id":"setup","tricks":[{"id":"level2.setup.j-step","name":"J-STEP"},{"id":"level2.setup.scoot","name":"SCOOT"},{"id":"level2.setup.vanish","name":"VANISH"},{"id":"level2.setup.transformer","name":"TRANSFORMER","aka":"Machine"},{"id":"level2.setup.pivot","name":"PIVOT"},{"id":"level2.setup.blasterscoot","name":"BLASTERSCOOT","aka":"Blaster scoot"},{"id":"level2.setup.missleg","name":"MISSLEG"},{"id":"level2.setup.spyder","name":"SPYDER","aka":"Snowbubble"}]},{"id":"flip","tricks":[{"id":"level2.flip.side","name":"SIDE","aka":"Side flip"},{"id":"level2.flip.front","name":"FRONT","aka":"Front tuck"},{"id":"level2.flip.back","name":"BACK","aka":"Back tuck, backflip"},{"id":"level2.flip.sailor-moon","name":"SAILOR MOON"},{"id":"level2.flip.raiz","name":"RAIZ"},{"id":"level2.flip.aerial","name":"AERIAL"},{"id":"level2.flip.cheat-gainer","name":"CHEAT GAINER","aka":"Slant gainer, gainer flash"},{"id":"level2.flip.spyder","name":"SPYDER","aka":"Snowbubble"}]}]},{"id":"level3","numeral":"III","theme":{"en":"Advanced moves","lt":"Pažangūs judesiai"},"families":[{"id":"setup","tricks":[{"id":"level3.setup.tdr","name":"TDR","aka":"Touchdown raiz"},{"id":"level3.setup.swing","name":"SWING","aka":"Swing-through"},{"id":"level3.setup.valdez","name":"VALDEZ"},{"id":"level3.setup.masterscoot","name":"MASTERSCOOT"},{"id":"level3.setup.gumbi","name":"GUMBI","aka":"Gumby"},{"id":"level3.setup.wrap","name":"WRAP","aka":"Wrap-through"},{"id":"level3.setup.rapid","name":"RAPID"},{"id":"level3.setup.envergado","name":"ENVERGADO"}]},{"id":"flip","tricks":[{"id":"level3.flip.webster","name":"WEBSTER","aka":"Loser"},{"id":"level3.flip.gainer","name":"GAINER"},{"id":"level3.flip.arabian","name":"ARABIAN"},{"id":"level3.flip.tunnel","name":"TUNNEL","aka":"Tunnel flip"},{"id":"level3.flip.helicoptero","name":"HELICOPTERO","aka":"Helicóptero"},{"id":"level3.flip.reversao","name":"REVERSAO","aka":"Reversão"},{"id":"level3.flip.lonestar","name":"LONESTAR"},{"id":"level3.flip.dleg","name":"DLEG","aka":"Doubleleg, D-leg, armada dupla"}]},{"id":"twist","tricks":[{"id":"level3.twist.a-twist","name":"A-TWIST","aka":"Aerial twist"},{"id":"level3.twist.b-twist","name":"B-TWIST","aka":"Butterfly twist"},{"id":"level3.twist.cork","name":"CORK","aka":"Corkscrew"},{"id":"level3.twist.dleg-twist","name":"DLEG TWIST","aka":"Doubleleg twist"},{"id":"level3.twist.cartfull","name":"CARTFULL","aka":"Cartwheel full"},{"id":"level3.twist.backfull","name":"BACKFULL","aka":"Back full, full twist"},{"id":"level3.twist.side-twist","name":"SIDE TWIST"},{"id":"level3.twist.1990","name":"1990","aka":"Handspin"}]}]},{"id":"level4","numeral":"IV","theme":{"en":"Doubles and pro tricks","lt":"Dvigubi ir profų triukai"},"families":[{"id":"kick","tricks":[{"id":"level4.kick.540","name":"540","aka":"540 kick"},{"id":"level4.kick.backside-720","name":"BACKSIDE 720","aka":"Backside 700"},{"id":"level4.kick.cheat-720-c7","name":"CHEAT 720 (C7)","aka":"Cheat 700"},{"id":"level4.kick.cheat-1080-c10","name":"CHEAT 1080 (C10)"},{"id":"level4.kick.jackknife","name":"JACKKNIFE","aka":"Jacknife"},{"id":"level4.kick.sideswipe","name":"SIDESWIPE"},{"id":"level4.kick.cheat-900-c9","name":"CHEAT 900 (C9)"},{"id":"level4.kick.cheat-1260-c12","name":"CHEAT 1260 (C12)","aka":"Cheat 1220"}]},{"id":"flip","tricks":[{"id":"level4.flip.dub-side","name":"DUB SIDE","aka":"Double side flip"},{"id":"level4.flip.dub-back","name":"DUB BACK","aka":"Double back"},{"id":"level4.flip.dub-front","name":"DUB FRONT","aka":"Double front"},{"id":"level4.flip.dub-gainer","name":"DUB GAINER","aka":"Double gainer"},{"id":"level4.flip.vortex","name":"VORTEX"},{"id":"level4.flip.dub-arabian","name":"DUB ARABIAN","aka":"Double Arabian"},{"id":"level4.flip.fliffus","name":"FLIFFUS","aka":"Fliffus"},{"id":"level4.flip.dub-tunnel","name":"DUB TUNNEL","aka":"Double tunnel flip"}]},{"id":"twist","tricks":[{"id":"level4.twist.dub-a-twist","name":"DUB A-TWIST","aka":"Double aerial twist"},{"id":"level4.twist.dub-b-twist","name":"DUB B-TWIST","aka":"Double butterfly twist"},{"id":"level4.twist.dub-cork","name":"DUB CORK","aka":"Double cork"},{"id":"level4.twist.dub-dleg-twist","name":"DUB DLEG-TWIST","aka":"Double-leg double twist"},{"id":"level4.twist.dub-backfull","name":"DUB BACKFULL","aka":"Double full"},{"id":"level4.twist.half-in","name":"HALF IN","aka":"Half-in half-out"},{"id":"level4.twist.full-in","name":"FULL IN","aka":"Full-in back-out"},{"id":"level4.twist.ramen-king","name":"RAMEN KING"}]}]}],"variations":{"id":"variations","families":[{"id":"shapes","tricks":[{"id":"variations.shapes.lay-stall","name":"LAY / STALL","aka":"Layout"},{"id":"variations.shapes.pike","name":"PIKE"},{"id":"variations.shapes.x","name":"X","aka":"X-out"},{"id":"variations.shapes.rodeo","name":"RODEO"},{"id":"variations.shapes.super-man","name":"SUPER MAN","aka":"Superman"},{"id":"variations.shapes.rocket-boi","name":"ROCKET BOI","aka":"Rocketboi"},{"id":"variations.shapes.iron-man","name":"IRON MAN","aka":"Ironman"},{"id":"variations.shapes.spider-man","name":"SPIDER MAN"},{"id":"variations.shapes.pistol","name":"PISTOL"},{"id":"variations.shapes.donut-boi","name":"DONUT BOI","aka":"Donut boy"},{"id":"variations.shapes.pizza-boi","name":"PIZZA BOI","aka":"Pizzaboy"}]},{"id":"added-kicks","tricks":[{"id":"variations.added-kicks.flash","name":"FLASH"},{"id":"variations.added-kicks.round","name":"ROUND"},{"id":"variations.added-kicks.shuriken","name":"SHURIKEN"},{"id":"variations.added-kicks.knife","name":"KNIFE"},{"id":"variations.added-kicks.feilong","name":"FEILONG"},{"id":"variations.added-kicks.swipe","name":"SWIPE"},{"id":"variations.added-kicks.scissor","name":"SCISSOR"},{"id":"variations.added-kicks.dleg","name":"DLEG","aka":"Doubleleg"},{"id":"variations.added-kicks.terada","name":"TERADA","aka":"Terada grab"},{"id":"variations.added-kicks.crowd-awakener","name":"CROWD AWAKENER"},{"id":"variations.added-kicks.snapu","name":"SNAPU","aka":"Snapuswipe"}]},{"id":"rotation-timing","tricks":[{"id":"variations.rotation-timing.up","name":"UP"},{"id":"variations.rotation-timing.down","name":"DOWN"},{"id":"variations.rotation-timing.late9","name":"LATE9"},{"id":"variations.rotation-timing.gyro","name":"GYRO"},{"id":"variations.rotation-timing.kyro","name":"KYRO"},{"id":"variations.rotation-timing.in-out","name":"IN / OUT"}]},{"id":"landing","tricks":[{"id":"variations.landing.hyper","name":"HYPER"},{"id":"variations.landing.switch","name":"SWITCH"}]}]}};
const I18N = {"en":{"langName":"English","tagline":"Every trick, in order.","appSubtitle":"Tricking progression tracker","overall":"Overall progress","landed":"Landed","levelsDone":"Levels done","next":"Next","nextTrick":"Next trick","allLanded":"Every trick landed. Now build your combos.","level":"Level {n}","levelShort":"L{n}","variations":"Variations","variationsNote":"The levels are finite. The variations are not.","tips":"Tips","reminder":"Reminder","showReminder":"Show reminder","hideReminder":"Hide reminder","families":{"kick":"Kick","setup":"Setup","flip":"Flip","twist":"Twist","shapes":"Shapes","added-kicks":"Added kicks","rotation-timing":"Rotation and timing","landing":"Landing"},"tapToTick":"Tap a trick once you land it clean five times in a row.","bookTraining":"Book a training","getBook":"Get the book","savedICloud":"Your progress is saved to iCloud Drive.","savedLocal":"Your progress is saved on this device.","reset":"Reset progress","resetTitle":"Reset all progress?","resetBody":"Every ticked trick will be cleared. The tricks you added stay. This cannot be undone.","resetConfirm":"Reset","cancel":"Cancel","language":"Language","safety":"Tricking carries a real risk of injury. Warm up, train on soft ground and learn new flips with a coach or spotter.","addTrick":"Add a trick","addHere":"Add to {name}","editTrick":"Edit trick","kind":"Trick or variation?","kindTrick":"Trick","kindVariation":"Variation","fieldName":"Name","fieldNamePh":"e.g. Touchdown raiz","fieldAka":"Also known as","fieldType":"Type","types":{"kick":"Kick","setup":"Setup","flip":"Flip","twist":"Twist"},"fieldLevel":"Level","newLevel":"New level ({n})","fieldLevelName":"Level name","fieldGroup":"Group","fieldDesc":"Description","fieldCue":"Coach's cue","optional":"optional","save":"Save","edit":"Edit","delete":"Delete","deleteConfirm":"Tap again to delete","details":"Details","yours":"Yours","alsoKnown":"Also known as","coachCue":"Coach's cue","tryIt":"Try it","inBook":"The full description and coach's cue are in the book.","noDetails":"No description yet. Tap Edit to add one.","errName":"Give it a name.","errDuplicate":"That name is already in this list.","resetConfirmTap":"Tap again to reset","customNote":"The tricks you add are saved with it.","reminders":["Be sure to warm up before each training.","It's natural to feel fear, but it's your job to be stronger and to control it. Fear shows the way.","Always keep your eyes on the target and fully EXTEND your toes when kicking.","When doing a flip, bring your legs together as fast as possible. Ideally, knees should HIT the shoulders. The flip only happens when you tilt your head. After the flips you wanted, first SPOT where you land, then release your legs as quickly as possible.","When twisting, maximally TIGHTEN the axis: squeeze the glutes, straighten the body, bring the hands to the body.","Make sure to STRETCH each day.","There are anatomical limits to how you can enter or exit a trick, but the set of variations is limitless.","MOVE safely, actively and with fun!"]},"lt":{"langName":"Lietuvių","tagline":"Kiekvienas triukas – iš eilės.","appSubtitle":"Trikingo pažangos sekimas","overall":"Bendra pažanga","landed":"Įveikta","levelsDone":"Baigti lygiai","next":"Toliau","nextTrick":"Kitas triukas","allLanded":"Visi triukai įveikti. Dabar kurk kombinacijas.","level":"{n} lygis","levelShort":"{n}","variations":"Variacijos","variationsNote":"Lygių skaičius baigtinis. Variacijų – ne.","tips":"Patarimai","reminder":"Priminimas","showReminder":"Rodyti priminimą","hideReminder":"Slėpti priminimą","families":{"kick":"Spyriai","setup":"Įėjimai","flip":"Salto","twist":"Sukiniai","shapes":"Formos","added-kicks":"Papildomi spyriai","rotation-timing":"Sukimasis ir laikas","landing":"Nusileidimas"},"tapToTick":"Pažymėk triuką, kai švariai jį atliksi penkis kartus iš eilės.","bookTraining":"Registruotis į treniruotę","getBook":"Įsigyti knygą","savedICloud":"Pažanga saugoma iCloud Drive.","savedLocal":"Pažanga saugoma šiame įrenginyje.","reset":"Išvalyti pažangą","resetTitle":"Išvalyti visą pažangą?","resetBody":"Visi pažymėti triukai bus išvalyti. Tavo pridėti triukai liks. To atšaukti nebus galima.","resetConfirm":"Išvalyti","cancel":"Atšaukti","language":"Kalba","safety":"Trikingas kelia realią traumų riziką. Apšilk, treniruokis ant minkšto pagrindo, o naujus salto mokykis su treneriu ar draudžiančiuoju.","addTrick":"Pridėti triuką","addHere":"Pridėti į „{name}“","editTrick":"Redaguoti triuką","kind":"Triukas ar variacija?","kindTrick":"Triukas","kindVariation":"Variacija","fieldName":"Pavadinimas","fieldNamePh":"pvz., Touchdown raiz","fieldAka":"Kiti pavadinimai","fieldType":"Tipas","types":{"kick":"Spyris","setup":"Įėjimas","flip":"Salto","twist":"Sukinys"},"fieldLevel":"Lygis","newLevel":"Naujas lygis ({n})","fieldLevelName":"Lygio pavadinimas","fieldGroup":"Grupė","fieldDesc":"Aprašymas","fieldCue":"Trenerio patarimas","optional":"nebūtina","save":"Išsaugoti","edit":"Redaguoti","delete":"Ištrinti","deleteConfirm":"Paliesk dar kartą, kad ištrintum","details":"Plačiau","yours":"Tavo","alsoKnown":"Dar vadinama","coachCue":"Trenerio patarimas","tryIt":"Išbandyk","inBook":"Visas aprašymas ir trenerio patarimas – knygoje.","noDetails":"Aprašymo dar nėra. Paliesk „Redaguoti“ ir pridėk.","errName":"Įrašyk pavadinimą.","errDuplicate":"Toks pavadinimas šiame sąraše jau yra.","resetConfirmTap":"Paliesk dar kartą, kad išvalytum","customNote":"Tavo pridėti triukai saugomi kartu.","reminders":["Prieš kiekvieną treniruotę būtinai apšilk.","Jausti baimę natūralu, bet tavo darbas – būti stipresniam ir ją valdyti. Baimė rodo kelią.","Spiriant visada žiūrėk į taikinį ir iki galo IŠTEMPK pėdą.","Darant salto, kuo greičiau prisitrauk kojas. Idealiu atveju keliai turi PALIESTI pečius. Salto įvyks tik tada, kai palenksi galvą. Atlikus norimą salto skaičių, pirmiausia PAŽIŪRĖK, kur nusileisi, tada kuo greičiau ištiesk kojas.","Sukantis maksimaliai ĮTEMPK ašį: suspausk sėdmenis, ištiesk kūną, prispausk rankas prie kūno.","Kasdien būtinai TEMPKIS.","Įėjimą į triuką ir išėjimą iš jo riboja anatomija, bet variacijų aibė – beribė.","JUDĖK saugiai, aktyviai ir smagiai!"]}};
// Descriptions and coach's cues from the book. Empty in the public build.
const DESCRIPTIONS = {};
const BUILD = "2026-11-14";

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
.rings{display:grid;grid-template-columns:repeat(var(--n,4),1fr);gap:var(--s2);padding:var(--s2) 0}
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
.list-head{display:flex;justify-content:space-between;align-items:center;gap:var(--s3);padding:var(--s1) 0;border-bottom:1px solid var(--line)}
.list-title{margin:0;color:var(--gold-text);font:600 15px/1.2 var(--display);letter-spacing:.14em;text-transform:uppercase}
.list-head .right{display:flex;align-items:center;gap:var(--s1)}
.addfam{display:grid;place-items:center;width:36px;height:32px;margin-right:-10px;border:0;background:none;color:var(--gold-text);font:600 22px/1 var(--condensed);cursor:pointer}
.tricks{list-style:none;margin:0;padding:0}
.tricks>li+li{border-top:1px solid var(--line)}
.rowline{display:flex;align-items:stretch}
.trick{display:flex;flex:1;min-width:0;align-items:center;gap:var(--s3);min-height:46px;padding:var(--s2) 0;border:0;background:none;text-align:left;cursor:pointer;font:700 16px/1.25 var(--condensed);letter-spacing:.06em;text-transform:uppercase;color:var(--ink)}
.trick .tname{min-width:0;overflow-wrap:anywhere}
.trick .aka{margin-left:auto;padding-left:var(--s2);color:var(--ink-muted);font:600 12px/16px var(--condensed);letter-spacing:.08em;text-align:right}
.mine{flex:none;padding:1px 6px;border:1px solid var(--line);border-radius:var(--r-sm);color:var(--ink-muted);font:600 10px/14px var(--condensed);letter-spacing:.12em}
.check{display:grid;place-items:center;flex:none;width:22px;height:22px;border:2px solid var(--ink-muted);border-radius:var(--r-sm);color:transparent;font:800 14px/1 var(--sans)}
.trick[aria-checked=true] .check{background:var(--gold);border-color:var(--gold-text);color:var(--on-gold)}
.rowline.is-next{margin:0 calc(-1*var(--s2));padding-left:var(--s2);background:var(--gold-soft);border-radius:var(--r-sm)}
.rowline.is-next .trick,.rowline.is-next .aka{color:var(--gold-text)}
.more{display:grid;place-items:center;flex:none;width:40px;margin-right:-12px;border:0;background:none;color:var(--ink-muted);cursor:pointer}
.rowline.is-next .more{margin-right:-4px}
.more svg{width:16px;height:16px;transition:transform .15s ease-out}
.more[aria-expanded=true]{color:var(--gold-text)}
.more[aria-expanded=true] svg{transform:rotate(90deg)}
.detail{display:grid;gap:var(--s2);padding:var(--s1) 0 var(--s4) 34px;font:400 14px/21px var(--sans)}
.detail p{margin:0;overflow-wrap:anywhere}
.detail .alt{color:var(--ink-muted);font-style:italic}
.detail .k{margin-top:var(--s1);color:var(--gold-text);font:600 11px/16px var(--condensed);letter-spacing:.14em;text-transform:uppercase}
.detail .muted{color:var(--ink-muted)}
.detail a{color:var(--gold-text)}
.acts{display:flex;gap:var(--s2);margin-top:var(--s1)}
.mini{height:32px;padding:0 var(--s3);border:1px solid var(--line);border-radius:var(--r-sm);background:transparent;color:var(--ink);font:700 12px/1 var(--condensed);letter-spacing:.1em;text-transform:uppercase;cursor:pointer}
.mini.danger{border-color:var(--bail);color:var(--bail)}
.cue{display:grid;gap:var(--s3);margin:var(--s12) 0 var(--s4);padding-top:var(--s3);border-top:2px solid var(--gold-text);scroll-margin-top:60px}
.cue summary{list-style:none;display:flex;justify-content:space-between;align-items:center;cursor:pointer;color:var(--gold-text);font:600 14px/1 var(--display);letter-spacing:.16em;text-transform:uppercase;min-height:32px}
.cue summary::-webkit-details-marker{display:none}
.cue summary .label{color:var(--ink-muted)}
.cue p{margin:0 0 var(--s3);font:italic 600 17px/26px var(--sans);letter-spacing:.02em}
.cue strong{color:var(--gold-text);font-style:italic}
footer{display:grid;gap:var(--s3);padding:var(--s6) 0 var(--s12)}
.btn{display:flex;align-items:center;justify-content:center;height:44px;padding:0 var(--s6);border:1px solid var(--line);border-radius:var(--r-md);background:transparent;color:var(--ink);font:700 15px/1 var(--condensed);letter-spacing:.08em;text-transform:uppercase;text-decoration:none;cursor:pointer}
.btn.gold{width:100%;border-color:var(--gold-text);color:var(--gold-text)}
.btn.solid{border-color:var(--gold);background:var(--gold);color:var(--on-gold)}
.small{margin:0;color:var(--ink-muted);font:400 13px/18px var(--sans)}
.reset{justify-self:start;padding:var(--s2) 0;border:0;background:none;color:var(--ink-muted);font:600 12px/16px var(--condensed);letter-spacing:.12em;text-transform:uppercase;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.reset.danger{color:var(--bail)}
.sheet{position:fixed;inset:0;z-index:20;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.66)}
.sheet[hidden]{display:none}
.sheet form{display:grid;gap:var(--s3);width:100%;max-width:560px;max-height:92vh;max-height:92dvh;overflow:auto;-webkit-overflow-scrolling:touch;padding:var(--s4) var(--s4) calc(var(--s6) + env(safe-area-inset-bottom));background:var(--mat-raised);border:1px solid var(--line);border-bottom:0;border-radius:14px 14px 0 0}
.sheet h2{margin:0 0 var(--s1);color:var(--gold-text);font:600 18px/1.2 var(--display);letter-spacing:.12em;text-transform:uppercase}
.field{display:grid;gap:var(--s1)}
.field>.label em{margin-left:6px;font-style:normal;letter-spacing:.06em;text-transform:none;opacity:.75}
.field input,.field textarea,.field select{width:100%;margin:0;padding:10px 12px;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--mat);color:var(--ink);font:400 16px/22px var(--sans);-webkit-appearance:none;appearance:none}
.field select{background-image:linear-gradient(45deg,transparent 50%,var(--ink-muted) 50%),linear-gradient(135deg,var(--ink-muted) 50%,transparent 50%);background-position:calc(100% - 18px) 19px,calc(100% - 13px) 19px;background-size:5px 5px;background-repeat:no-repeat;padding-right:36px}
.field textarea{min-height:76px;resize:vertical}
.field input:focus,.field textarea:focus,.field select:focus{outline:none;border-color:var(--gold-text)}
.seg{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;border:1px solid var(--line);border-radius:var(--r-sm);overflow:hidden}
.seg button{height:40px;padding:0 2px;border:0;background:transparent;color:var(--ink-muted);font:700 13px/1 var(--condensed);letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
.seg button+button{border-left:1px solid var(--line)}
.seg button[aria-pressed=true]{background:var(--gold-soft);color:var(--gold-text)}
.err{margin:0;color:var(--bail);font:600 14px/20px var(--sans)}
.actions{display:grid;grid-template-columns:1fr 1fr;gap:var(--s2);margin-top:var(--s1)}
@media (prefers-reduced-motion:no-preference){.trick[aria-checked=true] .check{animation:pop 150ms ease-out}@keyframes pop{from{transform:scale(.6)}to{transform:scale(1)}}}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.more svg{transition:none}}
`;

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
