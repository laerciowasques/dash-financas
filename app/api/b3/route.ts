import { NextResponse } from 'next/server'
import {
  B3_INDEX_SYMBOLS,
  FALLBACK_INDICES,
  STOCK_RECOMMENDATIONS,
  type MarketQuote,
} from '@/lib/investment-data'

export const dynamic = 'force-dynamic'
export const revalidate = 300

async function fetchBrapiQuotes(symbols: string[]): Promise<MarketQuote[]> {
  const url = `https://brapi.dev/api/quote/${symbols.join(',')}?range=1d&interval=1d`
  const res = await fetch(url, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error('Brapi API error')

  const data = await res.json()
  return (data.results ?? []).map(
    (item: {
      symbol: string
      shortName?: string
      longName?: string
      regularMarketPrice: number
      regularMarketChangePercent: number
    }) => ({
      symbol: item.symbol,
      name: item.shortName ?? item.longName ?? item.symbol,
      price: item.regularMarketPrice,
      changePercent: item.regularMarketChangePercent,
    }),
  )
}

export async function GET() {
  try {
    const indexSymbols = B3_INDEX_SYMBOLS.map((i) => i.symbol)
    const stockSymbols = STOCK_RECOMMENDATIONS.map((s) => s.symbol)

    const [indicesRaw, stocksRaw] = await Promise.all([
      fetchBrapiQuotes([...indexSymbols]),
      fetchBrapiQuotes([...stockSymbols]),
    ])

    const indexNameMap = Object.fromEntries(
      B3_INDEX_SYMBOLS.map((i) => [i.symbol, i.name]),
    )

    const indices: MarketQuote[] = indicesRaw.map((q) => ({
      ...q,
      name: indexNameMap[q.symbol] ?? q.name,
    }))

    const stocks = stocksRaw.map((quote) => {
      const rec = STOCK_RECOMMENDATIONS.find((s) => s.symbol === quote.symbol)
      return {
        ...quote,
        name: rec?.name ?? quote.name,
        sector: rec?.sector ?? '',
        thesis: rec?.thesis ?? '',
        risk: rec?.risk ?? 'Médio',
        horizon: rec?.horizon ?? '',
      }
    })

    return NextResponse.json({
      indices,
      stocks,
      source: 'b3',
      updatedAt: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({
      indices: FALLBACK_INDICES,
      stocks: STOCK_RECOMMENDATIONS.map((s) => ({
        symbol: s.symbol,
        name: s.name,
        price: 0,
        changePercent: 0,
        sector: s.sector,
        thesis: s.thesis,
        risk: s.risk,
        horizon: s.horizon,
      })),
      source: 'fallback',
      updatedAt: new Date().toISOString(),
    })
  }
}
