'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Wallet, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { runBackgroundUserSetup } from '@/lib/auth-helpers'

export function VerificationSuccess() {
  useEffect(() => {
    void runBackgroundUserSetup()
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-2xl shadow-primary/10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20"
        >
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </motion.div>

        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Obrigado!!!</h1>
          <p className="mt-3 text-lg font-medium text-accent">
            Verificação realizada com sucesso.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Seu e-mail foi confirmado. Agora você pode acessar seu ambiente financeiro
            individual no Dash Finanças.
          </p>
        </div>

        <Button asChild className="h-11 w-full rounded-xl text-base shadow-lg shadow-primary/25" size="lg">
          <Link href="/">
            Ir para o Dashboard
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>

        <Link
          href="/login"
          className="mt-4 inline-block text-sm text-muted-foreground hover:text-primary"
        >
          Voltar ao login
        </Link>
      </div>
    </motion.div>
  )
}
