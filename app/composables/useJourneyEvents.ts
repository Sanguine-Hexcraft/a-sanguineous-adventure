import type { JourneyEvent } from '~/types/database.types'

// Fields a caller supplies; user_id + character_id are injected, the rest
// (id, created_at, occurred_at default) are filled by Postgres.
export interface JourneyEventDraft {
  event_type: string
  title: string
  description?: string | null
  occurred_at?: string
}

const FETCH_LIMIT = 25

// Timeline of a character's deeds, backed by journey_events (RLS-scoped to
// the signed-in user). Shared state so the dashboard and any future timeline
// page read the same list.
export function useJourneyEvents() {
  const supabase = useSupabaseClient()
  const requireSession = useRequireSession()
  const { active } = useActiveCharacter()

  const events = useState<JourneyEvent[]>('journey-events', () => [])
  const loadedFor = useState<string | null>('journey-events-char', () => null)
  const pending = useState<boolean>('journey-events-pending', () => false)

  async function fetchForActive(force = false) {
    const charId = active.value?.id ?? null
    if (!charId) {
      events.value = []
      loadedFor.value = null
      return
    }
    if (loadedFor.value === charId && !force) return
    pending.value = true
    try {
      const { data, error } = await supabase
        .from('journey_events')
        .select('*')
        .eq('character_id', charId)
        .order('occurred_at', { ascending: false })
        .limit(FETCH_LIMIT)
      if (error) throw error
      events.value = data ?? []
      loadedFor.value = charId
    } finally {
      pending.value = false
    }
  }

  async function create(draft: JourneyEventDraft): Promise<JourneyEvent> {
    const charId = active.value?.id
    if (!charId) throw new Error('No active character.')
    const session = await requireSession()
    const { data, error } = await supabase
      .from('journey_events')
      .insert({ ...draft, user_id: session.user.id, character_id: charId })
      .select()
      .single()
    if (error) throw error
    // Keep newest-first ordering in the shared list.
    events.value = [data, ...events.value]
    return data
  }

  async function remove(id: string): Promise<void> {
    const { error } = await supabase.from('journey_events').delete().eq('id', id)
    if (error) throw error
    events.value = events.value.filter(e => e.id !== id)
  }

  // Remove auto-generated deeds matching an event type + title for the active
  // character (e.g. undo the deed logged when an achievement was sealed).
  // Deletes all matches, which also cleans up any earlier duplicates.
  async function removeByTitle(eventType: string, title: string): Promise<void> {
    const charId = active.value?.id
    if (!charId) return
    await requireSession()
    const { error } = await supabase
      .from('journey_events')
      .delete()
      .eq('character_id', charId)
      .eq('event_type', eventType)
      .eq('title', title)
    if (error) throw error
    events.value = events.value.filter(e => !(e.event_type === eventType && e.title === title))
  }

  return { events, pending, fetchForActive, create, remove, removeByTitle }
}
