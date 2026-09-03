import fs from "node:fs";
import { spawnSync } from "node:child_process";

/**
 * Push the environment from .env into Vercel.
 *
 *   npm run vercel:env
 *
 * Secrets are piped in on stdin and never printed or passed as arguments, so
 * nothing lands in the terminal, in scrollback, or in the process list.
 * Re-running replaces what is already set rather than duplicating it.
 *
 * ADMIN_EMAIL / ADMIN_PASSWORD are deliberately NOT pushed, and are actively
 * removed if an earlier manual paste left them behind. The admin account
 * lives in the database, so the running server never reads them — storing
 * credentials somewhere they are not needed is just extra exposure.
 */

const PUSH = [
  "DATABASE_URI",
  "PAYLOAD_SECRET",
  "NEXT_PUBLIC_SITE_URL",
  "S3_BUCKET",
  "S3_ENDPOINT",
  "S3_REGION",
  "S3_ACCESS_KEY_ID",
  "S3_SECRET_ACCESS_KEY",
];

const NEVER_PUSH = ["ADMIN_EMAIL", "ADMIN_PASSWORD", "ADMIN_NAME"];
const TARGETS = ["production", "development", "preview"];

/**
 * shell:true is needed on Windows, where the npm-installed CLI is a .cmd shim
 * that Node will not spawn directly. Every argument here is a fixed literal or
 * an env-var NAME, never a value, so the usual injection concern with that
 * flag does not apply.
 */
function vercel(args, input) {
  return spawnSync("vercel", args, {
    input,
    encoding: "utf8",
    shell: true,
    stdio: input === undefined
      ? ["ignore", "pipe", "pipe"]
      : ["pipe", "pipe", "pipe"],
  });
}

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

let failed = false;

for (const key of PUSH) {
  const value = env[key];
  if (!value) {
    console.log(`  -   ${key.padEnd(22)} skipped, empty in .env`);
    continue;
  }

  const done = [];
  for (const target of TARGETS) {
    vercel(["env", "rm", key, target, "--yes"]);
    const res = vercel(["env", "add", key, target, "--yes"], value);

    if (res.status === 0) {
      done.push(target);
      continue;
    }

    // Production serves the live site, so a failure there is fatal. Preview
    // is branch-scoped and the CLI is fussy about it; missing it only means
    // pull-request previews run without a database, which is acceptable.
    if (target === "production") {
      console.error(`  x   ${key} FAILED on production`);
      console.error((res.stderr || res.stdout || "").trim().slice(-500));
      failed = true;
    }
  }
  if (done.length) console.log(`  ok  ${key.padEnd(22)} ${done.join(", ")}`);
}

for (const key of NEVER_PUSH) {
  for (const target of TARGETS) {
    if (vercel(["env", "rm", key, target, "--yes"]).status === 0) {
      console.log(`  ok  ${key.padEnd(22)} removed from ${target}`);
    }
  }
}

console.log("\n  Admin credentials are never stored on the server.");
console.log("  The account lives in the database — use `npm run admin` locally.");

process.exit(failed ? 1 : 0);
