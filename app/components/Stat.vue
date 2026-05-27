<template>
  <div>
    <div class="text-parchment-300/45 text-xs">{{ label }}</div>
    <div class="text-parchment-100 text-xs font-display mt-0.5">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string }>()
</script>
