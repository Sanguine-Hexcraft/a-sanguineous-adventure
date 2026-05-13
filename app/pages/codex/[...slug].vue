<template>
  <div class="p-6 max-w-3xl mx-auto">

    <!-- Category listing -->
    <div v-if="isCategory">
      <div class="border-b border-rune-600/20 pb-4 mb-6">
        <NuxtLink to="/codex" class="text-parchment-300/40 text-xs hover:text-rune-400 transition-colors">← Codex</NuxtLink>
        <h1 class="text-parchment-100 font-display text-3xl tracking-wide mt-2 capitalize">{{ category }}</h1>
      </div>

      <div v-if="entries?.length" class="space-y-2">
        <NuxtLink
          v-for="entry in entries"
          :key="entry.path"
          :to="entry.path.replace('/lore', '/codex')"
          class="flex items-start gap-3 px-4 py-3 bg-obsidian-800 border border-rune-600/15 rounded hover:border-rune-600/40 transition-colors group"
        >
          <span class="text-rune-400/40 group-hover:text-rune-400/70 transition-colors text-sm mt-0.5">◈</span>
          <div>
            <div class="text-parchment-100 font-display">{{ entry.title }}</div>
            <p v-if="entry.summary" class="text-parchment-300/50 text-xs mt-1 leading-relaxed line-clamp-2">{{ entry.summary }}</p>
            <div class="text-parchment-300/30 text-xs mt-1.5 flex gap-3">
              <span v-if="entry.expansion">{{ entry.expansion }}</span>
              <span v-if="entry.era">{{ entry.era }}</span>
              <span v-if="entry.region">{{ entry.region }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="text-parchment-300/40 text-sm">
        No entries recorded in this section yet.
      </div>
    </div>

    <!-- Single entry -->
    <div v-else-if="page">
      <div class="text-parchment-300/40 text-xs mb-4 flex items-center gap-2">
        <NuxtLink to="/codex" class="hover:text-rune-400 transition-colors">Codex</NuxtLink>
        <span>›</span>
        <NuxtLink :to="`/codex/${category}`" class="hover:text-rune-400 transition-colors capitalize">{{ category }}</NuxtLink>
        <span>›</span>
        <span class="text-parchment-300/60">{{ page.title }}</span>
      </div>

      <div class="border-b border-rune-600/20 pb-5 mb-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-rune-400/70 text-xs tracking-widest uppercase font-display">{{ page.entryType }}</p>
            <h1 class="text-parchment-100 font-display text-3xl tracking-wide mt-0.5">{{ page.title }}</h1>
          </div>
          <div class="text-right text-xs text-parchment-300/40 space-y-1 shrink-0 mt-1">
            <div v-if="page.expansion">{{ page.expansion }}</div>
            <div v-if="page.era">{{ page.era }}</div>
            <div v-if="page.region">{{ page.region }}</div>
          </div>
        </div>
        <p v-if="page.summary" class="text-parchment-300/60 mt-3 text-sm leading-relaxed italic">{{ page.summary }}</p>
        <div v-if="page.tags?.length" class="mt-3 flex flex-wrap gap-1.5">
          <span
            v-for="tag in page.tags"
            :key="tag"
            class="px-2 py-0.5 bg-obsidian-700 border border-rune-600/15 text-parchment-300/50 text-xs rounded"
          >{{ tag }}</span>
        </div>
      </div>

      <div class="prose prose-invert prose-sm max-w-none
        prose-headings:font-display prose-headings:text-parchment-100 prose-headings:font-normal prose-headings:tracking-wide
        prose-h1:text-2xl prose-h2:text-xl prose-h2:text-parchment-200 prose-h2:border-b prose-h2:border-rune-600/15 prose-h2:pb-2
        prose-h3:text-base prose-h3:text-rune-400/80
        prose-p:text-parchment-300/70 prose-p:leading-relaxed
        prose-a:text-rune-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-parchment-200
        prose-li:text-parchment-300/70
        prose-hr:border-rune-600/20
        prose-blockquote:border-l-rune-600/40 prose-blockquote:text-parchment-300/60 prose-blockquote:italic
        prose-code:text-rune-400/80 prose-code:bg-obsidian-700 prose-code:rounded prose-code:px-1">
        <ContentRenderer :value="page" />
      </div>
    </div>

    <div v-else class="text-parchment-300/40 text-sm">
      This page has not yet been recorded in the Codex.
    </div>

  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slugParts = Array.isArray(route.params.slug) ? route.params.slug : [route.params.slug]

const isCategory = slugParts.length === 1
const category = slugParts[0]
const fullPath = `/lore/${slugParts.join('/')}`

const { data: entries } = await useAsyncData(`codex-list-${category}`, async () => {
  if (!isCategory) return null
  const all = await queryCollection('lore').all()
  return all.filter(e => e.path.startsWith(`/lore/${category}/`))
})

const { data: page } = await useAsyncData(`codex-entry-${fullPath}`, () => {
  if (isCategory) return Promise.resolve(null)
  return queryCollection('lore').path(fullPath).first()
})
</script>
