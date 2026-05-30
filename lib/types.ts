export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  description: string
  category: string
  value: number
  date: string
  type: TransactionType
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
  type: TransactionType
}

export function getCategoryByName(
  categories: Category[],
  name: string,
  type: TransactionType
): Category | undefined {
  return categories.find(c => c.name === name && c.type === type)
}

export function getCategoriesByType(
  categories: Category[],
  type: TransactionType
): Category[] {
  return categories.filter(c => c.type === type)
}
