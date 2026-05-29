<template>
  <div class="h-full overflow-y-auto">
    <div class="p-6 max-w-xl mx-auto space-y-6">
      <div class="border-b border-rune-600/25 pb-4">
        <NuxtLink to="/app/characters" class="text-parchment-300/50 text-xs hover:text-rune-400 transition-colors font-display">← Roster</NuxtLink>
        <h1 class="text-parchment-100 font-display text-3xl tracking-wide mt-1">Inscribe a Character</h1>
      </div>

      <div class="bg-obsidian-800 border border-rune-600/25 rounded-lg p-6 shadow-[inset_0_1px_0_rgba(240,192,64,0.07)]">
        <CharacterForm
          submit-label="✦ Inscribe"
          :pending="pending"
          :error="errorMsg"
          @submit="onSubmit"
          @cancel="router.push('/app/characters')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CharacterDraft } from '~/composables/useCharacters'

const { create } = useCharacters()
const { setActive } = useActiveCharacter()
const router = useRouter()

const pending = ref(false)
const errorMsg = ref('')

async function onSubmit(draft: CharacterDraft) {
  pending.value = true
  errorMsg.value = ''
  try {
    const created = await create(draft)
    setActive(created.id)
    await router.push('/app/characters')
  } catch (e: any) {
    errorMsg.value = e?.message ?? 'The inscription failed. Try again.'
  } finally {
    pending.value = false
  }
}
</script>
