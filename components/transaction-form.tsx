'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useFinance } from '@/lib/finance-context'
import { getCategoriesByType, TransactionType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Plus, Minus, CalendarIcon } from 'lucide-react'

interface TransactionFormProps {
  isOpen: boolean
  onClose: () => void
}

export function TransactionForm({ isOpen, onClose }: TransactionFormProps) {
  const { addTransaction, categories } = useFinance()
  const [type, setType] = useState<TransactionType>('expense')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [value, setValue] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categoriesForType = getCategoriesByType(categories, type)

  useEffect(() => {
    if (!isOpen) return

    const available = getCategoriesByType(categories, type)
    setCategoryId(current => {
      if (current && available.some(category => category.id === current)) {
        return current
      }
      return available[0]?.id ?? ''
    })
  }, [isOpen, type, categories])

  const handleTypeChange = (nextType: TransactionType) => {
    setType(nextType)
    setCategoryId('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const selectedCategory = categories.find(category => category.id === categoryId)

    if (!description || !selectedCategory || !value || !date) {
      toast.error('Preencha todos os campos e selecione uma categoria.')
      return
    }

    setIsSubmitting(true)

    try {
      await addTransaction({
        description,
        category: selectedCategory.name,
        value: parseFloat(value),
        date,
        type,
      })

      toast.success(
        type === 'income' ? 'Receita adicionada com sucesso!' : 'Despesa adicionada com sucesso!'
      )

      setDescription('')
      setCategoryId('')
      setValue('')
      setDate(new Date().toISOString().split('T')[0])
      onClose()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Não foi possível salvar a transação.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
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
              <h2 className="text-xl font-bold text-foreground">Nova Transação</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex gap-2 rounded-xl bg-secondary p-1">
                <button
                  type="button"
                  onClick={() => handleTypeChange('expense')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors ${
                    type === 'expense'
                      ? 'bg-[#f472b6]/20 text-[#f472b6]'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Minus className="h-4 w-4" />
                  Despesa
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('income')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors ${
                    type === 'income'
                      ? 'bg-[#34d399]/20 text-[#34d399]'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  Receita
                </button>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm text-muted-foreground">
                  Descrição
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex: Almoço no restaurante"
                  className="mt-1.5 border-border bg-secondary"
                  required
                />
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Categoria</Label>
                {categoriesForType.length === 0 ? (
                  <p className="mt-2 rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
                    Nenhuma categoria disponível. Verifique a conexão com o Supabase.
                  </p>
                ) : (
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="mt-1.5 w-full border-border bg-secondary">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesForType.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
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
                    className="mt-1.5 border-border bg-secondary"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date" className="text-sm text-muted-foreground">
                    Data
                  </Label>
                  <div className="relative">
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="mt-1.5 border-border bg-secondary"
                      required
                    />
                    <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !description ||
                  !categoryId ||
                  !value ||
                  categoriesForType.length === 0
                }
                className={`w-full py-6 text-base font-semibold ${
                  type === 'income'
                    ? 'bg-[#34d399] hover:bg-[#34d399]/90'
                    : 'bg-[#f472b6] hover:bg-[#f472b6]/90'
                }`}
              >
                {isSubmitting
                  ? 'Salvando...'
                  : type === 'income'
                    ? 'Adicionar Receita'
                    : 'Adicionar Despesa'}
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
