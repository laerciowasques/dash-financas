import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { setupUserOnFirstAccess } from '@/lib/auth-helpers'
import { formatAuthError } from '@/lib/supabase/errors'
import { getSupabaseEnvError } from '@/lib/supabase/env'

export const maxDuration = 10

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const envError = getSupabaseEnvError(supabaseUrl, supabaseAnonKey)
  if (envError) {
    return NextResponse.json({ ok: false, error: envError }, { status: 500 })
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return NextResponse.json({ ok: false, error: 'Usuário não autenticado.' }, { status: 401 })
  }

  try {
    const result = await setupUserOnFirstAccess(supabase, user.id, user.email)
    return NextResponse.json({
      ok: true,
      ...result,
    })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: formatAuthError(err) },
      { status: 500 },
    )
  }
}
