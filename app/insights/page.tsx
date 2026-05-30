'use client'

import { motion } from 'framer-motion'
import { Sidebar } from '@/components/sidebar'
import { FinancialInsights } from '@/components/financial-insights'
import { FinanceProvider, useFinance } from '@/lib/finance-context'
import { 
  Target, 
  Wallet, 
  TrendingUp, 
  Shield, 
  Briefcase, 
  Home,
  Plane,
  GraduationCap,
  Heart,
  Car
} from 'lucide-react'

const financialGoals = [
  {
    id: 1,
    title: 'Reserva de Emergência',
    description: '6 meses de despesas guardados para imprevistos',
    icon: Shield,
    color: '#22d3ee',
    targetMonths: 6,
  },
  {
    id: 2,
    title: 'Aposentadoria',
    description: 'Investir 15% da renda mensal para o futuro',
    icon: Briefcase,
    color: '#a855f7',
    percentage: 15,
  },
  {
    id: 3,
    title: 'Casa Própria',
    description: 'Economizar para entrada de imóvel',
    icon: Home,
    color: '#34d399',
    targetValue: 100000,
  },
  {
    id: 4,
    title: 'Viagem dos Sonhos',
    description: 'Fundo para viagem internacional',
    icon: Plane,
    color: '#f472b6',
    targetValue: 15000,
  },
  {
    id: 5,
    title: 'Educação',
    description: 'Cursos e desenvolvimento profissional',
    icon: GraduationCap,
    color: '#fbbf24',
    targetValue: 5000,
  },
  {
    id: 6,
    title: 'Saúde',
    description: 'Plano de saúde e check-ups regulares',
    icon: Heart,
    color: '#ef4444',
    monthlyBudget: 500,
  },
]

const investmentTips = [
  {
    title: 'Tesouro Direto',
    description: 'Ideal para reserva de emergência. Rendimento acima da poupança com liquidez diária.',
    risk: 'Baixo',
    minInvestment: 30,
  },
  {
    title: 'CDB',
    description: 'Certificado de Depósito Bancário. Boa opção para médio prazo com proteção do FGC.',
    risk: 'Baixo',
    minInvestment: 100,
  },
  {
    title: 'Fundos Imobiliários',
    description: 'Receba aluguéis mensais investindo em imóveis. Diversificação com baixo valor.',
    risk: 'Médio',
    minInvestment: 100,
  },
  {
    title: 'Ações',
    description: 'Participação em empresas. Maior potencial de retorno para longo prazo.',
    risk: 'Alto',
    minInvestment: 1,
  },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function GoalCard({ goal, index, totalExpenses }: { goal: typeof financialGoals[0], index: number, totalExpenses: number }) {
  const Icon = goal.icon
  
  let targetText = ''
  if ('targetMonths' in goal) {
    targetText = `Meta: ${formatCurrency(totalExpenses * goal.targetMonths)}`
  } else if ('targetValue' in goal) {
    targetText = `Meta: ${formatCurrency(goal.targetValue)}`
  } else if ('percentage' in goal) {
    targetText = `${goal.percentage}% da renda`
  } else if ('monthlyBudget' in goal) {
    targetText = `${formatCurrency(goal.monthlyBudget)}/mês`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
    >
      <div
        className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-10 transition-opacity group-hover:opacity-20"
        style={{ backgroundColor: goal.color }}
      />
      
      <motion.div
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.5 }}
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${goal.color}20` }}
      >
        <Icon className="h-6 w-6" style={{ color: goal.color }} />
      </motion.div>
      
      <h3 className="mb-2 font-semibold text-foreground">{goal.title}</h3>
      <p className="mb-3 text-sm text-muted-foreground">{goal.description}</p>
      <div className="text-sm font-medium" style={{ color: goal.color }}>
        {targetText}
      </div>
    </motion.div>
  )
}

function InvestmentCard({ tip, index }: { tip: typeof investmentTips[0], index: number }) {
  const riskColor = tip.risk === 'Baixo' ? '#34d399' : tip.risk === 'Médio' ? '#fbbf24' : '#ef4444'
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.1 }}
      className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <TrendingUp className="h-5 w-5 text-primary" />
      </div>
      
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between">
          <h4 className="font-medium text-foreground">{tip.title}</h4>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${riskColor}20`, color: riskColor }}
          >
            Risco {tip.risk}
          </span>
        </div>
        <p className="mb-2 text-sm text-muted-foreground">{tip.description}</p>
        <p className="text-xs text-muted-foreground">
          Investimento mínimo: <span className="font-medium text-foreground">{formatCurrency(tip.minInvestment)}</span>
        </p>
      </div>
    </motion.div>
  )
}

function InsightsContent() {
  const { totalExpenses } = useFinance()

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                Insights Financeiros
              </h1>
              <p className="mt-1 text-muted-foreground">
                Dicas e metas para melhorar sua saúde financeira
              </p>
            </div>
          </motion.div>

          {/* Financial Insights Component */}
          <div className="mb-8">
            <FinancialInsights />
          </div>

          {/* Financial Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22d3ee]/10"
              >
                <Target className="h-5 w-5 text-[#22d3ee]" />
              </motion.div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Metas Financeiras</h2>
                <p className="text-sm text-muted-foreground">Objetivos sugeridos para seu perfil</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {financialGoals.map((goal, index) => (
                <GoalCard key={goal.id} goal={goal} index={index} totalExpenses={totalExpenses} />
              ))}
            </div>
          </motion.div>

          {/* Investment Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a855f7]/10"
              >
                <Wallet className="h-5 w-5 text-[#a855f7]" />
              </motion.div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Onde Investir</h2>
                <p className="text-sm text-muted-foreground">Opções de investimento para seu dinheiro</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {investmentTips.map((tip, index) => (
                <InvestmentCard key={tip.title} tip={tip} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default function InsightsPage() {
  return (
    <FinanceProvider>
      <InsightsContent />
    </FinanceProvider>
  )
}
