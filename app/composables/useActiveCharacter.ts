// Tracks which character the navbar + dashboard reflect. The chosen id is
// persisted in localStorage; the resolved character falls back to the first
// in the roster if nothing is pinned (or the pinned one no longer exists).
const STORAGE_KEY = 'asa.activeCharacterId'

export function useActiveCharacter() {
  const { characters } = useCharacters()
  const activeId = useState<string | null>('active-character-id', () => null)

  // Hydrate the persisted choice once, on the client.
  if (import.meta.client && activeId.value === null) {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) activeId.value = stored
  }

  const active = computed(() => {
    if (!characters.value.length) return null
    return characters.value.find(c => c.id === activeId.value) ?? characters.value[0]!
  })

  function setActive(id: string) {
    activeId.value = id
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, id)
  }

  return { activeId, active, setActive }
}
