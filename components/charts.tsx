'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useFinance } from '@/lib/finance-context'
import { getCategoryByName } from '@/lib/types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const chartVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
        <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
        {payload.map((entry: { name: string; value: number; color: string }, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function OverviewChart() {
  const { transactions } = useFinance()

  const monthlyData = useMemo(() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i)
      const start = startOfMonth(date)
      const end = endOfMonth(date)

      const monthTransactions = transactions.filter(t =>
        isWithinInterval(new Date(t.date), { start, end })
      )

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.value, 0)

      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.value, 0)

      months.push({
        name: format(date, 'MMM', { locale: ptBR }),
        receitas: income,
        despesas: expense,
        saldo: income - expense,
      })
    }
    return months
  }, [transactions])

  return (
    <motion.div
      custom={0}
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl border border-border bg-card p-5"
    >
      <h3 className="mb-4 text-lg font-semibold text-foreground">Visão Geral Mensal</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="receitas"
              name="Receitas"
              fill="#34d399"
              radius={[6, 6, 0, 0]}
              animationDuration={1000}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="despesas"
              name="Despesas"
              fill="#f472b6"
              radius={[6, 6, 0, 0]}
              animationDuration={1000}
              animationEasing="ease-out"
              animationBegin={200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export function CashFlowChart() {
  const { transactions } = useFinance()

  const flowData = useMemo(() => {
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    let balance = 0
    const data: { date: string; saldo: number }[] = []

    sortedTransactions.forEach(t => {
      balance += t.type === 'income' ? t.value : -t.value
      data.push({
        date: format(new Date(t.date), 'dd/MM'),
        saldo: balance,
      })
    })

    return data.slice(-15)
  }, [transactions])

  return (
    <motion.div
      custom={1}
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl border border-border bg-card p-5"
    >
      <h3 className="mb-4 text-lg font-semibold text-foreground">Fluxo de Caixa</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={flowData}>
            <defs>
              <linearGradient id="saldoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              tickFormatter={v => `${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="saldo"
              name="Saldo"
              stroke="#22d3ee"
              strokeWidth={3}
              fill="url(#saldoGradient)"
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export function CategoryChart() {
  const { transactions, categories } = useFinance()

  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense')
    const categoryTotals: Record<string, number> = {}

    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.value
    })

    return Object.entries(categoryTotals)
      .map(([name, value]) => {
        const cat = getCategoryByName(categories, name, 'expense')
        return {
          name,
          value,
          color: cat?.color || '#6b7280',
        }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [transactions, categories])

  return (
    <motion.div
      custom={2}
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl border border-border bg-card p-5"
    >
      <h3 className="mb-4 text-lg font-semibold text-foreground">Despesas por Categoria</h3>
      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
        <div className="h-64 w-full lg:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex-1 space-y-3 lg:mt-0">
          {categoryData.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-sm text-muted-foreground">{cat.name}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{formatCurrency(cat.value)}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function TrendChart() {
  const { transactions } = useFinance()

  const trendData = useMemo(() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i)
      const start = startOfMonth(date)
      const end = endOfMonth(date)

      const monthTransactions = transactions.filter(t =>
        isWithinInterval(new Date(t.date), { start, end })
      )

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.value, 0)

      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.value, 0)

      const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0

      months.push({
        name: format(date, 'MMM', { locale: ptBR }),
        taxaEconomia: Math.max(0, savingsRate),
      })
    }
    return months
  }, [transactions])

  return (
    <motion.div
      custom={3}
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl border border-border bg-card p-5"
    >
      <h3 className="mb-4 text-lg font-semibold text-foreground">Taxa de Economia</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              tickFormatter={v => `${v}%`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-sm text-muted-foreground">
                        Taxa: <span className="font-medium text-[#a855f7]">{payload[0].value?.toFixed(1)}%</span>
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="taxaEconomia"
              name="Taxa de Economia"
              stroke="#a855f7"
              strokeWidth={3}
              dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#a855f7' }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
