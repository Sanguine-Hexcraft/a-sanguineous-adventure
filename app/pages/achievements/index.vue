<template>
  <div class="p-6 max-w-6xl mx-auto">

    <div class="border-b border-rune-600/20 pb-4 mb-6">
      <p class="text-rune-400/70 text-xs tracking-widest uppercase font-display">The Achievement Tome</p>
      <h1 class="text-parchment-100 font-display text-3xl tracking-wide mt-0.5">Deeds of Norrath</h1>
    </div>

    <!-- Filter bar -->
    <div class="flex gap-3 mb-6 flex-wrap">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="activeCategory = cat"
        class="px-3 py-1.5 rounded text-xs font-display tracking-wide border transition-colors"
        :class="activeCategory === cat
          ? 'bg-rune-600/20 border-rune-600/50 text-rune-400'
          : 'border-rune-600/15 text-parchment-300/50 hover:text-parchment-200 hover:border-rune-600/30'"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Achievement grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <AchievementCard
        v-for="ach in filtered"
        :key="ach.id"
        :achievement="ach"
      />
    </div>

    <!-- Summary footer -->
    <div class="mt-8 pt-4 border-t border-rune-600/15 flex gap-6 text-xs text-parchment-300/40">
      <span>{{ unlocked }} deeds sealed</span>
      <span>{{ totalPoints }} points earned</span>
      <span>{{ achievements.length - unlocked }} deeds remaining</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import achievements from '~~/data/achievements/sample.json'

const categories = ['All', 'Hunter', 'Explorer', 'Faction', 'Quest', 'Raid', 'Skills', 'Lore']
const activeCategory = ref('All')

const filtered = computed(() =>
  activeCategory.value === 'All'
    ? achievements
    : achievements.filter(a => a.category === activeCategory.value)
)

const unlocked = computed(() => achievements.filter(a => a.unlocked).length)
const totalPoints = computed(() => achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0))
</script>
