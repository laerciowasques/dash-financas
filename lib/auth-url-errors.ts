export function getAuthErrorMessage(code: string | null, description?: string | null): string {
  if (code === 'otp_expired' || description?.toLowerCase().includes('expired')) {
    return 'O link do e-mail expirou. Solicite um novo em "Esqueceu sua senha?".'
  }

  if (code === 'access_denied') {
    return 'Acesso negado pelo link. Solicite um novo e-mail de recuperação.'
  }

  if (code === 'link-invalido') {
    return 'Link inválido ou expirado. Em Esqueci senha, envie um novo e-mail e abra o link no mesmo navegador.'
  }

  if (description) {
    return decodeURIComponent(description.replace(/\+/g, ' '))
  }

  if (code) {
    return `Erro de autenticação: ${code}`
  }

  return 'Não foi possível concluir a autenticação. Tente novamente.'
}

export function readAuthErrorsFromHash(): { code: string | null; description: string | null } {
  if (typeof window === 'undefined' || !window.location.hash) {
    return { code: null, description: null }
  }

  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash

  const params = new URLSearchParams(hash)

  return {
    code: params.get('error_code') ?? params.get('error'),
    description: params.get('error_description'),
  }
}
