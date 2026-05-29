<template>
  <div
    class="flex flex-col h-screen text-parchment-200 font-body overflow-hidden"
    style="background: radial-gradient(ellipse 130% 55% at 50% -8%, #251f52 0%, #09071a 58%)"
  >
    <!-- Top navbar -->
    <header class="shrink-0 relative z-50">
      <!-- Magic line at very top -->
      <div class="h-px bg-gradient-to-r from-transparent via-arcane-500/70 to-transparent"></div>

      <div
        class="px-5 h-14 flex items-center gap-4"
        style="background: rgba(13,10,34,0.92); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(122,92,24,0.25);"
      >
        <!-- Wordmark -->
        <NuxtLink to="/" class="shrink-0 group flex items-center gap-2">
          <span class="text-rune-400/60 text-sm">✦</span>
          <div>
            <span class="text-parchment-100 font-display text-base tracking-wide group-hover:text-rune-400 transition-colors">
              A Sanguineous Adventure
            </span>
          </div>
        </NuxtLink>

        <!-- Divider -->
        <div class="h-5 w-px bg-rune-600/25 shrink-0 mx-1"></div>

        <!-- Nav links -->
        <nav class="flex items-center gap-0.5 flex-1">
          <NavLink to="/app" label="Chronicle" icon="◈" exact />
          <NavLink to="/app/characters" label="Roster" icon="🜂" />
          <NavLink to="/achievements" label="Achievements" icon="⚔" />
          <NavLink to="/codex" label="Codex" icon="📜" />
          <NavLink to="/app/logs" label="Log Parser" icon="⌘" />
          <NavLink to="/app/notes" label="Notes" icon="✦" />
          <NavLink to="/app/media" label="Gallery" icon="◉" />
        </nav>

        <!-- Character info -->
        <div class="shrink-0 flex items-center gap-3 border-l border-rune-600/15 pl-4">
          <template v-if="user">
            <NuxtLink v-if="active" to="/app/characters" class="text-right group">
              <div class="text-parchment-100 group-hover:text-rune-400 font-display text-sm leading-tight transition-colors">{{ active.name }}</div>
              <div class="text-parchment-300/50 text-xs">{{ active.class }}<template v-if="active.deity"> · {{ active.deity }}</template></div>
            </NuxtLink>
            <NuxtLink v-else to="/app/characters/new" class="text-right text-mana-400/70 hover:text-mana-400 text-xs font-display tracking-wide transition-colors">
              + Create a character
            </NuxtLink>
            <button
              class="text-parchment-300/45 hover:text-blood-500 text-xs font-display tracking-wide transition-colors"
              title="Sign out"
              @click="signOut"
            >
              Depart ⏻
            </button>
          </template>
          <NuxtLink
            v-else
            to="/login"
            class="text-parchment-300/45 hover:text-mana-400 text-xs font-display tracking-wide transition-colors"
          >
            Sign in →
          </NuxtLink>
        </div>
      </div>

      <!-- Bottom glow line -->
      <div class="h-px bg-gradient-to-r from-transparent via-rune-600/35 to-transparent"></div>
    </header>

    <!-- Page content -->
    <main class="flex-1 overflow-hidden min-h-0">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, signOut } = useAuth()
const { fetchAll } = useCharacters()
const { active } = useActiveCharacter()

onMounted(() => fetchAll())
watch(user, () => fetchAll(true))
</script>
