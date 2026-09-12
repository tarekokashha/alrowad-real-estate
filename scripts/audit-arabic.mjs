/**
 * Audits the Arabic the admin panel actually renders.
 *
 * Payload's bundled Arabic is community-contributed and uneven: it carries
 * classical vocalisation marks no Egyptian business user expects to read in a
 * UI, a few spelling errors, and strings that were never translated at all.
 * The client runs this panel himself and reads every word of it, so "it is in
 * Arabic" is not the same as "the Arabic is right".
 *
 *   node scripts/audit-arabic.mjs
 *
 * Prints three lists: strings carrying tashkeel, strings with no Arabic in
 * them, and strings matching known spelling errors. Exits 0 always — this is
 * a report, not a gate.
 */
import { readFile } from "node:fs/promises";

const FILE = "node_modules/@payloadcms/translations/dist/languages/ar.js";

const TASHKEEL = /[ً-ْ]/;
const ARABIC = /[؀-ۿ]/;
const LATIN_WORD = /[A-Za-z]{3,}/;

/** Hamza placement: إ carries kasra and starts a verbal noun like إنشاء.
 *  أ carries fatha. Swapping them is the single most common Arabic typo. */
const MISSPELLINGS = [
  ["أنشاء", "إنشاء"],
  ["أستخدام", "استخدام"],
  ["أختيار", "اختيار"],
  ["أضافة", "إضافة"],
  ["أرسال", "إرسال"],
  ["ألغاء", "إلغاء"],
  ["أدخال", "إدخال"],
  ["أظهار", "إظهار"],
  ["أغلاق", "إغلاق"],
  ["أنشئ", null],
];

const src = await readFile(FILE, "utf8");

// key: 'value' — values may contain escaped quotes.
const pairs = [...src.matchAll(/([a-zA-Z0-9_]+):\s*'((?:[^'\\]|\\.)*)'/g)].map(
  (m) => [m[1], m[2]],
);

const tashkeel = pairs.filter(([, v]) => TASHKEEL.test(v));
const untranslated = pairs.filter(
  ([, v]) => !ARABIC.test(v) && LATIN_WORD.test(v),
);
const misspelled = [];
for (const [key, value] of pairs) {
  for (const [wrong, right] of MISSPELLINGS) {
    if (right && value.includes(wrong)) misspelled.push([key, value, right]);
  }
}

const show = (title, rows, fmt) => {
  console.log(`\n${title} — ${rows.length}`);
  rows.slice(0, 30).forEach((r) => console.log("  " + fmt(r)));
  if (rows.length > 30) console.log(`  … and ${rows.length - 30} more`);
};

console.log(`Payload Arabic: ${pairs.length} strings`);
show("Carrying tashkeel", tashkeel, ([k, v]) => `${k} = ${v}`);
show("No Arabic at all", untranslated, ([k, v]) => `${k} = ${v}`);
show(
  "Misspelled",
  misspelled,
  ([k, v, right]) => `${k} = ${v}   → should use «${right}»`,
);
