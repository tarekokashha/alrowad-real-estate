import { ar as payloadAr } from "@payloadcms/translations/languages/ar";

/**
 * The Arabic the admin panel actually renders.
 *
 * Payload's bundled Arabic is community-contributed and, audited string by
 * string (`node scripts/audit-arabic.mjs`), has three defects that matter for
 * a panel a non-technical Egyptian owner operates every day:
 *
 *   1. 145 of its 587 strings carry tashkeel — «تسجيل الدّخول», «لوحة
 *      التّحكّم», «تمّ التّفعيل». The other 442 do not. Vocalisation belongs in
 *      a Qur'an, a children's reader or a dictionary; in a business UI it
 *      reads as either an odd classical register or as a font bug, and
 *      because only a quarter of the strings have it the panel looks
 *      inconsistent with itself. Stripped, panel-wide.
 *
 *   2. `general.createNew` reads «أنشاء جديد». The word is «إنشاء» — hamza
 *      below the alif, not above. It sits on the most-clicked button in the
 *      product.
 *
 *   3. `fields.toggleBlock` was never translated and renders the English
 *      "Toggle block" inside an Arabic RTL panel.
 *
 * Reported upstream-able, but the client needs it right now, so it is fixed
 * here. The audit script re-runs against whatever version of the package is
 * installed, so a Payload upgrade that fixes these will show up as the lists
 * going empty rather than as a silent double-fix.
 */

/**
 * Harakat, shadda and sukun (U+064B–U+0652) plus the superscript alef
 * (U+0670).
 *
 * Deliberately NOT U+0653–U+0655 — maddah and the combining hamzas. Those
 * change which letter you are reading rather than how it is pronounced, and
 * stripping them would turn a decomposed «أ» into «ا», which is the very
 * error being fixed in (2) above.
 */
const TASHKEEL = /[ً-ْٰ]/g;

export const stripTashkeel = (s: string) => s.replace(TASHKEEL, "");

/** Applied after stripping, so the keys here are written undiacritised. */
const CORRECTIONS: Record<string, Record<string, string>> = {
  general: {
    createNew: "إنشاء جديد",
  },
  fields: {
    toggleBlock: "طيّ القسم أو فتحه",
  },
};

type Group = Record<string, unknown>;

function correct(groupName: string, group: Group): Group {
  const out: Group = {};
  for (const [key, value] of Object.entries(group)) {
    if (typeof value === "string") {
      out[key] = CORRECTIONS[groupName]?.[key] ?? stripTashkeel(value);
    } else if (value && typeof value === "object") {
      // A few groups nest one level deeper.
      out[key] = correct(groupName, value as Group);
    } else {
      out[key] = value;
    }
  }
  return out;
}

const translations = Object.fromEntries(
  Object.entries(payloadAr.translations).map(([groupName, group]) => [
    groupName,
    correct(groupName, group as Group),
  ]),
) as typeof payloadAr.translations;

export const ar = { ...payloadAr, translations };
