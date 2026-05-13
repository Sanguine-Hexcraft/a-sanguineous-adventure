<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors duration-150"
    :class="isActive
      ? 'bg-rune-600/20 text-rune-400 shadow-rune'
      : 'text-parchment-300/60 hover:text-parchment-200 hover:bg-obsidian-700/50'"
  >
    <span class="text-base w-4 text-center">{{ icon }}</span>
    <span class="font-display tracking-wide">{{ label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  to: string
  label: string
  icon: string
  exact?: boolean
}>()

const route = useRoute()
const isActive = computed(() =>
  props.exact ? route.path === props.to : route.path.startsWith(props.to)
)
</script>
