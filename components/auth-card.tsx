'use client'

import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'

type AuthCardProps = {
  title?: string
  subtitle?: string
  children: React.ReactNode
}

export function AuthCard({
  title = 'Dash Finanças',
  subtitle = 'Gestão Financeira',
  children,
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl shadow-primary/10">
        <div className="mb-8 flex flex-col items-center text-center">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30"
          >
            <Wallet className="h-7 w-7 text-primary-foreground" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </div>
    </motion.div>
  )
}
