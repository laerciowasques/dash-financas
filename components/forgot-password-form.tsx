'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { getSupabase } from '@/lib/supabase/client'
import { formatAuthError } from '@/lib/supabase/errors'
import { AuthCard } from '@/components/auth-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!email.trim()) {
      toast.error('Informe seu e-mail.')
      return
    }

    setIsLoading(true)

    try {
      const supabase = getSupabase()
      const redirectTo = `${window.location.origin}/login/redefinir-senha`

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      })

      if (error) {
        throw error
      }

      setEmailSent(true)
      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.')
    } catch (err) {
      toast.error(formatAuthError(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard title="Recuperar senha" subtitle="Enviaremos um link para redefinir sua senha">
      {emailSent ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Se <span className="font-medium text-foreground">{email}</span> estiver cadastrado,
            você receberá um e-mail com o link para criar uma nova senha.
          </p>
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-left text-xs text-amber-100/90">
            Após atualizar o template &quot;Reset password&quot; no Supabase (arquivo{' '}
            <span className="font-medium">supabase/email-templates/reset-password.html</span>
            ), o link do e-mail funciona em qualquer navegador.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-11 rounded-xl border-border bg-input/50"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-xl text-base font-medium shadow-lg shadow-primary/25"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar link de recuperação'
            )}
          </Button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao login
          </Link>
        </form>
      )}
    </AuthCard>
  )
}
