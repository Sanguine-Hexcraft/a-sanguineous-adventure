<template>
  <NuxtLink
    :to="section.path"
    class="block bg-obsidian-800 border border-rune-600/15 rounded p-4 hover:border-rune-600/40 transition-colors group"
  >
    <div class="flex items-center gap-2 mb-2">
      <span class="text-rune-400 text-lg">{{ section.icon }}</span>
      <span class="text-parchment-100 font-display text-lg">{{ section.label }}</span>
    </div>
    <p class="text-parchment-300/50 text-xs leading-relaxed">{{ section.description }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  section: { label: string; icon: string; path: string; description: string }
}>()
</script>
