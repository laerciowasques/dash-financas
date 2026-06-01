import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/auth/callback', '/auth/verificado']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const authError = request.nextUrl.searchParams.get('error')
  const errorCode = request.nextUrl.searchParams.get('error_code')
  const errorDescription = request.nextUrl.searchParams.get('error_description')

  if (authError || errorCode) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.delete('error')
    url.searchParams.delete('error_code')
    url.searchParams.delete('error_description')
    if (errorCode) url.searchParams.set('erro', errorCode)
    else if (authError) url.searchParams.set('erro', authError)
    if (errorDescription) url.searchParams.set('error_description', errorDescription)
    return NextResponse.redirect(url)
  }

  const code = request.nextUrl.searchParams.get('code')

  if (code) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/callback'
    url.searchParams.delete('code')

    const nextPath =
      pathname.startsWith('/login/redefinir-senha') || pathname === '/'
        ? '/login/redefinir-senha'
        : pathname === '/login'
          ? '/auth/verificado'
          : '/login/redefinir-senha'

    url.searchParams.set('next', request.nextUrl.searchParams.get('next') ?? nextPath)
    url.searchParams.set('code', code)

    const isRedefinirSenha = pathname.startsWith('/login/redefinir-senha')

    if (
      pathname === '/' ||
      pathname === '/login' ||
      (pathname.startsWith('/login/') && !isRedefinirSenha)
    ) {
      return NextResponse.redirect(url)
    }
  }

  const token_hash = request.nextUrl.searchParams.get('token_hash')
  const type = request.nextUrl.searchParams.get('type')

  if (token_hash && type && (pathname === '/' || pathname.startsWith('/login'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/callback'
    return NextResponse.redirect(url)
  }

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )
  const isApiRoute = pathname.startsWith('/api/')

  if (!user && !isPublicPath && !isApiRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (user && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = request.nextUrl.searchParams.get('redirect') || '/'
    url.searchParams.delete('redirect')
    return NextResponse.redirect(url)
  }

  // Permite redefinir senha mesmo com sessão temporaria de recovery
  if (user && pathname.startsWith('/login/redefinir-senha')) {
    return supabaseResponse
  }

  return supabaseResponse
}
