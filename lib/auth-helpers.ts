import type { SupabaseClient } from '@supabase/supabase-js'

export type SetupUserResult = {
  senhaOk: boolean
  categoriesOk: boolean
  warnings: string[]
}

const DEFAULT_CATEGORIES = [
  { name: 'Salário', color: '#34d399', icon: '💰', type: 'income' as const },
  { name: 'Freelance', color: '#22d3ee', icon: '💻', type: 'income' as const },
  { name: 'Investimentos', color: '#a855f7', icon: '📈', type: 'income' as const },
  { name: 'Alimentação', color: '#f472b6', icon: '🍔', type: 'expense' as const },
  { name: 'Transporte', color: '#fbbf24', icon: '🚗', type: 'expense' as const },
  { name: 'Entretenimento', color: '#a855f7', icon: '🎮', type: 'expense' as const },
  { name: 'Contas', color: '#ef4444', icon: '📄', type: 'expense' as const },
  { name: 'Saúde', color: '#34d399', icon: '💊', type: 'expense' as const },
]

/** Registra na tabela senha o primeiro cadastro de credencial do usuario. */
export async function registerSenhaRecord(
  supabase: SupabaseClient,
  userId: string,
  email: string,
): Promise<{ ok: boolean; warning?: string }> {
  const { error } = await supabase.from('senha').upsert(
    {
      user_id: userId,
      email: email.trim().toLowerCase(),
      atualizada_em: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  )

  if (error) {
    return { ok: false, warning: error.message }
  }

  return { ok: true }
}

async function seedCategoriesViaRpc(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ ok: boolean; warning?: string }> {
  const { error } = await supabase.rpc('seed_default_categories_for_user', {
    p_user_id: userId,
  })

  if (error) {
    return { ok: false, warning: error.message }
  }

  return { ok: true }
}

async function seedCategoriesDirect(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ ok: boolean; warning?: string }> {
  const { count, error: countError } = await supabase
    .from('categories')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (countError) {
    return { ok: false, warning: countError.message }
  }

  if (count && count > 0) {
    return { ok: true }
  }

  const rows = DEFAULT_CATEGORIES.map((c) => ({ ...c, user_id: userId }))
  const { error } = await supabase.from('categories').insert(rows)

  if (error) {
    return { ok: false, warning: error.message }
  }

  return { ok: true }
}

/** Cria categorias padrao para o ambiente individual do usuario. */
export async function ensureUserEnvironment(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ ok: boolean; warning?: string }> {
  const directResult = await seedCategoriesDirect(supabase, userId)
  if (directResult.ok) return directResult

  return seedCategoriesViaRpc(supabase, userId)
}

/** Executa setup em segundo plano (nao bloqueia login). */
export async function runBackgroundUserSetup(): Promise<void> {
  try {
    await setupUserViaApi()
    return
  } catch {
    // segue para fallback client-side
  }

  try {
    const { getSupabase } = await import('@/lib/supabase/client')
    const supabase = getSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user?.email) {
      await setupUserOnFirstAccess(supabase, user.id, user.email)
    }
  } catch (err) {
    console.warn('Setup em segundo plano:', err)
  }
}

/** Primeiro acesso: grava senha na tabela e prepara ambiente isolado (nao interrompe o cadastro). */
export async function setupUserOnFirstAccess(
  supabase: SupabaseClient,
  userId: string,
  email: string,
): Promise<SetupUserResult> {
  const warnings: string[] = []
  let senhaOk = false
  let categoriesOk = false

  const { data: existing, error: selectError } = await supabase
    .from('senha')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (selectError) {
    warnings.push(`Tabela senha: ${selectError.message}`)
  } else if (!existing) {
    const senhaResult = await registerSenhaRecord(supabase, userId, email)
    senhaOk = senhaResult.ok
    if (senhaResult.warning) warnings.push(`Tabela senha: ${senhaResult.warning}`)
  } else {
    senhaOk = true
  }

  const categoriesResult = await ensureUserEnvironment(supabase, userId)
  categoriesOk = categoriesResult.ok
  if (categoriesResult.warning) warnings.push(`Categorias: ${categoriesResult.warning}`)

  return { senhaOk, categoriesOk, warnings }
}

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'http://localhost:3000'
}

/** Configura ambiente via API (resposta sempre JSON). */
export async function setupUserViaApi(): Promise<SetupUserResult & { ok: boolean }> {
  const { fetchWithTimeout } = await import('@/lib/fetch-with-timeout')
  const res = await fetchWithTimeout(
    '/api/auth/setup-user',
    {
      method: 'POST',
      credentials: 'include',
    },
    12_000,
  )

  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    throw new Error(
      'Resposta inválida do servidor. Verifique o deploy e as variáveis do Supabase na Vercel.',
    )
  }

  const body = await res.json()

  if (!res.ok || !body.ok) {
    throw new Error(body.error ?? 'Falha ao preparar ambiente do usuário.')
  }

  return body
}
