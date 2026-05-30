'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bitcoin,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Sparkles,
  AlertTriangle,
} from 'lucide-react'
import { FinanceProvider } from '@/lib/finance-context'
import { InvestmentShell } from '@/components/investments/investment-shell'
import { type MarketQuote, type CryptoRecommendation } from '@/lib/investment-data'
import { formatCurrency, formatPercent, riskColor } from '@/components/investments/utils'
import { Badge } from '@/components/ui/badge'

interface CryptoData {
  coins: MarketQuote[]
  recommendations: CryptoRecommendation[]
  source: string
  updatedAt: string
}

function CryptoContent() {
  const [data, setData] = useState<CryptoData | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/crypto')
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
      title="Criptomoedas"
      subtitle="Principais criptoativos e recomendações de alocação do especialista"
      backHref="/investments"
      backLabel="Voltar aos Investimentos"
      badge={
        <Badge variant="outline" className="border-[#fbbf24]/30 text-[#fbbf24]">
          <Bitcoin className="h-3 w-3" />
          {data?.source === 'coingecko' ? 'CoinGecko · Tempo real' : 'Dados de referência'}
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

      {/* Top Recommendations */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fbbf24]/10">
            <Sparkles className="h-5 w-5 text-[#fbbf24]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Top 3 Recomendações</h2>
            <p className="text-sm text-muted-foreground">Alocação sugerida dentro do bucket cripto</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {(data?.recommendations ?? []).map((rec, index) => {
            const live = data?.coins.find((c) => c.symbol === rec.symbol)
            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.08 }}
                className="rounded-xl border border-[#fbbf24]/20 bg-gradient-to-br from-[#fbbf24]/5 to-transparent p-5"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{rec.symbol}</h3>
                    <p className="text-sm text-muted-foreground">{rec.name}</p>
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: `${riskColor(rec.risk)}20`,
                      color: riskColor(rec.risk),
                    }}
                  >
                    Risco {rec.risk}
                  </span>
                </div>

                {live && live.price > 0 && (
                  <div className="mb-3 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-foreground">
                      {formatCurrency(live.price)}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        live.changePercent >= 0 ? 'text-[#34d399]' : 'text-[#ef4444]'
                      }`}
                    >
                      {formatPercent(live.changePercent)}
                    </span>
                  </div>
                )}

                <p className="mb-2 text-sm leading-relaxed text-muted-foreground">{rec.thesis}</p>
                <p className="text-xs font-medium text-[#fbbf24]">{rec.allocation}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* All Cryptos Table */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-8"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6366f1]/10">
            <Bitcoin className="h-5 w-5 text-[#6366f1]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Principais Criptomoedas</h2>
            <p className="text-sm text-muted-foreground">Top 10 por capitalização de mercado</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ativo</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Preço (BRL)</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">24h</th>
                </tr>
              </thead>
              <tbody>
                {(data?.coins ?? []).map((coin, i) => {
                  const positive = coin.changePercent >= 0
                  return (
                    <motion.tr
                      key={coin.symbol}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.03 }}
                      className="border-b border-border/50 transition-colors hover:bg-muted/20"
                    >
                      <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-foreground">{coin.symbol}</span>
                        <span className="ml-2 text-muted-foreground">{coin.name}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">
                        {coin.price > 0 ? formatCurrency(coin.price) : '—'}
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
                          {formatPercent(coin.changePercent)}
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border border-[#fbbf24]/20 bg-[#fbbf24]/5 p-5"
      >
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[#fbbf24]" />
          <h3 className="font-semibold text-foreground">Aviso de risco</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Criptomoedas são ativos de alta volatilidade. Limite a exposição a no máximo{' '}
          <strong className="text-foreground">5–10% da carteira total</strong>. Priorize BTC e ETH
          como base e use altcoins apenas como posição satélite. Nunca invista o que não pode perder.
        </p>
      </motion.div>
    </InvestmentShell>
  )
}

export default function CriptoPage() {
  return (
    <FinanceProvider>
      <CryptoContent />
    </FinanceProvider>
  )
}
