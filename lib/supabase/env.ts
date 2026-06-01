export function getSupabaseEnvError(
  url = process.env.NEXT_PUBLIC_SUPABASE_URL,
  key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
): string | null {
  if (!url?.trim()) {
    return 'NEXT_PUBLIC_SUPABASE_URL não está definida na Vercel.'
  }

  if (!url.includes('supabase.co')) {
    return (
      'NEXT_PUBLIC_SUPABASE_URL na Vercel está errada (parece URL do site). ' +
      'Use https://goppveejenbsedapffpp.supabase.co — a URL do app (Vercel) vai em NEXT_PUBLIC_SITE_URL.'
    )
  }

  if (!key?.trim()) {
    return 'NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida na Vercel.'
  }

  if (key.includes('your_anon_key') || key === 'your_anon_key_here') {
    return 'NEXT_PUBLIC_SUPABASE_ANON_KEY ainda está com valor de exemplo. Cole a chave anon real do Supabase.'
  }

  if (!key.startsWith('eyJ') || key.length < 100) {
    return 'NEXT_PUBLIC_SUPABASE_ANON_KEY parece inválida. Use a chave "anon public" completa do Supabase (começa com eyJ).'
  }

  return null
}
