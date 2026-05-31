'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { getSupabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

type LogoutButtonProps = {
  variant?: 'sidebar' | 'header'
}

export function LogoutButton({ variant = 'header' }: LogoutButtonProps) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setIsSigningOut(true)
    const supabase = getSupabase()
    const { error } = await supabase.auth.signOut()
    setIsSigningOut(false)

    if (error) {
      toast.error('Não foi possível sair. Tente novamente.')
      return
    }

    toast.success('Sessão encerrada.')
    router.push('/login')
    router.refresh()
  }

  if (variant === 'sidebar') {
    return (
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive transition-all hover:bg-destructive/20 disabled:opacity-50"
      >
        <LogOut className="h-5 w-5" />
        {isSigningOut ? 'Saindo...' : 'Logoff'}
      </button>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <LogOut className="h-4 w-4" />
      {isSigningOut ? 'Saindo...' : 'Logoff'}
    </Button>
  )
}
