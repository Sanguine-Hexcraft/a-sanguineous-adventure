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

**Current state:** Phase 1 (static prototype). The Nuxt app is freshly initialized; the design doc describes what to build.

**Planned stack:**
- **Nuxt 4** — web framework (in use)
- **Nuxt Content** — file-based CMS for lore/codex pages (Markdown, YAML, JSON in `content/`)
- **Supabase** — Postgres, auth, storage for dynamic user data (characters, progress, notes, media)
- **Tauri 2** — desktop companion app that watches local EQ log files and syncs events to Supabase

## Architecture

### Static vs. Dynamic separation

Static content (lore, codex, structured achievement data) lives in `content/` and `data/` — git-tracked Markdown/YAML/JSON served via Nuxt Content. Dynamic user content (characters, achievement unlocks, notes, media, parsed log events) goes in Supabase.

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
