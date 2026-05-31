import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { fetchWithTimeout } from '@/lib/fetch-with-timeout'
import { getSupabaseEnvError } from '@/lib/supabase/env'

let supabaseClient: SupabaseClient | null = null

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const envError = getSupabaseEnvError(supabaseUrl, supabaseAnonKey)
  if (envError) {
    throw new Error(envError)
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: fetchWithTimeout,
    },
  })
}

export function getSupabase() {
  if (supabaseClient) return supabaseClient
  supabaseClient = createClient()
  return supabaseClient
}
