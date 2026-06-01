import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getSupabaseEnvError } from '@/lib/supabase/env'
import { getPasswordRecoveryRedirectUrl, getSiteUrlConfigError } from '@/lib/site-url'
import { formatAuthError } from '@/lib/supabase/errors'

export const maxDuration = 15

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const envError = getSupabaseEnvError(supabaseUrl, supabaseAnonKey)

  if (envError) {
    return NextResponse.json({ ok: false, error: envError }, { status: 500 })
  }

  const siteConfigError = getSiteUrlConfigError()
  if (siteConfigError) {
    return NextResponse.json({ ok: false, error: siteConfigError }, { status: 500 })
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

  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  })

  try {
    // PKCE exige code_verifier no navegador — use o formulario em /login/esqueci-senha (client).
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getPasswordRecoveryRedirectUrl(),
    })

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
