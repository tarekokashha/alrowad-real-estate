/**
 * Content for the Arabic site.
 *
 * This file is the interim store. Every collection here maps 1:1 to a Payload
 * collection so the move to the CMS is a swap of the data source, not a
 * rewrite of the components.
 *
 * PLACEHOLDER WARNING — before launch these must become the client's real
 * figures. The whole positioning collapses if any of them are invented:
 *   · every price, price-per-metre, range, sample size and quarter change
 *   · every unit code, area, floor, finishing and handover value
 *   · every sold-archive record
 *   · commercialRegistry / taxCard / brokerageRegistration
 * The phone number, address, company name, compound names and the Ministerial
 * Decision 578/2025 reference are REAL and stay verbatim.
 */

export const COMPANY = {
  nameAr: "شركة الرواد للتطوير العقاري",
  shortAr: "الرواد",
  nameEn: "Al Rowad Real Estate Development",
  taglineAr: "نعرف كل متر في حدائق أكتوبر",
  taglineEn: "We know every metre of Hadayek October",
  addressAr: "حدائق أكتوبر، الجيزة، مصر",
  addressEn: "Hadayek October, Giza, Egypt",
  hoursAr: "مفتوح ٢٤/٧",
  officeHoursAr: "السبت – الخميس 10:00 – 20:00",
  replyTimeAr: "متوسط الرد ١٤ دقيقة · ٢٤ ساعة طوال الأسبوع",
  /** Placeholders — must be the real registered numbers before launch. */
  commercialRegistry: "124567",
  taxCard: "644-312-890",
  brokerageRegistration: "RB-2026-0413",
  brokerageDecreeAr: "القرار الوزاري ٥٧٨/٢٠٢٥",
  surveyRef: "HO-800-B12",
} as const;

import type { LegalStatus } from "./units";

/** Counts by legal status, shown on the homepage as the proof artifact.
 *  Never rendered as a green tick — a tick is a claim, a value is a
 *  disclosure, and the disclosure is the whole strategy. */
export const LEGAL_STATUSES: { status: LegalStatus; count: number }[] = [
  { status: "مسجل بالشهر العقاري", count: 41 },
  { status: "حكم صحة ونفاذ", count: 18 },
  { status: "عقد ابتدائي موثق", count: 63 },
  { status: "عقد ابتدائي عرفي", count: 26 },
];

export const TOTAL_LISTED = 148;

/* ---- The price index. Our own numbers, dated, with the sample stated. ---- */

export const PRICE_INDEX = {
  updatedAr: "١ سبتمبر ٢٠٢٦",
  sampleAr: "135 عرضًا و31 عملية بيع موثقة",
  cycleAr: "تحديث أول كل شهر",
  rows: [
    { areaAr: "أو ويست — أوراسكوم", avg: 28_400, low: 24_900, high: 33_600, sample: 19, qoq: "+4%" },
    { areaAr: "أشجار سيتي — IGI", avg: 21_300, low: 18_700, high: 24_100, sample: 26, qoq: "+3%" },
    { areaAr: "روك إيدن — البطل", avg: 19_800, low: 17_200, high: 22_500, sample: 14, qoq: "+2%" },
    { areaAr: "بيتا ريزيدنس وبيتا جاردنز", avg: 17_400, low: 15_100, high: 19_800, sample: 16, qoq: "+2%" },
    { areaAr: "منطقة الـ٨٠٠ فدان", avg: 15_600, low: 13_400, high: 18_000, sample: 38, qoq: "+5%" },
    { areaAr: "سكن مصر", avg: 12_900, low: 11_500, high: 14_200, sample: 22, qoq: "+6%" },
  ],
  footnoteAr:
    "الأرقام بالجنيه المصري للمتر المربع، ولا تشمل مصاريف التسجيل ولا العمولة. المدى يمثّل أدنى وأعلى عرض داخل العيّنة نفسها.",
} as const;

/** Every prior revision stays published at its date. We do not rewrite old numbers. */
export const INDEX_REVISIONS = [
  { dateAr: "١ سبتمبر ٢٠٢٦", noteAr: "تحديث كامل للمؤشر — 135 عرضًا" },
  { dateAr: "١ أغسطس ٢٠٢٦", noteAr: "تحديث كامل للمؤشر — 128 عرضًا" },
  { dateAr: "١ يوليو ٢٠٢٦", noteAr: "تحديث كامل للمؤشر — 119 عرضًا" },
  { dateAr: "١ يونيو ٢٠٢٦", noteAr: "تحديث كامل للمؤشر — 112 عرضًا" },
] as const;

/** The archive that turns "500+ units sold" from a counter into evidence. */
export const RECENT_SALES = [
  { code: "HO-ASH-1387", descAr: "شقة 144 م² — أشجار سيتي", price: 2_640_000, dateAr: "٢٠٢٦/٠٨/١٩" },
  { code: "HO-800-0844", descAr: "دوبلكس 212 م² — الـ٨٠٠ فدان", price: 3_180_000, dateAr: "٢٠٢٦/٠٨/٠٤" },
  { code: "HO-SKM-0291", descAr: "شقة 96 م² — سكن مصر", price: 1_150_000, dateAr: "٢٠٢٦/٠٧/٢٨" },
  { code: "HO-OW-0612", descAr: "تاون هاوس 238 م² — أو ويست", price: 4_410_000, dateAr: "٢٠٢٦/٠٧/١١" },
] as const;

/* ---- The scope. Verified compound names for this zone only. --------------
   Zed West is Sheikh Zayed and Bloomfields is Mostakbal City — neither
   belongs in an October list, and a local reader catches it instantly. */

export const COMPOUNDS = [
  { nameAr: "أو ويست", count: 19 },
  { nameAr: "أشجار سيتي", count: 26 },
  { nameAr: "روك إيدن", count: 14 },
  { nameAr: "إيكو ويست", count: 9 },
  { nameAr: "بيتا ريزيدنس وبيتا جاردنز", count: 16 },
  { nameAr: "ويست وودز وويست تاون", count: 12 },
  { nameAr: "أقمار", count: 7 },
  { nameAr: "هوم أكتوبر جاردنز", count: 11 },
] as const;

export const DISTRICTS = [
  { nameAr: "منطقة الـ٨٠٠ فدان", count: 38 },
  { nameAr: "سكن مصر", count: 22 },
  { nameAr: "ربوة أكتوبر", count: 15 },
  { nameAr: "ابني بيتك", count: 8 },
  { nameAr: "أرض المخابرات", count: 6 },
  { nameAr: "جاردن هيلز", count: 5 },
  { nameAr: "كنز", count: 4 },
  { nameAr: "صن كابيتال · بادية", count: 13 },
] as const;

/** Two registers, deliberately. MSA for the Gulf investor, light Egyptian
 *  colloquial for the local family. Never mixed on one page. */
export const TESTIMONIALS = [
  {
    quoteAr:
      "اشتريت الوحدة وأنا في الرياض ولم أرَها إلا بعد التعاقد. أرسلوا لي صورة العقد الابتدائي وبيان المساحة قبل التحويل، وأزمنة الوصول التي كتبوها في التقرير طابقت ما وجدته على الأرض.",
    nameAr: "عبد العزيز الشمري — الرياض",
    detailAr: "شقة استثمارية، أشجار سيتي · مارس ٢٠٢٦",
    register: "msa" as const,
  },
  {
    quoteAr:
      "قالولي من أول مكالمة إن الوحدة دي عقدها عرفي ودي مسجلة، والفرق في السعر كده وكده. أول مرة حد يقول لنا الحكاية كلها قبل نروح نشوف.",
    nameAr: "أسماء ومحمد — حدائق أكتوبر",
    detailAr: "دوبلكس، منطقة الـ٨٠٠ فدان · يوليو ٢٠٢٦",
    register: "colloquial" as const,
  },
];

export const NAV = [
  { labelAr: "الوحدات", href: "/ar/properties" },
  { labelAr: "حدائق أكتوبر", href: "/ar/areas/hadayek-october" },
  { labelAr: "تم البيع", href: "/ar/sold" },
  { labelAr: "للمستثمرين", href: "/ar/gulf" },
  { labelAr: "من نحن", href: "/ar/about" },
] as const;

export const FOOTER_LINKS = [
  {
    titleAr: "العقارات",
    links: [
      { labelAr: "كل الوحدات", href: "/ar/properties" },
      { labelAr: "اعرف قسطك", href: "/ar/properties#affordability" },
      { labelAr: "تم البيع", href: "/ar/sold" },
      { labelAr: "مؤشر سعر المتر", href: "/ar#index" },
    ],
  },
  {
    titleAr: "المناطق",
    links: [
      { labelAr: "حدائق أكتوبر", href: "/ar/areas/hadayek-october" },
      { labelAr: "٦ أكتوبر", href: "/ar/areas/6-october" },
      { labelAr: "الشيخ زايد", href: "/ar/areas/sheikh-zayed" },
    ],
  },
  {
    titleAr: "الشركة",
    links: [
      { labelAr: "من نحن", href: "/ar/about" },
      { labelAr: "الشرعية القانونية", href: "/ar/about#credentials" },
      { labelAr: "للمستثمرين من الخليج", href: "/ar/gulf" },
    ],
  },
] as const;
