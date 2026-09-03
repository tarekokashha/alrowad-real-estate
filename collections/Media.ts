import type { CollectionConfig } from "payload";

/**
 * الصور — media.
 *
 * Aspect ratios are enforced here, not left to the client. A grid of cards
 * whose images were cropped differently is the single fastest way to make
 * AI-generated photography read as fake, and the client uploads the images
 * himself. So the CMS crops; he does not choose.
 */
export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: { ar: "صورة", en: "Image" },
    plural: { ar: "الصور", en: "Media" },
  },
  admin: {
    group: { ar: "المحتوى", en: "Content" },
    description: {
      ar: "ارفع الصورة بأعلى جودة عندك — النظام بيقصّها ويصغّرها للمقاسات المطلوبة تلقائيًا. متقصّهاش بنفسك.",
      en: "Upload at the highest quality you have; the system crops and resizes.",
    },
  },
  access: { read: () => true },
  upload: {
    staticDir: "public/uploads",
    mimeTypes: ["image/*"],
    // One ratio per role. Never mixed within a grid.
    imageSizes: [
      { name: "card", width: 800, height: 1000, position: "centre" },      // 4:5
      { name: "cardWide", width: 1200, height: 800, position: "centre" },  // 3:2
      { name: "hero", width: 1920, height: 1080, position: "centre" },     // 16:9
      { name: "thumb", width: 400, height: 400, position: "centre" },
    ],
    formatOptions: { format: "webp", options: { quality: 82 } },
    adminThumbnail: "thumb",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      maxLength: 120,
      label: { ar: "وصف الصورة", en: "Alt text" },
      admin: {
        description: {
          ar: "اكتب اللي في الصورة بجملة قصيرة. ده اللي بيقرأه قارئ الشاشة للمكفوفين، وجوجل بيستخدمه في نتائج الصور.",
          en: "Describe what is in the image. Screen readers and Google image search both use this.",
        },
      },
    },
  ],
};
