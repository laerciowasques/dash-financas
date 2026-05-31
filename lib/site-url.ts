const PRODUCTION_FALLBACK = 'https://dash-financas-delta.vercel.app'

/** URL canonica do app em rotas de servidor (nunca localhost na Vercel). */
export function getServerSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '')

  if (process.env.VERCEL) {
    if (fromEnv && !fromEnv.includes('localhost')) return fromEnv
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`
    }
    return PRODUCTION_FALLBACK
  }

  if (fromEnv) return fromEnv
  return 'http://localhost:3000'
}

export function getAuthCallbackUrl(nextPath = '/login/redefinir-senha') {
  const base = getServerSiteUrl()
  return `${base}/auth/callback?next=${encodeURIComponent(nextPath)}`
}

export function isLocalhostUrl(url: string) {
  return url.includes('localhost') || url.includes('127.0.0.1')
}

export function getSiteUrlConfigError(): string | null {
  const url = getServerSiteUrl()
  if (process.env.VERCEL && isLocalhostUrl(url)) {
    return (
      'NEXT_PUBLIC_SITE_URL na Vercel nao pode ser localhost. Use https://dash-financas-delta.vercel.app'
    )
  }
  return null
}
