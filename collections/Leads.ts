import type { CollectionConfig } from "payload";

/**
 * الطلبات — leads.
 *
 * Read-only in practice: rows arrive from the site, and the team marks what
 * happened. There is deliberately no contact FORM on the public site — a form
 * you fill and nobody answers is exactly the experience this brand exists to
 * contradict — so this collection records callback requests and WhatsApp
 * click-throughs rather than a generic enquiry box.
 */
export const Leads: CollectionConfig = {
  slug: "leads",
  labels: {
    singular: { ar: "طلب", en: "Lead" },
    plural: { ar: "الطلبات", en: "Leads" },
  },
  admin: {
    useAsTitle: "phone",
    defaultColumns: ["phone", "name", "unitCode", "state", "createdAt"],
    group: { ar: "العملاء", en: "Clients" },
    description: {
      ar: "الطلبات اللي جت من الموقع. الرد المتوقع خلال ١٤ دقيقة — ده الرقم المكتوب على الصفحة الرئيسية.",
      en: "Requests from the site. The homepage promises a 14-minute median reply.",
    },
  },
  access: { read: () => true, create: () => true },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", label: { ar: "الاسم", en: "Name" }, admin: { width: "50%" } },
        {
          name: "phone",
          type: "text",
          required: true,
          label: { ar: "الموبايل", en: "Phone" },
          admin: { width: "50%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "unitCode",
          type: "text",
          label: { ar: "كود الوحدة", en: "Unit code" },
          admin: {
            width: "50%",
            description: {
              ar: "بيوصل تلقائيًا من الصفحة اللي العميل كان فيها.",
              en: "Arrives automatically from the page the visitor was on.",
            },
          },
        },
        {
          name: "bestTime",
          type: "text",
          label: { ar: "أنسب وقت للاتصال", en: "Best time to call" },
          admin: { width: "50%" },
        },
      ],
    },
    {
      name: "state",
      type: "select",
      defaultValue: "new",
      label: { ar: "الحالة", en: "State" },
      options: [
        { label: { ar: "جديد", en: "New" }, value: "new" },
        { label: { ar: "تم الرد", en: "Replied" }, value: "replied" },
        { label: { ar: "معاينة محجوزة", en: "Viewing booked" }, value: "viewing" },
        { label: { ar: "تعاقد", en: "Contracted" }, value: "contracted" },
        { label: { ar: "مغلق", en: "Closed" }, value: "closed" },
      ],
    },
    { name: "note", type: "textarea", label: { ar: "ملاحظات", en: "Notes" } },
    {
      name: "source",
      type: "text",
      label: { ar: "مصدر الطلب", en: "Source" },
      admin: { readOnly: true, description: { ar: "الصفحة اللي جه منها الطلب.", en: "Originating page." } },
    },
  ],
};
