import { NextResponse } from 'next/server'
import {
  CRYPTO_IDS,
  CRYPTO_RECOMMENDATIONS,
  FALLBACK_CRYPTO,
  type MarketQuote,
} from '@/lib/investment-data'

export const dynamic = 'force-dynamic'
export const revalidate = 120

export async function GET() {
  try {
    const ids = CRYPTO_IDS.join(',')
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=brl&include_24hr_change=true`
    const res = await fetch(url, { next: { revalidate: 120 } })
    if (!res.ok) throw new Error('CoinGecko API error')

    const data = await res.json()

    const nameMap: Record<string, { symbol: string; name: string }> = {
      bitcoin: { symbol: 'BTC', name: 'Bitcoin' },
      ethereum: { symbol: 'ETH', name: 'Ethereum' },
      solana: { symbol: 'SOL', name: 'Solana' },
      binancecoin: { symbol: 'BNB', name: 'BNB' },
      ripple: { symbol: 'XRP', name: 'XRP' },
      cardano: { symbol: 'ADA', name: 'Cardano' },
      'avalanche-2': { symbol: 'AVAX', name: 'Avalanche' },
      chainlink: { symbol: 'LINK', name: 'Chainlink' },
      polkadot: { symbol: 'DOT', name: 'Polkadot' },
      litecoin: { symbol: 'LTC', name: 'Litecoin' },
    }

    const coins: MarketQuote[] = CRYPTO_IDS.map((id) => {
      const info = nameMap[id]
      const entry = data[id]
      return {
        symbol: info.symbol,
        name: info.name,
        price: entry?.brl ?? 0,
        changePercent: entry?.brl_24h_change ?? 0,
      }
    })

    return NextResponse.json({
      coins,
      recommendations: CRYPTO_RECOMMENDATIONS,
      source: 'coingecko',
      updatedAt: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({
      coins: FALLBACK_CRYPTO,
      recommendations: CRYPTO_RECOMMENDATIONS,
      source: 'fallback',
      updatedAt: new Date().toISOString(),
    })
  }
}
