import type { CollectionConfig } from "payload";

/**
 * آراء العملاء — testimonials.
 *
 * Name, city, unit type and month are ALL required. First-name-plus-a-star is
 * precisely the pattern fake sites use, and the Gulf segment — the most
 * valuable audience on this site — is the most sceptical about it. A
 * half-credible testimonial is worse than none, so the CMS will not store one.
 */
export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: {
    singular: { ar: "رأي عميل", en: "Testimonial" },
    plural: { ar: "آراء العملاء", en: "Testimonials" },
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "city", "unitType", "dateAr", "register"],
    group: { ar: "المحتوى", en: "Content" },
    description: {
      ar: "الاسم والمدينة ونوع الوحدة والتاريخ كلهم إجباريين. رأي باسم أول ونجمة بس شكله مضروب، والمشتري الخليجي أول واحد بيلاحظ ده.",
      en: "Name, city, unit type and date are all required — anonymous testimonials read as fabricated.",
    },
  },
  access: { read: () => true },
  fields: [
    {
      name: "quote",
      type: "textarea",
      required: true,
      maxLength: 320,
      label: { ar: "نص الرأي", en: "Quote" },
    },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, label: { ar: "الاسم كامل", en: "Full name" }, admin: { width: "50%" } },
        { name: "city", type: "text", required: true, label: { ar: "المدينة", en: "City" }, admin: { width: "50%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "unitType", type: "text", required: true, label: { ar: "نوع الوحدة والمنطقة", en: "Unit and area" }, admin: { width: "50%", placeholder: "شقة استثمارية، أشجار سيتي" } },
        { name: "dateAr", type: "text", required: true, label: { ar: "شهر وسنة التعامل", en: "Month and year" }, admin: { width: "50%", placeholder: "مارس ٢٠٢٦" } },
      ],
    },
    {
      name: "register",
      type: "radio",
      required: true,
      defaultValue: "colloquial",
      label: { ar: "اللهجة", en: "Register" },
      options: [
        { label: { ar: "عامية مصرية — للعملاء المحليين", en: "Egyptian colloquial — local clients" }, value: "colloquial" },
        { label: { ar: "فصحى — للعملاء من الخليج", en: "MSA — Gulf clients" }, value: "msa" },
      ],
      admin: {
        description: {
          ar: "خليك على لهجة العميل نفسه. العامية على صفحة المستثمرين بتخلي الشركة تبان صغيرة.",
          en: "Keep the client's own register. Colloquial on the investor pages reads as small-scale.",
        },
      },
    },
    {
      name: "proofUrl",
      type: "text",
      label: { ar: "لينك إثبات (تقييم جوجل أو فيديو)", en: "Proof link" },
      admin: {
        description: {
          ar: "اختياري بس بيفرق كتير. رأي معاه لينك يتأكد منه بيساوي عشرة بدونه.",
          en: "Optional, but a verifiable testimonial is worth ten unverifiable ones.",
        },
      },
    },
  ],
};
