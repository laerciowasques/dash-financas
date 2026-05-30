'use client'

import { motion } from 'framer-motion'
import { Sidebar } from '@/components/sidebar'
import { OverviewChart, CashFlowChart, CategoryChart, TrendChart } from '@/components/charts'
import { FinanceProvider } from '@/lib/finance-context'

function AnalyticsContent() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                Análises
              </h1>
              <p className="mt-1 text-muted-foreground">
                Visualize seus dados financeiros em detalhes
              </p>
            </div>
          </motion.div>

          {/* Charts Grid */}
          <div className="grid gap-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <OverviewChart />
              <CashFlowChart />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <CategoryChart />
              <TrendChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <FinanceProvider>
      <AnalyticsContent />
    </FinanceProvider>
  )
}
