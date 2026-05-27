<template>
  <div
    class="border rounded-lg p-4 transition-all cursor-pointer group"
    :class="unlocked
      ? 'bg-gradient-to-br from-rune-600/10 to-obsidian-800 border-rune-500/55 shadow-rune hover:shadow-rune-lg hover:border-rune-400/75'
      : 'bg-obsidian-800 border-obsidian-600/50 hover:border-rune-600/35 shadow-[inset_0_1px_0_rgba(240,192,64,0.04)]'"
    @click="$emit('toggle')"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-2.5 min-w-0">
        <span
          class="text-base mt-0.5 shrink-0 transition-colors"
          :class="unlocked ? 'text-rune-400' : 'text-parchment-300/20 group-hover:text-parchment-300/40'"
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
      <span
        class="text-xs shrink-0 font-display tabular-nums transition-colors"
        :class="unlocked ? 'text-rune-400/80' : 'text-rune-600/55'"
      >
        {{ achievement.points }}pt
      </span>
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
          :class="unlocked ? 'text-parchment-300/55 line-through' : 'text-parchment-300/35'"
          class="leading-snug"
        >
          {{ req.label }}
        </span>
      </div>
      <div v-if="achievement.requirements.length > 4" class="text-parchment-300/25 text-xs pl-4">
        +{{ achievement.requirements.length - 4 }} more
      </div>
    </div>

    <div v-if="unlocked" class="mt-3 pt-2.5 border-t border-rune-600/25 text-xs text-rune-400/60 font-display flex items-center gap-1.5">
      <span class="text-rune-500/50">✦</span>
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
