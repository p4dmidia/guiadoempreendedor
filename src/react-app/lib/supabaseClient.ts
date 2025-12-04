import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  const url = import.meta.env.VITE_SUPABASE_URL as string
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string
  const maskedKey = key ? `${key.slice(0, 4)}…${key.slice(-4)}` : ''
  console.log('[Supabase] VITE_SUPABASE_URL =', url, ' VITE_SUPABASE_ANON_KEY =', maskedKey)
  if (!client) {
    client = createClient(url, key)
  }
  return client
}

