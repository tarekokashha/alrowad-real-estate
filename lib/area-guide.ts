/**
 * The Hadayek October area guide.
 *
 * This is the SEO and AI-citation engine of the whole site. Retrieval happens
 * at 100–300 word chunk level, so every section here answers one question
 * directly in its opening sentence, and every number carries its date and its
 * sample size. Dated, sourced, original figures are what search engines rank
 * and what answer engines quote — a page of adjectives is neither.
 *
 * PLACEHOLDER: all figures are illustrative and must be replaced with the
 * client's own measured data before launch.
 */

export const GUIDE_UPDATED_AR = "١ سبتمبر ٢٠٢٦";
export const GUIDE_SAMPLE_AR =
  "من عيّنة ١٣٥ عرضًا و٣١ عملية بيع داخل النطاق، حتى ١ سبتمبر ٢٠٢٦.";

export const GUIDE_SUMMARY = [
  { labelAr: "مدى سعر المتر", valueAr: "11,500 – 33,600" },
  { labelAr: "مدى سعر الوحدة", valueAr: "950,000 – 4,500,000" },
  { labelAr: "أشهر مساحة مطلوبة", valueAr: "120 – 150 م²" },
  { labelAr: "المدة الوسيطة للبيع", valueAr: "47 يومًا" },
  { labelAr: "نسبة المسجل من معروضنا", valueAr: "28%" },
  { labelAr: "أطول تقسيط رأيناه", valueAr: "8 سنوات" },
] as const;

/** Verified compounds in and adjacent to Hadayek October, with their real
 *  developers. Sun Capital and Badya are 6 October rather than Hadayek
 *  October and are labelled as such — buyers compare against them, so
 *  omitting them is unhelpful, but mislabelling them is worse. */
export const COMPOUND_TABLE = [
  { nameAr: "أو ويست", devAr: "أوراسكوم للتنمية", typesAr: "شقق · تاون · فيلات", ppm: "28,400", handoverAr: "٢٠٢٦ – ٢٠٢٩", units: 19 },
  { nameAr: "أشجار سيتي", devAr: "IGI", typesAr: "شقق · دوبلكس", ppm: "21,300", handoverAr: "جارٍ التسليم", units: 26 },
  { nameAr: "روك إيدن", devAr: "البطل للتعمير", typesAr: "شقق", ppm: "19,800", handoverAr: "جارٍ التسليم", units: 14 },
  { nameAr: "إيكو ويست", devAr: "ماونتن فيو", typesAr: "شقق · تاون", ppm: "24,600", handoverAr: "٢٠٢٧ – ٢٠٢٨", units: 9 },
  { nameAr: "بيتا ريزيدنس وبيتا جاردنز", devAr: "بيتا إيجيبت", typesAr: "شقق · دوبلكس", ppm: "17,400", handoverAr: "مسلَّم", units: 16 },
  { nameAr: "ويست وودز وويست تاون", devAr: "أرابيا هولدنج", typesAr: "شقق · تاون", ppm: "18,900", handoverAr: "جارٍ التسليم", units: 12 },
  { nameAr: "أقمار", devAr: "كيان للتطوير", typesAr: "شقق", ppm: "16,700", handoverAr: "مسلَّم", units: 7 },
  { nameAr: "هوم أكتوبر جاردنز", devAr: "زايا", typesAr: "شقق", ppm: "18,200", handoverAr: "جارٍ التسليم", units: 11 },
  { nameAr: "جاردن هيلز", devAr: "سوديك", typesAr: "شقق · فيلات", ppm: "26,800", handoverAr: "٢٠٢٧", units: 5 },
  { nameAr: "كنز", devAr: "الأهلي صبور", typesAr: "شقق", ppm: "20,400", handoverAr: "٢٠٢٧", units: 4 },
  { nameAr: "صن كابيتال — ٦ أكتوبر", devAr: "أرابيا هولدنج", typesAr: "شقق · تاون", ppm: "22,100", handoverAr: "٢٠٢٧ – ٢٠٢٨", units: 8 },
  { nameAr: "بادية — ٦ أكتوبر", devAr: "بالم هيلز", typesAr: "شقق · تاون · فيلات", ppm: "25,300", handoverAr: "٢٠٢٦ – ٢٠٣٠", units: 5 },
] as const;

export const SUBAREAS = [
  {
    nameAr: "منطقة الـ٨٠٠ فدان",
    noteAr:
      "أكبر مصدر معروض في حدائق أكتوبر. عمارات على أراضٍ مقسَّمة، جودة تنفيذ متفاوتة من عمارة لعمارة، والفرق في السعر داخل نفس الشارع يصل إلى ١٥٪.",
    ppm: "15,600",
  },
  {
    nameAr: "سكن مصر",
    noteAr:
      "مشروع حكومي بنظام تخصيص واضح ووحدات متشابهة. أرخص مدخل للمنطقة، وشروط النقل تحتاج مراجعة مع الجهة قبل الشراء.",
    ppm: "12,900",
  },
  {
    nameAr: "ربوة أكتوبر",
    noteAr:
      "وحدات أصغر ومساحات من ٧٥ إلى ١٠٥ م². طلب إيجار قوي بسبب قرب الجامعات.",
    ppm: "13,800",
  },
  {
    nameAr: "ابني بيتك",
    noteAr:
      "أراضٍ بُني عليها بمواصفات مختلفة تمامًا. لا نعرض هنا إلا ما راجعنا رخصته وحصر تشطيبه.",
    ppm: "11,900",
  },
  {
    nameAr: "أرض المخابرات",
    noteAr:
      "موقع متميز على المحور وأسعار أعلى من محيطها. المعروض قليل والدوران بطيء.",
    ppm: "18,600",
  },
] as const;

export const BY_TYPE = [
  { nameAr: "شقة ٢ غرف", ppm: "14,200", rangeAr: "11,500 – 19,400", sizeAr: "85 – 110", n: 44 },
  { nameAr: "شقة ٣ غرف", ppm: "15,900", rangeAr: "12,400 – 24,800", sizeAr: "118 – 155", n: 58 },
  { nameAr: "دوبلكس", ppm: "14,600", rangeAr: "12,100 – 21,300", sizeAr: "175 – 230", n: 14 },
  { nameAr: "تاون هاوس", ppm: "19,700", rangeAr: "16,800 – 28,900", sizeAr: "200 – 250", n: 11 },
  { nameAr: "بنتهاوس برووف", ppm: "16,400", rangeAr: "13,900 – 22,700", sizeAr: "140 – 190", n: 6 },
  { nameAr: "فيلا مستقلة", ppm: "25,100", rangeAr: "21,000 – 33,600", sizeAr: "280 – 420", n: 2 },
] as const;

export const FINISH_PREMIUM = [
  { nameAr: "سوبر لوكس", deltaAr: "+18%" },
  { nameAr: "تشطيب كامل", deltaAr: "+11%" },
  { nameAr: "نص تشطيب", deltaAr: "+4%" },
  { nameAr: "على المحارة", deltaAr: "الأساس" },
] as const;

export const ACCESS = [
  { nameAr: "محور ٢٦ يوليو", km: "2.4", min: 7 },
  { nameAr: "الجامعة البريطانية في مصر", km: "3.1", min: 9 },
  { nameAr: "الطريق الدائري الأوسطي", km: "5.8", min: 12 },
  { nameAr: "مول مصر", km: "8.2", min: 14 },
  { nameAr: "هايبر ون", km: "10.4", min: 17 },
  { nameAr: "الشيخ زايد", km: "14.6", min: 22 },
  { nameAr: "المهندسين", km: "31.0", min: 38 },
  { nameAr: "وسط القاهرة", km: "38.5", min: 45 },
] as const;

export const SERVICES = [
  {
    titleAr: "جامعات",
    items: [
      "الجامعة البريطانية في مصر (BUE)",
      "جامعة مصر للعلوم والتكنولوجيا",
      "مدينة زويل للعلوم والتكنولوجيا",
      "الجامعة الكندية",
      "جامعة النيل",
    ],
    noteAr: "كلها داخل ١٥ دقيقة بالسيارة، وهي السبب الأول لطلب الإيجار في المنطقة.",
  },
  {
    titleAr: "صحة",
    items: [
      "مستشفى دار الفؤاد",
      "مستشفى السادس من أكتوبر التخصصي",
      "وحدات صحية داخل مناطق الإسكان",
      "صيدليات مفتوحة ٢٤ ساعة على المحور",
    ],
    noteAr:
      "أقرب مستشفى مجهّز لحالات الطوارئ من معظم مواقع حدائق أكتوبر: ١٢ إلى ١٨ دقيقة.",
  },
  {
    titleAr: "تجاري ويومي",
    items: [
      "مول مصر · ١٤ دقيقة",
      "دريم لاند وأمريكانا بلازا",
      "هايبر ون · ١٧ دقيقة",
      "أسواق يومية داخل سكن مصر والـ٨٠٠ فدان",
    ],
    noteAr:
      "الخدمة اليومية داخل الكمبوندات الجديدة لا تزال ناقصة؛ اسأل عن نسبة المحال المفتوحة فعلًا وقت المعاينة.",
  },
] as const;

/** The section that earns the page its citations. Four specific, checkable
 *  problems, written because knowing them before booking saves the buyer
 *  money — and because nobody else in this market publishes them. */
export const CAUTIONS = [
  {
    titleAr: "وحدة تُعرض بعقد عرفي منقول أكثر من مرة",
    bodyAr:
      "كل نقل عرفي يضيف طرفًا يجب الحصول على موافقته عند التسجيل. اسأل دائمًا: كم مرة انتقلت هذه الوحدة، ومن هو المالك في آخر عقد مسجل؟",
  },
  {
    titleAr: "فرق بين المساحة المتعاقد عليها والمساحة على الأرض",
    bodyAr:
      "شائع في الأبنية الفردية، والفرق يصل إلى ٨ م². قِس بالشريط يوم المعاينة، أو اطلب منا القياس.",
  },
  {
    titleAr: "أقساط مربوطة بتسليم متأخر بلا شرط جزائي",
    bodyAr:
      "إن لم يكن في العقد تاريخ تسليم محدد وغرامة تأخير، فالتاريخ المعلن ليس التزامًا. راجع هذا البند قبل توقيع أي حجز.",
  },
  {
    titleAr: "صور معروضة لوحدة نموذجية لا للوحدة نفسها",
    bodyAr:
      "اطلب صورًا بتاريخ حديث للوحدة بعينها ومن نفس الدور. كل صورة في هذا الموقع مكتوب تاريخ التقاطها.",
  },
] as const;

export const GUIDE_CONTENTS = [
  { id: "compounds", labelAr: "الكمبوندات ومطوّروها" },
  { id: "housing", labelAr: "مناطق الإسكان والسكن الحكومي" },
  { id: "prices", labelAr: "مؤشر سعر المتر بالنوع" },
  { id: "access", labelAr: "الطرق وأزمنة الوصول" },
  { id: "services", labelAr: "الجامعات والمدارس والخدمات" },
  { id: "cautions", labelAr: "ما ننصح بالحذر منه" },
] as const;

/** FAQ pairs. Question-shaped headings with the answer in the first
 *  sentence are what answer engines actually extract. */
export const GUIDE_FAQ = [
  {
    qAr: "ما متوسط سعر المتر في حدائق أكتوبر؟",
    aAr: "متوسط سعر المتر في حدائق أكتوبر يتراوح بين ١١٬٥٠٠ و٣٣٬٦٠٠ جنيه للمتر المربع حسب الكمبوند ونوع الوحدة، بحسب عيّنة من ١٣٥ عرضًا و٣١ عملية بيع رصدناها حتى ١ سبتمبر ٢٠٢٦. مناطق الإسكان مثل سكن مصر وربوة أكتوبر تبدأ من ١١٬٩٠٠، بينما الكمبوندات المسوّرة مثل أو ويست تصل إلى ٢٨٬٤٠٠.",
  },
  {
    qAr: "ما الفرق بين حدائق أكتوبر و٦ أكتوبر؟",
    aAr: "حدائق أكتوبر امتداد غربي لمدينة السادس من أكتوبر، مخطَّط على هضبة صحراوية مستوية بشبكة شوارع أوسع ومبانٍ أحدث. الفارق العملي أن الوصول للطرق الرئيسية يمر عبر محور واحد أو اثنين، فاختيار الموقع داخل المنطقة يغيّر زمن الرحلة اليومية أكثر من أي عامل آخر.",
  },
  {
    qAr: "هل الشراء في حدائق أكتوبر استثمار جيد؟",
    aAr: "القاعدة العملية في هذه المنطقة أن الورق أهم من التشطيب: وحدة على المحارة بعقد مسجل أفضل استثمارًا من وحدة سوبر لوكس بعقد عرفي، لأن فرق التشطيب يُدفع مرة واحدة بينما فرق الورق يُدفع عند البيع وعند التوريث وعند كل قرض. المدة الوسيطة للبيع داخل النطاق ٤٧ يومًا.",
  },
  {
    qAr: "ما أنواع العقود في حدائق أكتوبر وأيها أأمن؟",
    aAr: "أربعة أنواع: مسجل بالشهر العقاري وهو الأقوى، ثم حكم صحة ونفاذ، ثم عقد ابتدائي موثق، وأخيرًا عقد ابتدائي عرفي وهو الأضعف. نسبة المسجل من معروضنا ٢٨٪، وننشر الحالة القانونية لكل وحدة على الكارت قبل أن يسأل عنها المشتري.",
  },
] as const;
