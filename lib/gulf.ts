/**
 * The Gulf investor page.
 *
 * Modern Standard Arabic throughout — never the Egyptian colloquial register
 * used on the local pages. A Riyadh buyer reads colloquial as small-scale,
 * and this is the highest-value segment on the site: eight of the last twenty
 * clients were resident in Saudi or the Gulf, and no October competitor
 * serves them.
 *
 * ⚠️ LEGAL CONTENT: the ownership limits and fee percentages below describe
 * the current Egyptian regime as researched, but the foreign-ownership rules
 * are actively being amended. Every legal page must be dated, must say
 * «استشر محاميك», and must be reviewed by an Egyptian lawyer before launch.
 * Do not let this page drift into giving legal advice.
 */

export const GULF_SUMMARY = [
  { labelAr: "المدة المعتادة للإجراء", valueAr: "21 – 45 يومًا" },
  { labelAr: "الحضور الشخصي", valueAr: "غير لازم" },
  { labelAr: "رسوم التسجيل التقديرية", valueAr: "2.5%" },
  { labelAr: "ضريبة التصرفات العقارية", valueAr: "2.5% على البائع" },
  { labelAr: "حد التملك للأجانب", valueAr: "وحدتان · 4,000 م²" },
] as const;

/** Six stages, each with a documented output. We do not move to the next
 *  stage before the paperwork from the previous one has reached the buyer. */
export const GULF_STEPS = [
  {
    nAr: "٠١",
    titleAr: "تحديد النطاق والميزانية",
    bodyAr:
      "مكالمة واحدة نحدد فيها المنطقة والمساحة والغرض، ثم نرسل ملفًا مبدئيًا بثلاث وحدات مطابقة وأوراق كل منها.",
    outputAr: "ملف الوحدات المبدئي بصيغة PDF",
    daysAr: "يوم واحد",
  },
  {
    nAr: "٠٢",
    titleAr: "المعاينة المرئية المباشرة",
    bodyAr:
      "اتصال مرئي من داخل الوحدة توجّه فيه الكاميرا كما تريد، مع قياس المساحات وتصوير العدادات.",
    outputAr: "تقرير معاينة مصوَّر بتاريخه",
    daysAr: "٢ – ٥ أيام",
  },
  {
    nAr: "٠٣",
    titleAr: "فحص الأوراق قبل أي دفعة",
    bodyAr:
      "نراجع سلسلة الملكية وحالة العقد والرخصة وحصر التشطيب، ونكتب لك ما فيها من نقص إن وُجد.",
    outputAr: "مذكرة الحالة القانونية موقَّعة من محامٍ",
    daysAr: "٤ – ٧ أيام",
  },
  {
    nAr: "٠٤",
    titleAr: "التوكيل والحجز",
    bodyAr:
      "توكيل خاص يُوثَّق في السفارة المصرية، ودفعة حجز في حساب مصرفي باسم البائع لا باسمنا.",
    outputAr: "صورة التوكيل الموثَّق وإيصال الحجز البنكي",
    daysAr: "٧ – ١٤ يومًا",
  },
  {
    nAr: "٠٥",
    titleAr: "التعاقد",
    bodyAr:
      "تحرير عقد البيع وتوقيعه بالتوكيل، مع نسخة إلكترونية موقَّعة تصلك قبل التوقيع بيومين لمراجعتها.",
    outputAr: "عقد البيع موقَّعًا ومختومًا",
    daysAr: "٣ – ٧ أيام",
  },
  {
    nAr: "٠٦",
    titleAr: "التسجيل والتسليم",
    bodyAr:
      "تقديم ملف التسجيل بالشهر العقاري ومتابعته حتى صدور المشهر، ثم تسليم المفاتيح ومحضر الاستلام.",
    outputAr: "المشهر العقاري ومحضر التسليم",
    daysAr: "٢١ – ٩٠ يومًا",
  },
] as const;

export const GULF_DOCS = [
  { titleAr: "صورة جواز السفر سارية", noteAr: "نسخة ملوّنة واضحة" },
  { titleAr: "توكيل خاص بالشراء والتسجيل", noteAr: "يُوثَّق في السفارة أو القنصلية المصرية" },
  { titleAr: "إثبات محل الإقامة", noteAr: "عقد إيجار أو فاتورة خدمات" },
  { titleAr: "إفادة بمصدر التحويل", noteAr: "كشف حساب بنكي لثلاثة أشهر" },
  { titleAr: "رقم قومي أو ما يعادله للجنسية", noteAr: "للمصريين المقيمين بالخارج" },
  { titleAr: "بيانات حساب بنكي مصري", noteAr: "يمكن فتحه بالتوكيل نفسه" },
] as const;

export const GULF_COSTS = [
  { labelAr: "ثمن الوحدة", valueAr: "2,000,000" },
  { labelAr: "رسوم التسجيل 2.5%", valueAr: "50,000" },
  { labelAr: "أتعاب محامٍ وتوثيق", valueAr: "18,000 – 30,000" },
  { labelAr: "عمولة الوساطة 2%", valueAr: "40,000" },
] as const;

export const GULF_COST_TOTAL_AR = "2,108,000 – 2,120,000";

/** Observed, not promised. Net is after maintenance, vacancy and management
 *  — the three deductions that turn a headline yield into a real one. */
export const GULF_YIELDS = [
  { nameAr: "شقة ٢ غرف — ربوة أكتوبر", priceAr: "1,010,000", rentAr: "8,500", grossAr: "10.1%", netAr: "8.6%", vacancyAr: "1.0" },
  { nameAr: "شقة ٣ غرف — سكن مصر", priceAr: "1,290,000", rentAr: "10,000", grossAr: "9.3%", netAr: "7.9%", vacancyAr: "1.2" },
  { nameAr: "شقة ٣ غرف — أشجار سيتي", priceAr: "2,410,000", rentAr: "19,000", grossAr: "9.5%", netAr: "8.1%", vacancyAr: "1.0" },
  { nameAr: "دوبلكس — الـ٨٠٠ فدان", priceAr: "2,560,000", rentAr: "18,500", grossAr: "8.7%", netAr: "7.4%", vacancyAr: "1.5" },
  { nameAr: "شقة ٣ غرف مفروشة — أو ويست", priceAr: "3,720,000", rentAr: "32,000", grossAr: "10.3%", netAr: "9.1%", vacancyAr: "0.8" },
] as const;

/** Egypt observes DST and Saudi does not, so the offset moves twice a year.
 *  These are stated as local working hours in the buyer's own city rather
 *  than as a computed offset that would silently go wrong for half the year. */
export const GULF_HOURS = [
  { cityAr: "الرياض والدمام", hoursAr: "10:00 – 23:00" },
  { cityAr: "جدة ومكة", hoursAr: "10:00 – 23:00" },
  { cityAr: "الدوحة والكويت", hoursAr: "10:00 – 23:00" },
  { cityAr: "دبي وأبوظبي", hoursAr: "11:00 – 24:00" },
] as const;
