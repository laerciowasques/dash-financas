'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Transaction, TransactionType, Category } from './types'

interface FinanceContextType {
  transactions: Transaction[]
  categories: Category[]
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>
  totalIncome: number
  totalExpenses: number
  balance: number
  isLoading: boolean
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

type DbTransaction = {
  id: string
  description: string
  value: number
  date: string
  type: TransactionType
  categories: { name: string } | null
}

function mapTransaction(row: DbTransaction): Transaction {
  return {
    id: row.id,
    description: row.description,
    category: row.categories?.name ?? 'Outros',
    value: Number(row.value),
    date: row.date,
    type: row.type,
  }
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    setIsLoading(true)

    const [categoriesResult, transactionsResult] = await Promise.all([
      supabase.from('categories').select('id, name, color, icon, type').order('name'),
      supabase
        .from('transactions')
        .select('id, description, value, date, type, categories(name)')
        .order('date', { ascending: false }),
    ])

    if (categoriesResult.error) {
      console.error('Erro ao carregar categorias:', categoriesResult.error.message)
    } else {
      setCategories(categoriesResult.data as Category[])
    }

    if (transactionsResult.error) {
      console.error('Erro ao carregar transações:', transactionsResult.error.message)
    } else {
      setTransactions((transactionsResult.data as DbTransaction[]).map(mapTransaction))
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const addTransaction = useCallback(
    async (transaction: Omit<Transaction, 'id'>) => {
      const category = categories.find(
        c => c.name === transaction.category && c.type === transaction.type
      )

      if (!category) {
        throw new Error('Categoria não encontrada')
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          description: transaction.description,
          category_id: category.id,
          value: transaction.value,
          date: transaction.date,
          type: transaction.type,
        })
        .select('id, description, value, date, type, categories(name)')
        .single()

      if (error) throw error

      setTransactions(prev => [mapTransaction(data as DbTransaction), ...prev])
    },
    [categories]
  )

  const deleteTransaction = useCallback(async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) throw error
    setTransactions(prev => prev.filter(t => t.id !== id))
  }, [])

  const updateTransaction = useCallback(
    async (id: string, updates: Partial<Transaction>) => {
      const payload: Record<string, unknown> = {}

      if (updates.description !== undefined) payload.description = updates.description
      if (updates.value !== undefined) payload.value = updates.value
      if (updates.date !== undefined) payload.date = updates.date
      if (updates.type !== undefined) payload.type = updates.type

      if (updates.category !== undefined || updates.type !== undefined) {
        const type = updates.type ?? transactions.find(t => t.id === id)?.type
        const categoryName =
          updates.category ?? transactions.find(t => t.id === id)?.category
        const category = categories.find(c => c.name === categoryName && c.type === type)

        if (!category) throw new Error('Categoria não encontrada')
        payload.category_id = category.id
      }

      const { data, error } = await supabase
        .from('transactions')
        .update(payload)
        .eq('id', id)
        .select('id, description, value, date, type, categories(name)')
        .single()

      if (error) throw error

      setTransactions(prev =>
        prev.map(t => (t.id === id ? mapTransaction(data as DbTransaction) : t))
      )
    },
    [categories, transactions]
  )

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.value, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.value, 0)

  const balance = totalIncome - totalExpenses

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        totalIncome,
        totalExpenses,
        balance,
        isLoading,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}
