<template>
  <div
    class="min-h-screen flex items-center justify-center p-6 text-parchment-200 font-body"
    style="background: radial-gradient(ellipse 130% 55% at 50% -8%, #251f52 0%, #09071a 58%)"
  >
    <div class="w-full max-w-sm">
      <!-- Wordmark -->
      <NuxtLink to="/" class="block text-center mb-8 group">
        <div class="text-rune-400/60 text-lg">✦</div>
        <div class="text-parchment-100 font-display text-xl tracking-wide mt-1 group-hover:text-rune-400 transition-colors">
          A Sanguineous Adventure
        </div>
      </NuxtLink>

      <!-- Tome panel -->
      <div class="bg-obsidian-800 border border-rune-600/25 rounded-lg p-6 shadow-[inset_0_1px_0_rgba(240,192,64,0.07)]">
        <div class="h-px bg-gradient-to-r from-transparent via-arcane-500/60 to-transparent -mt-6 mb-5"></div>

        <p class="text-rune-400/65 text-xs tracking-widest uppercase font-display text-center">
          {{ mode === 'signin' ? 'Return to the Codex' : 'Inscribe your name' }}
        </p>
        <h1 class="text-parchment-100 font-display text-2xl tracking-wide text-center mt-1 mb-5">
          {{ mode === 'signin' ? 'Sign In' : 'Create a Chronicle' }}
        </h1>

        <form class="space-y-4" @submit.prevent="submit">
          <div>
            <label class="block text-parchment-300/60 text-xs font-display tracking-wide mb-1.5">Email</label>
            <input
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="w-full bg-obsidian-900 border border-rune-600/25 rounded-md px-3 py-2 text-sm text-parchment-100 placeholder-parchment-300/30 focus:border-mana-500/60 focus:outline-none focus:shadow-[0_0_0_1px_rgba(0,187,204,0.3)] transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label class="block text-parchment-300/60 text-xs font-display tracking-wide mb-1.5">Password</label>
            <input
              v-model="password"
              type="password"
              required
              :autocomplete="mode === 'signin' ? 'current-password' : 'new-password'"
              minlength="6"
              class="w-full bg-obsidian-900 border border-rune-600/25 rounded-md px-3 py-2 text-sm text-parchment-100 placeholder-parchment-300/30 focus:border-mana-500/60 focus:outline-none focus:shadow-[0_0_0_1px_rgba(0,187,204,0.3)] transition-all"
              placeholder="••••••••"
            />
          </div>

          <!-- Messages -->
          <p v-if="errorMsg" class="text-blood-500/95 text-xs leading-relaxed border-l-2 border-blood-500/50 pl-3">
            {{ errorMsg }}
          </p>
          <p v-if="infoMsg" class="text-jade-400/90 text-xs leading-relaxed border-l-2 border-jade-500/50 pl-3">
            {{ infoMsg }}
          </p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full border border-rune-600/40 bg-rune-600/10 text-rune-400/85 hover:text-rune-400 hover:border-rune-500/60 hover:bg-rune-600/15 text-sm font-display tracking-wide py-2.5 rounded-md transition-all hover:shadow-rune disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? '…' : (mode === 'signin' ? '✦ Enter' : '✦ Inscribe') }}
          </button>
        </form>

        <!-- Mode toggle -->
        <div class="text-center mt-5 pt-4 border-t border-rune-600/15">
          <button
            class="text-parchment-300/55 text-xs hover:text-mana-400 transition-colors"
            @click="toggleMode"
          >
            {{ mode === 'signin'
              ? 'No name in the Codex yet? Inscribe one.'
              : 'Already chronicled? Sign in.' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const mode = ref<'signin' | 'signup'>('signin')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const infoMsg = ref('')

// If already authenticated (or auth completes), leave the front door.
watchEffect(() => {
  if (user.value) router.push('/app')
})

function toggleMode() {
  mode.value = mode.value === 'signin' ? 'signup' : 'signin'
  errorMsg.value = ''
  infoMsg.value = ''
}

async function submit() {
  loading.value = true
  errorMsg.value = ''
  infoMsg.value = ''
  try {
    if (mode.value === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (error) throw error
      // watchEffect on `user` handles the redirect to /app
    } else {
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: { emailRedirectTo: `${window.location.origin}/confirm` },
      })
      if (error) throw error
      infoMsg.value = 'A sealed letter has been sent to your address. Open it to confirm your name in the Codex, then return here to sign in.'
    }
  } catch (e: any) {
    errorMsg.value = e?.message ?? 'The Codex rejected the inscription. Try again.'
  } finally {
    loading.value = false
  }
}
</script>
