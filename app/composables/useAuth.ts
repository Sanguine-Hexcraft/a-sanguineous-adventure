// Thin wrapper over @nuxtjs/supabase's auth helpers.
// useSupabaseUser / useSupabaseClient are auto-imported by the module.
export function useAuth() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const router = useRouter()

  async function signOut() {
    await supabase.auth.signOut()
    await router.push('/login')
  }

  return { user, signOut }
}
