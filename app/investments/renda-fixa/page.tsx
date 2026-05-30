'use client'

import { motion } from 'framer-motion'
import { Landmark, TrendingUp, Clock, Shield } from 'lucide-react'
import { FinanceProvider } from '@/lib/finance-context'
import { InvestmentShell } from '@/components/investments/investment-shell'
import { FIXED_INCOME_PRODUCTS } from '@/lib/investment-data'
import { formatCurrency, riskColor } from '@/components/investments/utils'
import { Badge } from '@/components/ui/badge'

function FixedIncomeContent() {
  return (
    <InvestmentShell
      title="Renda Fixa"
      subtitle="Produtos de baixo risco para preservação de capital e renda previsível"
      backHref="/investments"
      backLabel="Voltar aos Investimentos"
      badge={
        <Badge variant="outline" className="border-[#22d3ee]/30 text-[#22d3ee]">
          <Landmark className="h-3 w-3" />
          Baixo Risco
        </Badge>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid gap-4 sm:grid-cols-3"
      >
        {[
          { label: 'Rentabilidade média', value: '110% CDI', icon: TrendingUp, color: '#34d399' },
          { label: 'Liquidez ideal', value: 'D+1 a 90 dias', icon: Clock, color: '#6366f1' },
          { label: 'Proteção FGC', value: 'Até R$ 250 mil', icon: Shield, color: '#22d3ee' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Recomendações do Especialista
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {FIXED_INCOME_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + index * 0.05 }}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.type}</p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: `${riskColor(product.risk)}20`,
                    color: riskColor(product.risk),
                  }}
                >
                  Risco {product.risk}
                </span>
              </div>

              <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Rentabilidade</p>
                  <p className="font-medium text-[#34d399]">{product.yield}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Liquidez</p>
                  <p className="font-medium text-foreground">{product.liquidity}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Mínimo</p>
                  <p className="font-medium text-foreground">
                    {formatCurrency(product.minInvestment)}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.recommendation}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 rounded-xl border border-[#22d3ee]/20 bg-[#22d3ee]/5 p-5"
      >
        <h3 className="mb-2 font-semibold text-foreground">Estratégia sugerida</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Mantenha 6 meses de despesas no <strong className="text-foreground">Tesouro Selic</strong>.
          Para metas de 2–5 anos, combine <strong className="text-foreground">CDB/LCI</strong> com
          vencimentos escalonados. Use <strong className="text-foreground">Tesouro IPCA+</strong>{' '}
          para aposentadoria e proteção contra inflação de longo prazo.
        </p>
      </motion.div>
    </InvestmentShell>
  )
}

export default function RendaFixaPage() {
  return (
    <FinanceProvider>
      <FixedIncomeContent />
    </FinanceProvider>
  )
}
