'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFinance } from '@/lib/finance-context'
import { getCategoriesByType, TransactionType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Plus, Minus, CalendarIcon } from 'lucide-react'

interface TransactionFormProps {
  isOpen: boolean
  onClose: () => void
}

export function TransactionForm({ isOpen, onClose }: TransactionFormProps) {
  const { addTransaction, categories } = useFinance()
  const [type, setType] = useState<TransactionType>('expense')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [value, setValue] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categoriesForType = getCategoriesByType(categories, type)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !category || !value || !date) return

    setIsSubmitting(true)
    
    // Simular um pequeno delay para feedback visual
    await new Promise(resolve => setTimeout(resolve, 300))
    
    await addTransaction({
      description,
      category,
      value: parseFloat(value),
      date,
      type,
    })

    // Reset form
    setDescription('')
    setCategory('')
    setValue('')
    setDate(new Date().toISOString().split('T')[0])
    setIsSubmitting(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold text-foreground"
              >
                Nova Transação
              </motion.h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tipo de Transação */}
              <div className="flex gap-2 rounded-xl bg-secondary p-1">
                <motion.button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors ${
                    type === 'expense'
                      ? 'bg-[#f472b6]/20 text-[#f472b6]'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <Minus className="h-4 w-4" />
                  Despesa
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors ${
                    type === 'income'
                      ? 'bg-[#34d399]/20 text-[#34d399]'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="h-4 w-4" />
                  Receita
                </motion.button>
              </div>

              {/* Descrição */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label htmlFor="description" className="text-sm text-muted-foreground">
                  Descrição
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex: Almoço no restaurante"
                  className="mt-1.5 border-border bg-secondary focus:border-primary focus:ring-primary"
                  required
                />
              </motion.div>

              {/* Categoria */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Label className="text-sm text-muted-foreground">Categoria</Label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {categoriesForType.map((cat, index) => (
                    <motion.button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center gap-1 rounded-xl p-2 text-xs transition-all ${
                        category === cat.name
                          ? 'ring-2'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                      style={{
                        backgroundColor: category === cat.name ? `${cat.color}20` : undefined,
                        borderColor: category === cat.name ? cat.color : undefined,
                        ringColor: category === cat.name ? cat.color : undefined,
                      }}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-muted-foreground">{cat.name}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Valor e Data */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="value" className="text-sm text-muted-foreground">
                    Valor (R$)
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    min="0"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="0,00"
                    className="mt-1.5 border-border bg-secondary focus:border-primary focus:ring-primary"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Label htmlFor="date" className="text-sm text-muted-foreground">
                    Data
                  </Label>
                  <div className="relative">
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="mt-1.5 border-border bg-secondary focus:border-primary focus:ring-primary"
                      required
                    />
                    <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </motion.div>
              </div>

              {/* Botão de Submit */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting || !description || !category || !value}
                  className={`w-full py-6 text-base font-semibold transition-all ${
                    type === 'income'
                      ? 'bg-[#34d399] hover:bg-[#34d399]/90'
                      : 'bg-[#f472b6] hover:bg-[#f472b6]/90'
                  }`}
                >
                  <motion.span
                    initial={false}
                    animate={isSubmitting ? { opacity: 0 } : { opacity: 1 }}
                  >
                    {type === 'income' ? 'Adicionar Receita' : 'Adicionar Despesa'}
                  </motion.span>
                  {isSubmitting && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
