'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Building2,
  Layers,
  PieChart,
  RefreshCw,
} from 'lucide-react'
import { FinanceProvider } from '@/lib/finance-context'
import { InvestmentShell } from '@/components/investments/investment-shell'
import { CATEGORY_RECOMMENDATIONS, type MarketQuote } from '@/lib/investment-data'
import { formatCurrency, formatPercent, riskColor } from '@/components/investments/utils'
import { Badge } from '@/components/ui/badge'

interface StockWithMeta extends MarketQuote {
  sector: string
  thesis: string
  risk: string
  horizon: string
}

interface B3Data {
  indices: MarketQuote[]
  stocks: StockWithMeta[]
  source: string
  updatedAt: string
}

const categoryIcons = {
  FI: Building2,
  Ações: TrendingUp,
  ETFs: Layers,
}

const categoryColors = {
  FI: '#a855f7',
  Ações: '#6366f1',
  ETFs: '#22d3ee',
}

function VariableIncomeContent() {
  const [data, setData] = useState<B3Data | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/b3')
      const json = await res.json()
      setData(json)
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <InvestmentShell
      title="Renda Variável — B3"
      subtitle="Painel conectado à Bolsa de Valores com índices, ações e categorias recomendadas"
      backHref="/investments"
      backLabel="Voltar aos Investimentos"
      badge={
        <Badge variant="outline" className="border-[#6366f1]/30 text-[#6366f1]">
          <BarChart3 className="h-3 w-3" />
          {data?.source === 'b3' ? 'B3 · Tempo real' : 'Dados de referência'}
        </Badge>
      }
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {data?.updatedAt
            ? `Atualizado: ${new Date(data.updatedAt).toLocaleString('pt-BR')}`
            : 'Carregando cotações...'}
        </p>
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* B3 Indices Panel */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6366f1]/10">
            <BarChart3 className="h-5 w-5 text-[#6366f1]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              10 Principais Índices da B3
            </h2>
            <p className="text-sm text-muted-foreground">Cotações dos principais índices brasileiros</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Índice</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ticker</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Pontos</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Variação</th>
                </tr>
              </thead>
              <tbody>
                {(data?.indices ?? []).map((index, i) => {
                  const positive = index.changePercent >= 0
                  return (
                    <motion.tr
                      key={index.symbol}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 + i * 0.03 }}
                      className="border-b border-border/50 transition-colors hover:bg-muted/20"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{index.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{index.symbol}</td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">
                        {index.price > 0
                          ? index.price.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-medium ${
                            positive ? 'text-[#34d399]' : 'text-[#ef4444]'
                          }`}
                        >
                          {positive ? (
                            <TrendingUp className="h-3.5 w-3.5" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5" />
                          )}
                          {formatPercent(index.changePercent)}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
                {loading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td colSpan={4} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* 3 Stock Recommendations */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-8"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#34d399]/10">
            <TrendingUp className="h-5 w-5 text-[#34d399]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">3 Ações Recomendadas</h2>
            <p className="text-sm text-muted-foreground">Seleção do analista para carteira diversificada</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {(data?.stocks ?? []).map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.08 }}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{stock.symbol}</h3>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: `${riskColor(stock.risk)}20`,
                    color: riskColor(stock.risk),
                  }}
                >
                  {stock.risk}
                </span>
              </div>

              {stock.price > 0 && (
                <div className="mb-3 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">
                    {formatCurrency(stock.price)}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      stock.changePercent >= 0 ? 'text-[#34d399]' : 'text-[#ef4444]'
                    }`}
                  >
                    {formatPercent(stock.changePercent)}
                  </span>
                </div>
              )}

              <Badge variant="secondary" className="mb-3">
                {stock.sector}
              </Badge>
              <p className="mb-2 text-sm leading-relaxed text-muted-foreground">{stock.thesis}</p>
              <p className="text-xs text-muted-foreground">
                Horizonte: <span className="font-medium text-foreground">{stock.horizon}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 3 Categories: FI, Ações, ETFs */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a855f7]/10">
            <PieChart className="h-5 w-5 text-[#a855f7]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              3 Categorias de Investimento
            </h2>
            <p className="text-sm text-muted-foreground">FIIs, Ações e ETFs — alocação sugerida</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {CATEGORY_RECOMMENDATIONS.map((cat, index) => {
            const Icon = categoryIcons[cat.category]
            const color = categoryColors[cat.category]
            return (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + index * 0.08 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{cat.title}</h3>
                    <p className="text-xs font-medium" style={{ color }}>
                      {cat.allocation}
                    </p>
                  </div>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{cat.description}</p>
                <div className="space-y-3">
                  {cat.picks.map((pick) => (
                    <div
                      key={pick.symbol}
                      className="rounded-lg border border-border/60 bg-muted/20 p-3"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-semibold text-foreground">{pick.symbol}</span>
                        <span className="text-xs text-muted-foreground">{pick.name}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">{pick.reason}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.section>
    </InvestmentShell>
  )
}

export default function RendaVariavelPage() {
  return (
    <FinanceProvider>
      <VariableIncomeContent />
    </FinanceProvider>
  )
}
