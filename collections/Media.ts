import { APIError, type CollectionConfig } from "payload";

/**
 * A serverless function has no persistent disk. Without object storage an
 * uploaded file lands in the instance's own temporary filesystem, where it
 * survives until the next deploy — or simply is not there for the next
 * request, which may be served by a different instance entirely.
 *
 * Payload would accept that upload and render its thumbnail, so nothing
 * looks wrong until the client has spent an evening adding photographs and
 * they are gone the next morning. Refusing the upload with a message he can
 * act on is far kinder than accepting work that cannot survive.
 */
const ephemeralStorage =
  Boolean(process.env.VERCEL) &&
  !(
    process.env.S3_BUCKET &&
    process.env.S3_ENDPOINT &&
    process.env.S3_ACCESS_KEY_ID
  );

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
  hooks: {
    beforeOperation: [
      ({ operation, req }) => {
        if (!ephemeralStorage) return;
        if (operation !== "create" && operation !== "update") return;
        // Editing alt text carries no file and is perfectly safe.
        if (!req.file) return;
        throw new APIError(
          "التخزين لسه مش متظبّط على السيرفر، والصورة هتضيع لو رفعناها دلوقتي. لازم مفاتيح Supabase Storage تتحط في إعدادات الموقع الأول. كلّم اللي ظبّطلك الموقع.",
          503,
        );
      },
    ],
  },
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
