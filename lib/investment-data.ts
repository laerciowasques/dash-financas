export interface MarketQuote {
  symbol: string
  name: string
  price: number
  changePercent: number
}

export interface StockRecommendation {
  symbol: string
  name: string
  sector: string
  thesis: string
  risk: 'Baixo' | 'Médio' | 'Alto'
  horizon: string
}

export interface CategoryRecommendation {
  category: 'FI' | 'Ações' | 'ETFs'
  title: string
  description: string
  picks: { symbol: string; name: string; reason: string }[]
  allocation: string
}

export interface FixedIncomeProduct {
  name: string
  type: string
  yield: string
  liquidity: string
  risk: 'Baixo' | 'Médio'
  minInvestment: number
  recommendation: string
}

export interface CryptoRecommendation {
  id: string
  symbol: string
  name: string
  thesis: string
  risk: 'Baixo' | 'Médio' | 'Alto'
  allocation: string
}

export const B3_INDEX_SYMBOLS = [
  { symbol: '^BVSP', name: 'Ibovespa' },
  { symbol: '^IFIX', name: 'IFIX' },
  { symbol: '^SMLL', name: 'Small Caps' },
  { symbol: '^IDIV', name: 'IDIV' },
  { symbol: '^ICON', name: 'Consumo' },
  { symbol: '^IFNC', name: 'Financeiro' },
  { symbol: '^IMAT', name: 'Materiais Básicos' },
  { symbol: '^UTIL', name: 'Utilidade Pública' },
  { symbol: '^IBXX', name: 'IBrX-50' },
  { symbol: '^ITAG', name: 'Tag Along' },
] as const

export const FALLBACK_INDICES: MarketQuote[] = [
  { symbol: '^BVSP', name: 'Ibovespa', price: 128450, changePercent: 0.82 },
  { symbol: '^IFIX', name: 'IFIX', price: 3421.5, changePercent: 0.35 },
  { symbol: '^SMLL', name: 'Small Caps', price: 2187.3, changePercent: -0.41 },
  { symbol: '^IDIV', name: 'IDIV', price: 8542.1, changePercent: 0.67 },
  { symbol: '^ICON', name: 'Consumo', price: 4123.8, changePercent: 0.22 },
  { symbol: '^IFNC', name: 'Financeiro', price: 6234.5, changePercent: 1.12 },
  { symbol: '^IMAT', name: 'Materiais Básicos', price: 3891.2, changePercent: -0.18 },
  { symbol: '^UTIL', name: 'Utilidade Pública', price: 9456.7, changePercent: 0.45 },
  { symbol: '^IBXX', name: 'IBrX-50', price: 18234.9, changePercent: 0.73 },
  { symbol: '^ITAG', name: 'Tag Along', price: 12456.3, changePercent: 0.55 },
]

export const STOCK_RECOMMENDATIONS: StockRecommendation[] = [
  {
    symbol: 'WEGE3',
    name: 'WEG',
    sector: 'Industrial',
    thesis: 'Líder global em motores elétricos com margens sólidas e forte presença internacional. Ideal para carteira de longo prazo.',
    risk: 'Médio',
    horizon: 'Longo prazo (5+ anos)',
  },
  {
    symbol: 'ITUB4',
    name: 'Itaú Unibanco',
    sector: 'Financeiro',
    thesis: 'Maior banco privado do Brasil, dividendos consistentes e resiliência em ciclos econômicos. Referência em governança.',
    risk: 'Médio',
    horizon: 'Médio/Longo prazo',
  },
  {
    symbol: 'BBSE3',
    name: 'BB Seguridade',
    sector: 'Seguros',
    thesis: 'Modelo asset-light com alto payout de dividendos. Baixa necessidade de capital e receita recorrente.',
    risk: 'Baixo',
    horizon: 'Renda passiva',
  },
]

export const CATEGORY_RECOMMENDATIONS: CategoryRecommendation[] = [
  {
    category: 'FI',
    title: 'Fundos Imobiliários (FIIs)',
    description: 'Renda passiva mensal via aluguéis de imóveis comerciais e logísticos. Diversificação com baixo ticket.',
    allocation: '15–25% da carteira',
    picks: [
      { symbol: 'MXRF11', name: 'Maxi Renda', reason: 'Diversificado, alta liquidez e histórico de distribuições' },
      { symbol: 'HGLG11', name: 'CSHG Logística', reason: 'Exposição a galpões logísticos — setor em expansão' },
      { symbol: 'XPML11', name: 'XP Malls', reason: 'Shoppings premium com boa taxa de ocupação' },
    ],
  },
  {
    category: 'Ações',
    title: 'Ações Brasileiras',
    description: 'Participação em empresas listadas na B3. Maior potencial de valorização no longo prazo.',
    allocation: '40–60% da carteira',
    picks: [
      { symbol: 'PETR4', name: 'Petrobras', reason: 'Dividendos elevados e geração robusta de caixa' },
      { symbol: 'VALE3', name: 'Vale', reason: 'Exposição global a commodities e balanço sólido' },
      { symbol: 'WEGE3', name: 'WEG', reason: 'Crescimento consistente e qualidade operacional' },
    ],
  },
  {
    category: 'ETFs',
    title: 'ETFs (Fundos de Índice)',
    description: 'Diversificação instantânea com baixo custo. Ideal para iniciantes e aportes regulares.',
    allocation: '20–35% da carteira',
    picks: [
      { symbol: 'BOVA11', name: 'iShares Ibovespa', reason: 'Replica o Ibovespa com taxa baixa' },
      { symbol: 'IVVB11', name: 'iShares S&P 500', reason: 'Exposição ao mercado americano em reais' },
      { symbol: 'HASH11', name: 'Hashdex Nasdaq Crypto', reason: 'Exposição diversificada a cripto via ETF regulado' },
    ],
  },
]

export const FIXED_INCOME_PRODUCTS: FixedIncomeProduct[] = [
  {
    name: 'Tesouro Selic',
    type: 'Título Público',
    yield: 'Selic + 0,05% a.a.',
    liquidity: 'D+1',
    risk: 'Baixo',
    minInvestment: 30,
    recommendation: 'Reserva de emergência e objetivos de curto prazo. Liquidez diária e segurança máxima.',
  },
  {
    name: 'Tesouro IPCA+ 2035',
    type: 'Título Público',
    yield: 'IPCA + 6,2% a.a.',
    liquidity: 'Mercado secundário',
    risk: 'Baixo',
    minInvestment: 30,
    recommendation: 'Proteção contra inflação para aposentadoria e metas de 10+ anos.',
  },
  {
    name: 'CDB 120% CDI',
    type: 'CDB Bancário',
    yield: '120% do CDI',
    liquidity: 'No vencimento (2 anos)',
    risk: 'Baixo',
    minInvestment: 1000,
    recommendation: 'Rentabilidade acima da poupança com proteção FGC até R$ 250 mil.',
  },
  {
    name: 'LCI/LCA 95% CDI',
    type: 'Crédito Imobiliário/Agrícola',
    yield: '95% do CDI (isento IR)',
    liquidity: '90 dias',
    risk: 'Baixo',
    minInvestment: 5000,
    recommendation: 'Isenção de IR compensa taxa menor. Boa opção para médio prazo.',
  },
  {
    name: 'Debêntures Incentivadas',
    type: 'Crédito Corporativo',
    yield: 'IPCA + 7,5% a.a.',
    liquidity: 'Mercado secundário',
    risk: 'Médio',
    minInvestment: 1000,
    recommendation: 'Infraestrutura com isenção de IR. Avalie rating do emissor.',
  },
  {
    name: 'CRI/CRA',
    type: 'Recebíveis',
    yield: 'CDI + 1,5% a.a.',
    liquidity: 'No vencimento',
    risk: 'Médio',
    minInvestment: 1000,
    recommendation: 'Diversificação fora do sistema bancário. Preferir emissores AAA.',
  },
]

export const CRYPTO_IDS = [
  'bitcoin',
  'ethereum',
  'solana',
  'binancecoin',
  'ripple',
  'cardano',
  'avalanche-2',
  'chainlink',
  'polkadot',
  'litecoin',
] as const

export const FALLBACK_CRYPTO: MarketQuote[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 542000, changePercent: 2.1 },
  { symbol: 'ETH', name: 'Ethereum', price: 16800, changePercent: 1.8 },
  { symbol: 'SOL', name: 'Solana', price: 980, changePercent: 3.4 },
  { symbol: 'BNB', name: 'BNB', price: 3200, changePercent: 0.9 },
  { symbol: 'XRP', name: 'XRP', price: 3.45, changePercent: -0.5 },
  { symbol: 'ADA', name: 'Cardano', price: 2.85, changePercent: 1.2 },
  { symbol: 'AVAX', name: 'Avalanche', price: 185, changePercent: 2.7 },
  { symbol: 'LINK', name: 'Chainlink', price: 92, changePercent: 1.5 },
  { symbol: 'DOT', name: 'Polkadot', price: 28, changePercent: -1.1 },
  { symbol: 'LTC', name: 'Litecoin', price: 520, changePercent: 0.6 },
]

export const CRYPTO_RECOMMENDATIONS: CryptoRecommendation[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    thesis: 'Reserva de valor digital — "ouro digital". Alocação base para diversificação cripto (50–60% do bucket).',
    risk: 'Alto',
    allocation: '3–5% da carteira total',
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    thesis: 'Principal plataforma de smart contracts e DeFi. Segunda maior posição recomendada (20–30% do bucket).',
    risk: 'Alto',
    allocation: '1–2% da carteira total',
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    thesis: 'Alta performance para dApps e NFTs. Posição satélite para crescimento — limitar a 5–10% do bucket cripto.',
    risk: 'Alto',
    allocation: '0,5–1% da carteira total',
  },
]
