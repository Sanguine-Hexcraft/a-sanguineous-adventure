<template>
  <div class="h-full overflow-y-auto">
    <div class="p-6 space-y-6 max-w-6xl mx-auto">

      <!-- Page header -->
      <div class="border-b border-rune-600/25 pb-4">
        <p class="text-rune-400/65 text-xs tracking-widest uppercase font-display">Chronicle of</p>
        <h1 class="text-parchment-100 font-display text-3xl tracking-wide mt-0.5">{{ active?.name ?? 'your adventure' }}</h1>
      </div>

      <!-- No active character -->
      <div v-if="!active" class="bg-obsidian-800 border border-rune-600/25 rounded-lg p-10 text-center shadow-[inset_0_1px_0_rgba(240,192,64,0.07)]">
        <div class="text-rune-400/50 text-3xl">✦</div>
        <p class="text-parchment-100 font-display text-lg mt-3">No chronicle has begun</p>
        <p class="text-parchment-300/55 text-sm mt-1.5 max-w-sm mx-auto leading-relaxed">
          Inscribe a character to open their chronicle — their deeds, their lore, and the legend yet to come.
        </p>
        <NuxtLink to="/app/characters/new" class="inline-block mt-5 border border-rune-600/40 bg-rune-600/10 text-rune-400/85 hover:text-rune-400 hover:border-rune-500/60 text-sm font-display tracking-wide px-5 py-2 rounded-md transition-all hover:shadow-rune">
          ✦ Inscribe a Character
        </NuxtLink>
      </div>

      <template v-else>
      <!-- Top row: Character card + Current position -->
      <div class="grid grid-cols-3 gap-4">

        <!-- Character card -->
        <div class="col-span-1 bg-obsidian-800 border border-rune-600/25 rounded-lg p-4 space-y-3 shadow-[inset_0_1px_0_rgba(240,192,64,0.07)]">
          <div class="flex items-start gap-3">
            <div class="w-14 h-14 rounded-lg bg-obsidian-700 border border-rune-600/35 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
              <img v-if="active?.portrait_url" :src="active.portrait_url" :alt="active.name" class="w-full h-full object-cover" />
              <span v-else>💀</span>
            </div>
            <div>
              <div class="text-parchment-100 font-display text-lg">{{ active?.name }}</div>
              <div class="text-parchment-300/60 text-xs mt-0.5">{{ active?.class }} · Level {{ active?.level }}</div>
              <div class="text-parchment-300/50 text-xs">{{ active?.race }}<template v-if="active?.deity"> · {{ active?.deity }}</template></div>
            </div>
          </div>
          <div class="border-t border-rune-600/15 pt-3 grid grid-cols-2 gap-2 text-xs">
            <Stat label="Server" :value="active?.server ?? '—'" />
            <Stat label="Inscribed" :value="inscribedDate" />
            <Stat label="Achievements" :value="`${sealedCount} sealed`" />
            <Stat label="Points" value="—" />
          </div>
        </div>

        <!-- Current position -->
        <div class="col-span-2 bg-obsidian-800 border border-mana-500/20 rounded-lg p-4 shadow-[inset_0_1px_0_rgba(0,187,204,0.05)]">
          <SectionLabel>Current Position</SectionLabel>
          <div class="mt-3 space-y-1">
            <div class="text-parchment-100 font-display text-xl">The Ruins of Kunark</div>
            <div class="text-mana-400/80 text-sm">Old Sebilis · Hunting the named</div>
          </div>
          <p class="text-parchment-300/60 text-sm mt-3 leading-relaxed">
            Descended into the drowned capital three days past. The frogloks do not contest passage — they simply watch, which is worse. Trakanon's presence fills the lower halls like pressure. I have not yet approached the throne room.
          </p>
          <div class="mt-3 flex gap-4 text-xs text-parchment-300/45">
            <span>Era: Age of War</span>
            <span>·</span>
            <span>Expansion: Ruins of Kunark</span>
          </div>
        </div>
      </div>

      <!-- Recent deeds -->
      <div class="bg-obsidian-800 border border-rune-600/25 rounded-lg p-4 shadow-[inset_0_1px_0_rgba(240,192,64,0.07)]">
        <SectionLabel>Recent Deeds</SectionLabel>
        <div class="mt-3 space-y-1">
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
        <div class="bg-obsidian-800 border border-rune-600/25 rounded-lg p-4 shadow-[inset_0_1px_0_rgba(240,192,64,0.07)]">
          <div class="flex items-center justify-between">
            <SectionLabel>Achievement Progress</SectionLabel>
            <NuxtLink to="/achievements" class="text-rune-400/65 text-xs hover:text-rune-400 transition-colors font-display">View all →</NuxtLink>
          </div>
          <div class="mt-3 space-y-2.5">
            <AchievementRow
              v-for="ach in progressAchievements"
              :key="ach.id"
              :achievement="ach"
            />
          </div>
        </div>

        <!-- Recent lore notes -->
        <div class="bg-obsidian-800 border border-arcane-500/25 rounded-lg p-4 shadow-[inset_0_1px_0_rgba(155,93,229,0.06)]">
          <SectionLabel>Lore Notes</SectionLabel>
          <div class="mt-3 space-y-3.5">
            <LoreNoteCard v-for="note in recentNotes" :key="note.id" :note="note" />
          </div>
          <button class="mt-4 w-full border border-arcane-600/35 text-arcane-400/70 hover:text-arcane-300 hover:border-arcane-500/60 text-xs font-display tracking-wide py-2 rounded-md transition-all hover:shadow-arcane">
            ✦ Write in the Codex
          </button>
        </div>
      </div>

      <!-- Log events + Media row -->
      <div class="grid grid-cols-2 gap-4">

        <!-- Parsed log events -->
        <div class="bg-obsidian-800 border border-obsidian-600/50 rounded-lg p-4 shadow-[inset_0_1px_0_rgba(240,192,64,0.04)]">
          <SectionLabel>Log Events</SectionLabel>
          <div class="mt-3 space-y-1.5 font-mono text-xs">
            <LogLine v-for="line in logLines" :key="line.id" :line="line" />
          </div>
          <NuxtLink to="/app/logs" class="mt-3 inline-block text-mana-400/60 hover:text-mana-400 text-xs transition-colors font-display">
            Import log file →
          </NuxtLink>
        </div>

        <!-- Media gallery preview -->
        <div class="bg-obsidian-800 border border-obsidian-600/50 rounded-lg p-4 shadow-[inset_0_1px_0_rgba(240,192,64,0.04)]">
          <div class="flex items-center justify-between">
            <SectionLabel>Gallery</SectionLabel>
            <NuxtLink to="/app/media" class="text-rune-400/65 text-xs hover:text-rune-400 transition-colors font-display">View all →</NuxtLink>
          </div>
          <div class="mt-3 grid grid-cols-3 gap-2">
            <div
              v-for="item in mediaItems"
              :key="item.id"
              class="aspect-square bg-obsidian-700 border border-obsidian-600/60 rounded-md flex items-center justify-center text-2xl cursor-pointer hover:border-rune-600/40 hover:shadow-rune transition-all"
              :title="item.title"
            >
              {{ item.icon }}
            </div>
            <div class="aspect-square bg-obsidian-700/40 border border-dashed border-obsidian-600/35 rounded-md flex items-center justify-center text-rune-600/45 text-xl cursor-pointer hover:border-rune-600/30 transition-colors">
              +
            </div>
          </div>
        </div>
      </div>

      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import achievements from '~~/data/achievements/sample.json'

const { active } = useActiveCharacter()
const { fetchAll } = useCharacters()
const { unlocked, fetchForActive } = useAchievementUnlocks()

onMounted(async () => {
  await fetchAll()
  await fetchForActive()
})
watch(active, () => fetchForActive())

const inscribedDate = computed(() =>
  active.value
    ? new Date(active.value.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : '—',
)
const sealedCount = computed(() => unlocked.value.size)

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
  { id: 5, type: 'faction', text: 'Your faction standing with Frogloks has gotten worse.', time: '19:04' },
  { id: 6, type: 'system', text: 'You have gained experience!', time: '19:04' },
]

const mediaItems = [
  { id: 1, title: 'Entrance to Blackburrow', icon: '🖼' },
  { id: 2, title: 'Neriak third gate', icon: '🖼' },
  { id: 3, title: 'Sebilis entrance', icon: '🖼' },
  { id: 4, title: 'testhero at 50', icon: '🖼' },
  { id: 5, title: 'Lich form', icon: '🖼' },
]
</script>
