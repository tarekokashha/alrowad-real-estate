import fs from "node:fs";
import pg from "pg";

/**
 * Database hardening, run as the table owner.
 *
 * This app talks to Postgres directly as `alrowad_app` and never uses the
 * Supabase client library, so the PostgREST roles (`anon`, `authenticated`)
 * need no access to any of these tables. That matters: `users` holds password
 * hashes and `leads` holds real buyers' names and phone numbers, and the anon
 * key is public by design — it ships in browser code.
 *
 * Two layers:
 *   1. Revoke every grant from the API roles.
 *   2. Enable RLS with no policies. The table OWNER bypasses RLS, so Payload
 *      is unaffected, but anything arriving through the API is denied even if
 *      somebody later runs a broad GRANT by mistake.
 *
 * Safe to re-run.
 */

const uri = (fs.readFileSync(".env", "utf8").match(/^DATABASE_URI=(.*)$/m) || [])[1];
if (!uri) {
  console.error("✗ DATABASE_URI missing from .env");
  process.exit(1);
}

const client = new pg.Client({ connectionString: uri });

const SQL = `
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

do $$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t.tablename);
  end loop;
end $$;
`;

const CHECK_RLS = `
select count(*) filter (where rowsecurity) as enabled,
       count(*) as total
from pg_tables where schemaname = 'public'
`;

const CHECK_GRANTS = `
select count(*)::int as remaining
from information_schema.role_table_grants
where table_schema = 'public' and grantee in ('anon', 'authenticated')
`;

try {
  await client.connect();
  await client.query(SQL);

  const rls = (await client.query(CHECK_RLS)).rows[0];
  const grants = (await client.query(CHECK_GRANTS)).rows[0];

  console.log(`  ✓ RLS enabled on ${rls.enabled} of ${rls.total} tables`);
  console.log(`  ✓ grants remaining for anon/authenticated: ${grants.remaining}`);

  if (grants.remaining > 0) {
    console.error("  ✗ some API-role grants survived — investigate before launch");
    process.exit(1);
  }
  await client.end();
} catch (err) {
  console.error("  ✗", err.message);
  process.exit(1);
}
