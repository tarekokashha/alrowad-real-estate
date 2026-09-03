import { UNITS, type Unit, type LegalStatus } from "./units";

/**
 * Per-unit detail: the 22-field Egyptian spec table, the room breakdown, the
 * gallery, and the plain-language explanation of what the legal status
 * actually means for this buyer.
 *
 * PLACEHOLDER: derived to be internally consistent with each unit so the
 * page can be reviewed. Every value must come from the real file before
 * launch — and `legalNote` in particular must never be published for a unit
 * whose papers the team has not physically seen.
 */

export type RoomArea = { nameAr: string; area: number };

export type UnitDetail = {
  rooms: number;
  baths: number;
  floorOfAr: string;
  compoundAr: string;
  viewAr: string;
  gardenAr: string;
  roofAr: string;
  elevatorAr: string;
  garageAr: string;
  metersAr: string;
  paymentAr: string;
  downPct: number;
  photoCountAr: string;
  photoDateAr: string;
  gallery: { src: string; alt: string }[];
  roomAreas: RoomArea[];
  netArea: number;
  legalNote: string;
};

/** What each status means, and what it would take to change it. Written
 *  plainly, because a status the buyer cannot interpret is not a disclosure. */
const LEGAL_NOTES: Record<LegalStatus, string> = {
  "مسجل بالشهر العقاري":
    "الوحدة مسجَّلة باسم المالك في الشهر العقاري، ونقل الملكية يتم بالتوقيع أمام المصلحة. هذه أقوى صورة للملكية في مصر، وسعرها عادةً أعلى من نظيرتها غير المسجَّلة بفارق يعكس ذلك.",
  "حكم صحة ونفاذ":
    "صدر حكم بصحة ونفاذ عقد البيع، وهو سند قوي يقوم مقام التسجيل في نقل الحيازة ويمكن الاعتماد عليه لاستكمال التسجيل لاحقًا. نراجع نسخة الحكم وتاريخه معك قبل أي حجز.",
  "عقد ابتدائي موثق":
    "العقد موثق بالشهر العقاري ولم يُسجَّل بعد. التسجيل ممكن ويحتاج موافقة المالك الأصلي وتقديرًا لرسوم التسجيل يقارب ٢٫٥٪ من القيمة. نراجع الأوراق معك قبل أي حجز.",
  "عقد ابتدائي عرفي":
    "العقد عرفي غير موثق. هذه أضعف صور الحيازة، وسعر الوحدة يعكس ذلك. ننشرها كما ننشر المسجَّلة، ونشرح لك بالضبط ما ينقصها وما تكلفة توفيقه، ثم القرار قرارك.",
};

const GALLERY_POOL = [
  "unit-01-living", "unit-01-kitchen", "unit-01-bedroom", "unit-01-exterior",
  "unit-02-reception", "unit-02-garden", "unit-02-exterior",
  "unit-03-living", "unit-03-stair", "unit-03-exterior",
  "unit-04-living", "unit-04-exterior",
  "unit-05-garden", "unit-05-exterior",
  "unit-06-roof", "unit-06-exterior",
];

/** Drive times are measured, and the measurement conditions are stated.
 *  A drive time with no stated conditions is marketing, not information. */
export const DRIVE_TIMES = [
  { toAr: "محور ٢٦ يوليو", minutes: 7 },
  { toAr: "الجامعة البريطانية BUE", minutes: 9 },
  { toAr: "الطريق الدائري", minutes: 12 },
  { toAr: "مول مصر", minutes: 14 },
  { toAr: "الشيخ زايد", minutes: 22 },
  { toAr: "وسط القاهرة", minutes: 45 },
];

export const DRIVE_CONDITIONS_AR =
  "مقيسة بالسيارة يوم عمل الساعة ٩ صباحًا، أغسطس ٢٠٢٦.";

function roomsFor(u: Unit): number {
  if (/٣ غرف/.test(u.titleAr)) return 3;
  if (/٢ غرف/.test(u.titleAr)) return 2;
  if (u.type === "تاون هاوس" || u.type === "دوبلكس") return 4;
  return 3;
}

function galleryFor(u: Unit): { src: string; alt: string }[] {
  const base = u.image.replace("/img/", "").replace(".webp", "");
  const start = Math.max(0, GALLERY_POOL.indexOf(base));
  const picks = [base];
  for (let i = 1; picks.length < 6; i++) {
    const cand = GALLERY_POOL[(start + i) % GALLERY_POOL.length];
    if (!picks.includes(cand)) picks.push(cand);
  }
  return picks.map((p, i) => ({
    src: `/img/${p}.webp`,
    alt:
      i === 0
        ? u.imageAlt
        : `${u.titleAr} — ${u.areaAr}: صورة ${i + 1} من معاينة الوحدة`,
  }));
}

/** Room breakdown, scaled to the unit's sold area. The gap between sold and
 *  net area is stated explicitly rather than quietly omitted — it is one of
 *  the most common sources of a buyer feeling misled after handover. */
function roomAreasFor(u: Unit): { rooms: RoomArea[]; net: number } {
  const r = roomsFor(u);
  const scale = u.size / 132;
  const rows: RoomArea[] = [
    { nameAr: "الريسبشن", area: +(38.5 * scale).toFixed(1) },
    { nameAr: "غرفة النوم الرئيسية", area: +(18.2 * scale).toFixed(1) },
  ];
  if (r >= 2) rows.push({ nameAr: "غرفة نوم ٢", area: +(14.0 * scale).toFixed(1) });
  if (r >= 3) rows.push({ nameAr: "غرفة نوم ٣", area: +(12.4 * scale).toFixed(1) });
  if (r >= 4) rows.push({ nameAr: "غرفة نوم ٤", area: +(11.8 * scale).toFixed(1) });
  rows.push({ nameAr: "المطبخ", area: +(11.6 * scale).toFixed(1) });
  rows.push({ nameAr: "الحمامات", area: +(8.9 * scale).toFixed(1) });
  rows.push({ nameAr: "البلكونات", area: +(7.8 * scale).toFixed(1) });
  const net = +rows.reduce((a, b) => a + b.area, 0).toFixed(1);
  return { rooms: rows, net };
}

export function detailFor(u: Unit): UnitDetail {
  const rooms = roomsFor(u);
  const { rooms: roomAreas, net } = roomAreasFor(u);
  const isHouse = u.type === "تاون هاوس" || u.type === "توين هاوس" || u.type === "فيلا";
  const downPct = 30;

  return {
    rooms,
    baths: rooms >= 4 ? 3 : 2,
    floorOfAr: u.floorAr ? `${u.floorAr} من ٥` : "—",
    compoundAr: `داخل كمبوند — ${u.areaAr}`,
    viewAr: u.gardenSize ? "حديقة خاصة · واجهة شمالية" : "حديقة داخلية · واجهة شمالية شرقية",
    gardenAr: u.gardenSize ? `نعم — ${u.gardenSize} م²` : "لا",
    roofAr: u.code === "HO-HOM-0277" ? "نعم — تراس علوي خاص" : "لا",
    elevatorAr: isHouse ? "لا ينطبق" : "نعم — ٢ أسانسير",
    garageAr: isHouse ? "جراج خاص" : "مكان مغطى مخصص",
    metersAr: "مياه وكهرباء مركّبة · الغاز الطبيعي واصل للعمارة",
    paymentAr: `مقدم وتقسيط على ${u.maxYears} سنين بدون فوائد`,
    downPct,
    photoCountAr: "٦ صور",
    photoDateAr: u.visitedAr,
    gallery: galleryFor(u),
    roomAreas,
    netArea: net,
    legalNote: LEGAL_NOTES[u.legalStatus],
  };
}

/** Comparables: same price band, never the unit itself. */
export function comparablesFor(u: Unit, n = 3): Unit[] {
  return [...UNITS]
    .filter((x) => x.code !== u.code)
    .sort(
      (a, b) =>
        Math.abs(a.price - u.price) - Math.abs(b.price - u.price),
    )
    .slice(0, n);
}
