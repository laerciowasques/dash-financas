type ErrorLike = { message?: string; code?: string; details?: string }

export function formatAuthError(err: unknown): string {
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

  return message
}
