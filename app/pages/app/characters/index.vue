<template>
  <div class="h-full overflow-y-auto">
    <div class="p-6 space-y-6 max-w-5xl mx-auto">

      <!-- Header -->
      <div class="flex items-end justify-between border-b border-rune-600/25 pb-4">
        <div>
          <p class="text-rune-400/65 text-xs tracking-widest uppercase font-display">The</p>
          <h1 class="text-parchment-100 font-display text-3xl tracking-wide mt-0.5">Roster</h1>
        </div>
        <NuxtLink
          to="/app/characters/new"
          class="border border-rune-600/40 bg-rune-600/10 text-rune-400/85 hover:text-rune-400 hover:border-rune-500/60 hover:bg-rune-600/15 text-sm font-display tracking-wide px-4 py-2 rounded-md transition-all hover:shadow-rune"
        >
          ✦ New Character
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div v-if="pending && !characters.length" class="text-parchment-300/50 text-sm py-12 text-center">
        Unrolling the roster…
      </div>

      <!-- Empty state -->
      <div
        v-else-if="!characters.length"
        class="bg-obsidian-800 border border-rune-600/25 rounded-lg p-10 text-center shadow-[inset_0_1px_0_rgba(240,192,64,0.07)]"
      >
        <div class="text-rune-400/50 text-3xl">✦</div>
        <p class="text-parchment-100 font-display text-lg mt-3">No names in the Codex yet</p>
        <p class="text-parchment-300/55 text-sm mt-1.5 max-w-sm mx-auto leading-relaxed">
          Every chronicle begins with a single soul. Inscribe your first character to start the adventure.
        </p>
        <NuxtLink
          to="/app/characters/new"
          class="inline-block mt-5 border border-rune-600/40 bg-rune-600/10 text-rune-400/85 hover:text-rune-400 hover:border-rune-500/60 text-sm font-display tracking-wide px-5 py-2 rounded-md transition-all hover:shadow-rune"
        >
          ✦ Inscribe a Character
        </NuxtLink>
      </div>

      <!-- Character grid -->
      <div v-else class="grid grid-cols-2 gap-4">
        <div
          v-for="c in characters"
          :key="c.id"
          class="bg-obsidian-800 border rounded-lg p-4 space-y-3 transition-all"
          :class="c.id === active?.id
            ? 'border-rune-500/60 shadow-rune'
            : 'border-rune-600/25 shadow-[inset_0_1px_0_rgba(240,192,64,0.07)]'"
        >
          <div class="flex items-start gap-3">
            <div class="w-14 h-14 rounded-lg bg-obsidian-700 border border-rune-600/35 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
              <img v-if="c.portrait_url" :src="c.portrait_url" :alt="c.name" class="w-full h-full object-cover" />
              <span v-else>💀</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="text-parchment-100 font-display text-lg truncate">{{ c.name }}</span>
                <span
                  v-if="c.id === active?.id"
                  class="text-rune-400/90 text-[10px] font-display tracking-widest uppercase border border-rune-500/40 rounded px-1.5 py-0.5 shrink-0"
                >Active</span>
              </div>
              <div class="text-parchment-300/60 text-xs mt-0.5">{{ c.class }} · Level {{ c.level }}</div>
              <div class="text-parchment-300/50 text-xs">{{ c.race }}<template v-if="c.deity"> · {{ c.deity }}</template></div>
            </div>
          </div>

          <div class="border-t border-rune-600/15 pt-3 flex items-center justify-between text-xs">
            <span class="text-parchment-300/45">{{ c.server }}</span>
            <div class="flex items-center gap-3 font-display">
              <button
                v-if="c.id !== active?.id"
                class="text-mana-400/70 hover:text-mana-400 transition-colors"
                @click="setActive(c.id)"
              >Set active</button>
              <NuxtLink :to="`/app/characters/${c.id}/edit`" class="text-parchment-300/55 hover:text-rune-400 transition-colors">Edit</NuxtLink>
              <button
                v-if="confirmingId !== c.id"
                class="text-parchment-300/45 hover:text-blood-500 transition-colors"
                @click="confirmingId = c.id"
              >Delete</button>
              <span v-else class="flex items-center gap-2">
                <button class="text-blood-500 hover:text-blood-500/80 transition-colors" @click="onDelete(c.id)">Confirm</button>
                <button class="text-parchment-300/45 hover:text-parchment-200 transition-colors" @click="confirmingId = null">Cancel</button>
              </span>
            </div>
          </div>
        </div>
      </div>

      <p v-if="errorMsg" class="text-blood-500/95 text-xs border-l-2 border-blood-500/50 pl-3">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { characters, pending, fetchAll, remove } = useCharacters()
const { active, setActive, activeId } = useActiveCharacter()

const confirmingId = ref<string | null>(null)
const errorMsg = ref('')

onMounted(() => { fetchAll() })

async function onDelete(id: string) {
  errorMsg.value = ''
  try {
    await remove(id)
    confirmingId.value = null
    // If we deleted the active one, fall back to whatever remains.
    if (activeId.value === id) {
      if (characters.value[0]) setActive(characters.value[0].id)
    }
  } catch (e: any) {
    errorMsg.value = e?.message ?? 'The Codex would not release that name.'
  }
}
</script>
