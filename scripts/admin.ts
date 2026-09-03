import { getPayload } from "payload";
import config from "../payload.config";

/**
 * إنشاء أو تغيير حساب المدير.
 *
 *   npm run admin
 *
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from .env — which is gitignored, so
 * the password never enters the repository. If the account already exists the
 * password is reset instead, so this doubles as "I forgot my password".
 *
 * The password is deliberately NOT hard-coded anywhere in this project. A
 * panel that holds buyers' names and phone numbers should not have its
 * credentials sitting in version control or in a chat transcript.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function main() {
  const email = (process.env.ADMIN_EMAIL || "").trim();
  const password = process.env.ADMIN_PASSWORD || "";
  const name = (process.env.ADMIN_NAME || "مدير الموقع").trim();

  const die = (msg: string) => {
    console.error(`\n✗ ${msg}\n`);
    console.error("  افتح ملف .env واكتب فيه:\n");
    console.error("    ADMIN_EMAIL=admin@alrowadrealestate.com");
    console.error("    ADMIN_PASSWORD=<كلمة المرور اللي تختارها>\n");
    console.error("  وبعدين شغّل:  npm run admin\n");
    process.exit(1);
  };

  if (!email) die("ADMIN_EMAIL مش مكتوب في ملف .env");
  if (!EMAIL_RE.test(email)) {
    die(
      `«${email}» مش بريد إلكتروني صالح.\n` +
        "  لازم يكون فيه @ ونطاق، مثال: admin@alrowadrealestate.com",
    );
  }
  if (!password) die("ADMIN_PASSWORD مش مكتوب في ملف .env");
  if (password.length < 8) die("كلمة المرور لازم تكون ٨ حروف على الأقل.");

  const payload = await getPayload({ config });

  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
  });

  if (existing.totalDocs > 0) {
    await payload.update({
      collection: "users",
      id: existing.docs[0].id,
      data: { password, name, role: "admin" },
    });
    console.log(`\n✓ اتغيّرت كلمة مرور ${email}`);
  } else {
    await payload.create({
      collection: "users",
      data: { email, password, name, role: "admin" },
    });
    console.log(`\n✓ اتعمل حساب المدير: ${email}`);
  }

  console.log("  ادخل من: http://localhost:3100/admin\n");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
