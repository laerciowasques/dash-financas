export function formatCurrency(value: number, decimals = 2) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatPercent(value: number) {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function riskColor(risk: string) {
  if (risk === 'Baixo') return '#34d399'
  if (risk === 'Médio') return '#fbbf24'
  return '#ef4444'
}
