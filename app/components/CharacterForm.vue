<template>
  <form class="space-y-5" @submit.prevent="onSubmit">
    <!-- Name -->
    <div>
      <label class="block text-parchment-300/60 text-xs font-display tracking-wide mb-1.5">Name</label>
      <input
        v-model.trim="form.name"
        type="text"
        required
        maxlength="64"
        :class="fieldClass"
        placeholder="The name inscribed in legend"
      />
    </div>

    <!-- Class + Race -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-parchment-300/60 text-xs font-display tracking-wide mb-1.5">Class</label>
        <select v-model="form.class" required :class="fieldClass">
          <option value="" disabled>Choose a class…</option>
          <option v-for="c in EQ_CLASSES" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div>
        <label class="block text-parchment-300/60 text-xs font-display tracking-wide mb-1.5">Race</label>
        <select v-model="form.race" required :class="fieldClass">
          <option value="" disabled>Choose a race…</option>
          <option v-for="r in EQ_RACES" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>
    </div>

    <!-- Level + Deity -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-parchment-300/60 text-xs font-display tracking-wide mb-1.5">Level</label>
        <input
          v-model.number="form.level"
          type="number"
          required
          :min="EQ_LEVEL_MIN"
          :max="EQ_LEVEL_MAX"
          :class="fieldClass"
        />
      </div>
      <div>
        <label class="block text-parchment-300/60 text-xs font-display tracking-wide mb-1.5">
          Deity <span class="text-parchment-300/35">· optional</span>
        </label>
        <select v-model="deitySelect" :class="fieldClass">
          <option value="">None / Agnostic</option>
          <option v-for="d in EQ_DEITIES" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
    </div>

    <!-- Server -->
    <div>
      <label class="block text-parchment-300/60 text-xs font-display tracking-wide mb-1.5">Server</label>
      <input
        v-model.trim="form.server"
        type="text"
        required
        list="eq-servers"
        maxlength="48"
        :class="fieldClass"
        placeholder="e.g. Bristlebane"
      />
      <datalist id="eq-servers">
        <option v-for="s in EQ_SERVER_HINTS" :key="s" :value="s" />
      </datalist>
    </div>

    <!-- Portrait URL -->
    <div>
      <label class="block text-parchment-300/60 text-xs font-display tracking-wide mb-1.5">
        Portrait URL <span class="text-parchment-300/35">· optional</span>
      </label>
      <input
        v-model.trim="portraitInput"
        type="url"
        :class="fieldClass"
        placeholder="https://…"
      />
    </div>

    <!-- Error -->
    <p v-if="error" class="text-blood-500/95 text-xs leading-relaxed border-l-2 border-blood-500/50 pl-3">
      {{ error }}
    </p>

    <!-- Actions -->
    <div class="flex items-center gap-3 pt-1">
      <button
        type="submit"
        :disabled="pending"
        class="border border-rune-600/40 bg-rune-600/10 text-rune-400/85 hover:text-rune-400 hover:border-rune-500/60 hover:bg-rune-600/15 text-sm font-display tracking-wide px-5 py-2 rounded-md transition-all hover:shadow-rune disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ pending ? '…' : submitLabel }}
      </button>
      <button
        type="button"
        class="text-parchment-300/55 hover:text-parchment-200 text-xs font-display tracking-wide transition-colors"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { EQ_CLASSES, EQ_RACES, EQ_DEITIES, EQ_SERVER_HINTS, EQ_LEVEL_MIN, EQ_LEVEL_MAX } from '~/constants/eq'
import type { CharacterDraft } from '~/composables/useCharacters'

const props = defineProps<{
  initial?: Partial<CharacterDraft>
  submitLabel: string
  pending?: boolean
  error?: string
}>()

const emit = defineEmits<{
  submit: [draft: CharacterDraft]
  cancel: []
}>()

const fieldClass =
  'w-full bg-obsidian-900 border border-rune-600/25 rounded-md px-3 py-2 text-sm text-parchment-100 placeholder-parchment-300/30 focus:border-mana-500/60 focus:outline-none focus:shadow-[0_0_0_1px_rgba(0,187,204,0.3)] transition-all'

const form = reactive<CharacterDraft>({
  name: props.initial?.name ?? '',
  class: props.initial?.class ?? '',
  race: props.initial?.race ?? '',
  server: props.initial?.server ?? '',
  level: props.initial?.level ?? 1,
  deity: props.initial?.deity ?? null,
  portrait_url: props.initial?.portrait_url ?? null,
})

// Selects/inputs bind to strings; map empty string <-> null for nullable cols.
const deitySelect = computed({
  get: () => form.deity ?? '',
  set: (v: string) => { form.deity = v || null },
})
const portraitInput = computed({
  get: () => form.portrait_url ?? '',
  set: (v: string) => { form.portrait_url = v || null },
})

function onSubmit() {
  emit('submit', {
    name: form.name,
    class: form.class,
    race: form.race,
    server: form.server,
    level: form.level,
    deity: form.deity,
    portrait_url: form.portrait_url,
  })
}
</script>
