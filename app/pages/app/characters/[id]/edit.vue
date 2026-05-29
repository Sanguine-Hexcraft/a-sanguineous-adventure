<template>
  <div class="h-full overflow-y-auto">
    <div class="p-6 max-w-xl mx-auto space-y-6">
      <div class="border-b border-rune-600/25 pb-4">
        <NuxtLink to="/app/characters" class="text-parchment-300/50 text-xs hover:text-rune-400 transition-colors font-display">← Roster</NuxtLink>
        <h1 class="text-parchment-100 font-display text-3xl tracking-wide mt-1">
          {{ character ? `Amend ${character.name}` : 'Amend Character' }}
        </h1>
      </div>

      <div v-if="notFound" class="bg-obsidian-800 border border-blood-500/30 rounded-lg p-6 text-center">
        <p class="text-parchment-100 font-display">No such name in the Codex.</p>
        <NuxtLink to="/app/characters" class="inline-block mt-3 text-mana-400/80 hover:text-mana-400 text-sm transition-colors">← Back to roster</NuxtLink>
      </div>

      <div v-else-if="character" class="bg-obsidian-800 border border-rune-600/25 rounded-lg p-6 shadow-[inset_0_1px_0_rgba(240,192,64,0.07)]">
        <CharacterForm
          :initial="character"
          submit-label="✦ Save Changes"
          :pending="saving"
          :error="errorMsg"
          @submit="onSubmit"
          @cancel="router.push('/app/characters')"
        />
      </div>

      <div v-else class="text-parchment-300/50 text-sm py-12 text-center">Retrieving the record…</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Character } from '~/types/database.types'
import type { CharacterDraft } from '~/composables/useCharacters'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { loaded, fetchAll, getById, update } = useCharacters()

const character = ref<Character | null>(null)
const notFound = ref(false)
const saving = ref(false)
const errorMsg = ref('')

onMounted(async () => {
  await fetchAll()
  const found = getById(id)
  if (found) character.value = found
  else notFound.value = true
})

async function onSubmit(draft: CharacterDraft) {
  saving.value = true
  errorMsg.value = ''
  try {
    await update(id, draft)
    await router.push('/app/characters')
  } catch (e: any) {
    errorMsg.value = e?.message ?? 'The amendment failed. Try again.'
  } finally {
    saving.value = false
  }
}
</script>
