import type { Character } from '~/types/database.types'

// Fields the create/edit form supplies. user_id is injected from the session,
// the rest (id, timestamps) are filled by Postgres defaults/triggers.
export interface CharacterDraft {
  name: string
  class: string
  race: string
  server: string
  level: number
  deity: string | null
  portrait_url: string | null
}

// Shared store: a single source of truth across navbar, roster, dashboard.
export function useCharacters() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const requireSession = useRequireSession()

  const characters = useState<Character[]>('characters', () => [])
  const loaded = useState<boolean>('characters-loaded', () => false)
  const pending = useState<boolean>('characters-pending', () => false)

  async function fetchAll(force = false) {
    if (!user.value) {
      characters.value = []
      loaded.value = true
      return
    }
    if (loaded.value && !force) return
    pending.value = true
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) throw error
      characters.value = data ?? []
      loaded.value = true
    } finally {
      pending.value = false
    }
  }

  async function create(draft: CharacterDraft): Promise<Character> {
    const session = await requireSession()
    const { data, error } = await supabase
      .from('characters')
      .insert({ ...draft, user_id: session.user.id })
      .select()
      .single()
    if (error) throw error
    characters.value = [...characters.value, data]
    return data
  }

  async function update(id: string, patch: Partial<CharacterDraft>): Promise<Character> {
    const { data, error } = await supabase
      .from('characters')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    characters.value = characters.value.map(c => (c.id === id ? data : c))
    return data
  }

  async function remove(id: string): Promise<void> {
    const { error } = await supabase.from('characters').delete().eq('id', id)
    if (error) throw error
    characters.value = characters.value.filter(c => c.id !== id)
  }

  function getById(id: string): Character | null {
    return characters.value.find(c => c.id === id) ?? null
  }

  return { characters, loaded, pending, fetchAll, create, update, remove, getById }
}
