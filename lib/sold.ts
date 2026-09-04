/**
 * The sold archive.
 *
 * This is what turns "500+ units sold" from an unverifiable counter into 32
 * dated, checkable records. It is deliberately a negotiating tool the buyer
 * can use against us as much as with us: the published price is the
 * CONTRACTED value, not the asking price before negotiation, entries appear
 * only after a contract closes, and nothing is ever deleted afterwards.
 *
 * Buyer names are never published — the unit, the number and the date are
 * all that a comparison needs.
 *
 * PLACEHOLDER: replace with the client's real contract history before launch.
 */

export type SoldRecord = {
  code: string;
  titleAr: string;
  areaAr: string;
  size: number;
  price: number;
  legalStatus: string;
  /** Days the unit was listed before contracting. */
  days: number;
  dateAr: string;
  year: number;
};

export const SOLD: SoldRecord[] = [
  { code: "HO-ASH-1387", titleAr: "شقة ٣ غرف", areaAr: "أشجار سيتي", size: 144, price: 2640000, legalStatus: "عقد ابتدائي موثق", days: 34, dateAr: "٢٠٢٦/٠٨/١٩", year: 2026 },
  { code: "HO-800-0844", titleAr: "دوبلكس بحديقة", areaAr: "منطقة الـ٨٠٠ فدان", size: 212, price: 3180000, legalStatus: "حكم صحة ونفاذ", days: 61, dateAr: "٢٠٢٦/٠٨/٠٤", year: 2026 },
  { code: "HO-SKM-0291", titleAr: "شقة ٢ غرف", areaAr: "سكن مصر", size: 96, price: 1150000, legalStatus: "مسجل بالشهر العقاري", days: 22, dateAr: "٢٠٢٦/٠٧/٢٨", year: 2026 },
  { code: "HO-OW-0612", titleAr: "تاون هاوس", areaAr: "أو ويست", size: 238, price: 4410000, legalStatus: "عقد ابتدائي موثق", days: 88, dateAr: "٢٠٢٦/٠٧/١١", year: 2026 },
  { code: "HO-RCK-0702", titleAr: "شقة ٣ غرف", areaAr: "روك إيدن", size: 137, price: 2080000, legalStatus: "عقد ابتدائي عرفي", days: 52, dateAr: "٢٠٢٦/٠٦/٢٩", year: 2026 },
  { code: "HO-RBW-0166", titleAr: "شقة ٢ غرف", areaAr: "ربوة أكتوبر", size: 88, price: 1010000, legalStatus: "مسجل بالشهر العقاري", days: 19, dateAr: "٢٠٢٦/٠٦/١٥", year: 2026 },
  { code: "HO-BET-0388", titleAr: "شقة ٣ غرف", areaAr: "بيتا ريزيدنس", size: 148, price: 2290000, legalStatus: "عقد ابتدائي موثق", days: 41, dateAr: "٢٠٢٦/٠٥/٣٠", year: 2026 },
  { code: "HO-800-0801", titleAr: "شقة ٣ غرف", areaAr: "منطقة الـ٨٠٠ فدان", size: 126, price: 1580000, legalStatus: "عقد ابتدائي عرفي", days: 47, dateAr: "٢٠٢٦/٠٥/١٢", year: 2026 },
  { code: "HO-ASH-1341", titleAr: "شقة ٢ غرف", areaAr: "أشجار سيتي", size: 102, price: 1490000, legalStatus: "عقد ابتدائي موثق", days: 29, dateAr: "٢٠٢٦/٠٤/٢٦", year: 2026 },
  { code: "HO-ECO-0301", titleAr: "شقة ٢ غرف", areaAr: "إيكو ويست", size: 110, price: 1720000, legalStatus: "حكم صحة ونفاذ", days: 55, dateAr: "٢٠٢٦/٠٤/٠٩", year: 2026 },
  { code: "HO-HOM-0244", titleAr: "شقة ٣ غرف", areaAr: "هوم أكتوبر جاردنز", size: 134, price: 1940000, legalStatus: "عقد ابتدائي موثق", days: 38, dateAr: "٢٠٢٦/٠٣/٢١", year: 2026 },
  { code: "HO-SKM-0277", titleAr: "شقة ٣ غرف", areaAr: "سكن مصر", size: 118, price: 1290000, legalStatus: "مسجل بالشهر العقاري", days: 26, dateAr: "٢٠٢٦/٠٣/٠٤", year: 2026 },
  { code: "HO-800-0762", titleAr: "دوبلكس", areaAr: "منطقة الـ٨٠٠ فدان", size: 188, price: 2560000, legalStatus: "عقد ابتدائي موثق", days: 72, dateAr: "٢٠٢٦/٠٢/١٧", year: 2026 },
  { code: "HO-RCK-0668", titleAr: "شقة ٢ غرف", areaAr: "روك إيدن", size: 105, price: 1610000, legalStatus: "عقد ابتدائي عرفي", days: 44, dateAr: "٢٠٢٦/٠١/٢٩", year: 2026 },
  { code: "HO-ASH-1298", titleAr: "شقة ٣ غرف", areaAr: "أشجار سيتي", size: 141, price: 2410000, legalStatus: "عقد ابتدائي موثق", days: 33, dateAr: "٢٠٢٦/٠١/١٢", year: 2026 },
  { code: "HO-OW-0574", titleAr: "شقة ٣ غرف", areaAr: "أو ويست", size: 152, price: 3720000, legalStatus: "عقد ابتدائي موثق", days: 96, dateAr: "٢٠٢٥/١٢/٢٢", year: 2025 },
  { code: "HO-800-0719", titleAr: "شقة ٣ غرف", areaAr: "منطقة الـ٨٠٠ فدان", size: 130, price: 1490000, legalStatus: "مسجل بالشهر العقاري", days: 31, dateAr: "٢٠٢٥/١٢/٠٣", year: 2025 },
  { code: "HO-SKM-0248", titleAr: "شقة ٢ غرف", areaAr: "سكن مصر", size: 92, price: 1040000, legalStatus: "مسجل بالشهر العقاري", days: 24, dateAr: "٢٠٢٥/١١/١٨", year: 2025 },
  { code: "HO-BET-0341", titleAr: "شقة ٣ غرف", areaAr: "بيتا ريزيدنس", size: 145, price: 2060000, legalStatus: "عقد ابتدائي موثق", days: 49, dateAr: "٢٠٢٥/١٠/٢٧", year: 2025 },
  { code: "HO-RBW-0132", titleAr: "شقة ٢ غرف", areaAr: "ربوة أكتوبر", size: 85, price: 920000, legalStatus: "عقد ابتدائي عرفي", days: 37, dateAr: "٢٠٢٥/١٠/٠٦", year: 2025 },
  { code: "HO-ASH-1233", titleAr: "دوبلكس", areaAr: "أشجار سيتي", size: 196, price: 2880000, legalStatus: "حكم صحة ونفاذ", days: 68, dateAr: "٢٠٢٥/٠٩/١٤", year: 2025 },
  { code: "HO-HOM-0201", titleAr: "شقة ٢ غرف", areaAr: "هوم أكتوبر جاردنز", size: 108, price: 1440000, legalStatus: "عقد ابتدائي موثق", days: 42, dateAr: "٢٠٢٥/٠٨/٢٥", year: 2025 },
  { code: "HO-800-0688", titleAr: "شقة ٣ غرف", areaAr: "منطقة الـ٨٠٠ فدان", size: 122, price: 1370000, legalStatus: "عقد ابتدائي عرفي", days: 58, dateAr: "٢٠٢٥/٠٧/٣٠", year: 2025 },
  { code: "HO-ECO-0264", titleAr: "شقة ٣ غرف", areaAr: "إيكو ويست", size: 138, price: 2140000, legalStatus: "عقد ابتدائي موثق", days: 63, dateAr: "٢٠٢٥/٠٦/١٩", year: 2025 },
  { code: "HO-RCK-0611", titleAr: "شقة ٣ غرف", areaAr: "روك إيدن", size: 133, price: 1860000, legalStatus: "عقد ابتدائي عرفي", days: 45, dateAr: "٢٠٢٥/٠٥/٢٨", year: 2025 },
  { code: "HO-SKM-0219", titleAr: "شقة ٣ غرف", areaAr: "سكن مصر", size: 116, price: 1180000, legalStatus: "مسجل بالشهر العقاري", days: 28, dateAr: "٢٠٢٥/٠٤/١٥", year: 2025 },
  { code: "HO-ASH-1177", titleAr: "شقة ٢ غرف", areaAr: "أشجار سيتي", size: 99, price: 1320000, legalStatus: "عقد ابتدائي موثق", days: 35, dateAr: "٢٠٢٥/٠٣/٠٢", year: 2025 },
  { code: "HO-800-0641", titleAr: "دوبلكس بحديقة", areaAr: "منطقة الـ٨٠٠ فدان", size: 204, price: 2410000, legalStatus: "حكم صحة ونفاذ", days: 79, dateAr: "٢٠٢٥/٠١/٢١", year: 2025 },
  { code: "HO-OW-0498", titleAr: "تاون هاوس", areaAr: "أو ويست", size: 226, price: 3540000, legalStatus: "عقد ابتدائي موثق", days: 104, dateAr: "٢٠٢٤/١٢/١١", year: 2024 },
  { code: "HO-BET-0287", titleAr: "شقة ٣ غرف", areaAr: "بيتا ريزيدنس", size: 142, price: 1780000, legalStatus: "عقد ابتدائي موثق", days: 51, dateAr: "٢٠٢٤/١٠/٢٩", year: 2024 },
  { code: "HO-800-0577", titleAr: "شقة ٣ غرف", areaAr: "منطقة الـ٨٠٠ فدان", size: 128, price: 1210000, legalStatus: "عقد ابتدائي عرفي", days: 66, dateAr: "٢٠٢٤/٠٨/١٤", year: 2024 },
  { code: "HO-SKM-0184", titleAr: "شقة ٢ غرف", areaAr: "سكن مصر", size: 90, price: 860000, legalStatus: "مسجل بالشهر العقاري", days: 30, dateAr: "٢٠٢٤/٠٥/٢٢", year: 2024 }
];

export const SOLD_TOTAL_SINCE_2011 = 503;

export const SOLD_SUMMARY_2026 = {
  yearAr: "٢٠٢٦",
  units: 31,
  medianPrice: 1_860_000,
  medianPerMetre: 15_100,
  medianDays: 47,
  negotiationAr: "−" + "3.4%",
} as const;

export const SOLD_YEARS = [...new Set(SOLD.map((r) => r.year))].sort((a, b) => b - a);
export const SOLD_AREAS = [...new Set(SOLD.map((r) => r.areaAr))];

/** The same derivation over whichever records are on screen — see
 *  `facetsFor` in lib/units.ts for why the filters cannot be hard-coded. */
export function soldFacetsFor(records: SoldRecord[]) {
  return {
    years: [...new Set(records.map((r) => r.year))].sort((a, b) => b - a),
    areas: [...new Set(records.map((r) => r.areaAr))],
  };
}

/** How buyers actually use the archive. Written as instructions, not as
 *  claims about our experience. */
export const SOLD_USES = [
  {
    titleAr: "قارن السعر المعروض عليك بآخر بيع في نفس المنطقة",
    bodyAr:
      "افتح السنة الحالية، اختر منطقتك، واقرأ عمود «سعر المتر». إن كان السعر المطلوب منك أعلى بأكثر من ١٠٪ من آخر تعاقد مشابه، اسأل عن السبب.",
  },
  {
    titleAr: "اقرأ عمود مدة العرض قبل أن تستعجل",
    bodyAr:
      "الوسيط ٤٧ يومًا. الوحدة التي تُعرض عليك كـ«آخر وحدة، والسعر يزيد بكرة» نادرًا ما تكون كذلك.",
  },
  {
    titleAr: "لاحظ فرق السعر بين العقد المسجل والعرفي",
    bodyAr:
      "في نفس المنطقة والمساحة، الوحدة المسجلة تبيع أعلى بـ٦٪ إلى ١١٪. هذا هو الثمن الحقيقي للورقة الناقصة، مكتوبًا بالأرقام.",
  },
] as const;
