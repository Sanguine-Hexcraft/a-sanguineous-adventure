<template>
  <div
    class="flex items-start gap-3 px-3 py-2 rounded"
    :class="deed.highlight ? 'bg-rune-600/10 border border-rune-600/20' : 'hover:bg-obsidian-700/40'"
  >
    <span class="text-sm mt-0.5 shrink-0 w-4 text-center">{{ deed.icon }}</span>
    <div class="flex-1 min-w-0">
      <span class="text-parchment-200 text-sm">{{ deed.text }}</span>
    </div>
    <span class="text-parchment-300/30 text-xs shrink-0">{{ deed.date }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  deed: { id: number; type: string; icon: string; text: string; date: string; highlight: boolean }
}>()
</script>
