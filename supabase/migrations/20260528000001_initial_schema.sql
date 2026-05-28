-- ============================================================
-- a sanguineous adventure — initial schema
-- ============================================================

-- Enable UUID extension (already available in Supabase)
create extension if not exists "uuid-ossp";

-- ============================================================
-- characters
-- ============================================================
create table public.characters (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  class         text not null,
  race          text not null,
  server        text not null,
  level         integer not null default 1 check (level between 1 and 125),
  deity         text,
  portrait_url  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.characters enable row level security;

create policy "users manage own characters"
  on public.characters
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- achievement_unlocks
-- ============================================================
create table public.achievement_unlocks (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  character_id    uuid not null references public.characters(id) on delete cascade,
  -- integer ID from normalized EQ achievement data (public/data/achievements/)
  achievement_id  integer not null,
  unlocked_at     timestamptz not null default now(),
  source          text not null default 'manual' check (source in ('manual', 'log_parse', 'import')),
  unique (character_id, achievement_id)
);

alter table public.achievement_unlocks enable row level security;

create policy "users manage own unlocks"
  on public.achievement_unlocks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- journey_events
-- ============================================================
create table public.journey_events (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  character_id  uuid not null references public.characters(id) on delete cascade,
  event_type    text not null,
  title         text not null,
  description   text,
  occurred_at   timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

alter table public.journey_events enable row level security;

create policy "users manage own journey events"
  on public.journey_events
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- lore_notes
-- ============================================================
create table public.lore_notes (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  character_id uuid references public.characters(id) on delete cascade,
  title        text not null,
  body         text not null,
  note_type    text not null default 'general' check (note_type in ('general', 'theory', 'quote', 'observation')),
  tags         text[] not null default '{}',
  linked_type  text check (linked_type in ('zone', 'npc', 'faction', 'expansion', 'achievement', null)),
  linked_id    text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.lore_notes enable row level security;

create policy "users manage own lore notes"
  on public.lore_notes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- media_items
-- ============================================================
create table public.media_items (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  character_id  uuid references public.characters(id) on delete cascade,
  title         text not null,
  media_type    text not null check (media_type in ('screenshot', 'audio', 'video', 'document')),
  url           text not null,
  caption       text,
  tags          text[] not null default '{}',
  created_at    timestamptz not null default now()
);

alter table public.media_items enable row level security;

create policy "users manage own media"
  on public.media_items
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- log_events
-- ============================================================
create table public.log_events (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  character_id  uuid not null references public.characters(id) on delete cascade,
  raw_line      text not null,
  event_type    text,
  parsed_data   jsonb,
  timestamp     timestamptz not null,
  created_at    timestamptz not null default now()
);

alter table public.log_events enable row level security;

create policy "users manage own log events"
  on public.log_events
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index log_events_character_timestamp on public.log_events (character_id, timestamp desc);

-- ============================================================
-- updated_at trigger (shared)
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger characters_updated_at
  before update on public.characters
  for each row execute function public.set_updated_at();

create trigger lore_notes_updated_at
  before update on public.lore_notes
  for each row execute function public.set_updated_at();
