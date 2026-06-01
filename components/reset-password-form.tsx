'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  Check,
  Circle,
  Loader2,
  Mail,
  PartyPopper,
} from 'lucide-react'
import { toast } from 'sonner'
import { getSupabase } from '@/lib/supabase/client'
import { registerSenhaRecord } from '@/lib/auth-helpers'
import { establishSessionFromUrlHash, parseOtpParams } from '@/lib/auth-recovery'
import { formatAuthError } from '@/lib/supabase/errors'
import { getAuthErrorMessage, readAuthErrorsFromHash } from '@/lib/auth-url-errors'
import { getPasswordStrength, strengthMeta } from '@/lib/password-strength'
import { ResetPasswordLayout } from '@/components/reset-password-layout'
import { Button } from '@/components/ui/button'
import { PasswordField } from '@/components/password-field'

type ViewState = 'validar' | 'criar' | 'erro' | 'concluido'

function RequirementRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2 text-xs">
      {ok ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
      ) : (
        <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
      )}
      <span className={ok ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
    </li>
  )
}

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [view, setView] = useState<ViewState>('validar')

  const strength = getPasswordStrength(password)
  const meta = strength !== 'empty' ? strengthMeta[strength] : null

  const requirements = useMemo(
    () => ({
      minLength: password.length >= 6,
      match: password.length > 0 && password === confirmPassword,
    }),
    [password, confirmPassword],
  )

  const canSubmit =
    view === 'criar' && requirements.minLength && requirements.match && !isLoading

  useEffect(() => {
    async function validateRecoveryLink() {
      const hashErrors = readAuthErrorsFromHash()
      const erro = searchParams.get('erro') ?? hashErrors.code
      const errorDescription =
        searchParams.get('error_description') ?? hashErrors.description

      if (erro) {
        setView('erro')
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
          setView('criar')
        } else {
          setView('erro')
          toast.error('Sessão de recuperação não encontrada. Solicite um novo e-mail.')
        }
      } catch (err) {
        setView('erro')
        toast.error(formatAuthError(err))
      }
    }

    validateRecoveryLink()
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

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
        // opcional
      }
    }

    setIsLoading(false)
    setView('concluido')
    toast.success('Senha atualizada com sucesso!')
  }

  const layoutStep =
    view === 'concluido' ? 'concluido' : view === 'criar' ? 'criar' : 'validar'

  return (
    <ResetPasswordLayout step={layoutStep}>
      <AnimatePresence mode="wait">
        {view === 'validar' && (
          <motion.div
            key="validar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-6 text-center"
          >
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">
              Conferindo o link do seu e-mail…
            </p>
            <div className="mt-6 flex w-full gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-1 flex-1 rounded-full bg-primary/30"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {view === 'erro' && (
          <motion.div
            key="erro"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <div>
              <p className="font-medium text-foreground">Não foi possível validar o link</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                O link pode ter expirado ou o template do e-mail no Supabase ainda não usa{' '}
                <code className="rounded bg-muted px-1 text-xs">token_hash</code>. Solicite um
                novo e-mail de recuperação.
              </p>
            </div>
            <Button asChild className="h-11 w-full rounded-xl shadow-lg shadow-primary/20">
              <Link href="/login/esqueci-senha">
                <Mail className="h-4 w-4" />
                Solicitar novo link
              </Link>
            </Button>
          </motion.div>
        )}

        {view === 'criar' && (
          <motion.form
            key="criar"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <p className="text-sm text-muted-foreground">
              Escolha uma senha forte. Ela substitui a anterior no seu cadastro.
            </p>

            <PasswordField
              id="password"
              label="Nova senha"
              value={password}
              onChange={setPassword}
              disabled={isLoading}
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
            />

            {meta && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Força da senha</span>
                  <span className={`font-medium ${meta.textClass}`}>{meta.label}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={`h-full rounded-full ${meta.barClass}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${meta.percent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            <PasswordField
              id="confirmPassword"
              label="Confirmar nova senha"
              value={confirmPassword}
              onChange={setConfirmPassword}
              disabled={isLoading}
              autoComplete="new-password"
            />

            <ul className="space-y-1.5 rounded-xl border border-border/60 bg-muted/30 p-3">
              <RequirementRow ok={requirements.minLength} label="Pelo menos 6 caracteres" />
              <RequirementRow ok={requirements.match} label="As duas senhas são iguais" />
            </ul>

            <Button
              type="submit"
              disabled={!canSubmit}
              className="h-11 w-full rounded-xl text-base font-medium shadow-lg shadow-primary/25"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Salvando…
                </>
              ) : (
                <>
                  Confirmar nova senha
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </motion.form>
        )}

        {view === 'concluido' && (
          <motion.div
            key="concluido"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14 }}
              className="relative mx-auto flex h-20 w-20 items-center justify-center"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
                <PartyPopper className="h-10 w-10 text-emerald-400" />
              </div>
            </motion.div>

            <div>
              <p className="text-lg font-semibold text-foreground">Tudo certo!</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Sua nova senha já está ativa. Entre no Dash Finanças e continue de onde parou.
              </p>
            </div>

            <Button
              asChild
              className="h-11 w-full rounded-xl text-base shadow-lg shadow-primary/25"
              size="lg"
            >
              <Link href="/login">
                Ir para o login
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </ResetPasswordLayout>
  )
}
