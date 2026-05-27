<template>
  <div class="min-h-screen bg-obsidian-950 text-parchment-200 font-body flex">
    <!-- Sidebar -->
    <aside class="w-56 shrink-0 bg-obsidian-900 border-r border-rune-600/30 flex flex-col">
      <!-- Wordmark -->
      <div class="px-5 py-6 border-b border-rune-600/20">
        <NuxtLink to="/" class="block">
          <div class="text-rune-400 font-display text-xs tracking-widest uppercase mb-1">A Sanguineous</div>
          <div class="text-parchment-100 font-display text-lg tracking-wide">Adventure</div>
        </NuxtLink>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-4 space-y-1">
        <NavLink to="/app" label="Chronicle" icon="◈" exact />
        <NavLink to="/achievements" label="Achievements" icon="⚔" />
        <NavLink to="/codex" label="Codex" icon="📜" />
        <NavLink to="/app/logs" label="Log Parser" icon="⌘" />
        <NavLink to="/app/notes" label="Notes" icon="✦" />
        <NavLink to="/app/media" label="Media" icon="◉" />
      </nav>

      <!-- Character quick-info -->
      <div class="px-4 py-4 border-t border-rune-600/20">
        <div class="text-parchment-300 font-display text-sm">Sanguine</div>
        <div class="text-parchment-300/50 text-xs mt-0.5">Necromancer · Innoruuk</div>
        <div class="text-rune-400/60 text-xs mt-0.5">The Ruins of Kunark</div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>
