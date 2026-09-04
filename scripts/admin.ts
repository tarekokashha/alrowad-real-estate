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

/**
 * `npm run admin -- --generate` — for when the account has to be created by
 * someone who must not learn the password, which includes an assistant
 * working in a transcript.
 *
 * A strong password is generated here, used, and written to a local file
 * that .gitignore already excludes. It is never printed to the terminal, so
 * it cannot end up in scrollback or in a conversation log — the only copy is
 * on this machine, for the owner to read and then change.
 */
const CREDENTIAL_FILE = ".admin-password.tmp";

function generatePassword() {
  // base64url over 18 bytes: 24 characters, no ambiguous punctuation to
  // retype, comfortably past anything worth brute-forcing.
  return randomBytes(18).toString("base64url");
}

function writeCredentialFile(email: string, password: string) {
  writeFileSync(
    CREDENTIAL_FILE,
    [
      "حساب لوحة تحكم الرواد",
      "",
      `البريد:      ${email}`,
      `كلمة المرور: ${password}`,
      "",
      "غيّر كلمة المرور من اللوحة أول ما تدخل، وبعدها امسح الملف ده.",
      "الملف مستثنى من git، بس ده مش سبب تسيبه.",
      "",
    ].join("\n"),
    "utf8",
  );
}

async function main() {
  ensureSecret();

  const generate = process.argv.includes("--generate");

  let email = (process.env.ADMIN_EMAIL || "").trim();
  let password = process.env.ADMIN_PASSWORD || "";

  if (generate) {
    if (!EMAIL_RE.test(email)) email = "admin@alrowadrealestate.com";
    if (!password) password = generatePassword();
  }

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

  if (generate) {
    writeCredentialFile(email, password);
    console.log(`  كلمة المرور اتكتبت في: ${CREDENTIAL_FILE}`);
    console.log("  افتح الملف، غيّر كلمة المرور من اللوحة، وبعدين امسحه.");
  }

  console.log("  ادخل من: http://localhost:3100/admin\n");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
