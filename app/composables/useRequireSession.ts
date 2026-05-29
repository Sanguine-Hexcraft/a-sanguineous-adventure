// Single source of truth for "I'm about to write — give me an authenticated
// session." Calling supabase.auth.getSession() also hydrates the token into
// the client, so the following request carries it; without this, auth.uid()
// can be null server-side and RLS with-check policies reject the insert.
//
// Every Supabase WRITE (insert/update/delete on a user-owned table) should
// get its user_id from the returned session.user.id — never from a cached
// useSupabaseUser() ref.
export class SessionExpiredError extends Error {
  constructor() {
    super('Your session has expired — sign out and back in.')
    this.name = 'SessionExpiredError'
  }
}

export function useRequireSession() {
  const supabase = useSupabaseClient()

  return async function requireSession() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new SessionExpiredError()
    return session
  }
}
