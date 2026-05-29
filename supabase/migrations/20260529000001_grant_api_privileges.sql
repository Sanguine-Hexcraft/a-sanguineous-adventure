-- ============================================================
-- Grant table privileges to the PostgREST API roles.
--
-- The initial schema migration enabled RLS + policies but never granted
-- base table privileges. RLS restricts WHICH ROWS a role sees; the role
-- still needs SELECT/INSERT/UPDATE/DELETE to touch the table at all.
-- (The dashboard table editor auto-grants these; raw SQL migrations do not.)
--
-- We grant to `authenticated` only — every table here is user-isolated via
-- `auth.uid() = user_id` policies, so anonymous users get nothing useful and
-- need no grant. UUID PKs use uuid_generate_v4(), so no sequence grants.
-- ============================================================

grant usage on schema public to authenticated;

grant select, insert, update, delete
  on all tables in schema public
  to authenticated;

-- Keep future tables working without revisiting this.
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
