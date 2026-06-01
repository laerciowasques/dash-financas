import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { getSupabaseEnvError } from '@/lib/supabase/env'

function getRedirectOrigin(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https'

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`
  }

  return new URL(request.url).origin
}

/** Troca token_hash do e-mail por sessão (sem PKCE — funciona em qualquer navegador). */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/login/redefinir-senha'
  const origin = getRedirectOrigin(request)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const envError = getSupabaseEnvError(supabaseUrl, supabaseAnonKey)

  if (envError) {
    return NextResponse.redirect(`${origin}/login?erro=config-supabase`)
  }

  if (!token_hash || !type) {
    return NextResponse.redirect(`${origin}/login/redefinir-senha?erro=link-invalido`)
  }

  const destination = `${origin}${next}`
  let response = NextResponse.redirect(destination)

  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const { error } = await supabase.auth.verifyOtp({ token_hash, type })

  if (error) {
    console.error('auth/confirm verifyOtp:', error.message)
    return NextResponse.redirect(`${origin}/login/redefinir-senha?erro=link-invalido`)
  }

  return response
}
