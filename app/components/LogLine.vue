<template>
  <div class="flex items-baseline gap-2">
    <span class="text-parchment-300/25 shrink-0">[{{ line.time }}]</span>
    <span :class="typeColor">{{ line.text }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  line: { id: number; type: string; text: string; time: string }
}>()

const typeColor = computed(() => ({
  zone: 'text-mana-400',
  kill: 'text-blood-500',
  loot: 'text-rune-400',
  faction: 'text-parchment-300/50',
  system: 'text-parchment-300/40',
})[props.line.type] ?? 'text-parchment-300/60')
</script>
