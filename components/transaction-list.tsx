'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFinance } from '@/lib/finance-context'
import { getCategoryByName, Category, Transaction } from '@/lib/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash2, Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Input } from '@/components/ui/input'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
}

interface TransactionItemProps {
  transaction: Transaction
  onDelete: (id: string) => void
  categories: Category[]
}

function TransactionItem({ transaction, onDelete, categories }: TransactionItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const category = getCategoryByName(categories, transaction.category, transaction.type)
  
  return (
    <motion.div
      variants={itemVariants}
      layout
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
          className="flex h-12 w-12 items-center justify-center rounded-xl text-xl"
          style={{ backgroundColor: category ? `${category.color}20` : 'var(--secondary)' }}
        >
          {category?.icon || '📌'}
        </motion.div>
        
        <div>
          <p className="font-medium text-foreground">{transaction.description}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className="rounded-full px-2 py-0.5"
              style={{ backgroundColor: category ? `${category.color}20` : 'var(--secondary)', color: category?.color }}
            >
              {transaction.category}
            </span>
            <span>•</span>
            <span>{format(new Date(transaction.date), "d 'de' MMM", { locale: ptBR })}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <motion.div
          animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
          className="flex items-center gap-1"
        >
          {transaction.type === 'income' ? (
            <ArrowUpRight className="h-4 w-4 text-[#34d399]" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-[#f472b6]" />
          )}
          <span
            className={`text-lg font-bold ${
              transaction.type === 'income' ? 'text-[#34d399]' : 'text-[#f472b6]'
            }`}
          >
            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.value)}
          </span>
        </motion.div>

        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(transaction.id)}
              className="rounded-lg bg-destructive/10 p-2 text-destructive transition-colors hover:bg-destructive hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function TransactionList() {
  const { transactions, deleteTransaction, categories, isLoading } = useFinance()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  const filteredTransactions = transactions
    .filter(t => {
      if (filter !== 'all' && t.type !== filter) return false
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border border-border bg-card"
    >
      <div className="border-b border-border p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-foreground">Transações Recentes</h3>
          
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border-border bg-secondary pl-9 focus:border-primary"
              />
            </div>
            
            <div className="flex rounded-lg bg-secondary p-1">
              {(['all', 'income', 'expense'] as const).map(f => (
                <motion.button
                  key={f}
                  onClick={() => setFilter(f)}
                  whileTap={{ scale: 0.95 }}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    filter === f
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f === 'all' ? 'Todos' : f === 'income' ? 'Receitas' : 'Despesas'}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto p-4">
        {filteredTransactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-muted-foreground"
          >
            <Filter className="mb-4 h-12 w-12 opacity-50" />
            <p>Nenhuma transação encontrada</p>
          </motion.div>
        ) : (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredTransactions.map(transaction => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  categories={categories}
                  onDelete={deleteTransaction}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
