import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getSupabaseEnvError } from '@/lib/supabase/env'
import { getRecoveryRedirectUrl } from '@/lib/auth-recovery'
import { formatAuthError } from '@/lib/supabase/errors'

export const maxDuration = 15

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const envError = getSupabaseEnvError(supabaseUrl, supabaseAnonKey)

  if (envError) {
    return NextResponse.json({ ok: false, error: envError }, { status: 500 })
  }

  let body: { email?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Dados inválidos.' }, { status: 400 })
  }

  const email = body.email?.trim()
  if (!email) {
    return NextResponse.json({ ok: false, error: 'Informe seu e-mail.' }, { status: 400 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.headers.get('origin')
  const redirectTo = siteUrl
    ? `${siteUrl}/auth/callback?next=${encodeURIComponent('/login/redefinir-senha')}`
    : getRecoveryRedirectUrl()

  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  })

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

    if (error) {
      return NextResponse.json(
        { ok: false, error: formatAuthError({ message: error.message }) },
        { status: 400 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: formatAuthError(err) },
      { status: 500 },
    )
  }
}
