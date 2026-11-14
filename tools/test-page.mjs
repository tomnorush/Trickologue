// Drives the app page in a real headless browser, the way a tricker would use it:
// tick tricks, open details, add, edit and delete their own tricks, add a level,
// switch language, reset. It checks two pages:
//   1. the page the Scriptable script shows, with every message it sends handed
//      back to the script (run against the stand-in Scriptable API);
//   2. the stand-alone page the Android app shows, saved through the Android
//      bridge and through localStorage.
// Screenshots go to tools/out/.
//
// Needs Playwright:  npm i --no-save playwright   (or set NODE_PATH to a global install)
// Usage:             node tools/build.mjs && node tools/test-page.mjs
import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { makeEnv, runScript, progressPath } from "./mock-scriptable.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "tools/out");
mkdirSync(outDir, { recursive: true });
const require = createRequire(import.meta.url);
const pwPath = require.resolve("playwright", { paths: [root, ...(process.env.NODE_PATH || "").split(":").filter(Boolean)] });
const { chromium } = require(pwPath);

// --script and --page let the same checks run against the build with the book's text.
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : process.argv[i + 1];
};
const scriptFile = arg("--script", join(root, "scriptable/Trickologue.js"));
const pageFile = arg("--page", join(root, "android/app/src/main/assets/index.html"));
const src = readFileSync(scriptFile, "utf8");
// Each build either carries the book's descriptions or points to the book.
const scriptHasBook = !/const DESCRIPTIONS = \{\};/.test(src);
const pageHasBook = !/"desc":\{\}/.test(readFileSync(pageFile, "utf8"));

let browser;
try {
  browser = await chromium.launch();
} catch (e) {
  const exe = process.env.CHROME_PATH || ["/usr/bin/google-chrome", "/usr/bin/chromium"].find(existsSync);
  browser = await chromium.launch({ executablePath: exe });
}
const phone = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

const text = (page, sel) => page.locator(sel).first().innerText();
const total = async (page) => (await text(page, ".big")).replace(/\s+/g, " ").trim();
const rowOf = (page, name) => page.locator("li", { has: page.locator(".tname", { hasText: new RegExp("^" + name + "$", "i") }) });

async function fillForm(page, f) {
  if (f.kind) await page.click(`#sheet [data-set-field=kind][data-value=${f.kind}]`);
  if (f.name !== undefined) await page.fill("#sheet [name=name]", f.name);
  if (f.aka !== undefined) await page.fill("#sheet [name=aka]", f.aka);
  if (f.family) await page.click(`#sheet [data-set-field=family][data-value=${f.family}]`);
  if (f.set) await page.selectOption("#sheet [name=set]", f.set);
  if (f.levelName !== undefined) await page.fill("#sheet [name=levelName]", f.levelName);
  if (f.vfam) await page.selectOption("#sheet [name=vfam]", f.vfam);
  if (f.desc !== undefined) await page.fill("#sheet [name=desc]", f.desc);
  if (f.cue !== undefined) await page.fill("#sheet [name=cue]", f.cue);
}
const save = (page) => page.click("#sheet button[type=submit]");

// The walk-through shared by both pages. `sync` hands the page's state to whatever stores it.
async function walkthrough(page, label, sync, hasBookText) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.click("[data-lang=en]");
  const front = () => page.locator("#level1 li", { has: page.locator(".tname", { hasText: /^FRONT$/ }) });
  assert.equal(await total(page), "0 / 126");
  assert.equal(await page.locator(".ringbtn").count(), 4);
  assert.equal(await page.locator(".trick").count(), 126);

  // Tick and untick.
  await page.click("#t-level1_kick_front");
  assert.equal(await total(page), "1 / 126");
  assert.equal(await page.getAttribute("#t-level1_kick_front", "aria-checked"), "true");

  // Details of a book trick.
  await front().locator(".more").click();
  const detail = await front().locator(".detail").innerText();
  assert.match(detail, /Front kick/);
  if (hasBookText) {
    assert.match(detail, /COACH'S CUE\s+\S/i, "the book's description and cue are shown");
    assert.doesNotMatch(detail, /in the book/);
  } else {
    assert.match(detail, /^Also known as: Front kick\s+The full description and coach's cue are in the book\. Get the book$/);
  }
  await page.screenshot({ path: join(outDir, `${label}-1-detail.png`) });
  await front().locator(".more").click();
  assert.equal(await front().locator(".detail").count(), 0);

  // Add a trick in a new level.
  await page.click(".summary [data-add]");
  assert.ok(await page.isVisible("#sheet form"));
  assert.equal(await page.inputValue("#sheet [name=set]"), "level1", "the form starts on the level being trained");
  await save(page);
  assert.match(await text(page, "#sheet .err"), /Give it a name/);
  await fillForm(page, { name: "  Triple   cork ", aka: "Trip cork", family: "twist", set: "__new", levelName: "Legends", desc: "Three twists on the cork axis.", cue: "Set tall, wrap late, spot the floor <b>early</b>." });
  await page.screenshot({ path: join(outDir, `${label}-2-form.png`) });
  await save(page);
  assert.equal(await page.isVisible("#sheet form"), false);
  assert.equal(await total(page), "1 / 127");
  assert.equal(await page.locator(".ringbtn").count(), 5);
  const lv = page.locator("section.lvl").nth(4);
  assert.match(await lv.locator(".lvl-title").innerText(), /LEVEL V/i);
  assert.match(await lv.locator(".lvl-head .label").innerText(), /LEGENDS · 0 \/ 1/i);
  assert.match(await lv.locator(".list-title").innerText(), /TWIST/i);
  const mine = await rowOf(page, "Triple cork").innerText();
  assert.match(mine, /TRIPLE CORK[\s\S]*YOURS[\s\S]*Trip cork[\s\S]*Three twists[\s\S]*COACH'S CUE[\s\S]*<b>early<\/b>/i, "own text is shown as text, never as markup");
  await page.screenshot({ path: join(outDir, `${label}-3-own-level.png`) });

  // The same name twice in one list is refused; the same name elsewhere is fine.
  await lv.locator(".addfam").click();
  assert.match(await page.inputValue("#sheet [name=set]"), /^clevel-/, "+ on a list starts the form there");
  await fillForm(page, { name: "triple CORK" });
  await save(page);
  assert.match(await text(page, "#sheet .err"), /already in this list/);
  await page.click("#sheet [data-cancel]");
  assert.equal(await total(page), "1 / 127");

  // Add a variation, and a kick straight from the Level I list.
  await page.click(".summary [data-add]");
  await fillForm(page, { kind: "variation", name: "Ninja land", vfam: "landing" });
  await save(page);
  assert.equal(await total(page), "1 / 128");
  assert.equal(await page.locator("#variations .list").last().locator(".trick").last().locator(".tname").innerText().then((s) => s.toUpperCase()), "NINJA LAND");
  await page.locator("#level1 .list").first().locator(".addfam").click();
  assert.equal(await page.getAttribute("#sheet [data-set-field=family][data-value=kick]", "aria-pressed"), "true");
  await fillForm(page, { name: "Touchdown raiz" });
  await save(page);
  assert.equal(await total(page), "1 / 129");
  assert.equal(await page.locator("#level1 .list").first().locator(".trick").count(), 9);

  // Tick own tricks, then hand everything to the store.
  await rowOf(page, "Touchdown raiz").locator(".trick").click();
  await rowOf(page, "Ninja land").locator(".trick").click();
  assert.equal(await total(page), "3 / 129");
  let saved = await sync();
  assert.equal(saved.custom.tricks.length, 3);
  assert.deepEqual(saved.custom.levels.map((l) => l.name), ["Legends"]);
  assert.equal(Object.keys(saved.landed).length, 3);
  const cork = saved.custom.tricks.find((x) => x.name === "Triple cork");
  assert.deepEqual({ aka: cork.aka, family: cork.family, desc: cork.desc }, { aka: "Trip cork", family: "twist", desc: "Three twists on the cork axis." });

  // Edit: rename and move to Level II. The emptied level disappears.
  await rowOf(page, "Triple cork").locator("[data-edit]").click();
  assert.equal(await page.inputValue("#sheet [name=name]"), "Triple cork");
  assert.equal(await page.inputValue("#sheet [name=desc]"), "Three twists on the cork axis.");
  await fillForm(page, { name: "Trip cork", set: "level2" });
  await save(page);
  assert.equal(await page.locator(".ringbtn").count(), 4);
  assert.equal(await page.locator("section.lvl").count(), 5);
  assert.deepEqual(await page.locator("#level2 .list-title").allInnerTexts().then((a) => a.map((s) => s.toUpperCase())), ["KICK", "SETUP", "FLIP", "TWIST"]);
  assert.equal(await total(page), "3 / 129");

  // Lithuanian.
  await page.click("[data-lang=lt]");
  assert.match(await text(page, "#level1 .lvl-title"), /I LYGIS/i);
  assert.match(await rowOf(page, "Touchdown raiz").innerText(), /TAVO/i);
  await page.click(".summary [data-add]");
  const formText = await page.locator("#sheet form").innerText();
  assert.match(formText, /PRIDĖTI TRIUKĄ[\s\S]*TRIUKAS AR VARIACIJA\?[\s\S]*PAVADINIMAS[\s\S]*SPYRIS[\s\S]*ĮĖJIMAS[\s\S]*SALTO[\s\S]*SUKINYS[\s\S]*LYGIS[\s\S]*APRAŠYMAS[\s\S]*TRENERIO PATARIMAS[\s\S]*IŠSAUGOTI/i);
  await page.screenshot({ path: join(outDir, `${label}-4-form-lt.png`) });
  await page.keyboard.press("Escape");
  assert.equal(await page.isVisible("#sheet form"), false);
  if (hasBookText) {
    await front().locator(".more").click();
    assert.match(await front().locator(".detail").innerText(), /TRENERIO PATARIMAS\s+\S/i);
    await front().locator(".more").click();
  }
  await page.click("[data-lang=en]");

  // Delete takes two taps; tapping elsewhere disarms it.
  // (its details are still open from when it was added)
  await rowOf(page, "Ninja land").locator("[data-del]").click();
  assert.match(await rowOf(page, "Ninja land").locator("[data-del]").innerText(), /TAP AGAIN TO DELETE/i);
  await page.click(".sub");
  assert.match(await rowOf(page, "Ninja land").locator("[data-del]").innerText(), /^DELETE$/i);
  await rowOf(page, "Ninja land").locator("[data-del]").click();
  await rowOf(page, "Ninja land").locator("[data-del]").click();
  assert.equal(await rowOf(page, "Ninja land").count(), 0);
  assert.equal(await total(page), "2 / 128");
  saved = await sync();
  assert.deepEqual(saved.custom.tricks.map((x) => x.name).sort(), ["Touchdown raiz", "Trip cork"]);
  assert.deepEqual(saved.custom.levels, []);
  assert.equal(Object.keys(saved.landed).length, 2);
  assert.deepEqual(errors, [], "no script errors on the page");
  await page.screenshot({ path: join(outDir, `${label}-5-top.png`) });
  return saved;
}

// ---------- 1. The page inside the Scriptable script ----------
{
  const files = {};
  let before;
  const t = makeEnv({
    mode: "app", files,
    onWebView: async (wv) => {
      const page = await browser.newPage(phone);
      await page.setContent(wv.html, { waitUntil: "domcontentloaded" });
      // In Scriptable the page's trickologue:// requests reach the script. Here the
      // same message is read from the page and handed to the script's request hook.
      const sync = async () => {
        const url = await page.evaluate(() => window.tqMessage());
        assert.match(url, /^trickologue:\/\/state\?v=2&/);
        assert.equal(wv.shouldAllowRequest({ url }), false);
        return JSON.parse(files[progressPath]);
      };
      before = await walkthrough(page, "scriptable", sync, scriptHasBook);
      wv.evalResult = await page.evaluate(() => window.tqMessage());
      await page.close();
    },
  });
  await runScript(src, t.env);
  const saved = JSON.parse(files[progressPath]);
  assert.deepEqual(saved.custom, before.custom);

  // Run the script again: the page comes back with the tricker's tricks and ticks.
  const t2 = makeEnv({
    mode: "app", files,
    onWebView: async (wv) => {
      const page = await browser.newPage(phone);
      await page.setContent(wv.html, { waitUntil: "domcontentloaded" });
      assert.equal(await total(page), "2 / 128");
      assert.equal(await rowOf(page, "Trip cork").locator(".trick").getAttribute("aria-checked"), "false");
      assert.equal(await rowOf(page, "Touchdown raiz").locator(".trick").getAttribute("aria-checked"), "true");
      // Reset is confirmed by the script's own alert, then the page clears.
      await page.evaluate(() => window.tqApplyReset());
      assert.equal(await total(page), "0 / 128");
      await page.close();
    },
  });
  await runScript(src, t2.env);
  console.log("scriptable page       ok  add, edit, delete, new level, EN / LT, saved through the script");
}

// ---------- 2. The stand-alone page: Android bridge ----------
{
  const context = await browser.newContext(phone);
  // Stand-in for the app's JavascriptInterface: one string kept by the "app".
  let appFile = "";
  await context.exposeBinding("__tqSave", (_, json) => { appFile = json; });
  await context.addInitScript((initial) => {
    let mem = initial;
    window.TQAndroid = { load: () => mem, save: (json) => { mem = json; window.__tqSave(json); } };
  }, "");
  const page = await context.newPage();
  await page.goto(pathToFileURL(pageFile).href);
  const sync = async () => {
    await page.waitForTimeout(250); // the page saves a moment after each change
    const s = JSON.parse(appFile);
    return { ...s, landed: Object.fromEntries(s.landed.map((id) => [id, true])) };
  };
  await walkthrough(page, "android", sync, pageHasBook);
  // Reset: two taps, own tricks stay.
  await page.click("[data-reset]");
  assert.match(await text(page, "[data-reset]"), /TAP AGAIN TO RESET/i);
  await page.click("[data-reset]");
  assert.equal(await total(page), "0 / 128");
  const after = await sync();
  assert.equal(after.custom.tricks.length, 2);
  await context.close();

  // A second launch reads what the app kept.
  const context2 = await browser.newContext(phone);
  await context2.addInitScript((initial) => { window.TQAndroid = { load: () => initial, save: () => {} }; }, appFile);
  const page2 = await context2.newPage();
  await page2.goto(pathToFileURL(pageFile).href);
  assert.equal(await total(page2), "0 / 128");
  assert.equal(await rowOf(page2, "Trip cork").count(), 1);
  await context2.close();
  console.log("android page          ok  saved through the app bridge, kept across launches");
}

// ---------- 3. The stand-alone page in a plain browser: localStorage ----------
{
  const context = await browser.newContext(phone);
  const page = await context.newPage();
  await page.goto(pathToFileURL(pageFile).href);
  await page.click("#t-level1_kick_front");
  await page.click(".summary [data-add]");
  await fillForm(page, { name: "Šuolis su ąžuolu", family: "flip", set: "__new" });
  await save(page);
  await page.waitForTimeout(250);
  await page.reload();
  assert.equal(await total(page), "1 / 127");
  assert.match(await page.locator("section.lvl").nth(4).innerText(), /ŠUOLIS SU ĄŽUOLU/);
  // Links open outside the app.
  assert.equal(await page.getAttribute("footer a.btn", "target"), "_blank");
  await context.close();
  console.log("browser page          ok  saved to localStorage, Lithuanian letters kept");
}

await browser.close();
console.log("All page checks passed.");
