'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from '@/components/sidebar'
import { BackButton } from './back-button'

interface InvestmentShellProps {
  title: string
  subtitle: string
  backHref?: string
  backLabel?: string
  badge?: ReactNode
  children: ReactNode
}

export function InvestmentShell({
  title,
  subtitle,
  backHref,
  backLabel,
  badge,
  children,
}: InvestmentShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8">
          <div className="mb-8 ml-12 space-y-4 lg:ml-0">
            <BackButton href={backHref} label={backLabel} />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">{title}</h1>
                {badge}
              </div>
              <p className="mt-1 text-muted-foreground">{subtitle}</p>
            </motion.div>
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
