import { getPayload } from "payload";
import config from "../payload.config";
import { toEasternDigits } from "./format";
import { UNITS, type Unit } from "./units";
import { SOLD, type SoldRecord } from "./sold";

/**
 * The bridge between لوحة التحكم and the pages.
 *
 * Until now the site read its inventory from lib/units.ts — a TypeScript
 * file. The admin panel existed, held data, and changed nothing: the client
 * could edit a price all evening and the site would not move. This module is
 * what makes the panel real.
 *
 * ── The rule about placeholders ──────────────────────────────────────────
 * Every price, code and date in lib/units.ts came from the design comp. So
 * the fallback is all-or-nothing: if the CMS has published units, the site
 * shows those and ONLY those; if it has none, the site shows the design set.
 * The two are never mixed. A grid with a real 2.4M flat beside an invented
 * one is worse than either, because a buyer cannot tell which is which — and
 * for a page whose whole argument is "our numbers are checkable", that is
 * the one failure that matters.
 *
 * The switchover therefore happens on the first published unit, by itself.
 *
 * Payload is called in-process here, not over HTTP. It is the same Node
 * process, so there is no network hop and no port to configure.
 *
 * Server-side only. There is no `server-only` guard because importing this
 * from a client component already fails loudly — Payload pulls in the
 * database driver — and adding a dependency to restate that seemed a poor
 * trade. Import it from server components and route handlers.
 */

const AR_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

/** "٢٨ أغسطس ٢٠٢٦" — the form already used throughout the site. */
function arabicDate(value: unknown): string {
  if (!value) return "—";
  const d = new Date(value as string);
  if (Number.isNaN(d.getTime())) return "—";
  return `${toEasternDigits(d.getDate())} ${AR_MONTHS[d.getMonth()]} ${toEasternDigits(String(d.getFullYear()))}`;
}

/** "٢٠٢٦/٠٨/١٩" — the sold archive's denser form. */
function arabicNumericDate(value: unknown): string {
  if (!value) return "—";
  const d = new Date(value as string);
  if (Number.isNaN(d.getTime())) return "—";
  const p = (n: number) => toEasternDigits(String(n).padStart(2, "0"));
  return `${toEasternDigits(String(d.getFullYear()))}/${p(d.getMonth() + 1)}/${p(d.getDate())}`;
}

type Doc = Record<string, unknown>;

/**
 * The first image and its alt text.
 *
 * A published unit is guaranteed by the collection's own publish guard to
 * carry at least one real photograph, but a draft need not, and an upload
 * can always be deleted out from under a reference — so this never assumes.
 */
function firstImage(doc: Doc): { image: string; imageAlt: string } {
  const gallery = (doc.gallery as Doc[] | undefined) ?? [];
  for (const row of gallery) {
    const img = row.image as Doc | undefined;
    if (img && typeof img.url === "string" && img.url) {
      return {
        image: img.url,
        imageAlt: typeof img.alt === "string" && img.alt ? img.alt : String(doc.title ?? ""),
      };
    }
  }
  return { image: "/img/unit-01-living.webp", imageAlt: String(doc.title ?? "") };
}

function toUnit(doc: Doc): Unit {
  const area = String(doc.area ?? "");
  return {
    code: String(doc.code ?? ""),
    titleAr: String(doc.title ?? ""),
    areaAr: area,
    // The catalogue filters on this. Display name and filter key are the same
    // thing now that the client types the area himself — inventing a second
    // identifier he cannot see would only drift out of step with the first.
    areaKey: area,
    type: doc.type as Unit["type"],
    price: Number(doc.price ?? 0),
    size: Number(doc.size ?? 0),
    gardenSize: doc.gardenSize ? Number(doc.gardenSize) : undefined,
    floorAr: doc.floor ? String(doc.floor) : undefined,
    finishing: doc.finishing as Unit["finishing"],
    handoverAr: String(doc.handover ?? ""),
    saleTypeAr: String(doc.saleType ?? ""),
    legalStatus: doc.legalStatus as Unit["legalStatus"],
    maxYears: Number(doc.maxYears ?? 0),
    priceCheckedAr: arabicDate(doc.priceCheckedAt),
    visitedAr: arabicDate(doc.visitedAt),
    ...firstImage(doc),
  };
}

function toSoldRecord(doc: Doc): SoldRecord {
  const contractedAt = doc.contractedAt;
  const year = contractedAt ? new Date(contractedAt as string).getFullYear() : 0;
  return {
    code: String(doc.code ?? ""),
    titleAr: String(doc.title ?? ""),
    areaAr: String(doc.area ?? ""),
    size: Number(doc.size ?? 0),
    // The CONTRACTED figure, never the asking price. That distinction is the
    // whole point of publishing this archive.
    price: Number(doc.soldPrice ?? doc.price ?? 0),
    legalStatus: String(doc.legalStatus ?? ""),
    days: Number(doc.daysListed ?? 0),
    dateAr: arabicNumericDate(contractedAt),
    year,
  };
}

async function query(status: "published" | "sold"): Promise<Doc[]> {
  const payload = await getPayload({ config });
  const res = await payload.find({
    collection: "units",
    where: { status: { equals: status } },
    limit: 500,
    // depth 2 resolves the gallery's upload relation to a media document with
    // a usable url. Depth 1 would hand back an id and every card would break.
    depth: 2,
    sort: "-createdAt",
    overrideAccess: true,
  });
  return res.docs as unknown as Doc[];
}

export type InventorySource = "cms" | "design";

/**
 * Where the visible inventory came from. The admin panel shows this, because
 * the difference between "the site is showing my units" and "the site is
 * showing the designer's examples" is not something the client should have
 * to deduce from whether a price looks familiar.
 */
export async function getInventorySource(): Promise<InventorySource> {
  try {
    return (await query("published")).length > 0 ? "cms" : "design";
  } catch {
    return "design";
  }
}

export async function getUnits(): Promise<Unit[]> {
  try {
    const docs = await query("published");
    return docs.length > 0 ? docs.map(toUnit) : UNITS;
  } catch (err) {
    // A database that is down must not take the marketing site with it. The
    // pages are statically generated, so in practice this is a build-time
    // safety net rather than a request-time one — but it is the difference
    // between a stale page and a 500.
    console.error("[cms] units unavailable, serving the design catalogue:", err);
    return UNITS;
  }
}

export async function getUnit(code: string): Promise<Unit | undefined> {
  const units = await getUnits();
  const wanted = code.toLowerCase();
  return units.find((u) => u.code.toLowerCase() === wanted);
}

export async function getSoldRecords(): Promise<SoldRecord[]> {
  try {
    const docs = await query("sold");
    if (docs.length === 0) return SOLD;
    // Newest first, which is how the archive reads.
    return docs
      .map(toSoldRecord)
      .sort((a, b) => b.dateAr.localeCompare(a.dateAr));
  } catch (err) {
    console.error("[cms] sold archive unavailable, serving the design set:", err);
    return SOLD;
  }
}
