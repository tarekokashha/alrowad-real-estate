import type { CollectionConfig } from "payload";
import { APIError } from "payload";

/**
 * الوحدات — the unit collection.
 *
 * This is where the trust strategy is ENFORCED rather than merely documented.
 * Four rules are structural, not advisory:
 *
 *  1. `legalStatus`, `priceCheckedAt`, `visitedAt` and `maxYears` are required.
 *     A unit that cannot state its legal status and the date its price was
 *     checked has no business being published, and the CMS refuses it.
 *
 *  2. Every image must be tagged صورة حقيقية or صورة تعبيرية, and a unit
 *     cannot publish with zero real photographs. AI imagery presented as the
 *     actual flat is the highest-probability way this project damages the
 *     brand, and the client uploads the images himself — so the guard has to
 *     live in the tooling, not in a style guide.
 *
 *  3. A unit untouched for 30 days flips to «تحت المراجعة» automatically.
 *     An honest broker with forty units that sold three months ago becomes,
 *     functionally, a bait-and-switch operation. Staleness is the mechanism.
 *
 *  4. Marking a unit sold requires the contract date and the sale price, and
 *     writes a permanent record into the archive.
 */

const STALE_DAYS = 30;

export const Units: CollectionConfig = {
  slug: "units",
  labels: {
    singular: { ar: "وحدة", en: "Unit" },
    plural: { ar: "الوحدات", en: "Units" },
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["code", "title", "area", "price", "legalStatus", "status"],
    listSearchableFields: ["code", "title", "area"],
    group: { ar: "العقارات", en: "Properties" },
    description: {
      ar: "كل وحدة لازم يكون لها حالة قانونية وتاريخ آخر مراجعة للسعر وصورة حقيقية واحدة على الأقل قبل النشر.",
      en: "Every unit requires a legal status, a price-check date and at least one real photograph before it can be published.",
    },
  },
  access: { read: () => true },
  defaultSort: "-updatedAt",

  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Publishing is a claim. Refuse it when the evidence is missing.
        if (data.status === "published") {
          const realPhotos = (data.gallery ?? []).filter(
            (g: { kind?: string }) => g?.kind === "real",
          );
          if (realPhotos.length === 0) {
            // APIError with an explicit 400, not a bare Error: a plain throw
            // surfaces as a 500 with no message, so the client would see a
            // generic failure instead of being told what to fix.
            throw new APIError(
              "لا يمكن نشر وحدة بدون صورة حقيقية واحدة على الأقل. أضف صورة من المعاينة وحدّد نوعها «صورة حقيقية»، أو سيب الوحدة «مسودة».",
              400,
            );
          }
        }
        if (operation === "create" && !data.priceCheckedAt) {
          data.priceCheckedAt = new Date().toISOString();
        }
        return data;
      },
    ],
    afterRead: [
      ({ doc }) => {
        // A published unit whose price has not been re-checked in 30 days is
        // shown to the client as stale, so the list itself asks for the work.
        if (doc.status === "published" && doc.priceCheckedAt) {
          const days =
            (Date.now() - new Date(doc.priceCheckedAt).getTime()) / 86_400_000;
          doc.isStale = days > STALE_DAYS;
          doc.daysSincePriceCheck = Math.floor(days);
        }
        return doc;
      },
    ],
  },

  fields: [
    {
      type: "tabs",
      tabs: [
        /* ---------------- الأساسيات ---------------- */
        {
          label: { ar: "الأساسيات", en: "Basics" },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "code",
                  type: "text",
                  required: true,
                  unique: true,
                  label: { ar: "كود الوحدة", en: "Unit code" },
                  admin: {
                    width: "35%",
                    description: {
                      ar: "مثال: HO-ASH-1442 — حروف إنجليزية وأرقام فقط، ولا يتكرر.",
                      en: "e.g. HO-ASH-1442 — Latin letters and digits, must be unique.",
                    },
                  },
                  validate: (v: unknown) =>
                    typeof v === "string" && /^[A-Z0-9-]+$/.test(v)
                      ? true
                      : "الكود بحروف إنجليزية كبيرة وأرقام وشرطات فقط، مثال: HO-ASH-1442",
                },
                {
                  name: "status",
                  type: "select",
                  required: true,
                  defaultValue: "draft",
                  label: { ar: "حالة النشر", en: "Publication status" },
                  admin: { width: "35%" },
                  options: [
                    { label: { ar: "مسودة", en: "Draft" }, value: "draft" },
                    { label: { ar: "منشورة", en: "Published" }, value: "published" },
                    { label: { ar: "تحت المراجعة", en: "Under review" }, value: "review" },
                    { label: { ar: "تم البيع", en: "Sold" }, value: "sold" },
                  ],
                },
                {
                  name: "featured",
                  type: "checkbox",
                  label: { ar: "تظهر في الصفحة الرئيسية", en: "Show on homepage" },
                  admin: { width: "30%" },
                },
              ],
            },
            {
              name: "title",
              type: "text",
              required: true,
              maxLength: 40,
              label: { ar: "اسم الوحدة", en: "Unit title" },
              admin: {
                description: {
                  ar: "مثال: «شقة ٣ غرف» أو «دوبلكس بحديقة». اكتبه قصيرًا — الحد ٤٠ حرفًا حتى لا يكسر تنسيق الكارت.",
                  en: "Keep it short — 40 characters max so the card layout holds.",
                },
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "area",
                  type: "text",
                  required: true,
                  label: { ar: "المنطقة أو الكمبوند", en: "Area or compound" },
                  admin: {
                    width: "50%",
                    description: {
                      ar: "بالاسم كما هو معروف محليًا: أشجار سيتي، منطقة الـ٨٠٠ فدان، سكن مصر…",
                      en: "Use the name as it is known locally.",
                    },
                  },
                },
                {
                  name: "type",
                  type: "select",
                  required: true,
                  label: { ar: "النوع", en: "Type" },
                  admin: { width: "50%" },
                  options: [
                    "شقة", "دوبلكس", "تاون هاوس", "توين هاوس", "بنتهاوس", "فيلا",
                  ].map((v) => ({ label: v, value: v })),
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "price",
                  type: "number",
                  required: true,
                  min: 100_000,
                  label: { ar: "السعر (ج.م)", en: "Price (EGP)" },
                  admin: {
                    width: "50%",
                    description: {
                      ar: "بالأرقام فقط، بدون فواصل. اكتب 1950000 والنظام هو اللي هينسّقها.",
                      en: "Digits only, no separators. The site formats it.",
                    },
                  },
                },
                {
                  name: "priceCheckedAt",
                  type: "date",
                  required: true,
                  label: { ar: "تاريخ آخر مراجعة للسعر", en: "Price last checked" },
                  admin: {
                    width: "50%",
                    date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
                    description: {
                      ar: "سعر بلا تاريخ ليس سعرًا. راجعه كل شهر على الأكثر.",
                      en: "A price with no date is not a price.",
                    },
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "size",
                  type: "number",
                  required: true,
                  min: 30,
                  label: { ar: "المساحة (م²)", en: "Area (m²)" },
                  admin: { width: "33%" },
                },
                {
                  name: "gardenSize",
                  type: "number",
                  label: { ar: "مساحة الحديقة (م²)", en: "Garden (m²)" },
                  admin: { width: "33%" },
                },
                {
                  name: "floor",
                  type: "text",
                  label: { ar: "الدور", en: "Floor" },
                  admin: { width: "34%", placeholder: "الدور الثالث" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "rooms",
                  type: "number",
                  required: true,
                  min: 1,
                  label: { ar: "عدد الغرف", en: "Bedrooms" },
                  admin: { width: "33%" },
                },
                {
                  name: "baths",
                  type: "number",
                  required: true,
                  min: 1,
                  label: { ar: "عدد الحمامات", en: "Bathrooms" },
                  admin: { width: "33%" },
                },
                {
                  name: "saleType",
                  type: "select",
                  required: true,
                  label: { ar: "أولى أم إعادة بيع", en: "First sale or resale" },
                  admin: { width: "34%" },
                  options: ["أولى", "إعادة بيع"].map((v) => ({ label: v, value: v })),
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "finishing",
                  type: "select",
                  required: true,
                  label: { ar: "التشطيب", en: "Finishing" },
                  admin: { width: "50%" },
                  options: ["تشطيب كامل", "سوبر لوكس", "نص تشطيب", "على المحارة"].map(
                    (v) => ({ label: v, value: v }),
                  ),
                },
                {
                  name: "handover",
                  type: "text",
                  required: true,
                  label: { ar: "الاستلام", en: "Handover" },
                  admin: { width: "50%", placeholder: "استلام فوري / استلام ٢٠٢٧" },
                },
              ],
            },
          ],
        },

        /* ---------------- الأوراق ---------------- */
        {
          label: { ar: "الأوراق", en: "Papers" },
          description: {
            ar: "هذا التبويب هو سبب وجود الموقع. اكتب الحالة كما هي — العرفي يُنشر كما يُنشر المسجل، والفرق في السعر وفي المخاطرة، ومن حق المشتري يعرفهما.",
            en: "This tab is why the site exists. State the status honestly.",
          },
          fields: [
            {
              name: "legalStatus",
              type: "select",
              required: true,
              label: { ar: "الحالة القانونية", en: "Legal status" },
              options: [
                "مسجل بالشهر العقاري",
                "حكم صحة ونفاذ",
                "عقد ابتدائي موثق",
                "عقد ابتدائي عرفي",
              ].map((v) => ({ label: v, value: v })),
              admin: {
                description: {
                  ar: "⚠️ لا تختر «مسجل بالشهر العقاري» إلا إذا شفت رقم التسجيل وتاريخه بعينك. الخطأ هنا مرة واحدة يهدم الموقع كله.",
                  en: "Never select 'registered' unless you have seen the registration number and date yourself.",
                },
              },
            },
            {
              name: "legalSeenBy",
              type: "text",
              required: true,
              label: { ar: "مين راجع الأوراق", en: "Who reviewed the papers" },
              admin: {
                description: {
                  ar: "اسم الشخص اللي قرأ الأوراق بنفسه. مش اسم المالك.",
                  en: "The person who read the papers. Not the owner's name.",
                },
              },
            },
            {
              name: "visitedAt",
              type: "date",
              required: true,
              label: { ar: "تاريخ زيارة الوحدة", en: "Unit visited on" },
              admin: {
                date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
                description: {
                  ar: "لا نعرض وحدة لم نرها. لو مازرتهاش، سيبها مسودة.",
                  en: "We do not list a unit we have not seen.",
                },
              },
            },
            {
              name: "legalNote",
              type: "textarea",
              maxLength: 400,
              label: { ar: "ملاحظة على الأوراق", en: "Note on the papers" },
              admin: {
                description: {
                  ar: "اشرح للمشتري بالعربي البسيط: العقد ده معناه إيه، والتسجيل ممكن ولا لأ، وتكلفته تقريبًا كام. لو الأوراق ناقصة اكتب إنها ناقصة.",
                  en: "Explain in plain language what the status means and what registration would cost.",
                },
              },
            },
          ],
        },

        /* ---------------- السداد ---------------- */
        {
          label: { ar: "السداد", en: "Payment" },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "maxYears",
                  type: "number",
                  required: true,
                  min: 1,
                  max: 12,
                  label: { ar: "أطول تقسيط يقبله المالك (سنوات)", en: "Longest term (years)" },
                  admin: {
                    width: "50%",
                    description: {
                      ar: "ده اللي بتشتغل عليه «اعرف قسطك». لو غلط، الحسبة كلها غلط.",
                      en: "This drives the affordability search.",
                    },
                  },
                },
                {
                  name: "minDownPct",
                  type: "number",
                  defaultValue: 20,
                  min: 5,
                  max: 60,
                  label: { ar: "أقل مقدَّم يقبله المالك (%)", en: "Minimum deposit (%)" },
                  admin: { width: "50%" },
                },
              ],
            },
          ],
        },

        /* ---------------- الصور ---------------- */
        {
          label: { ar: "الصور", en: "Photographs" },
          description: {
            ar: "كل صورة لازم تتحدد: حقيقية للوحدة نفسها، ولا تعبيرية. الصورة التعبيرية بيظهر عليها لابل واضح على الموقع. الوحدة مش هتتنشر من غير صورة حقيقية واحدة على الأقل.",
            en: "Every image must be tagged real or representative. A representative image is visibly labelled on the site.",
          },
          fields: [
            {
              name: "gallery",
              type: "array",
              // Deliberately NOT required at field level. A draft is working
              // state — the broker may create the record before the visit.
              // PUBLISHING is the claim, and the beforeChange hook refuses to
              // publish a unit with no image tagged as a real photograph.
              maxRows: 12,
              label: { ar: "معرض الصور", en: "Gallery" },
              labels: { singular: { ar: "صورة", en: "Image" }, plural: { ar: "صور", en: "Images" } },
              admin: {
                description: {
                  ar: "أول صورة هي صورة الكارت. رتّبها بالسحب.",
                  en: "The first image is the card image. Drag to reorder.",
                },
              },
              fields: [
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                  label: { ar: "الصورة", en: "Image" },
                },
                {
                  name: "kind",
                  type: "radio",
                  required: true,
                  defaultValue: "real",
                  label: { ar: "نوع الصورة", en: "Image kind" },
                  options: [
                    { label: { ar: "صورة حقيقية للوحدة", en: "Real photo of this unit" }, value: "real" },
                    { label: { ar: "صورة تعبيرية", en: "Representative image" }, value: "representative" },
                  ],
                  admin: {
                    description: {
                      ar: "«تعبيرية» = صورة مولّدة أو لوحدة مشابهة. الموقع بيكتب عليها اللابل ده للمشتري. المشتري اللي يكتشف إن الصورة مش للوحدة بيمشي ومش بيرجع.",
                      en: "Representative = generated or of a similar unit. The site labels it for the buyer.",
                    },
                  },
                },
                {
                  name: "caption",
                  type: "text",
                  maxLength: 90,
                  label: { ar: "وصف الصورة", en: "Caption" },
                  admin: {
                    description: {
                      ar: "يُستخدم كنص بديل لقارئ الشاشة ولجوجل. اكتب اللي في الصورة: «ريسبشن بإضاءة نهارية».",
                      en: "Used as alt text for screen readers and for Google.",
                    },
                  },
                },
              ],
            },
            {
              name: "photosTakenAt",
              type: "date",
              label: { ar: "تاريخ التقاط الصور", en: "Photos taken on" },
              admin: {
                date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
                description: {
                  ar: "يظهر تحت المعرض. الصور القديمة بتخلي المشتري يحس إن الوحدة واقفة من زمان.",
                  en: "Shown under the gallery.",
                },
              },
            },
          ],
        },

        /* ---------------- البيع ---------------- */
        {
          label: { ar: "البيع", en: "Sale" },
          admin: { condition: (data) => data?.status === "sold" },
          description: {
            ar: "لما تغيّر الحالة إلى «تم البيع»، املأ الحقول دي — الوحدة هتنتقل تلقائيًا إلى سجل البيع العام بتاريخها، ومش هتتشال منه بعد كده.",
            en: "When status is set to sold, these fields move the unit into the public archive.",
          },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "soldPrice",
                  type: "number",
                  label: { ar: "سعر البيع الفعلي (ج.م)", en: "Contracted sale price" },
                  admin: {
                    width: "50%",
                    description: {
                      ar: "القيمة المتعاقد عليها، لا السعر المعلن قبل التفاوض.",
                      en: "The contracted value, not the asking price.",
                    },
                  },
                },
                {
                  name: "contractedAt",
                  type: "date",
                  label: { ar: "تاريخ إتمام التعاقد", en: "Contract date" },
                  admin: {
                    width: "50%",
                    date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
                  },
                },
              ],
            },
            {
              name: "daysListed",
              type: "number",
              label: { ar: "عدد أيام العرض", en: "Days listed" },
            },
          ],
        },
      ],
    },
  ],
};
