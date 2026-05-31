import type { EmailOtpType, SupabaseClient } from '@supabase/supabase-js'

/** Processa tokens de recuperação no hash da URL (#access_token=...). */
export async function establishSessionFromUrlHash(supabase: SupabaseClient): Promise<boolean> {
  if (typeof window === 'undefined' || !window.location.hash) return false

  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash

  const params = new URLSearchParams(hash)
  const accessToken = params.get('access_token')
  const refreshToken = params.get('refresh_token')
  const type = params.get('type')

  if (!accessToken || !refreshToken) return false

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  })

  if (error) throw error

  window.history.replaceState(null, '', window.location.pathname + window.location.search)

  return type === 'recovery' || Boolean(accessToken)
}

export function getRecoveryRedirectUrl(nextPath = '/login/redefinir-senha') {
  const base =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  return `${base}/auth/callback?next=${encodeURIComponent(nextPath)}`
}

export type OtpVerifyParams = {
  token_hash: string
  type: EmailOtpType
}

export function parseOtpParams(searchParams: URLSearchParams): OtpVerifyParams | null {
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (!token_hash || !type) return null

  return { token_hash, type }
}
