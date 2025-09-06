import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY environment variable')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export const supabaseUser = (token: string) => {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}
