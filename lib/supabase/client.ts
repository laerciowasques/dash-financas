import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias.',
    )
  }

  if (!supabaseUrl.includes('supabase.co')) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL inválida. Use a URL do projeto Supabase (https://goppveejenbsedapffpp.supabase.co), não a URL da Vercel.',
    )
  }

  if (supabaseAnonKey.includes('your_anon_key') || supabaseAnonKey.length < 20) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY inválida. Copie a chave anon em Supabase → API Keys.')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export function getSupabase() {
  if (supabaseClient) return supabaseClient
  supabaseClient = createClient()
  return supabaseClient
}
