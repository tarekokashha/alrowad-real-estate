import fs from "node:fs";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

/**
 * فحص تخزين الصور — does object storage actually work?
 *
 *   npm run storage:check
 *
 * The S3 access keys can only be generated from the Supabase dashboard, so
 * that step is the client's. This is the part that can be automated: the
 * moment the keys are pasted into .env, this proves they work by doing a
 * real round trip — write a small file, read it back, compare the bytes,
 * delete it.
 *
 * It exists because the failure mode is silent and slow. Wrong keys do not
 * announce themselves; a photograph uploads, the thumbnail renders, and the
 * loss only shows up on the next deploy after somebody has spent an evening
 * adding a folder of them. Ten seconds here is worth that.
 *
 * Nothing secret is printed. Keys are reported as present or missing only.
 */

const env = Object.fromEntries(
  fs
    .readFileSync(".env", "utf8")
    .split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const REQUIRED = [
  "S3_BUCKET",
  "S3_ENDPOINT",
  "S3_REGION",
  "S3_ACCESS_KEY_ID",
  "S3_SECRET_ACCESS_KEY",
];

const missing = REQUIRED.filter((k) => !env[k]);
if (missing.length) {
  console.error("\n  ✗ ناقص في .env:\n");
  for (const k of missing) console.error(`      ${k}`);
  console.error(`
  المفتاحين بيتعملوا من:
      Supabase ← Settings ← Storage ← S3 connection ← New access key

  حطهم في alrowad/.env وشغّل الأمر ده تاني.
`);
  process.exit(1);
}

const client = new S3Client({
  forcePathStyle: true, // Supabase addresses buckets by path, not subdomain.
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

const Bucket = env.S3_BUCKET;
const Key = `_healthcheck/${Date.now()}.txt`;
const body = `alrowad storage check ${new Date().toISOString()}`;

console.log(`\n  المخزن   : ${Bucket}`);
console.log(`  العنوان  : ${env.S3_ENDPOINT}`);
console.log(`  المفاتيح : موجودة\n`);

let wrote = false;
try {
  await client.send(
    new PutObjectCommand({ Bucket, Key, Body: body, ContentType: "text/plain" }),
  );
  wrote = true;
  console.log("  ✓ الرفع شغال");

  const got = await client.send(new GetObjectCommand({ Bucket, Key }));
  const readBack = await got.Body.transformToString();

  if (readBack !== body) {
    // Reading something other than what was written is worse than a failure
    // to write, because it means uploads appear to succeed and do not.
    console.error("  ✗ الملف رجع مختلف عن اللي اترفع — فيه حاجة غلط في الإعداد");
    process.exit(1);
  }
  console.log("  ✓ القراءة شغالة والمحتوى مطابق");
} catch (err) {
  console.error(`\n  ✗ التخزين مش شغال: ${err.name}`);
  console.error(`    ${err.message}\n`);
  if (err.name === "SignatureDoesNotMatch") {
    console.error("    غالبًا المفتاح السري متنسخ ناقص أو فيه مسافة زيادة.");
  } else if (err.name === "NoSuchBucket") {
    console.error(`    مفيش bucket اسمه «${Bucket}». اعمله من Storage ← New bucket.`);
  } else if (err.name === "InvalidAccessKeyId") {
    console.error("    الـAccess key ID غلط أو اتمسح من اللوحة.");
  }
  console.error("");
  process.exit(1);
} finally {
  if (wrote) {
    try {
      await client.send(new DeleteObjectCommand({ Bucket, Key }));
      console.log("  ✓ المسح شغال — الملف التجريبي اتشال");
    } catch {
      console.warn(`  ! الملف التجريبي لسه موجود: ${Key}`);
    }
  }
}

console.log(`
  التخزين شغال تمام. ارفعه لـVercel:

      npm run vercel:env
`);
process.exit(0);
