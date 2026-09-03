import type { CollectionConfig } from "payload";

/**
 * مؤشر سعر المتر — the price index.
 *
 * Each revision is a SEPARATE document, never an edit of the previous one.
 * That is the point: old revisions stay published at their date, so the
 * company can be checked against what it said last month. Publishing a
 * dated, sourced, original number with its sample size is simultaneously
 * the trust play, the SEO play and the reason an answer engine has anything
 * worth quoting.
 */
export const PriceIndex: CollectionConfig = {
  slug: "price-index",
  labels: {
    singular: { ar: "نسخة من المؤشر", en: "Index revision" },
    plural: { ar: "مؤشر سعر المتر", en: "Price index" },
  },
  admin: {
    useAsTitle: "publishedAt",
    defaultColumns: ["publishedAt", "sampleListings", "sampleSales"],
    group: { ar: "المحتوى", en: "Content" },
    description: {
      ar: "كل شهر اعمل نسخة جديدة — متعدّلش القديمة. النسخ القديمة بتفضل منشورة بتاريخها، وده اللي بيخلي الأرقام قابلة للمراجعة.",
      en: "Create a new revision each month; never edit an old one. Prior revisions stay published at their date.",
    },
  },
  access: { read: () => true },
  defaultSort: "-publishedAt",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "publishedAt",
          type: "date",
          required: true,
          label: { ar: "تاريخ النسخة", en: "Revision date" },
          admin: {
            width: "34%",
            date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
          },
        },
        {
          name: "sampleListings",
          type: "number",
          required: true,
          label: { ar: "عدد العروض في العيّنة", en: "Listings in sample" },
          admin: { width: "33%" },
        },
        {
          name: "sampleSales",
          type: "number",
          required: true,
          label: { ar: "عدد عمليات البيع", en: "Sales in sample" },
          admin: { width: "33%" },
        },
      ],
    },
    {
      name: "rows",
      type: "array",
      required: true,
      minRows: 1,
      label: { ar: "صفوف المؤشر", en: "Index rows" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "area", type: "text", required: true, label: { ar: "المنطقة / الكمبوند", en: "Area" }, admin: { width: "40%" } },
            { name: "avg", type: "number", required: true, label: { ar: "متوسط سعر المتر", en: "Average /m²" }, admin: { width: "20%" } },
            { name: "low", type: "number", required: true, label: { ar: "أدنى", en: "Low" }, admin: { width: "20%" } },
            { name: "high", type: "number", required: true, label: { ar: "أعلى", en: "High" }, admin: { width: "20%" } },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "sample", type: "number", required: true, label: { ar: "حجم العيّنة", en: "Sample size" }, admin: { width: "50%" } },
            {
              name: "qoq",
              type: "text",
              label: { ar: "التغيّر ربع/ربع", en: "QoQ change" },
              admin: { width: "50%", placeholder: "+4%" },
            },
          ],
        },
      ],
    },
    {
      name: "footnote",
      type: "textarea",
      label: { ar: "ما لا تشمله الأرقام", en: "What the numbers exclude" },
      defaultValue:
        "الأرقام بالجنيه المصري للمتر المربع، ولا تشمل مصاريف التسجيل ولا العمولة. المدى يمثّل أدنى وأعلى عرض داخل العيّنة نفسها.",
      admin: {
        description: {
          ar: "قول بالظبط الرقم ده مش شامل إيه. الرقم اللي مش معروف حدوده رأي مش قياس.",
          en: "State exactly what the figure excludes.",
        },
      },
    },
  ],
};
