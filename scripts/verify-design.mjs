/**
 * The redesign's acceptance criteria, made executable.
 *
 * A visual rebuild has no unit tests worth writing. What it has is a list of
 * properties that must hold no matter what the page looks like, and this is
 * that list. It runs against a served site — dev, preview or production —
 * because several of the checks are about what a reader with no JavaScript
 * receives, which only the server can answer.
 *
 *   node scripts/verify-design.mjs [baseUrl]
 *
 * Exits 0 if every check passes, 1 on the first failure class. Prints one
 * line per check either way, so a failure says which property broke rather
 * than that "something is wrong".
 */

import { readFile, access } from "node:fs/promises";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";

const BASE = (process.argv[2] || "http://localhost:3100").replace(/\/$/, "");
const ROOT = path.resolve(import.meta.dirname, "..");

let failures = 0;
const pass = (m) => console.log(`  ok    ${m}`);
const fail = (m) => {
  failures += 1;
  console.log(`  FAIL  ${m}`);
};
const head = (n, t) => console.log(`\n${n}. ${t}`);

const get = async (url) => {
  const res = await fetch(url, { redirect: "follow" });
  return { status: res.status, text: res.ok ? await res.text() : "" };
};

/** Every source file that could carry a colour, a token or an attribute. */
function sources(dirs = ["app", "components", "lib"]) {
  const out = [];
  const walk = (d) => {
    let entries;
    try {
      entries = readdirSync(d);
    } catch {
      return;
    }
    for (const e of entries) {
      const p = path.join(d, e);
      if (statSync(p).isDirectory()) {
        if (e !== "node_modules" && e !== ".next") walk(p);
      } else if (/\.(tsx?|css)$/.test(e)) {
        out.push(p);
      }
    }
  };
  for (const d of dirs) walk(path.join(ROOT, d));
  return out;
}

/* ---- WCAG contrast -------------------------------------------------- */

function parseColour(v) {
  const hex = v.trim().replace(/^#/, "");
  if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(hex)) return null;
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

const luminance = ([r, g, b]) => {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/* ---- The checks ------------------------------------------------------ */

async function checkRoutes() {
  head(1, "Routes return 200");
  const paths = [
    "/ar",
    "/ar/properties",
    "/ar/sold",
    "/ar/gulf",
    "/ar/about",
    "/ar/areas/hadayek-october",
  ];

  // The unit route is discovered rather than hard-coded, so the check keeps
  // working when the inventory changes.
  const home = await get(`${BASE}/ar`);
  const code = home.text.match(/\/ar\/properties\/(ho-[a-z0-9-]+)/i);
  if (code) paths.push(`/ar/properties/${code[1]}`);
  else fail("no unit link found on the homepage to test");

  for (const p of paths) {
    const { status } = await get(BASE + p);
    if (status === 200) pass(`${p}`);
    else fail(`${p} returned ${status}`);
  }
  return home.text;
}

function checkNoJsContent(html) {
  head(2, "The served HTML is complete without JavaScript");

  if (html.includes("نعرف كل متر")) pass("H1 present");
  else fail("H1 «نعرف كل متر» missing from the served HTML");

  const codes = new Set(html.match(/HO-[A-Z0-9]+-\d+/g) || []);
  if (codes.size >= 6) pass(`${codes.size} unit codes present`);
  else fail(`only ${codes.size} unit codes in the HTML, expected 6 or more`);

  if (/سجل تجاري|القرار الوزاري/.test(html)) pass("footer registry line present");
  else fail("footer registry line missing");
}

async function checkNothingParked(html) {
  head(3, "No stylesheet rule parks content at opacity 0");

  // Any rule whose selector mentions an animation hook and whose body sets
  // opacity:0 — that is content held hostage by the bundle.
  const re = /\[data-(anim|reveal)[^\]]*\][^{}]*\{[^}]*opacity\s*:\s*0[;\s}]/g;

  // The source stylesheets are the truth, and they can be read in any mode.
  // In development Next injects CSS through the bundler rather than through
  // <link>, so served-stylesheet inspection alone would silently check
  // nothing — which is worse than not checking.
  let offenders = 0;
  let files = 0;
  for (const file of sources().filter((f) => f.endsWith(".css"))) {
    files += 1;
    offenders += ((await readFile(file, "utf8")).match(re) || []).length;
  }
  if (offenders === 0) pass(`${files} source stylesheet(s), no parked opacity`);
  else fail(`${offenders} rule(s) hide content until JavaScript runs`);

  // When the site is built, check what actually shipped as well.
  const links = [...html.matchAll(/href="(\/_next\/static\/css\/[^"]+)"/g)].map(
    (m) => m[1],
  );
  if (!links.length) {
    console.log("  --    served stylesheets: none linked (development mode)");
    return;
  }
  let shipped = 0;
  for (const href of links) {
    const { text } = await get(BASE + href);
    shipped += (text.match(re) || []).length;
  }
  if (shipped === 0) pass(`${links.length} served stylesheet(s), clean`);
  else fail(`${shipped} shipped rule(s) hide content until JavaScript runs`);
}

async function checkEntranceGone() {
  head(4, "The frame-sequence entrance is gone");

  try {
    await access(path.join(ROOT, "public", "entrance"));
    fail("public/entrance/ still exists");
  } catch {
    pass("public/entrance/ removed");
  }

  const dead = ["framePath", "ENTRANCE_TIERS", "data-entrance", "AVIF_PROBE"];
  const hits = [];
  for (const file of sources()) {
    const text = await readFile(file, "utf8");
    for (const token of dead) {
      if (text.includes(token)) hits.push(`${path.relative(ROOT, file)} → ${token}`);
    }
  }
  if (hits.length === 0) pass("no source references the old entrance");
  else hits.forEach((h) => fail(h));
}

async function checkContrast() {
  head(5, "Contrast floors");

  const css = await readFile(path.join(ROOT, "app", "globals.css"), "utf8");
  const tok = (name) => {
    const m = css.match(new RegExp(`--${name}\\s*:\\s*(#[0-9a-fA-F]{3,6})`));
    return m ? parseColour(m[1]) : null;
  };

  const pairs = [
    ["ink", "paper", 4.5, "body text on paper"],
    ["paper", "void", 4.5, "text on the dark ground"],
    ["ink", "amber", 4.5, "text on amber"],
  ];

  for (const [a, b, floor, label] of pairs) {
    const ca = tok(a);
    const cb = tok(b);
    if (!ca || !cb) {
      fail(`${label}: token --${a} or --${b} not found`);
      continue;
    }
    const ratio = contrast(ca, cb);
    if (ratio >= floor) pass(`${label}: ${ratio.toFixed(2)}:1 ≥ ${floor}`);
    else fail(`${label}: ${ratio.toFixed(2)}:1 below ${floor}`);
  }
}

async function checkDeadTokens() {
  head(6, "The old palette and the serifs are gone");

  const dead = [
    "--bronze",
    "--action",
    "--paper-deep",
    "--paper-on-night",
    "Amiri",
    "Newsreader",
  ];
  const hits = [];
  for (const file of [...sources(), path.join(ROOT, "app", "globals.css")]) {
    const text = await readFile(file, "utf8");
    for (const token of dead) {
      if (text.includes(token)) {
        hits.push(`${path.relative(ROOT, file)} → ${token}`);
      }
    }
  }
  if (hits.length === 0) pass("no source references the old design system");
  else [...new Set(hits)].forEach((h) => fail(h));
}

/* ---- Run ------------------------------------------------------------- */

console.log(`Verifying ${BASE}`);

try {
  const html = await checkRoutes();
  checkNoJsContent(html);
  await checkNothingParked(html);
  await checkEntranceGone();
  await checkContrast();
  await checkDeadTokens();
} catch (err) {
  console.log(`\nCould not complete: ${err.message}`);
  console.log("Is the server running?  npm run dev");
  process.exit(1);
}

console.log(
  failures === 0
    ? "\nAll checks passed.\n"
    : `\n${failures} check(s) failed.\n`,
);
process.exit(failures === 0 ? 0 : 1);
