import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";
import { ar } from "@payloadcms/translations/languages/ar";

import { Units } from "./collections/Units";
import { Media } from "./collections/Media";
import { Leads } from "./collections/Leads";
import { PriceIndex } from "./collections/PriceIndex";
import { Testimonials } from "./collections/Testimonials";
import { Users } from "./collections/Users";
import { Settings } from "./collections/Settings";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const DATABASE_URI = process.env.DATABASE_URI || "file:./alrowad.db";

// Object storage is opt-in. With no S3 credentials the uploads go to local
// disk, which is right for development and for running on a laptop. On a
// serverless host there is no persistent disk, so the same env vars that
// exist in production switch the same code onto S3-compatible storage —
// Supabase Storage, Cloudflare R2, Backblaze B2, any of them.
const S3_BUCKET = process.env.S3_BUCKET;
const S3_ENDPOINT = process.env.S3_ENDPOINT;
const useS3 = Boolean(S3_BUCKET && S3_ENDPOINT && process.env.S3_ACCESS_KEY_ID);

/**
 * لوحة تحكم الرواد — the admin panel.
 *
 * Payload was chosen over Sanity and Storyblok for one decisive reason: it is
 * the only one of the three that renders a genuinely ARABIC, right-to-left
 * admin. Sanity Studio ships 31 UI languages and Arabic is not among them,
 * with no RTL support anywhere; Storyblok is $99/mo and also cannot. The
 * client is a non-technical Arabic speaker who has to run this himself, so
 * an English-only LTR admin would have failed on day one regardless of how
 * good the rest of the CMS was.
 *
 * It also lives inside the same Next.js app: one repo, one deploy, one
 * domain, admin at /admin.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — لوحة تحكم الرواد",
      description: "لوحة تحكم موقع شركة الرواد للتطوير العقاري",
    },
    components: {
      // The dashboard leads with the work that keeps the site honest:
      // stale prices, unpublished units, and new leads waiting on a reply.
      beforeDashboard: ["/components/admin/Welcome#Welcome"],
      // The client should see his own brand on login, not the CMS vendor's.
      graphics: {
        Logo: "/components/admin/Logo#Logo",
        Icon: "/components/admin/Logo#Icon",
      },
    },
  },

  // Arabic first, English as the fallback. This is the whole reason for
  // choosing Payload — the admin itself renders RTL in Arabic.
  i18n: {
    fallbackLanguage: "ar",
    // Arabic ONLY, deliberately.
    //
    // Payload picks the admin language from the browser's Accept-Language
    // against this list. Leaving English in it means a client whose browser
    // is set to English lands in an English LTR panel — which defeats the
    // entire reason Payload was chosen over Sanity. Listing only Arabic makes
    // the Arabic RTL admin guaranteed rather than probable.
    //
    // A developer who wants English can add `en` back here and switch it in
    // their own user profile; the client should never have to.
    supportedLanguages: { ar },
  },

  localization: {
    locales: [
      { label: { ar: "العربية", en: "Arabic" }, code: "ar" },
      { label: { ar: "الإنجليزية", en: "English" }, code: "en" },
    ],
    defaultLocale: "ar",
    fallback: true,
  },

  collections: [Units, Media, Testimonials, PriceIndex, Leads, Users],
  globals: [Settings],

  editor: lexicalEditor(),

  // The adapter is chosen from the connection string, so the same code runs
  // on a laptop and on Vercel with no edit at deploy time:
  //   file:./alrowad.db      → SQLite, for local work and handover
  //   postgres://… (Neon)    → Postgres, required on Vercel because
  //                            serverless functions have no persistent disk
  db: DATABASE_URI.startsWith("postgres")
    ? postgresAdapter({ pool: { connectionString: DATABASE_URI } })
    : sqliteAdapter({ client: { url: DATABASE_URI } }),

  secret: process.env.PAYLOAD_SECRET || "dev-only-secret-change-before-deploy",

  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },

  sharp,

  plugins: useS3
    ? [
        s3Storage({
          collections: { media: true },
          bucket: S3_BUCKET!,
          config: {
            endpoint: S3_ENDPOINT,
            region: process.env.S3_REGION || "auto",
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID!,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
            },
            // Required by R2, Supabase Storage, Backblaze and MinIO —
            // they address buckets by path, not by subdomain.
            forcePathStyle: true,
          },
        }),
      ]
    : [],

  upload: {
    limits: { fileSize: 12_000_000 }, // 12MB — generous for a phone photo
  },
});
