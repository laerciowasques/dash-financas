'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getSupabase } from '@/lib/supabase/client'
import { getSiteUrl, setupUserOnFirstAccess, setupUserViaApi } from '@/lib/auth-helpers'
import { formatAuthError } from '@/lib/supabase/errors'
import { AuthCard } from '@/components/auth-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { PasswordField } from '@/components/password-field'

type AuthMode = 'login' | 'signup'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function afterAuthSuccess() {
    try {
      const setup = await setupUserViaApi()
      if (setup.warnings?.length) {
        console.warn('Setup parcial:', setup.warnings)
      }
    } catch {
      const supabase = getSupabase()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) {
        await setupUserOnFirstAccess(supabase, user.id, user.email)
      }
    }

    toast.success(mode === 'signup' ? 'Conta criada com sucesso!' : 'Login realizado com sucesso!')
    router.push(redirectTo)
    router.refresh()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!email.trim() || !password) {
      toast.error('Preencha e-mail e senha.')
      return
    }

    if (mode === 'signup' && password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (mode === 'signup' && password !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      return
    }

    setIsLoading(true)
    const supabase = getSupabase()

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/auth/verificado`,
          },
        })

        if (error) throw error

        if (data.user && data.session) {
          await afterAuthSuccess()
        } else {
          toast.success(
            'Conta criada! Confirme o e-mail enviado pelo Supabase e depois faça login.',
          )
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (error) {
          toast.error(
            error.message === 'Invalid login credentials'
              ? 'E-mail ou senha incorretos.'
              : error.message,
          )
          return
        }

        if (data.user) {
          await afterAuthSuccess()
        }
      }
    } catch (err) {
      toast.error(formatAuthError(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard
      subtitle={
        mode === 'login'
          ? 'Acesse seu ambiente financeiro'
          : 'Crie seu ambiente individual'
      }
    >
      <div className="mb-6 flex rounded-xl bg-secondary/60 p-1">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            mode === 'login'
              ? 'bg-primary text-primary-foreground shadow'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            mode === 'signup'
              ? 'bg-primary text-primary-foreground shadow'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Criar conta
        </button>
      </div>

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

        <PasswordField
          id="password"
          label="Senha"
          value={password}
          onChange={setPassword}
          disabled={isLoading}
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        />

        {mode === 'signup' && (
          <PasswordField
            id="confirmPassword"
            label="Confirmar senha"
            value={confirmPassword}
            onChange={setConfirmPassword}
            disabled={isLoading}
            autoComplete="new-password"
          />
        )}

        {mode === 'login' && (
          <div className="flex justify-end">
            <Link
              href="/login/esqueci-senha"
              className="text-sm text-primary hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full rounded-xl text-base font-medium shadow-lg shadow-primary/25"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {mode === 'signup' ? 'Criando conta...' : 'Entrando...'}
            </>
          ) : mode === 'signup' ? (
            'Criar conta'
          ) : (
            'Entrar'
          )}
        </Button>
      </form>

      {mode === 'signup' && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Ao criar a conta, sua senha é registrada na tabela{' '}
          <span className="text-foreground">senha</span> e seu ambiente financeiro é preparado
          automaticamente.
        </p>
      )}
    </AuthCard>
  )
}
