# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server at http://localhost:3000
npm run build      # build for production
npm run generate   # static site generation
npm run preview    # preview production build locally
```

No test runner or linter is configured yet.

## Project

This is an EverQuest fan site called "a sanguineous adventure" — a dark-fantasy character journal, lore codex, and achievement tracker for the MMORPG EverQuest. The full design document is at `docs/design/everquest-lore-achievements-design-doc.md`.

**Current state:** Phase 3 in progress. Phases 1–2 (static prototype + retail achievement import) and the visual redesign are done. Supabase is connected with a live schema; email/password auth and character CRUD are shipped with working RLS. Next: wiring achievement unlocks / journey events / lore notes to the active character. The design doc describes the full plan.

**Planned stack:**
- **Nuxt 4** — web framework (in use)
- **Nuxt Content** — file-based CMS for lore/codex pages (Markdown, YAML, JSON in `content/`)
- **Supabase** — Postgres, auth, storage for dynamic user data (characters, progress, notes, media)
- **Tauri 2** — desktop companion app that watches local EQ log files and syncs events to Supabase

## Architecture

### Static vs. Dynamic separation

Static content (lore, codex, structured achievement data) lives in `content/` and `data/` — git-tracked Markdown/YAML/JSON served via Nuxt Content. Dynamic user content (characters, achievement unlocks, notes, media, parsed log events) goes in Supabase.

### Supabase tables — security checklist (MANDATORY for every new table)

RLS is the **only** real security boundary — the `@nuxtjs/supabase` redirect/exclude
list is navigation UX, not access control. A grants migration
(`20260529000001_grant_api_privileges.sql`) sets `alter default privileges … grant …
to authenticated`, so **every new table in `public` auto-grants full CRUD to any
logged-in user.** That means a table without RLS is wide open to all users. So for
each new table, in the same migration:

1. `alter table public.<t> enable row level security;`
2. Add a policy. Default user-data pattern: `for all using (auth.uid() = user_id) with check (auth.uid() = user_id)` (the `with check` is what blocks `user_id` spoofing on insert).
3. Include a `user_id uuid not null references auth.users(id) on delete cascade` column (or scope via a parent FK that is itself user-isolated).
4. Don't grant to `anon` — public pages read static JSON, never the DB.
5. After applying (manually, via Supabase SQL Editor — no CLI installed), run Dashboard → Advisors → Security Advisor to confirm no RLS-disabled tables.
6. In app code, never trust client-supplied `user_id` — set it from the live session (`supabase.auth.getSession()`), and let RLS enforce it.

Raw SQL `create table` migrations do **not** auto-grant API privileges the way the
dashboard table editor does — hence the explicit grants migration. A missing GRANT
surfaces as `permission denied for table …`; a missing/failing RLS check surfaces as
`new row violates row-level security policy`.

### Planned directory layout

```
app/
  pages/          # Nuxt file-based routing
  components/
  composables/
  layouts/
  middleware/
  server/         # Nuxt server routes/API
content/
  lore/
    zones/ npcs/ factions/ expansions/
  codex/
  guides/
data/
  achievements/
    retail-raw/   # unmodified files from EQ client
    normalized/   # parsed/cleaned internal records
  parser-rules/
supabase/
  migrations/
companion/        # Tauri desktop app (Phase 5)
```

### Achievement data pipeline

EQ retail achievement files → raw import table (preserve originals) → normalizer → internal achievement tables → UI / log matching / lore connections. Never overwrite or discard raw source data.

### Log parser pipeline (Phase 4+)

Upload/paste log text → regex-based parser rules → structured `LogEvent` records → matched against achievement requirements → progress updates in Supabase. Later replaced by a Tauri file watcher that streams live lines.

## Key data models

Defined in the design doc (section 07–12). The core types: `Achievement`, `AchievementRequirement`, `AchievementCategory`, `AchievementUnlock`, `LoreEntry`, `LoreLink`, `Character`, `JourneyEvent`, `LogEvent`, `LoreNote`, `MediaItem`.

## Routing

Public: `/`, `/codex/**`, `/achievements`, `/timeline`, `/journeys/[character]`
Private app: `/app`, `/app/characters/**`, `/app/achievements/**`, `/app/logs/**`, `/app/notes`, `/app/media`, `/app/settings`

## Visual tone

Dark fantasy — obsidian/parchment aesthetic, codex/tome UI metaphors. Progress events should read like legend entries ("A seal has been broken in the Codex") not generic notifications.

## IP note

EverQuest IP belongs to Daybreak/Darkpaw. Frame this as a fan project; avoid redistributing protected game assets.
