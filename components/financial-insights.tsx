'use client'

import { motion } from 'framer-motion'
import { useFinance } from '@/lib/finance-context'
import { 
  Lightbulb, 
  TrendingUp, 
  PiggyBank, 
  AlertTriangle, 
  Award,
  Target,
  Sparkles 
} from 'lucide-react'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

interface Insight {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  color: string
  bgColor: string
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
}

export function FinancialInsights() {
  const { totalIncome, totalExpenses, balance, transactions } = useFinance()

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
  const monthlySavings = balance > 0 ? balance * 0.3 : 0
  const emergencyFund = totalExpenses * 6

  // Calcular categoria com maior gasto
  const categoryExpenses: Record<string, number> = {}
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.value
    })
  
  const topCategory = Object.entries(categoryExpenses).sort((a, b) => b[1] - a[1])[0]

  const insights: Insight[] = [
    {
      id: '1',
      icon: <PiggyBank className="h-5 w-5" />,
      title: 'Economia Mensal Sugerida',
      description: `Com base no seu saldo, sugerimos guardar ${formatCurrency(monthlySavings)} por mês para alcançar seus objetivos financeiros.`,
      color: '#34d399',
      bgColor: 'rgba(52, 211, 153, 0.1)',
    },
    {
      id: '2',
      icon: <Target className="h-5 w-5" />,
      title: 'Reserva de Emergência',
      description: `Sua reserva ideal seria de ${formatCurrency(emergencyFund)}, equivalente a 6 meses de despesas.`,
      color: '#22d3ee',
      bgColor: 'rgba(34, 211, 238, 0.1)',
    },
    {
      id: '3',
      icon: <TrendingUp className="h-5 w-5" />,
      title: 'Taxa de Economia',
      description: savingsRate > 20 
        ? `Excelente! Você está economizando ${savingsRate.toFixed(1)}% da sua renda.`
        : savingsRate > 0
        ? `Sua taxa de economia é ${savingsRate.toFixed(1)}%. Tente aumentar para 20-30%.`
        : 'Você está gastando mais do que ganha. Revise seus gastos urgentemente.',
      color: savingsRate > 20 ? '#34d399' : savingsRate > 0 ? '#fbbf24' : '#f472b6',
      bgColor: savingsRate > 20 ? 'rgba(52, 211, 153, 0.1)' : savingsRate > 0 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(244, 114, 182, 0.1)',
    },
    {
      id: '4',
      icon: <AlertTriangle className="h-5 w-5" />,
      title: 'Maior Gasto',
      description: topCategory 
        ? `${topCategory[0]} é sua maior categoria de despesa (${formatCurrency(topCategory[1])}). Considere formas de reduzir.`
        : 'Adicione transações para ver insights sobre seus gastos.',
      color: '#f472b6',
      bgColor: 'rgba(244, 114, 182, 0.1)',
    },
    {
      id: '5',
      icon: <Award className="h-5 w-5" />,
      title: 'Investimentos',
      description: balance > 1000 
        ? `Com ${formatCurrency(balance)} de saldo, considere investir parte em renda fixa ou fundos de investimento.`
        : 'Construa sua reserva de emergência antes de começar a investir.',
      color: '#a855f7',
      bgColor: 'rgba(168, 85, 247, 0.1)',
    },
    {
      id: '6',
      icon: <Sparkles className="h-5 w-5" />,
      title: 'Dica do Dia',
      description: 'Automatize suas economias! Configure uma transferência automática para sua conta poupança no dia do pagamento.',
      color: '#fbbf24',
      bgColor: 'rgba(251, 191, 36, 0.1)',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="mb-6 flex items-center gap-3">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"
        >
          <Lightbulb className="h-5 w-5 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Insights Financeiros</h3>
          <p className="text-sm text-muted-foreground">Ideias para melhorar suas finanças</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-xl border border-border p-4 transition-colors hover:border-primary/30"
          >
            <div
              className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 transition-opacity group-hover:opacity-30"
              style={{ backgroundColor: insight.color }}
            />
            
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: insight.bgColor, color: insight.color }}
            >
              {insight.icon}
            </motion.div>
            
            <h4 className="mb-2 font-medium text-foreground">{insight.title}</h4>
            <p className="text-sm leading-relaxed text-muted-foreground">{insight.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
