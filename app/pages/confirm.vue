<template>
  <div
    class="min-h-screen flex items-center justify-center p-6 text-parchment-200 font-body text-center"
    style="background: radial-gradient(ellipse 130% 55% at 50% -8%, #251f52 0%, #09071a 58%)"
  >
    <div class="max-w-sm space-y-3">
      <div class="text-rune-400/70 text-2xl animate-pulse">✦</div>
      <p class="text-parchment-100 font-display text-lg tracking-wide">Breaking the seal…</p>
      <p class="text-parchment-300/55 text-xs leading-relaxed">
        Confirming your name in the Codex. You will be led to your chronicle shortly.
      </p>
      <p v-if="stalled" class="text-parchment-300/50 text-xs pt-2">
        Taking longer than expected.
        <NuxtLink to="/login" class="text-mana-400/80 hover:text-mana-400 transition-colors">Return to sign in →</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

// supabase-js exchanges the code/hash in the callback URL automatically
// (detectSessionInUrl). Once the session lands, `user` populates and we leave.
const user = useSupabaseUser()
const router = useRouter()
const stalled = ref(false)

watch(
  user,
  () => {
    if (user.value) router.push('/app')
  },
  { immediate: true },
)

onMounted(() => {
  setTimeout(() => { stalled.value = true }, 6000)
})
</script>
