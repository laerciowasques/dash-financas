'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getSupabase } from '@/lib/supabase/client'
import { registerSenhaRecord } from '@/lib/auth-helpers'
import { AuthCard } from '@/components/auth-card'
import { Button } from '@/components/ui/button'
import { PasswordField } from '@/components/password-field'

export function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

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
      toast.error(error.message)
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
    router.push('/')
    router.refresh()
  }

  return (
    <AuthCard title="Nova senha" subtitle="Defina sua nova senha de acesso">
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
    </AuthCard>
  )
}
