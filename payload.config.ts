import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";
// Payload's bundled Arabic, with its tashkeel stripped and its two
// defects corrected — see lib/admin-arabic.ts.
import { ar } from "./lib/admin-arabic";

import { Units } from "./collections/Units";
import { Media } from "./collections/Media";
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
      // stale prices and unpublished units.
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

  // No `localization` block, deliberately.
  //
  // There was one, offering العربية and الإنجليزية. Not one field in any
  // collection is marked `localized: true` and the database has no locale
  // tables, so the only thing it produced was a locale switcher in the header
  // that changed nothing when used — on a site whose public routes are Arabic
  // and where /en permanently redirects to /ar.
  //
  // For the owner that control was a trap: switch to «الإنجليزية», type a
  // unit description in English, save, and the work goes nowhere because no
  // page reads it and no field stores it separately. Removing it is free —
  // there is no localized data to migrate.

  // No Leads collection, deliberately.
  //
  // There was one — a read-only log of callback requests, meant to record
  // WhatsApp click-throughs. It never had a public write path (no contact
  // form, and nothing on the site ever posted to it), so in practice it was
  // dead UI: an empty "الطلبات" screen and an "٠ طلب جديد" dashboard card
  // that could never become anything else. The client now runs the whole
  // conversation inside WhatsApp itself — the chat carries the unit code,
  // the price, the legal status, and the booking, and it needs no mirror in
  // the admin. See git history for collections/Leads.ts if that changes.
  collections: [Units, Media, Testimonials, PriceIndex, Users],
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
