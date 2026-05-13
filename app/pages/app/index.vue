<template>
  <div class="p-6 space-y-6 max-w-6xl mx-auto">

    <!-- Page header -->
    <div class="border-b border-rune-600/20 pb-4">
      <p class="text-rune-400/70 text-xs tracking-widest uppercase font-display">Chronicle of</p>
      <h1 class="text-parchment-100 font-display text-3xl tracking-wide mt-0.5">Sanguine</h1>
    </div>

    <!-- Top row: Character card + Current position -->
    <div class="grid grid-cols-3 gap-4">

      <!-- Character card -->
      <div class="col-span-1 bg-obsidian-800 border border-rune-600/20 rounded p-4 space-y-3">
        <div class="flex items-start gap-3">
          <div class="w-14 h-14 rounded bg-obsidian-700 border border-rune-600/30 flex items-center justify-center text-2xl shrink-0">💀</div>
          <div>
            <div class="text-parchment-100 font-display text-lg">Sanguine</div>
            <div class="text-parchment-300/60 text-xs mt-0.5">Necromancer · Level 52</div>
            <div class="text-parchment-300/50 text-xs">Dark Elf · Innoruuk</div>
          </div>
        </div>
        <div class="border-t border-rune-600/15 pt-3 grid grid-cols-2 gap-2 text-xs">
          <Stat label="Server" value="Bristlebane" />
          <Stat label="Guild" value="None" />
          <Stat label="Achievements" value="4 / 10" />
          <Stat label="Points" value="55 / 295" />
        </div>
      </div>

      <!-- Current position -->
      <div class="col-span-2 bg-obsidian-800 border border-rune-600/20 rounded p-4">
        <SectionLabel>Current Position</SectionLabel>
        <div class="mt-3 space-y-1">
          <div class="text-parchment-100 font-display text-xl">The Ruins of Kunark</div>
          <div class="text-rune-400/80 text-sm">Old Sebilis · Hunting the named</div>
        </div>
        <p class="text-parchment-300/60 text-sm mt-3 leading-relaxed">
          Descended into the drowned capital three days past. The frogloks do not contest passage — they simply watch, which is worse. Trakanon's presence fills the lower halls like pressure. I have not yet approached the throne room.
        </p>
        <div class="mt-3 flex gap-4 text-xs text-parchment-300/50">
          <span>Era: Age of War</span>
          <span>·</span>
          <span>Expansion: Ruins of Kunark</span>
        </div>
      </div>
    </div>

    <!-- Recent deeds -->
    <div class="bg-obsidian-800 border border-rune-600/20 rounded p-4">
      <SectionLabel>Recent Deeds</SectionLabel>
      <div class="mt-3 space-y-2">
        <Deed
          v-for="deed in recentDeeds"
          :key="deed.id"
          :deed="deed"
        />
      </div>
    </div>

    <!-- Achievement progress + Lore notes row -->
    <div class="grid grid-cols-2 gap-4">

      <!-- Achievement progress -->
      <div class="bg-obsidian-800 border border-rune-600/20 rounded p-4">
        <div class="flex items-center justify-between">
          <SectionLabel>Achievement Progress</SectionLabel>
          <NuxtLink to="/achievements" class="text-rune-400/70 text-xs hover:text-rune-400 transition-colors">View all →</NuxtLink>
        </div>
        <div class="mt-3 space-y-2">
          <AchievementRow
            v-for="ach in progressAchievements"
            :key="ach.id"
            :achievement="ach"
          />
        </div>
      </div>

      <!-- Recent lore notes -->
      <div class="bg-obsidian-800 border border-rune-600/20 rounded p-4">
        <SectionLabel>Lore Notes</SectionLabel>
        <div class="mt-3 space-y-3">
          <LoreNoteCard v-for="note in recentNotes" :key="note.id" :note="note" />
        </div>
        <button class="mt-4 w-full border border-rune-600/30 text-rune-400/70 hover:text-rune-400 hover:border-rune-600/60 text-xs font-display tracking-wide py-2 rounded transition-colors">
          ✦ Write in the Codex
        </button>
      </div>
    </div>

    <!-- Log events + Media row -->
    <div class="grid grid-cols-2 gap-4">

      <!-- Parsed log events -->
      <div class="bg-obsidian-800 border border-rune-600/20 rounded p-4">
        <SectionLabel>Log Events</SectionLabel>
        <div class="mt-3 space-y-1.5 font-mono text-xs">
          <LogLine v-for="line in logLines" :key="line.id" :line="line" />
        </div>
        <NuxtLink to="/app/logs" class="mt-3 inline-block text-rune-400/60 hover:text-rune-400 text-xs transition-colors">
          Import log file →
        </NuxtLink>
      </div>

      <!-- Media gallery preview -->
      <div class="bg-obsidian-800 border border-rune-600/20 rounded p-4">
        <div class="flex items-center justify-between">
          <SectionLabel>Gallery</SectionLabel>
          <NuxtLink to="/app/media" class="text-rune-400/70 text-xs hover:text-rune-400 transition-colors">View all →</NuxtLink>
        </div>
        <div class="mt-3 grid grid-cols-3 gap-2">
          <div
            v-for="item in mediaItems"
            :key="item.id"
            class="aspect-square bg-obsidian-700 border border-rune-600/20 rounded flex items-center justify-center text-2xl cursor-pointer hover:border-rune-600/50 transition-colors"
            :title="item.title"
          >
            {{ item.icon }}
          </div>
          <div class="aspect-square bg-obsidian-700/50 border border-dashed border-rune-600/15 rounded flex items-center justify-center text-rune-600/40 text-xl cursor-pointer hover:border-rune-600/30 transition-colors">
            +
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import achievements from '~~/data/achievements/sample.json'

const recentDeeds = [
  { id: 1, type: 'achievement', icon: '⚔', text: 'Hunter of Blackburrow — sealed in the Codex.', date: 'Nov 3, 2024', highlight: true },
  { id: 2, type: 'zone', icon: '◈', text: 'Entered Old Sebilis for the first time.', date: 'Dec 15, 2024', highlight: false },
  { id: 3, type: 'kill', icon: '☠', text: 'Slew Venril Sathir\'s Remains in the crypts below Karnor\'s Castle.', date: 'Dec 12, 2024', highlight: false },
  { id: 4, type: 'faction', icon: '⚖', text: 'Dark Reflection faction reached: Kindly.', date: 'Oct 28, 2024', highlight: false },
]

const progressAchievements = achievements.slice(0, 4)

const recentNotes = [
  { id: 1, type: 'journal', title: 'On the silence of the frogloks', preview: 'They do not speak. They watch. There is something in the watching that feels like memory — as though they recall what this place was and mourn it in a language that has no words.' },
  { id: 2, type: 'research', title: 'Venril Sathir — undeath mechanism', preview: 'He is not simply a spirit bound to a body. The binding is more sophisticated than standard necromancy. His will persists because he made it persist, not because something else holds him.' },
]

const logLines = [
  { id: 1, type: 'zone', text: 'You have entered Old Sebilis.', time: '18:42' },
  { id: 2, type: 'kill', text: 'You have slain a froglok shin lord!', time: '18:51' },
  { id: 3, type: 'kill', text: 'You have slain a sebilite golem!', time: '19:03' },
  { id: 4, type: 'loot', text: 'You receive Sebilite Scale.', time: '19:03' },
  { id: 5, type: 'faction', text: 'Your faction standing with Froglok Slaves has gotten worse.', time: '19:04' },
  { id: 6, type: 'system', text: 'You have gained experience!', time: '19:04' },
]

const mediaItems = [
  { id: 1, title: 'Entrance to Blackburrow', icon: '🖼' },
  { id: 2, title: 'Neriak third gate', icon: '🖼' },
  { id: 3, title: 'Sebilis entrance', icon: '🖼' },
  { id: 4, title: 'Sanguine at 50', icon: '🖼' },
  { id: 5, title: 'Lich form', icon: '🖼' },
]
</script>
