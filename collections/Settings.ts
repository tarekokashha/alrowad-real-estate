import type { GlobalConfig } from "payload";

/**
 * إعدادات الموقع — site settings.
 *
 * Deliberately NARROW. There are no colour pickers, no font choices, no
 * section builder and no free HTML. A panel that lets the client restyle the
 * site guarantees it looks like a template within six months — so what he can
 * change is what should change: the facts, the numbers and the registry
 * details. Everything else is the designer's decision, and it stays made.
 */
export const Settings: GlobalConfig = {
  slug: "settings",
  label: { ar: "إعدادات الموقع", en: "Site settings" },
  admin: {
    group: { ar: "الإعدادات", en: "Settings" },
    description: {
      ar: "الأرقام والبيانات اللي بتظهر في كل صفحة. الألوان والخطوط والتصميم مش هنا عن قصد — دي محسومة، وتغييرها بيخرّب التماسك.",
      en: "The facts shown on every page. Colours, fonts and layout are deliberately not editable.",
    },
  },
  access: { read: () => true },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: { ar: "التواصل", en: "Contact" },
          fields: [
            {
              type: "row",
              fields: [
                { name: "phoneLocal", type: "text", required: true, defaultValue: "010 9809 8026", label: { ar: "الموبايل المحلي", en: "Local number" }, admin: { width: "50%" } },
                { name: "phoneIntl", type: "text", required: true, defaultValue: "+20 10 9809 8026", label: { ar: "الرقم الدولي", en: "International" }, admin: { width: "50%" } },
              ],
            },
            { name: "address", type: "text", required: true, defaultValue: "حدائق أكتوبر، الجيزة، مصر", label: { ar: "العنوان", en: "Address" } },
            {
              type: "row",
              fields: [
                { name: "officeHours", type: "text", required: true, defaultValue: "السبت – الخميس 10:00 – 20:00", label: { ar: "مواعيد المكتب", en: "Office hours" }, admin: { width: "50%" } },
                { name: "replyTime", type: "text", defaultValue: "متوسط الرد ١٤ دقيقة", label: { ar: "متوسط زمن الرد", en: "Median reply time" }, admin: { width: "50%" } },
              ],
            },
          ],
        },
        {
          label: { ar: "الشرعية القانونية", en: "Credentials" },
          description: {
            ar: "⚠️ دي أهم بيانات في الموقع كله. متكتبش رقم غير اللي عندك مستنده. الموقع كله قايم على إن الأرقام دي حقيقية وتتراجع.",
            en: "The most important data on the site. Never enter a number you cannot evidence.",
          },
          fields: [
            {
              type: "row",
              fields: [
                { name: "commercialRegistry", type: "text", required: true, label: { ar: "رقم السجل التجاري", en: "Commercial registry" }, admin: { width: "50%" } },
                { name: "registryOffice", type: "text", label: { ar: "جهة القيد", en: "Registry office" }, admin: { width: "50%" } },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "taxCard", type: "text", required: true, label: { ar: "البطاقة الضريبية", en: "Tax card" }, admin: { width: "50%" } },
                { name: "brokerageRegistration", type: "text", required: true, label: { ar: "رقم تسجيل الوساطة العقارية", en: "Brokerage registration" }, admin: { width: "50%" } },
              ],
            },
            {
              name: "brokerageDecree",
              type: "text",
              defaultValue: "القرار الوزاري ٥٧٨/٢٠٢٥",
              label: { ar: "سند التسجيل", en: "Registration instrument" },
              admin: {
                description: {
                  ar: "القرار ده صدر يناير ٢٠٢٦ وأوجب تسجيل الوسطاء العقاريين. ولا منافس في أكتوبر حاطط رقمه على موقعه — ده أقوى ما عندك.",
                  en: "Effective January 2026. Essentially no October competitor publishes their number.",
                },
              },
            },
            { name: "registeredAt", type: "text", label: { ar: "تاريخ التسجيل", en: "Registration date" } },
          ],
        },
        {
          label: { ar: "أرقام التشغيل", en: "Operating numbers" },
          description: {
            ar: "الأرقام دي بتظهر في صفحة «من نحن». راجعها كل شهر — رقم قديم أسوأ من مفيش رقم.",
            en: "Shown on the About page. Review monthly.",
          },
          fields: [
            {
              type: "row",
              fields: [
                { name: "unitsVisited", type: "number", label: { ar: "وحدات زرناها ووثّقناها", en: "Units visited" }, admin: { width: "33%" } },
                { name: "unitsDeclined", type: "number", label: { ar: "وحدات رفضنا عرضها", en: "Units declined" }, admin: { width: "33%" } },
                { name: "unitsListed", type: "number", label: { ar: "معروض حاليًا", en: "Currently listed" }, admin: { width: "34%" } },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "contractsThisYear", type: "number", label: { ar: "تعاقدات هذا العام", en: "Contracts this year" }, admin: { width: "50%" } },
                { name: "totalSold", type: "number", label: { ar: "إجمالي الوحدات المبيعة", en: "Total units sold" }, admin: { width: "50%" } },
              ],
            },
            {
              name: "numbersCheckedAt",
              type: "date",
              label: { ar: "تاريخ مراجعة الأرقام", en: "Numbers checked on" },
              admin: { date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" } },
            },
          ],
        },
      ],
    },
  ],
};
