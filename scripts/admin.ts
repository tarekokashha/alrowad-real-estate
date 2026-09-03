import { getPayload } from "payload";
import { createInterface } from "node:readline";
import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import config from "../payload.config";

/**
 * إنشاء أو تغيير حساب المدير.
 *
 *   npm run admin
 *
 * Asks for the email and password in the terminal — the password is typed
 * once, hidden while typing, used, and never written anywhere. It does not go
 * into a file, into git, or into any transcript.
 *
 * If ADMIN_EMAIL / ADMIN_PASSWORD happen to be set in .env those are used
 * instead, which is what CI or a scripted redeploy needs.
 *
 * Running it on an account that already exists RESETS the password, so this
 * is also the "forgot my password" path.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function ask(question: string, { hidden = false } = {}): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  if (hidden) {
    // Swallow the echoed characters so the password never appears on screen
    // or in the shell's scrollback.
    const out = process.stdout as NodeJS.WriteStream & { _writeToOutput?: unknown };
    const rlAny = rl as unknown as { _writeToOutput: (s: string) => void; output: NodeJS.WriteStream };
    rlAny._writeToOutput = function (s: string) {
      if (s.includes(question)) rlAny.output.write(question);
      else rlAny.output.write("*");
    };
    void out;
  }

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      if (hidden) process.stdout.write("\n");
      rl.close();
      resolve(answer.trim());
    });
  });
}

/** Payload refuses to start without a signing secret. Generate one on first
 *  run rather than shipping a default that somebody forgets to change. */
function ensureSecret() {
  const envPath = ".env";
  if (process.env.PAYLOAD_SECRET && process.env.PAYLOAD_SECRET !== "dev-only-secret-change-before-deploy") {
    return;
  }
  const secret = randomBytes(32).toString("base64");
  let body = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
  body = body.replace(/^PAYLOAD_SECRET=.*$/m, `PAYLOAD_SECRET=${secret}`);
  if (!/^PAYLOAD_SECRET=/m.test(body)) body += `\nPAYLOAD_SECRET=${secret}\n`;
  writeFileSync(envPath, body, "utf8");
  process.env.PAYLOAD_SECRET = secret;
  console.log("✓ اتولّد PAYLOAD_SECRET جديد واتحفظ في .env");
}

async function main() {
  ensureSecret();

  let email = (process.env.ADMIN_EMAIL || "").trim();
  let password = process.env.ADMIN_PASSWORD || "";

  if (!email || !password) {
    console.log("\n──────────────────────────────────────────────");
    console.log("  حساب مدير لوحة التحكم");
    console.log("──────────────────────────────────────────────\n");
  }

  while (!EMAIL_RE.test(email)) {
    if (email) console.log(`  ✗ «${email}» مش بريد صالح — لازم يكون فيه @ ونطاق.\n`);
    email = await ask("  البريد الإلكتروني: ");
    if (!email) email = "admin@alrowadrealestate.com";
  }

  while (password.length < 8) {
    if (password) console.log("  ✗ كلمة المرور لازم ٨ حروف على الأقل.\n");
    password = await ask("  كلمة المرور (مش هتظهر وانت بتكتب): ", { hidden: true });
  }

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
      data: { password, name: process.env.ADMIN_NAME || "مدير الموقع", role: "admin" },
    });
    console.log(`\n✓ اتغيّرت كلمة مرور ${email}`);
  } else {
    await payload.create({
      collection: "users",
      data: {
        email,
        password,
        name: process.env.ADMIN_NAME || "مدير الموقع",
        role: "admin",
      },
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
