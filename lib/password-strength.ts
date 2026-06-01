export type PasswordStrength = 'empty' | 'weak' | 'fair' | 'good' | 'strong'

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return 'empty'
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return 'weak'
  if (score === 2) return 'fair'
  if (score === 3) return 'good'
  return 'strong'
}

export const strengthMeta: Record<
  Exclude<PasswordStrength, 'empty'>,
  { label: string; percent: number; barClass: string; textClass: string }
> = {
  weak: {
    label: 'Fraca',
    percent: 25,
    barClass: 'bg-red-500',
    textClass: 'text-red-400',
  },
  fair: {
    label: 'Razoável',
    percent: 50,
    barClass: 'bg-amber-500',
    textClass: 'text-amber-400',
  },
  good: {
    label: 'Boa',
    percent: 75,
    barClass: 'bg-emerald-500',
    textClass: 'text-emerald-400',
  },
  strong: {
    label: 'Forte',
    percent: 100,
    barClass: 'bg-primary',
    textClass: 'text-primary',
  },
}
