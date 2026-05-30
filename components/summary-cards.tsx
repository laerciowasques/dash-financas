'use client'

import { motion } from 'framer-motion'
import { useFinance } from '@/lib/finance-context'
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
}

const numberVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: string
  bgColor: string
  index: number
  trend?: number
}

function StatCard({ title, value, icon, color, bgColor, index, trend }: StatCardProps) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-xl border border-border bg-card p-5"
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10" style={{ backgroundColor: color }} />
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <motion.p
            variants={numberVariants}
            initial="hidden"
            animate="visible"
            className="mt-1 text-2xl font-bold"
            style={{ color }}
          >
            {formatCurrency(value)}
          </motion.p>
          {trend !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className={`mt-2 flex items-center gap-1 text-xs ${trend >= 0 ? 'text-[#34d399]' : 'text-[#f472b6]'}`}
            >
              {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{trend >= 0 ? '+' : ''}{trend.toFixed(1)}% este mês</span>
            </motion.div>
          )}
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
          className="rounded-xl p-3"
          style={{ backgroundColor: bgColor }}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  )
}

export function SummaryCards() {
  const { totalIncome, totalExpenses, balance } = useFinance()
  
  const savings = balance > 0 ? balance * 0.3 : 0

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Saldo Total"
        value={balance}
        icon={<Wallet className="h-6 w-6 text-[#22d3ee]" />}
        color="#22d3ee"
        bgColor="rgba(34, 211, 238, 0.1)"
        index={0}
        trend={8.2}
      />
      <StatCard
        title="Receitas"
        value={totalIncome}
        icon={<TrendingUp className="h-6 w-6 text-[#34d399]" />}
        color="#34d399"
        bgColor="rgba(52, 211, 153, 0.1)"
        index={1}
        trend={12.5}
      />
      <StatCard
        title="Despesas"
        value={totalExpenses}
        icon={<TrendingDown className="h-6 w-6 text-[#f472b6]" />}
        color="#f472b6"
        bgColor="rgba(244, 114, 182, 0.1)"
        index={2}
        trend={-3.2}
      />
      <StatCard
        title="Economia Sugerida"
        value={savings}
        icon={<PiggyBank className="h-6 w-6 text-[#a855f7]" />}
        color="#a855f7"
        bgColor="rgba(168, 85, 247, 0.1)"
        index={3}
      />
    </div>
  )
}
