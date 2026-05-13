<template>
  <div class="p-6 max-w-4xl mx-auto">

    <div class="border-b border-rune-600/20 pb-4 mb-6">
      <p class="text-rune-400/70 text-xs tracking-widest uppercase font-display">Archive of Norrath</p>
      <h1 class="text-parchment-100 font-display text-3xl tracking-wide mt-0.5">The Codex</h1>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <CodexSection
        v-for="section in sections"
        :key="section.path"
        :section="section"
      />
    </div>

    <!-- Recent entries -->
    <div class="mt-8">
      <div class="text-rune-400/70 text-xs tracking-widest uppercase font-display mb-3">Recent Entries</div>
      <div class="space-y-2">
        <NuxtLink
          v-for="entry in entries"
          :key="entry.path"
          :to="entry.path.replace('/lore', '/codex')"
          class="flex items-center gap-3 px-3 py-2 rounded hover:bg-obsidian-800 transition-colors group"
        >
          <span class="text-rune-400/40 group-hover:text-rune-400/70 transition-colors text-sm">◈</span>
          <div>
            <div class="text-parchment-200 text-sm font-display">{{ entry.title }}</div>
            <div class="text-parchment-300/40 text-xs">{{ entry.entryType }} · {{ entry.expansion }}</div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const sections = [
  { label: 'Zones', icon: '◈', path: '/codex/zones', description: 'Dungeons, wilderness, and the places that mark the journey.' },
  { label: 'NPCs', icon: '⚉', path: '/codex/npcs', description: 'Named creatures, legendary enemies, and figures of note.' },
  { label: 'Factions', icon: '⚖', path: '/codex/factions', description: 'Powers, guilds, and the allegiances that shape Norrath.' },
  { label: 'Expansions', icon: '🗺', path: '/codex/expansions', description: 'The eras and continents that define the age.' },
]

const { data: entries } = await useAsyncData('codex-index', () =>
  queryCollection('lore').limit(10).all()
)
</script>
