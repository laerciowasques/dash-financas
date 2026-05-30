'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from '@/components/sidebar'
import { SummaryCards } from '@/components/summary-cards'
import { TransactionList } from '@/components/transaction-list'
import { TransactionForm } from '@/components/transaction-form'
import { OverviewChart, CashFlowChart } from '@/components/charts'
import { FinancialInsights } from '@/components/financial-insights'
import { FinanceProvider } from '@/lib/finance-context'
import { Plus } from 'lucide-react'

function DashboardContent() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                Dashboard Financeiro
              </h1>
              <p className="mt-1 text-muted-foreground">
                Acompanhe suas finanças em tempo real
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFormOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30"
            >
              <Plus className="h-5 w-5" />
              Nova Transação
            </motion.button>
          </motion.div>

          {/* Summary Cards */}
          <div className="mb-8">
            <SummaryCards />
          </div>

          {/* Charts Grid */}
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <OverviewChart />
            <CashFlowChart />
          </div>

          {/* Transactions and Insights */}
          <div className="grid gap-6 lg:grid-cols-2">
            <TransactionList />
            <FinancialInsights />
          </div>
        </div>
      </main>

      <TransactionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  )
}

export default function Dashboard() {
  return (
    <FinanceProvider>
      <DashboardContent />
    </FinanceProvider>
  )
}
