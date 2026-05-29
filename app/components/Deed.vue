<template>
  <div
    class="flex items-start gap-3 px-3 py-2 rounded-md transition-colors"
    :class="deed.highlight
      ? 'bg-rune-600/10 border border-rune-600/30 shadow-[inset_0_1px_0_rgba(240,192,64,0.07)]'
      : 'hover:bg-obsidian-700/50 border border-transparent'"
  >
    <span class="text-sm mt-0.5 shrink-0 w-4 text-center">{{ deed.icon }}</span>
    <div class="flex-1 min-w-0">
      <span :class="deed.highlight ? 'text-parchment-100' : 'text-parchment-200'" class="text-sm">{{ deed.text }}</span>
    </div>
    <span class="text-parchment-300/30 text-xs shrink-0 tabular-nums">{{ deed.date }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  deed: { id: string | number; type: string; icon: string; text: string; date: string; highlight: boolean }
}>()
</script>
