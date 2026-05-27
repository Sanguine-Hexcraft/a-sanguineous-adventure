<template>
  <div class="border-l-2 border-arcane-500/55 pl-3">
    <span class="text-arcane-400/60 text-xs uppercase tracking-wide font-display">{{ note.type }}</span>
    <div class="text-parchment-100 text-sm font-display mt-0.5">{{ note.title }}</div>
    <p class="text-parchment-300/50 text-xs mt-1 leading-relaxed line-clamp-2">{{ note.preview }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  note: { id: number; type: string; title: string; preview: string }
}>()
</script>
