import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { EmailOtpType } from '@supabase/supabase-js'
import { getSupabaseEnvError } from '@/lib/supabase/env'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/login/redefinir-senha'

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const envError = getSupabaseEnvError(supabaseUrl, supabaseAnonKey)

  if (envError) {
    return NextResponse.redirect(`${origin}/login?erro=config-supabase`)
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
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

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })

    if (error) {
      console.error('verifyOtp recovery:', error.message)
      return NextResponse.redirect(`${origin}/login/redefinir-senha?erro=link-invalido`)
    }

    const destination = type === 'recovery' ? '/login/redefinir-senha' : next
    return NextResponse.redirect(`${origin}${destination}`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login/redefinir-senha?erro=link-invalido`)
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('exchangeCodeForSession:', error.message)
    return NextResponse.redirect(`${origin}/login/redefinir-senha?erro=link-invalido`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
