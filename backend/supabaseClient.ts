import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY environment variable')
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

export const supabaseWithAuth = (token: string) => {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: {
      fetch: (input, init: RequestInit = {}) => {
        init.headers = {
          ...(init.headers || {}),
          Authorization: `Bearer ${token}`,
          apikey: SUPABASE_KEY!,
          'Content-Type': 'application/json',
        }
        return fetch(input, init)
      },
    },
  })
}
