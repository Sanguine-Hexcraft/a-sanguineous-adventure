<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-2 px-3.5 py-1.5 rounded text-sm font-display tracking-wide transition-all duration-150 border"
    :class="isActive
      ? 'bg-rune-600/20 text-rune-400 border-rune-600/35 shadow-rune'
      : 'text-parchment-300/55 border-transparent hover:text-parchment-100 hover:bg-obsidian-700/60 hover:border-rune-600/15'"
  >
    <span class="shrink-0 text-base leading-none">{{ icon }}</span>
    <span>{{ label }}</span>
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
