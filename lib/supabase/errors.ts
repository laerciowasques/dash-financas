import { FetchTimeoutError } from '@/lib/fetch-with-timeout'

type ErrorLike = { message?: string; code?: string; details?: string }

export function formatAuthError(err: unknown): string {
  if (err instanceof FetchTimeoutError) {
    return (
      err.message +
      ' Verifique NEXT_PUBLIC_SUPABASE_URL na Vercel ou desative confirmação de e-mail em Supabase → Authentication → Providers → Email.'
    )
  }

  if (err instanceof Error && err.name === 'AbortError') {
    return 'Tempo esgotado ao conectar ao Supabase. Tente novamente em alguns segundos.'
  }
  const message =
    typeof err === 'object' && err !== null && 'message' in err
      ? String((err as ErrorLike).message)
      : err instanceof Error
        ? err.message
        : 'Não foi possível concluir a operação.'

  if (
    message.includes('<!DOCTYPE') ||
    message.includes("Unexpected token '<'") ||
    message.includes('is not valid JSON')
  ) {
    return (
      'Configuração do Supabase incorreta na Vercel. ' +
      'Confira NEXT_PUBLIC_SUPABASE_URL (deve ser https://goppveejenbsedapffpp.supabase.co) ' +
      'e NEXT_PUBLIC_SUPABASE_ANON_KEY (chave anon do painel API Keys).'
    )
  }

  if (message.includes('relation') && message.includes('senha')) {
    return 'Tabela "senha" não encontrada. Execute a migration no Supabase (SQL Editor).'
  }

  if (message.includes('seed_default_categories_for_user') || message.includes('PGRST202')) {
    return 'Função de categorias não encontrada. Execute a migration multi_user_senha no Supabase.'
  }

  if (message.toLowerCase().includes('invalid api key')) {
    return (
      'Chave API do Supabase inválida. No Supabase abra Project Settings → API Keys, copie a chave ' +
      '"anon public" (Legacy) e cole em NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel. Depois clique em Redeploy.'
    )
  }

  return message
}
