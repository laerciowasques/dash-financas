'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getSupabase } from '@/lib/supabase/client'
import { registerSenhaRecord } from '@/lib/auth-helpers'
import { establishSessionFromUrlHash, parseOtpParams } from '@/lib/auth-recovery'
import { formatAuthError } from '@/lib/supabase/errors'
import { getAuthErrorMessage, readAuthErrorsFromHash } from '@/lib/auth-url-errors'
import { AuthCard } from '@/components/auth-card'
import { Button } from '@/components/ui/button'
import { PasswordField } from '@/components/password-field'

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingLink, setIsCheckingLink] = useState(true)
  const [canReset, setCanReset] = useState(false)

  useEffect(() => {
    async function validateRecoveryLink() {
      const hashErrors = readAuthErrorsFromHash()
      const erro = searchParams.get('erro') ?? hashErrors.code
      const errorDescription =
        searchParams.get('error_description') ?? hashErrors.description

      if (erro) {
        setIsCheckingLink(false)
        toast.error(getAuthErrorMessage(erro, errorDescription))
        return
      }

      const code = searchParams.get('code')
      const otpParams = parseOtpParams(searchParams)

      if (otpParams) {
        const params = new URLSearchParams({
          token_hash: otpParams.token_hash,
          type: otpParams.type,
          next: '/login/redefinir-senha',
        })
        window.location.href = `/auth/confirm?${params.toString()}`
        return
      }

      if (code) {
        window.location.href = `/auth/callback?code=${encodeURIComponent(code)}&next=/login/redefinir-senha`
        return
      }

      try {
        const supabase = getSupabase()

        await establishSessionFromUrlHash(supabase)

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setCanReset(true)
        } else {
          toast.error(
            'Sessão de recuperação não encontrada. Solicite um novo e-mail no mesmo navegador em que clicou em "Enviar link".',
          )
        }
      } catch (err) {
        toast.error(formatAuthError(err))
      } finally {
        setIsCheckingLink(false)
      }
    }

    validateRecoveryLink()
  }, [searchParams, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!canReset) {
      toast.error('Link de recuperação inválido. Solicite um novo e-mail.')
      return
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      return
    }

    setIsLoading(true)
    const supabase = getSupabase()

    const { data, error } = await supabase.auth.updateUser({ password })

    if (error) {
      setIsLoading(false)
      toast.error(formatAuthError(error))
      return
    }

    if (data.user?.id && data.user.email) {
      try {
        await registerSenhaRecord(supabase, data.user.id, data.user.email)
      } catch {
        // registro opcional se ja existir
      }
    }

    setIsLoading(false)
    toast.success('Senha atualizada com sucesso!')
    router.push('/login')
    router.refresh()
  }

  if (isCheckingLink) {
    return (
      <AuthCard title="Nova senha" subtitle="Validando link de recuperação...">
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Nova senha" subtitle="Defina sua nova senha de acesso">
      {!canReset ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Não foi possível validar o link. Solicite um novo e-mail de recuperação.
          </p>
          <Button asChild className="w-full">
            <Link href="/login/esqueci-senha">Solicitar novo link</Link>
          </Button>
          <Link
            href="/login"
            className="block text-center text-sm text-muted-foreground hover:text-primary"
          >
            Voltar ao login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordField
            id="password"
            label="Nova senha"
            value={password}
            onChange={setPassword}
            disabled={isLoading}
            autoComplete="new-password"
          />

          <PasswordField
            id="confirmPassword"
            label="Confirmar nova senha"
            value={confirmPassword}
            onChange={setConfirmPassword}
            disabled={isLoading}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-xl text-base font-medium shadow-lg shadow-primary/25"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar nova senha'
            )}
          </Button>

          <Link
            href="/login"
            className="block text-center text-sm text-muted-foreground hover:text-primary"
          >
            Voltar ao login
          </Link>
        </form>
      )}
    </AuthCard>
  )
}
