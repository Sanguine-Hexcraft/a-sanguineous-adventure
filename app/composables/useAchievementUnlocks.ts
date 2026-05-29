// Tracks which achievements the ACTIVE character has sealed, backed by the
// achievement_unlocks table (RLS-scoped to the signed-in user). The set of
// unlocked achievement_ids is shared state so the achievements browser,
// sidebar counts, and dashboard can all read it.
export type ToggleResult =
  | { ok: true; unlocked: boolean }
  | { ok: false; reason: 'no-character' | 'pending'; }
  | { ok: false; reason: 'error'; error: unknown }

export function useAchievementUnlocks() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const { active } = useActiveCharacter()

  const unlocked = useState<Set<number>>('achievement-unlocks', () => new Set())
  // The character id the current set was loaded for (null = none/anon).
  const loadedFor = useState<string | null>('achievement-unlocks-char', () => null)
  const pending = useState<Set<number>>('achievement-unlocks-pending', () => new Set())

  async function fetchForActive(force = false) {
    const charId = active.value?.id ?? null
    if (!charId || !user.value) {
      unlocked.value = new Set()
      loadedFor.value = charId
      return
    }
    if (loadedFor.value === charId && !force) return
    const { data, error } = await supabase
      .from('achievement_unlocks')
      .select('achievement_id')
      .eq('character_id', charId)
    if (error) throw error
    unlocked.value = new Set((data ?? []).map(r => r.achievement_id))
    loadedFor.value = charId
  }

  async function toggle(achievementId: number): Promise<ToggleResult> {
    const charId = active.value?.id ?? null
    if (!charId) return { ok: false, reason: 'no-character' }
    if (pending.value.has(achievementId)) return { ok: false, reason: 'pending' }

    // Same pattern as character create: confirm a live session and insert
    // its user id, so the request carries the token and auth.uid() is set
    // (a null/stale token trips the RLS with-check).
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return { ok: false, reason: 'error', error: new Error('Your session has expired — sign out and back in.') }
    }

    const wasUnlocked = unlocked.value.has(achievementId)

    // Optimistic update (reassign new Sets so reactivity always fires).
    const next = new Set(unlocked.value)
    wasUnlocked ? next.delete(achievementId) : next.add(achievementId)
    unlocked.value = next
    pending.value = new Set(pending.value).add(achievementId)

    try {
      if (wasUnlocked) {
        const { error } = await supabase
          .from('achievement_unlocks')
          .delete()
          .eq('character_id', charId)
          .eq('achievement_id', achievementId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('achievement_unlocks').insert({
          user_id: session.user.id,
          character_id: charId,
          achievement_id: achievementId,
          source: 'manual',
        })
        if (error) throw error
      }
      return { ok: true, unlocked: !wasUnlocked }
    } catch (error) {
      // Revert the optimistic change.
      const revert = new Set(unlocked.value)
      wasUnlocked ? revert.add(achievementId) : revert.delete(achievementId)
      unlocked.value = revert
      return { ok: false, reason: 'error', error }
    } finally {
      const p = new Set(pending.value)
      p.delete(achievementId)
      pending.value = p
    }
  }

  return { unlocked, pending, fetchForActive, toggle }
}
