<template>
  <div
    class="bg-obsidian-800 border rounded p-4 transition-colors cursor-pointer group"
    :class="unlocked
      ? 'border-rune-600/40 hover:border-rune-600/60'
      : 'border-obsidian-700 hover:border-rune-600/25'"
    @click="$emit('toggle')"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-2.5 min-w-0">
        <span
          class="text-base mt-0.5 shrink-0 transition-colors"
          :class="unlocked ? 'text-rune-400' : 'text-parchment-300/20 group-hover:text-parchment-300/35'"
        >
          {{ unlocked ? '◆' : '◇' }}
        </span>
        <div class="min-w-0">
          <div
            class="font-display text-sm leading-snug transition-colors"
            :class="unlocked ? 'text-parchment-100' : 'text-parchment-300/70'"
          >
            {{ achievement.title }}
          </div>
          <div class="text-parchment-300/35 text-xs mt-0.5 truncate">
            {{ achievement.subcategoryName ?? achievement.categoryName }}
          </div>
        </div>
      </div>
      <span class="text-rune-400/50 text-xs shrink-0 font-display tabular-nums">{{ achievement.points }}pt</span>
    </div>

    <p v-if="achievement.description" class="text-parchment-300/50 text-xs mt-2 leading-relaxed line-clamp-2">
      {{ achievement.description }}
    </p>

    <div v-if="achievement.requirements.length" class="mt-2.5 space-y-1">
      <div
        v-for="req in achievement.requirements.slice(0, 4)"
        :key="req.order"
        class="flex items-start gap-2 text-xs"
      >
        <span :class="unlocked ? 'text-rune-400' : 'text-parchment-300/20'">{{ unlocked ? '✓' : '·' }}</span>
        <span
          :class="unlocked ? 'text-parchment-300/60 line-through' : 'text-parchment-300/35'"
          class="leading-snug"
        >
          {{ req.label }}
        </span>
      </div>
      <div v-if="achievement.requirements.length > 4" class="text-parchment-300/25 text-xs pl-4">
        +{{ achievement.requirements.length - 4 }} more
      </div>
    </div>

    <div v-if="unlocked" class="mt-3 pt-2.5 border-t border-rune-600/20 text-xs text-rune-400/50 font-display">
      Sealed in the Codex
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  achievement: {
    id: number
    title: string
    description: string
    points: number
    isHidden: boolean
    categoryId: number | null
    categoryName: string | null
    subcategoryId: number | null
    subcategoryName: string | null
    requirements: { order: number; type: number; value: number; label: string }[]
  }
  unlocked: boolean
}>()

defineEmits<{ toggle: [] }>()
</script>
