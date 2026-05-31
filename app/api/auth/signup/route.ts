import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { formatAuthError } from '@/lib/supabase/errors'
import { getSupabaseEnvError } from '@/lib/supabase/env'
import { fetchWithTimeout } from '@/lib/fetch-with-timeout'

export const maxDuration = 15

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  const envError = getSupabaseEnvError(supabaseUrl, supabaseAnonKey)
  if (envError) {
    return NextResponse.json({ ok: false, error: envError }, { status: 500 })
  }

  let body: { email?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Dados inválidos.' }, { status: 400 })
  }

  const email = body.email?.trim()
  const password = body.password

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: 'E-mail e senha são obrigatórios.' }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json(
      { ok: false, error: 'A senha deve ter pelo menos 6 caracteres.' },
      { status: 400 },
    )
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    global: { fetch: fetchWithTimeout },
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        )
      },
    },
  })

  const redirectBase = siteUrl ?? request.headers.get('origin') ?? 'http://localhost:3000'

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${redirectBase}/auth/callback?next=/auth/verificado`,
      },
    })

    if (error) {
      return NextResponse.json(
        { ok: false, error: formatAuthError({ message: error.message }) },
        { status: 400 },
      )
    }

    return NextResponse.json({
      ok: true,
      hasSession: Boolean(data.session),
      userId: data.user?.id ?? null,
      needsEmailConfirmation: Boolean(data.user && !data.session),
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: formatAuthError(err) }, { status: 500 })
  }
}
