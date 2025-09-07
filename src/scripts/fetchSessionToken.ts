import { supabase } from '@/supabaseClient'

export const fetchSessionToken = async (): Promise<string> => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token ?? ''
}
