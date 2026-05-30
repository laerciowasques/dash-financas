'use client'

import { motion } from 'framer-motion'
import { Landmark, LineChart, Bitcoin, ShieldCheck, Award } from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { FinanceProvider } from '@/lib/finance-context'
import { InvestmentCategoryCard } from '@/components/investments/category-card'
import { BackButton } from '@/components/investments/back-button'

const categories = [
  {
    href: '/investments/renda-fixa',
    title: 'Renda Fixa',
    description:
      'Tesouro Direto, CDB, LCI/LCA e debêntures. Recomendações para reserva de emergência e metas de médio prazo com baixo risco.',
    icon: Landmark,
    color: '#22d3ee',
  },
  {
    href: '/investments/renda-variavel',
    title: 'Renda Variável',
    description:
      'Painel conectado à B3 com os 10 principais índices, 3 ações recomendadas e categorias FIIs, Ações e ETFs.',
    icon: LineChart,
    color: '#6366f1',
  },
  {
    href: '/investments/cripto',
    title: 'Criptomoedas',
    description:
      'Principais criptoativos em tempo real com recomendações de alocação e estratégia para diversificação digital.',
    icon: Bitcoin,
    color: '#fbbf24',
  },
]

function InvestmentsContent() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8">
          <div className="mb-8 ml-12 space-y-4 lg:ml-0">
            <BackButton href="/" label="Voltar ao Dashboard" />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                  Central de Investimentos
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Award className="h-3.5 w-3.5" />
                  Assessor Certificado ANBIMA
                </span>
              </div>
              <p className="mt-1 max-w-2xl text-muted-foreground">
                Análises de mercado, recomendações personalizadas e painéis em tempo real para
                construir sua carteira com inteligência.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 rounded-xl border border-border bg-gradient-to-r from-primary/10 via-transparent to-[#22d3ee]/10 p-5"
          >
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Perfil recomendado: Moderado</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Com base no seu fluxo de caixa, sugerimos 40% renda fixa, 50% renda variável e até
                  10% em criptoativos. Ajuste conforme seu perfil de risco.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, index) => (
              <InvestmentCategoryCard key={cat.href} {...cat} index={index} />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-xs text-muted-foreground"
          >
            * Conteúdo educacional. Recomendações não constituem oferta de valores mobiliários.
            Consulte um assessor de investimentos certificado antes de investir.
          </motion.p>
        </div>
      </main>
    </div>
  )
}

export default function InvestmentsPage() {
  return (
    <FinanceProvider>
      <InvestmentsContent />
    </FinanceProvider>
  )
}
