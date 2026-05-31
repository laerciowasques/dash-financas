export function formatFinanceError(err: unknown): string {
  const message =
    typeof err === 'object' && err !== null && 'message' in err
      ? String((err as { message: string }).message)
      : err instanceof Error
        ? err.message
        : 'Não foi possível concluir a operação.'

  if (message.includes('row-level security') || message.includes('RLS')) {
    return 'Acesso negado: você só pode ver e editar seus próprios dados.'
  }

  if (message.includes('user_id') && message.includes('null')) {
    return 'Banco desatualizado. Execute as migrations multi-usuário no Supabase SQL Editor.'
  }

  if (message.includes('Categoria não encontrada')) {
    return 'Nenhuma categoria disponível. Clique em "Preparar meu ambiente" ou faça login novamente.'
  }

  if (message.includes('column') && message.includes('user_id')) {
    return 'Coluna user_id ausente. Execute a migration multi_user_senha no Supabase.'
  }

  return message
}
