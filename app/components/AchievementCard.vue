<template>
  <div
    class="bg-obsidian-800 border rounded p-4 transition-colors"
    :class="achievement.unlocked
      ? 'border-rune-600/30 hover:border-rune-600/50'
      : 'border-obsidian-700 hover:border-rune-600/20 opacity-70'"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-2.5">
        <span class="text-lg mt-0.5 shrink-0" :class="achievement.unlocked ? 'text-rune-400' : 'text-parchment-300/20'">
          {{ achievement.isMeta ? '✦' : achievement.unlocked ? '◆' : '◇' }}
        </span>
        <div>
          <div class="text-parchment-100 font-display">{{ achievement.title }}</div>
          <div class="text-parchment-300/50 text-xs mt-0.5">{{ achievement.category }} · {{ achievement.expansion }}</div>
        </div>
      </div>
      <span class="text-rune-400/60 text-xs shrink-0 font-display">{{ achievement.points }}pt</span>
    </div>

    <p class="text-parchment-300/60 text-xs mt-2 leading-relaxed">{{ achievement.description }}</p>

    <!-- Requirements -->
    <div class="mt-3 space-y-1">
      <div
        v-for="req in achievement.requirements"
        :key="req.label"
        class="flex items-center gap-2 text-xs"
      >
        <span :class="req.completed ? 'text-rune-400' : 'text-parchment-300/20'">{{ req.completed ? '✓' : '·' }}</span>
        <span :class="req.completed ? 'text-parchment-300/70 line-through' : 'text-parchment-300/40'">{{ req.label }}</span>
      </div>
    </div>

    <div v-if="achievement.unlocked" class="mt-3 pt-3 border-t border-rune-600/15 text-xs text-rune-400/50 font-display">
      Sealed {{ achievement.unlockedAt }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  achievement: {
    id: string
    title: string
    description: string
    category: string
    expansion: string
    points: number
    isMeta: boolean
    isHidden: boolean
    unlocked: boolean
    unlockedAt: string | null
    requirements: { label: string; completed: boolean }[]
  }
}>()
</script>
