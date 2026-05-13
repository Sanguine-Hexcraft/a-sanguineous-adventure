<template>
  <div class="border-l-2 border-rune-600/30 pl-3">
    <div class="flex items-center gap-2">
      <span class="text-rune-400/50 text-xs uppercase tracking-wide font-display">{{ note.type }}</span>
    </div>
    <div class="text-parchment-200 text-sm font-display mt-0.5">{{ note.title }}</div>
    <p class="text-parchment-300/50 text-xs mt-1 leading-relaxed line-clamp-2">{{ note.preview }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  note: { id: number; type: string; title: string; preview: string }
}>()
</script>
