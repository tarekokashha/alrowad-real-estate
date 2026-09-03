/**
 * The unit catalogue.
 *
 * Maps 1:1 to the Payload `units` collection. Five fields are REQUIRED and
 * must never become optional, because the entire proof strategy rests on
 * them: `legalStatus`, `priceCheckedAr`, `visitedAr`, `photoDateAr` and
 * `maxYears`. A unit that cannot state its legal status and the date its
 * price was checked has no business being published.
 *
 * PLACEHOLDER: every figure here comes from the design comp. Replace with
 * the client's real inventory before launch.
 */

export type LegalStatus =
  | "مسجل بالشهر العقاري"
  | "حكم صحة ونفاذ"
  | "عقد ابتدائي موثق"
  | "عقد ابتدائي عرفي";

export type Finishing =
  | "تشطيب كامل"
  | "سوبر لوكس"
  | "نص تشطيب"
  | "على المحارة";

export type UnitType = "شقة" | "دوبلكس" | "تاون هاوس" | "توين هاوس" | "بنتهاوس" | "فيلا";

export type Unit = {
  code: string;
  titleAr: string;
  /** Display name of the compound or district. */
  areaAr: string;
  /** Filter key — shorter than the display name in a few cases. */
  areaKey: string;
  type: UnitType;
  price: number;
  size: number;
  gardenSize?: number;
  floorAr?: string;
  finishing: Finishing;
  handoverAr: string;
  saleTypeAr: string;
  legalStatus: LegalStatus;
  /** Longest term the owner accepts. Drives «اعرف قسطك». */
  maxYears: number;
  priceCheckedAr: string;
  visitedAr: string;
  image: string;
  imageAlt: string;
};

export const UNITS: Unit[] = [
  {
    code: "HO-ASH-1442",
    titleAr: "شقة ٣ غرف",
    areaAr: "أشجار سيتي",
    areaKey: "أشجار سيتي",
    type: "شقة",
    price: 1_950_000,
    size: 132,
    floorAr: "الدور الثالث",
    finishing: "تشطيب كامل",
    handoverAr: "استلام فوري",
    saleTypeAr: "أولى",
    legalStatus: "عقد ابتدائي موثق",
    maxYears: 5,
    priceCheckedAr: "٢٨ أغسطس ٢٠٢٦",
    visitedAr: "٢٤ أغسطس ٢٠٢٦",
    image: "/img/unit-01-living.webp",
    imageAlt: "ريسبشن شقة بأشجار سيتي، أرضية خشب وأثاث بلون الرمل وضوء نهاري",
  },
  {
    code: "HO-800-0917",
    titleAr: "دوبلكس بحديقة",
    areaAr: "منطقة الـ٨٠٠ فدان",
    areaKey: "الـ٨٠٠ فدان",
    type: "دوبلكس",
    price: 2_780_000,
    size: 196,
    gardenSize: 55,
    finishing: "على المحارة",
    handoverAr: "استلام ٢٠٢٧",
    saleTypeAr: "أولى",
    legalStatus: "حكم صحة ونفاذ",
    maxYears: 6,
    priceCheckedAr: "٢٦ أغسطس ٢٠٢٦",
    visitedAr: "٢٢ أغسطس ٢٠٢٦",
    image: "/img/unit-05-garden.webp",
    imageAlt: "حديقة خاصة بدوبلكس، تراس مرصوف وأشجار زيتون",
  },
  {
    code: "HO-SKM-0308",
    titleAr: "شقة ٢ غرف",
    areaAr: "سكن مصر",
    areaKey: "سكن مصر",
    type: "شقة",
    price: 1_180_000,
    size: 96,
    floorAr: "الدور الأول",
    finishing: "نص تشطيب",
    handoverAr: "استلام فوري",
    saleTypeAr: "إعادة بيع",
    legalStatus: "مسجل بالشهر العقاري",
    maxYears: 4,
    priceCheckedAr: "٢٩ أغسطس ٢٠٢٦",
    visitedAr: "٢٥ أغسطس ٢٠٢٦",
    image: "/img/unit-04-exterior.webp",
    imageAlt: "مدخل عمارة سكنية حديثة بسكن مصر",
  },
  {
    code: "HO-RCK-0755",
    titleAr: "شقة ٣ غرف",
    areaAr: "روك إيدن",
    areaKey: "روك إيدن",
    type: "شقة",
    price: 2_120_000,
    size: 139,
    floorAr: "الدور الثاني",
    finishing: "سوبر لوكس",
    handoverAr: "استلام فوري",
    saleTypeAr: "أولى",
    legalStatus: "عقد ابتدائي عرفي",
    maxYears: 5,
    priceCheckedAr: "٢٧ أغسطس ٢٠٢٦",
    visitedAr: "٢٠ أغسطس ٢٠٢٦",
    image: "/img/unit-01-kitchen.webp",
    imageAlt: "مطبخ مفتوح بشقة في روك إيدن، خزائن بلون العظم ورخام محبب",
  },
  {
    code: "HO-OW-0688",
    titleAr: "تاون هاوس",
    areaAr: "أو ويست",
    areaKey: "أو ويست",
    type: "تاون هاوس",
    price: 4_350_000,
    size: 232,
    gardenSize: 70,
    finishing: "على المحارة",
    handoverAr: "استلام ٢٠٢٨",
    saleTypeAr: "أولى",
    legalStatus: "عقد ابتدائي موثق",
    maxYears: 8,
    priceCheckedAr: "٢٥ أغسطس ٢٠٢٦",
    visitedAr: "١٨ أغسطس ٢٠٢٦",
    image: "/img/unit-05-exterior.webp",
    imageAlt: "واجهة تاون هاوس بأو ويست، حجر جيري وحديقة أمامية",
  },
  {
    code: "HO-BET-0421",
    titleAr: "شقة ٣ غرف",
    areaAr: "بيتا ريزيدنس",
    areaKey: "بيتا ريزيدنس",
    type: "شقة",
    price: 2_340_000,
    size: 148,
    floorAr: "الدور الرابع",
    finishing: "تشطيب كامل",
    handoverAr: "استلام فوري",
    saleTypeAr: "أولى",
    legalStatus: "عقد ابتدائي موثق",
    maxYears: 5,
    priceCheckedAr: "٢٨ أغسطس ٢٠٢٦",
    visitedAr: "٢١ أغسطس ٢٠٢٦",
    image: "/img/unit-02-reception.webp",
    imageAlt: "ريسبشن مزدوج الارتفاع بشقة في بيتا ريزيدنس",
  },
  {
    code: "HO-RBW-0193",
    titleAr: "شقة ٢ غرف",
    areaAr: "ربوة أكتوبر",
    areaKey: "ربوة أكتوبر",
    type: "شقة",
    price: 990_000,
    size: 88,
    floorAr: "الدور الأرضي",
    finishing: "نص تشطيب",
    handoverAr: "استلام فوري",
    saleTypeAr: "إعادة بيع",
    legalStatus: "مسجل بالشهر العقاري",
    maxYears: 3,
    priceCheckedAr: "٣٠ أغسطس ٢٠٢٦",
    visitedAr: "٢٦ أغسطس ٢٠٢٦",
    image: "/img/unit-04-living.webp",
    imageAlt: "غرفة معيشة مدمجة بشقة في ربوة أكتوبر",
  },
  {
    code: "HO-800-1102",
    titleAr: "شقة ٣ غرف",
    areaAr: "منطقة الـ٨٠٠ فدان",
    areaKey: "الـ٨٠٠ فدان",
    type: "شقة",
    price: 1_620_000,
    size: 124,
    floorAr: "الدور الخامس",
    finishing: "على المحارة",
    handoverAr: "استلام ٢٠٢٧",
    saleTypeAr: "أولى",
    legalStatus: "عقد ابتدائي عرفي",
    maxYears: 5,
    priceCheckedAr: "٢٧ أغسطس ٢٠٢٦",
    visitedAr: "١٩ أغسطس ٢٠٢٦",
    image: "/img/unit-03-stair.webp",
    imageAlt: "سلم داخلي بوحدة على المحارة، درجات خشب ودرابزين برونزي",
  },
  {
    code: "HO-ASH-1509",
    titleAr: "شقة ٢ غرف",
    areaAr: "أشجار سيتي",
    areaKey: "أشجار سيتي",
    type: "شقة",
    price: 1_540_000,
    size: 104,
    floorAr: "الدور الأول",
    finishing: "تشطيب كامل",
    handoverAr: "استلام فوري",
    saleTypeAr: "أولى",
    legalStatus: "عقد ابتدائي موثق",
    maxYears: 5,
    priceCheckedAr: "٢٩ أغسطس ٢٠٢٦",
    visitedAr: "٢٤ أغسطس ٢٠٢٦",
    image: "/img/unit-01-bedroom.webp",
    imageAlt: "غرفة نوم هادئة بشقة في أشجار سيتي، ضوء صباحي وستائر كتان",
  },
  {
    code: "HO-HOM-0277",
    titleAr: "شقة ٣ غرف",
    areaAr: "هوم أكتوبر جاردنز",
    areaKey: "هوم أكتوبر جاردنز",
    type: "شقة",
    price: 2_010_000,
    size: 136,
    floorAr: "الدور الثالث",
    finishing: "سوبر لوكس",
    handoverAr: "استلام فوري",
    saleTypeAr: "أولى",
    legalStatus: "عقد ابتدائي موثق",
    maxYears: 6,
    priceCheckedAr: "٢٦ أغسطس ٢٠٢٦",
    visitedAr: "٢٠ أغسطس ٢٠٢٦",
    image: "/img/unit-06-roof.webp",
    imageAlt: "تراس علوي خاص بإطلالة على حدائق أكتوبر وقت الغروب",
  },
  {
    code: "HO-ECO-0344",
    titleAr: "شقة ٢ غرف",
    areaAr: "إيكو ويست",
    areaKey: "إيكو ويست",
    type: "شقة",
    price: 1_760_000,
    size: 112,
    floorAr: "الدور الثاني",
    finishing: "تشطيب كامل",
    handoverAr: "استلام ٢٠٢٧",
    saleTypeAr: "أولى",
    legalStatus: "حكم صحة ونفاذ",
    maxYears: 7,
    priceCheckedAr: "٢٨ أغسطس ٢٠٢٦",
    visitedAr: "٢٣ أغسطس ٢٠٢٦",
    image: "/img/unit-03-living.webp",
    imageAlt: "غرفة معيشة بإطلالة على اللاندسكيب والأفق",
  },
  {
    code: "HO-SKM-0355",
    titleAr: "شقة ٣ غرف",
    areaAr: "سكن مصر",
    areaKey: "سكن مصر",
    type: "شقة",
    price: 1_340_000,
    size: 118,
    floorAr: "الدور الثالث",
    finishing: "على المحارة",
    handoverAr: "استلام فوري",
    saleTypeAr: "إعادة بيع",
    legalStatus: "مسجل بالشهر العقاري",
    maxYears: 4,
    priceCheckedAr: "٣٠ أغسطس ٢٠٢٦",
    visitedAr: "٢٥ أغسطس ٢٠٢٦",
    image: "/img/unit-02-exterior.webp",
    imageAlt: "واجهة عمارة سكنية بسكن مصر وقت العصر",
  },
];

export const CATALOGUE_REVIEWED_AR = "٢ سبتمبر ٢٠٢٦";

/* ---- Filter vocabularies, derived so they can never drift from the data -- */

export const AREAS = [...new Set(UNITS.map((u) => u.areaKey))];
export const TYPES = [...new Set(UNITS.map((u) => u.type))];
export const LEGAL_VALUES = [...new Set(UNITS.map((u) => u.legalStatus))];
export const FINISHINGS = [...new Set(UNITS.map((u) => u.finishing))];
export const PRICE_MIN = Math.min(...UNITS.map((u) => u.price));
export const PRICE_MAX = Math.max(...UNITS.map((u) => u.price));

/* -------------------------------------------------------------------------
   «اعرف قسطك» — the reverse instalment search.

   Egyptians buy by instalment capacity, not by sticker price, and no
   competitor in the October zone lets them search that way. The buyer states
   the deposit they hold and the monthly payment they can carry; we return the
   units that genuinely work, each with a written plan.

   Owner and developer plans in this market are interest-free, so:
       minDown = max(price × 20%, price − monthly × years × 12)
   A unit qualifies when that minimum down payment is within reach.
   ------------------------------------------------------------------------- */

export const MIN_DOWN_PCT = 0.2;

export type Plan = { minDown: number; monthly: number; years: number };

export function planFor(
  unit: Unit,
  depositAvailable: number,
  monthlyCapacity: number,
): Plan | null {
  const years = unit.maxYears;
  const months = years * 12;
  const floorDown = unit.price * MIN_DOWN_PCT;
  const neededDown = unit.price - monthlyCapacity * months;
  const minDown = Math.max(floorDown, neededDown);

  if (minDown > depositAvailable) return null;

  const monthly = Math.round((unit.price - minDown) / months);
  return { minDown: Math.round(minDown), monthly, years };
}

/** Arabic plural agreement for a term in years: 1 سنة · 2 سنتين · 3–10 سنوات · 11+ سنة */
export function yearsLabel(n: number): string {
  if (n === 1) return "سنة";
  if (n === 2) return "سنتين";
  if (n >= 3 && n <= 10) return "سنوات";
  return "سنة";
}

/** Arabic plural agreement for a count of units. */
export function unitsLabel(n: number): string {
  if (n === 0) return "وحدة";
  if (n === 1) return "وحدة واحدة";
  if (n === 2) return "وحدتان";
  if (n >= 3 && n <= 10) return "وحدات";
  return "وحدة";
}

export function findUnit(code: string): Unit | undefined {
  return UNITS.find((u) => u.code.toLowerCase() === code.toLowerCase());
}
