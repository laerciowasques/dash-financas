import type { SupabaseClient } from '@supabase/supabase-js'

/** Registra na tabela senha o primeiro cadastro de credencial do usuario. */
export async function registerSenhaRecord(
  supabase: SupabaseClient,
  userId: string,
  email: string,
) {
  const { error } = await supabase.from('senha').upsert(
    {
      user_id: userId,
      email: email.trim().toLowerCase(),
      atualizada_em: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  )

  if (error) throw error
}

/** Cria categorias padrao para o ambiente individual do usuario. */
export async function ensureUserEnvironment(supabase: SupabaseClient, userId: string) {
  const { error } = await supabase.rpc('seed_default_categories_for_user', {
    p_user_id: userId,
  })

  if (error) throw error
}

/** Primeiro acesso: grava senha na tabela e prepara ambiente isolado. */
export async function setupUserOnFirstAccess(
  supabase: SupabaseClient,
  userId: string,
  email: string,
) {
  const { data: existing } = await supabase
    .from('senha')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!existing) {
    await registerSenhaRecord(supabase, userId, email)
  }

  await ensureUserEnvironment(supabase, userId)
}

export function getSiteUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}
