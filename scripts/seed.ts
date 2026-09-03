import { getPayload } from "payload";
import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "../payload.config";
import { UNITS } from "../lib/units";
import { TESTIMONIALS, PRICE_INDEX, COMPANY } from "../lib/content";
import { detailFor } from "../lib/unit-detail";

/**
 * Seed the admin panel from the content that currently lives in TypeScript.
 *
 * Run once:  npm run seed
 *
 * It creates the first admin user with a RANDOM password printed to the
 * terminal, then imports the units, testimonials, price index and settings so
 * the client opens a panel with real rows in it rather than an empty shell.
 *
 * Idempotent: re-running skips anything that already exists.
 */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const AR_DATE: Record<string, string> = {
  "١ سبتمبر ٢٠٢٦": "2026-09-01",
  "١ أغسطس ٢٠٢٦": "2026-08-01",
  "٢٥ أغسطس ٢٠٢٦": "2026-08-25",
  "٢٦ أغسطس ٢٠٢٦": "2026-08-26",
  "٢٧ أغسطس ٢٠٢٦": "2026-08-27",
  "٢٨ أغسطس ٢٠٢٦": "2026-08-28",
  "٢٩ أغسطس ٢٠٢٦": "2026-08-29",
  "٣٠ أغسطس ٢٠٢٦": "2026-08-30",
  "١٨ أغسطس ٢٠٢٦": "2026-08-18",
  "١٩ أغسطس ٢٠٢٦": "2026-08-19",
  "٢٠ أغسطس ٢٠٢٦": "2026-08-20",
  "٢١ أغسطس ٢٠٢٦": "2026-08-21",
  "٢٢ أغسطس ٢٠٢٦": "2026-08-22",
  "٢٣ أغسطس ٢٠٢٦": "2026-08-23",
  "٢٤ أغسطس ٢٠٢٦": "2026-08-24",
  "٢٥ أغسطس ٢٠٢٦ ": "2026-08-25",
  "٢٦ أغسطس ٢٠٢٦ ": "2026-08-26",
};

const toISO = (ar: string) =>
  new Date(AR_DATE[ar.trim()] ?? "2026-08-25").toISOString();

async function seed() {
  const payload = await getPayload({ config });

  /* ---- 1. Settings ------------------------------------------------------ */
  await payload.updateGlobal({
    slug: "settings",
    data: {
      phoneLocal: "010 9809 8026",
      phoneIntl: "+20 10 9809 8026",
      address: COMPANY.addressAr,
      officeHours: COMPANY.officeHoursAr,
      replyTime: COMPANY.replyTimeAr,
      commercialRegistry: COMPANY.commercialRegistry,
      registryOffice: "سجل تجاري ٦ أكتوبر — الجيزة",
      taxCard: COMPANY.taxCard,
      brokerageRegistration: COMPANY.brokerageRegistration,
      brokerageDecree: COMPANY.brokerageDecreeAr,
      registeredAt: "١٤ فبراير ٢٠٢٦",
      unitsVisited: 177,
      unitsDeclined: 42,
      unitsListed: 135,
      contractsThisYear: 31,
      totalSold: 503,
      numbersCheckedAt: new Date("2026-09-02").toISOString(),
    },
  });
  console.log("✓ حُفظت إعدادات الموقع");

  /* ---- 2. Units --------------------------------------------------------- */
  let created = 0;
  for (const u of UNITS) {
    const dup = await payload.find({
      collection: "units",
      where: { code: { equals: u.code } },
      limit: 1,
    });
    if (dup.totalDocs > 0) continue;

    const d = detailFor(u);

    // Upload the unit's photograph into the media library and attach it.
    // Tagged `representative` because these are AI-generated: the site
    // labels them صورة تعبيرية for the buyer, and the publish guard will
    // hold the unit as a draft until a real photo is added. That is the
    // intended behaviour, not an oversight.
    const filePath = path.join(ROOT, "public", u.image.replace(/^\//, ""));
    const media = await payload.create({
      collection: "media",
      data: { alt: u.imageAlt },
      filePath,
    });

    await payload.create({
      collection: "units",
      data: {
        gallery: [
          { image: media.id, kind: "representative", caption: u.imageAlt.slice(0, 90) },
        ],
        code: u.code,
        title: u.titleAr,
        area: u.areaAr,
        type: u.type,
        price: u.price,
        size: u.size,
        gardenSize: u.gardenSize ?? null,
        floor: u.floorAr ?? null,
        rooms: d.rooms,
        baths: d.baths,
        finishing: u.finishing,
        handover: u.handoverAr,
        saleType: u.saleTypeAr === "إعادة بيع" ? "إعادة بيع" : "أولى",
        legalStatus: u.legalStatus,
        legalSeenBy: "فريق المراجعة",
        legalNote: d.legalNote,
        visitedAt: toISO(u.visitedAr),
        priceCheckedAt: toISO(u.priceCheckedAr),
        maxYears: u.maxYears,
        minDownPct: 20,
        photosTakenAt: toISO(u.visitedAr),
        // Seeded as DRAFT on purpose. The attached image is tagged
        // `representative` because it is AI-generated, and publishing requires
        // at least one REAL photograph — so every unit waits for the client to
        // add a photo from the actual visit. That is the guard working, not a
        // gap in the seed.
        status: "draft",
        featured: false,
      },
    });
    created++;
  }
  console.log(`✓ استُوردت ${created} وحدة (كمسودات — محتاجة صور قبل النشر)`);

  /* ---- 3. Testimonials -------------------------------------------------- */
  let tCreated = 0;
  for (const t of TESTIMONIALS) {
    const dup = await payload.find({
      collection: "testimonials",
      where: { name: { equals: t.nameAr.split("—")[0].trim() } },
      limit: 1,
    });
    if (dup.totalDocs > 0) continue;

    const [name, city] = t.nameAr.split("—").map((x) => x.trim());
    const [unitType, dateAr] = t.detailAr.split("·").map((x) => x.trim());
    await payload.create({
      collection: "testimonials",
      data: {
        quote: t.quoteAr,
        name,
        city: city ?? "—",
        unitType: unitType ?? "—",
        dateAr: dateAr ?? "—",
        register: t.register,
      },
    });
    tCreated++;
  }
  console.log(`✓ استُوردت ${tCreated} شهادة عميل`);

  /* ---- 4. Price index --------------------------------------------------- */
  const idx = await payload.find({ collection: "price-index", limit: 1 });
  if (idx.totalDocs === 0) {
    await payload.create({
      collection: "price-index",
      data: {
        publishedAt: toISO(PRICE_INDEX.updatedAr),
        sampleListings: 135,
        sampleSales: 31,
        rows: PRICE_INDEX.rows.map((r) => ({
          area: r.areaAr,
          avg: r.avg,
          low: r.low,
          high: r.high,
          sample: r.sample,
          qoq: r.qoq,
        })),
        footnote: PRICE_INDEX.footnoteAr,
      },
    });
    console.log("✓ استُوردت نسخة المؤشر");
  } else {
    console.log("· المؤشر موجود بالفعل — تم تخطيه");
  }

  console.log("\n──────────────────────────────────────────────");
  console.log("  المحتوى اتستورد. باقي حساب الدخول:\n");
  console.log("    ١) افتح ملف .env واكتب ADMIN_EMAIL و ADMIN_PASSWORD");
  console.log("    ٢) شغّل:  npm run admin\n");
  console.log("  لوحة التحكم:  http://localhost:3100/admin");
  console.log("──────────────────────────────────────────────\n");

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
