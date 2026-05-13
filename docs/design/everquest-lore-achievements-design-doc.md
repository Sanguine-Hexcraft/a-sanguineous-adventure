# EverQuest Lore & Achievements Website
## Modular Design Document

Version: 0.2
Working stack: Nuxt 4 + Nuxt Content + Supabase + Tauri 2
Working project type: dark-fantasy journey website + achievement tracker + lore codex + log parser

---

# 01. Project Vision

Build a modern EverQuest journey site that feels like a dark-fantasy adventurer’s codex.

It should track what a character has done, preserve what happened along the way, connect progress to EverQuest lore, and eventually read EverQuest log files to unlock or update achievements.

The site should not feel like a generic wiki or spreadsheet. It should feel like:

- a quest journal
- a lore archive
- an achievement tome
- a personal campaign record
- a dark fantasy RPG interface
- a living history of a character’s journey through Norrath

Core phrase:

> Track the deed, preserve the story, understand the world.

---

# 02. Core Product Idea

The project has four major pillars.

## 1. Journey Tracking

Track a character’s path through EverQuest:

- zones visited
- enemies killed
- quests completed
- achievements unlocked
- factions encountered
- NPCs spoken to
- items discovered
- personal notes
- screenshots/videos/art added

## 2. Achievement System

Use retail EverQuest achievement data as a relational source for structured tracking.

The project should be able to import, normalize, browse, and relate official achievement data to:

- characters
- expansions
- zones
- categories
- requirements
- logs
- lore notes
- media
- personal journal entries

## 3. Lore Codex

Create a lore-first archive that explains why the achievement matters.

Examples:

- “You killed this raid target” becomes connected to who that enemy is.
- “You completed this zone arc” becomes connected to the expansion storyline.
- “You gained faction” becomes connected to the politics of Norrath.

## 4. Log-Based Progression

Eventually read EverQuest log files to detect events and update progress.

The site/app should detect things like:

- kills
- loot
- zone entries
- NPC dialogue
- skill increases
- faction changes
- quest text
- achievement triggers
- raid emotes
- important player-written notes

---

# 03. Target Feel

## Visual Tone

- dark fantasy
- ancient codex
- obsidian and parchment
- arcane interface
- old RPG manual
- dungeon journal
- candlelit archive
- magical database
- grim but fun

## UI Inspiration

- character sheet
- quest journal
- codex
- world map
- faction ledger
- achievement tome
- expansion timeline
- relic inventory
- spellbook
- travel log

## Interaction Tone

The site should make progress feel like unlocking a legend.

Instead of:

> Achievement unlocked.

It might feel like:

> A seal has been broken in the Codex.

or:

> This deed has been etched into the Chronicle.

---

# 04. Recommended Stack

## Primary Stack

### Nuxt 4

Use Nuxt as the main web app framework.

Why:

- good for beautiful interactive sites
- Vue-based and approachable
- supports static content and app-like dashboards
- good routing and layout system
- can grow from static prototype to full application
- works well with Markdown-driven content through Nuxt Content

Nuxt describes itself as a framework for type-safe, performant full-stack web applications and websites with Vue. Nuxt Content supports a content directory that can parse Markdown, YAML, CSV, and JSON into a file-based CMS.

### Nuxt Content

Use Nuxt Content for lore and codex material.

Good for:

- zone pages
- NPC pages
- faction pages
- expansion pages
- static achievement explanations
- written lore essays
- Markdown notes
- JSON/YAML structured codex files

Suggested content directories:

```txt
content/
  lore/
    zones/
    npcs/
    factions/
    items/
    expansions/
  codex/
  devlog/
  guides/
```

### Supabase

Use Supabase for the dynamic app data.

Good for:

- auth
- user profiles
- characters
- achievement progress
- parsed log events
- user notes
- media metadata
- public/private journey pages
- relational achievement data
- Postgres database design

Supabase Auth stores user/auth data in Postgres and can connect auth users to custom tables with triggers and foreign keys. Supabase Storage can handle files and media with access control policies.

### Tauri 2

Use Tauri later for the desktop companion app.

Why:

- browser websites are not ideal for continuously watching local game log files
- Tauri can create a lightweight desktop companion
- Tauri can access local files through its filesystem plugin and permissions model
- the desktop app can watch EQ logs and sync parsed events to Supabase

The Tauri filesystem plugin supports file/path access through native APIs, and Tauri permissions control which commands and file scopes are available.

---

# 05. Why This Stack Fits This Project

This project is both a website and a local game companion.

## Website side

Nuxt + Supabase handles:

- public site
- private user dashboards
- lore pages
- media pages
- achievement browser
- character journey pages
- notes
- login/accounts

## Local companion side

Tauri handles:

- selecting the EverQuest log folder
- reading local log files
- watching for new lines
- parsing events
- sending parsed events to Supabase
- optional offline queue later

## Content side

Nuxt Content handles:

- lore as Markdown
- structured codex pages as YAML/JSON
- static pages that can live in git
- easy editing without building a full CMS first

---

# 06. Retail EverQuest Achievement Data Source

The project will use files from retail EverQuest’s achievement system as a major relational data source.

## Purpose

The retail achievement files should become the structured foundation for:

- achievement definitions
- categories
- expansion grouping
- zone grouping
- requirement trees
- dependency relationships
- hidden/visible achievements
- point values if present
- completion logic
- relationships to lore entries
- relationships to user progress

## Design Principle

Do not treat the retail achievement files as final UI.

Treat them as source data.

The project should import them into a cleaner internal schema that is easier to query, display, and connect to lore.

## Import Pipeline

Suggested pipeline:

```txt
retail achievement files
        ↓
raw import table / raw JSON cache
        ↓
normalizer/parser
        ↓
internal achievement tables
        ↓
UI + log matching + lore connections
```

## Why Keep Raw Imports

Keep the raw imported data because:

- it helps debugging
- it preserves unknown fields
- retail files may change
- parser mistakes can be fixed later
- future relationships may become useful

---

# 07. Achievement Data Model

## Raw Achievement Source

```ts
type RawAchievementSource = {
  id: string
  sourceFile: string
  sourceVersion?: string
  importedAt: string
  rawData: Record<string, unknown>
}
```

## Achievement

```ts
type Achievement = {
  id: string
  externalId?: string
  title: string
  description?: string
  categoryId?: string
  expansionId?: string
  zoneId?: string
  points?: number
  isHidden?: boolean
  isMeta?: boolean
  sourceId?: string
  createdAt: string
  updatedAt: string
}
```

## Achievement Requirement

```ts
type AchievementRequirement = {
  id: string
  achievementId: string
  requirementType: "kill" | "loot" | "quest" | "explore" | "dialogue" | "faction" | "skill" | "custom" | "unknown"
  label: string
  targetName?: string
  targetId?: string
  quantity?: number
  sortOrder?: number
  rawData?: Record<string, unknown>
}
```

## Achievement Category

```ts
type AchievementCategory = {
  id: string
  title: string
  parentId?: string
  sortOrder?: number
}
```

## Achievement Unlock

```ts
type AchievementUnlock = {
  id: string
  achievementId: string
  characterId: string
  unlockedAt: string
  source: "manual" | "log" | "import" | "admin"
  sourceEventId?: string
}
```

## Achievement Requirement Progress

```ts
type AchievementRequirementProgress = {
  id: string
  achievementRequirementId: string
  characterId: string
  currentValue: number
  completed: boolean
  completedAt?: string
  sourceEventId?: string
}
```

---

# 08. Lore Relationship Model

Achievements should connect to lore.

## Lore Entry

```ts
type LoreEntry = {
  id: string
  title: string
  slug: string
  entryType: "zone" | "npc" | "faction" | "item" | "quest" | "raid" | "expansion" | "timeline" | "concept"
  summary?: string
  body?: string
  era?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}
```

## Lore Link

```ts
type LoreLink = {
  id: string
  loreEntryId: string
  linkedType: "achievement" | "zone" | "npc" | "faction" | "item" | "quest" | "log_event" | "media" | "note"
  linkedId: string
  relationshipType: "explains" | "mentions" | "requires" | "unlocks" | "happened_in" | "related_to"
}
```

## Example

The achievement “Hunter of Blackburrow” could link to:

- Blackburrow zone lore
- Clan Sabertooth faction lore
- Qeynos Hills regional lore
- Fippy Darkpaw NPC lore
- user’s personal Blackburrow journal note
- screenshots from that zone
- parsed kill events

---

# 09. Character Journey Model

## Character

```ts
type Character = {
  id: string
  userId: string
  name: string
  server?: string
  class?: string
  race?: string
  deity?: string
  level?: number
  portraitUrl?: string
  publicProfile: boolean
  createdAt: string
  updatedAt: string
}
```

## Journey Event

A journey event is the narrative layer on top of raw parsed logs.

```ts
type JourneyEvent = {
  id: string
  characterId: string
  eventType: "achievement" | "zone" | "kill" | "loot" | "note" | "media" | "dialogue" | "level" | "faction" | "quest"
  title: string
  description?: string
  occurredAt: string
  sourceType: "manual" | "log" | "achievement" | "media"
  sourceId?: string
  visibility: "private" | "public"
}
```

## Journey Page

The public-facing version of a character’s legend.

Possible sections:

- character card
- latest deeds
- unlocked achievements
- current lore threads
- zone travel history
- personal journal entries
- media gallery
- expansion progress
- favorite kills
- notable quotes

---

# 10. EverQuest Log Parser

## Goal

Parse EverQuest log files into structured events.

## Early MVP

Start with upload/paste parsing.

The user manually uploads a log file or pastes lines.

The app parses:

- timestamps
- kills
- loot
- dialogue
- faction messages
- zone messages
- system text
- skill increases

## Later Version

A Tauri app watches the EQ log file live.

Possible flow:

```txt
EQ writes log file
        ↓
Tauri companion watches file
        ↓
new line detected
        ↓
parser classifies event
        ↓
event sent to Supabase
        ↓
achievement progress updated
        ↓
website dashboard updates
```

## Log Event

```ts
type LogEvent = {
  id: string
  characterId: string
  timestamp?: string
  rawLine: string
  eventType: "kill" | "loot" | "zone" | "dialogue" | "faction" | "skill" | "system" | "unknown"
  parsedData?: Record<string, unknown>
  createdAt: string
}
```

## Parser Rule

```ts
type ParserRule = {
  id: string
  name: string
  eventType: string
  pattern: string
  enabled: boolean
  notes?: string
}
```

## Example Parser Rules

```txt
You have slain (?<target>.+)\.
You receive (?<item>.+)\.
Your faction standing with (?<faction>.+) has gotten (?<direction>better|worse)\.
You have entered (?<zone>.+)\.
(?<npc>.+) says, '(?<text>.+)'
```

Actual EQ log formatting should be confirmed against real logs before locking patterns.

---

# 11. Notes System

The notes system should be central, not an afterthought.

## Note Types

- journal
- research
- quote
- theory
- TODO
- memory
- roleplay
- strategy
- bug/dev note

## Lore Note

```ts
type LoreNote = {
  id: string
  userId: string
  characterId?: string
  title: string
  body: string
  noteType: "journal" | "research" | "quote" | "todo" | "theory" | "memory" | "roleplay" | "strategy"
  linkedType?: "zone" | "npc" | "achievement" | "faction" | "event" | "quest" | "media"
  linkedId?: string
  tags: string[]
  visibility: "private" | "public"
  createdAt: string
  updatedAt: string
}
```

## Useful Note UX

A note should be addable from:

- achievement page
- zone page
- NPC page
- character dashboard
- log event
- media item
- timeline entry

---

# 12. Media System

## Media Types

- screenshot
- artwork
- video embed
- Twitch clip
- YouTube video
- map
- portrait
- reference image
- audio clip maybe later

## Media Item

```ts
type MediaItem = {
  id: string
  userId: string
  characterId?: string
  title: string
  mediaType: "image" | "video" | "embed" | "map" | "audio"
  url: string
  thumbnailUrl?: string
  caption?: string
  tags: string[]
  linkedType?: "zone" | "npc" | "achievement" | "faction" | "event" | "quest"
  linkedId?: string
  visibility: "private" | "public"
  createdAt: string
}
```

---

# 13. Main Site Sections

## Public Sections

```txt
/
  home / landing page

/codex
  public lore archive

/codex/zones
/codex/npcs
/codex/factions
/codex/items
/codex/expansions

/achievements
  achievement browser

/timeline
  expansion and lore timeline

/journeys/[character]
  public character journey page
```

## Private App Sections

```txt
/app
  user dashboard

/app/characters
/app/characters/[id]

/app/achievements
/app/achievements/[id]

/app/logs
/app/logs/import
/app/logs/events

/app/notes
/app/media
/app/settings
```

---

# 14. Suggested Repo Structure

```txt
eq-codex/
  app/
    pages/
    components/
    composables/
    layouts/
    middleware/
    server/
  content/
    lore/
      zones/
      npcs/
      factions/
      expansions/
    codex/
    guides/
  data/
    achievements/
      retail-raw/
      normalized/
    parser-rules/
  shared/
    types/
    utils/
  supabase/
    migrations/
    seed.sql
  companion/
    tauri-app/
  docs/
    design/
      everquest-lore-achievements-design.md
```

---

# 15. MVP Build Plan

## Phase 1: Beautiful Static Prototype

Goal: make the idea feel real.

Build:

- Nuxt 4 app
- dark fantasy layout
- fake character dashboard
- 5 lore pages
- 10 sample achievements
- manual achievement unlock mockup
- notes UI mockup
- media gallery mockup

No database yet.

## Phase 2: Retail Achievement Import

Goal: prove the achievement data can power the app.

Build:

- inspect retail achievement files
- write import script
- preserve raw imports
- normalize categories/achievements/requirements
- display achievement browser
- connect achievements to sample lore entries

## Phase 3: Supabase Data Layer

Goal: persist user journey data.

Build:

- Supabase project
- auth
- characters table
- achievements tables
- achievement progress tables
- notes table
- media metadata table
- parsed log events table

## Phase 4: Log Upload Parser

Goal: prove log-driven unlocking.

Build:

- upload/paste log text
- parse lines
- display event timeline
- match events to achievement requirements
- unlock/update progress

## Phase 5: Tauri Companion

Goal: make it feel alive.

Build:

- local desktop app
- select EQ log folder
- watch active log file
- parse new lines
- send events to Supabase
- optionally cache events locally if offline

## Phase 6: Full Codex/Journey System

Goal: turn data into an experience.

Build:

- expansion timeline
- faction relationship pages
- NPC dialogue archive
- public journey pages
- media-rich character chronicle
- achievement/lore crosslinks
- RP journal mode

---

# 16. First Screen to Build

Build this first:

## Character Journey Dashboard

Sections:

1. Character card
2. Current zone / current era
3. Recent deeds
4. Recent lore notes
5. Achievement progress
6. Latest parsed log events
7. Media gallery preview
8. “Write in the Codex” note button

This proves the whole concept visually.

---

# 17. Early Development Rules

## Keep Static and Dynamic Separate

Static codex content:

- Markdown
- YAML
- JSON
- git-tracked
- content directory

Dynamic user content:

- Supabase
- characters
- unlocks
- notes
- media
- logs

## Keep Raw and Normalized Data Separate

Do not destroy or overwrite retail achievement data.

Always preserve:

- raw source files
- raw imported records
- normalized internal records
- parser version

## Build Manual First, Automation Second

Manual tracking should work before log parsing.

This prevents the whole project from being blocked by parser complexity.

## Design Before Scale

The early win is making it feel cool.

A beautiful fake dashboard with good data structure is better than an ugly perfect backend.

---

# 18. Open Questions

## Achievement Files

Need to inspect:

- file format
- IDs
- categories
- hierarchy
- requirements
- whether achievements include text triggers
- whether they map clearly to zones/expansions
- whether data is complete or needs enrichment

## Log Files

Need real samples for:

- kills
- loot
- dialogue
- faction
- zoning
- achievements
- raid emotes
- quest text

## Privacy

Decide:

- are logs private by default?
- are public journey pages opt-in?
- should raw chat logs be hidden unless explicitly published?
- should player names be redacted automatically?

## Legal / Content

Need to be mindful that EverQuest IP belongs to Daybreak/Darkpaw.

Best approach:

- fan project language
- avoid claiming official status
- avoid redistributing protected assets without permission
- use user-created notes/art where possible
- keep source data usage careful and internal where needed

---

# 19. Project Name Ideas

- The Norrath Codex
- Echoes of Norrath
- The Planar Archive
- The Lorekeeper’s Ledger
- The Obsidian Codex
- Fires of Veeshan
- Atlas of Norrath
- The Adventurer’s Testament
- The Darkpaw Chronicle
- Codex of the First Brood
- The Faction Ledger
- The Deeds of Norrath
- Chronicle of the Nameless
- The Candlekeep of Norrath

---

# 20. Immediate Next Actions

1. Create Nuxt 4 project.
2. Add Nuxt Content.
3. Create the first dark fantasy layout.
4. Add sample local JSON achievement data.
5. Add 3–5 Markdown lore pages.
6. Build a fake character journey dashboard.
7. Inspect retail EQ achievement files.
8. Design the import/normalization script.
9. Add Supabase only after the prototype feels right.

---

# 21. Technical References

- Nuxt 4: modern Vue full-stack framework.
- Nuxt Content: file-based CMS that can parse Markdown, YAML, CSV, and JSON from the content directory.
- Supabase: Postgres-backed auth, database, storage, and row-level security.
- Tauri 2: lightweight desktop app framework with filesystem access through permissions/plugins.

