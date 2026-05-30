'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useIsMobile } from '@/components/ui/use-mobile'
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Lightbulb,
  Settings,
  Menu,
  X,
  Wallet,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: Receipt },
  { href: '/analytics', label: 'Análises', icon: PieChart },
  { href: '/insights', label: 'Insights', icon: Lightbulb },
]

const sidebarVariants = {
  open: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    x: '-100%',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
}

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const isMobile = useIsMobile()
  const sidebarState = isMobile ? (isMobileOpen ? 'open' : 'closed') : 'open'

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-xl border border-border bg-card p-3 shadow-lg lg:hidden"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={isMobile ? 'closed' : 'open'}
        animate={sidebarState}
        className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-sidebar lg:static lg:translate-x-0"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between border-b border-sidebar-border px-6 py-5"
          >
            <Link href="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary"
              >
                <Wallet className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <div>
                <span className="text-lg font-bold text-sidebar-foreground">FinanceFlow</span>
                <p className="text-xs text-muted-foreground">Gestão Financeira</p>
              </div>
            </Link>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <motion.div
                  key={item.href}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute right-3"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.div>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-sidebar-foreground">Dica Rápida</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Registre suas despesas diariamente para ter um controle mais preciso.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
