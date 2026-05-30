'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { LucideIcon, ChevronRight } from 'lucide-react'

interface InvestmentCategoryCardProps {
  href: string
  title: string
  description: string
  icon: LucideIcon
  color: string
  index: number
}

export function InvestmentCategoryCard({
  href,
  title,
  description,
  icon: Icon,
  color,
  index,
}: InvestmentCategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={href}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
      >
        <div
          className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10 transition-opacity group-hover:opacity-20"
          style={{ backgroundColor: color }}
        />
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-7 w-7" style={{ color }} />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="flex items-center gap-1 text-sm font-medium text-primary">
          Acessar painel
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  )
}
