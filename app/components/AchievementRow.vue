<template>
  <div class="flex items-center gap-3">
    <span
      class="text-sm transition-colors"
      :class="achievement.unlocked ? 'text-rune-400' : 'text-parchment-300/20'"
    >
      {{ achievement.unlocked ? '◆' : '◇' }}
    </span>
    <div class="flex-1 min-w-0">
      <div
        class="text-sm truncate font-display transition-colors"
        :class="achievement.unlocked ? 'text-parchment-100' : 'text-parchment-200/50'"
      >
        {{ achievement.title }}
      </div>
      <div class="text-parchment-300/40 text-xs">{{ completedCount }}/{{ total }} · {{ achievement.category }}</div>
    </div>
    <span class="text-rune-400/70 text-xs shrink-0 font-display tabular-nums">{{ achievement.points }}pt</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  achievement: {
    id: string
    title: string
    category: string
    points: number
    unlocked: boolean
    requirements: { label: string; completed: boolean }[]
  }
}>()

const completedCount = computed(() => props.achievement.requirements.filter(r => r.completed).length)
const total = computed(() => props.achievement.requirements.length)
</script>
