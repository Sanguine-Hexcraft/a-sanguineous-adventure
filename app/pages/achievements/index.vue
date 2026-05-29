<template>
  <div class="flex h-full overflow-hidden">

    <!-- Category sidebar -->
    <aside class="w-52 shrink-0 border-r border-rune-600/20 overflow-y-auto flex flex-col" style="background: rgba(13,10,34,0.5)">
      <div class="px-4 pt-5 pb-2">
        <p class="text-rune-400/55 text-xs tracking-widest uppercase font-display">Tome</p>
        <h2 class="text-parchment-100 font-display text-base mt-0.5">Deeds of Norrath</h2>
      </div>

      <nav class="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        <button
          v-for="cat in categories?.topLevel"
          :key="cat.id"
          @click="selectCategory(cat)"
          class="w-full text-left px-3 py-1.5 rounded text-xs font-display tracking-wide transition-all truncate border"
          :class="activeCategoryId === cat.id
            ? 'bg-rune-600/20 text-rune-400 border-rune-600/35 shadow-rune'
            : 'text-parchment-300/50 hover:text-parchment-200 hover:bg-obsidian-700/50 border-transparent hover:border-rune-600/15'"
        >
          {{ cat.fullName }}
        </button>
      </nav>

      <div class="px-4 py-3 border-t border-rune-600/15 text-parchment-300/30 text-xs font-display">
        {{ totalUnlocked }} sealed
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col overflow-hidden">

      <!-- Top bar -->
      <div class="px-6 pt-5 pb-4 border-b border-rune-600/20 shrink-0">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-rune-400/65 text-xs tracking-widest uppercase font-display">{{ activeCategory?.fullName }}</p>
            <h1 class="text-parchment-100 font-display text-2xl tracking-wide mt-0.5">{{ activeCategory?.name }}</h1>
            <p v-if="active" class="text-mana-400/60 text-xs mt-1 font-display">⚔ Sealing deeds for {{ active.name }}</p>
            <NuxtLink v-else-if="user" to="/app/characters/new" class="inline-block text-mana-400/60 hover:text-mana-400 text-xs mt-1 font-display transition-colors">+ Create a character to track deeds</NuxtLink>
            <NuxtLink v-else to="/login" class="inline-block text-mana-400/60 hover:text-mana-400 text-xs mt-1 font-display transition-colors">Sign in to track your deeds →</NuxtLink>
          </div>
          <div class="flex items-center gap-3 mt-1">
            <input
              v-model="search"
              placeholder="Search achievements…"
              class="bg-obsidian-800 border border-rune-600/20 rounded-md px-3 py-1.5 text-xs text-parchment-200 placeholder:text-parchment-300/30 focus:outline-none focus:border-rune-500/50 focus:shadow-rune w-52 transition-all"
            />
          </div>
        </div>

        <p v-if="toggleHint" class="text-blood-500/90 text-xs mt-2 font-display">{{ toggleHint }}</p>

        <!-- Subcategory tabs -->
        <div v-if="subcategories.length > 1" class="flex gap-2 mt-3 flex-wrap">
          <button
            @click="activeSubcategoryId = null"
            class="px-3 py-1 rounded text-xs font-display tracking-wide border transition-all"
            :class="activeSubcategoryId === null
              ? 'bg-rune-600/20 border-rune-600/40 text-rune-400 shadow-rune'
              : 'border-rune-600/15 text-parchment-300/40 hover:text-parchment-200 hover:border-rune-600/30'"
          >
            All
          </button>
          <button
            v-for="sub in subcategories"
            :key="sub.id"
            @click="activeSubcategoryId = sub.id"
            class="px-3 py-1 rounded text-xs font-display tracking-wide border transition-all"
            :class="activeSubcategoryId === sub.id
              ? 'bg-rune-600/20 border-rune-600/40 text-rune-400 shadow-rune'
              : 'border-rune-600/15 text-parchment-300/40 hover:text-parchment-200 hover:border-rune-600/30'"
          >
            {{ sub.name }}
          </button>
        </div>
      </div>

      <!-- Achievement list -->
      <div class="flex-1 overflow-y-auto px-6 py-4">

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center h-32 text-parchment-300/30 text-sm font-display">
          Reading the tome…
        </div>

        <!-- Empty -->
        <div v-else-if="paged.length === 0" class="text-parchment-300/30 text-sm py-12 text-center font-display">
          No deeds recorded here.
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          <AchievementCard
            v-for="ach in paged"
            :key="ach.id"
            :achievement="ach"
            :unlocked="unlocked.has(ach.id)"
            @toggle="toggleUnlock(ach)"
          />
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-between mt-6 pt-4 border-t border-rune-600/15">
          <button
            @click="page--"
            :disabled="page === 1"
            class="px-3 py-1.5 text-xs font-display border border-rune-600/20 rounded-md text-parchment-300/50 hover:text-parchment-100 hover:border-rune-500/50 hover:shadow-rune disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← Prior
          </button>
          <span class="text-parchment-300/40 text-xs font-display">
            {{ page }} / {{ totalPages }} · {{ filtered.length }} deeds
          </span>
          <button
            @click="page++"
            :disabled="page === totalPages"
            class="px-3 py-1.5 text-xs font-display border border-rune-600/20 rounded-md text-parchment-300/50 hover:text-parchment-100 hover:border-rune-500/50 hover:shadow-rune disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </button>
        </div>

        <div class="mt-4 text-parchment-300/25 text-xs text-right font-display">
          {{ filtered.length }} deeds · {{ categoryUnlocked }} sealed
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const PAGE_SIZE = 48

interface Achievement {
  id: number
  title: string
  description: string
  points: number
  isHidden: boolean
  categoryId: number | null
  categoryName: string | null
  subcategoryId: number | null
  subcategoryName: string | null
  requirements: { order: number; type: number; value: number; label: string }[]
}

interface Category {
  id: number
  name: string
  fullName: string
  sort: number
  parentId?: number
}

interface CategoryData {
  topLevel: Category[]
  subCategories: Category[]
}

const categories = ref<CategoryData | null>(null)
const activeCategoryId = ref<number>(10)
const activeSubcategoryId = ref<number | null>(null)
const search = ref('')
const page = ref(1)

const categoryCache = reactive<Record<number, Achievement[]>>({})
const loading = ref(true)

const activeCategory = computed(() =>
  categories.value?.topLevel.find(c => c.id === activeCategoryId.value)
)

const subcategories = computed(() =>
  categories.value?.subCategories.filter(s => s.parentId === activeCategoryId.value) ?? []
)

const categoryAchievements = computed<Achievement[]>(() =>
  categoryCache[activeCategoryId.value] ?? []
)

const filtered = computed(() => {
  let list = categoryAchievements.value

  if (activeSubcategoryId.value !== null) {
    list = list.filter(a => a.subcategoryId === activeSubcategoryId.value)
  }

  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q)
    )
  }

  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))

const paged = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return filtered.value.slice(start, start + PAGE_SIZE)
})

const user = useSupabaseUser()
const { active } = useActiveCharacter()
const { fetchAll: fetchCharacters } = useCharacters()
const { unlocked, fetchForActive, toggle } = useAchievementUnlocks()
const { create: logDeed, removeByTitle: removeDeed } = useJourneyEvents()

const totalUnlocked = computed(() => unlocked.value.size)

const categoryUnlocked = computed(() =>
  categoryAchievements.value.filter(a => unlocked.value.has(a.id)).length
)

const toggleHint = ref('')

async function loadCategory(id: number) {
  if (categoryCache[id]) return
  loading.value = true
  try {
    const data = await $fetch<Achievement[]>(`/data/achievements/category-${id}.json`)
    categoryCache[id] = data
  } finally {
    loading.value = false
  }
}

function selectCategory(cat: Category) {
  activeCategoryId.value = cat.id
  activeSubcategoryId.value = null
  search.value = ''
  page.value = 1
  loadCategory(cat.id)
}

async function toggleUnlock(ach: Achievement) {
  const result = await toggle(ach.id)
  if (result.ok) {
    // Keep the deed in sync with the seal: log on seal, remove on unseal.
    // A deed-sync hiccup must not undo the seal itself, so swallow errors.
    const deedTitle = `${ach.title} — sealed in the Codex.`
    try {
      if (result.unlocked) await logDeed({ event_type: 'achievement', title: deedTitle })
      else await removeDeed('achievement', deedTitle)
    } catch (e) {
      console.error('[journey] failed to sync achievement deed', e)
    }
    return
  }
  if (result.reason === 'no-character') {
    toggleHint.value = user.value
      ? 'Create or select a character to seal deeds.'
      : 'Sign in and choose a character to seal deeds.'
  } else if (result.reason === 'error') {
    const msg = (result.error as { message?: string })?.message
    console.error('[achievement toggle] write failed:', result.error)
    toggleHint.value = msg ? `Could not record that: ${msg}` : 'Could not record that — try again.'
  }
  if (toggleHint.value) setTimeout(() => { toggleHint.value = '' }, 4000)
}

watch(filtered, () => { page.value = 1 })

// Refetch this character's seals whenever the active character changes.
watch(active, () => fetchForActive())

onMounted(async () => {
  categories.value = await $fetch<CategoryData>('/data/achievements/categories.json')
  await loadCategory(activeCategoryId.value)
  await fetchCharacters()
  await fetchForActive()
})
</script>
