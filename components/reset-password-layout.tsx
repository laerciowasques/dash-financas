'use client'

import { motion } from 'framer-motion'
import {
  ArrowLeft,
  KeyRound,
  Lock,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import Link from 'next/link'

type Step = 'validar' | 'criar' | 'concluido'

const steps: { id: Step; label: string }[] = [
  { id: 'validar', label: 'Validar link' },
  { id: 'criar', label: 'Nova senha' },
  { id: 'concluido', label: 'Concluído' },
]

type ResetPasswordLayoutProps = {
  step: Step
  children: React.ReactNode
}

export function ResetPasswordLayout({ step, children }: ResetPasswordLayoutProps) {
  const stepIndex = steps.findIndex((s) => s.id === step)

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-primary/15 blur-[100px]" />
        <div className="absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <aside className="relative hidden w-[42%] max-w-xl flex-col justify-between border-r border-border/60 bg-card/30 p-10 backdrop-blur-sm lg:flex xl:p-12">
        <div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao login
          </Link>

          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-12"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Área segura
            </div>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground">
              Redefina sua chave de acesso ao cofre financeiro
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Uma nova senha protege suas receitas, despesas e metas. O processo leva menos de um
              minuto.
            </p>
          </motion.div>
        </div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="space-y-4"
        >
          {[
            {
              icon: ShieldCheck,
              title: 'Criptografia de ponta',
              desc: 'Senhas gerenciadas pelo Supabase Auth',
            },
            {
              icon: TrendingUp,
              title: 'Ambiente isolado',
              desc: 'Seus dados não se misturam com outros usuários',
            },
            {
              icon: Wallet,
              title: 'Dash Finanças',
              desc: 'Volte ao painel assim que confirmar a senha',
            },
          ].map((item, i) => (
            <li
              key={item.title}
              className="flex gap-3 rounded-xl border border-border/50 bg-background/40 p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </li>
          ))}
        </motion.ul>

        <div className="flex gap-2">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                i <= stepIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </aside>

      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8">
        <Link
          href="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao login
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-2xl shadow-primary/5 backdrop-blur-md">
            <div className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-transparent to-emerald-500/10 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={
                    step === 'validar'
                      ? { scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }
                      : { scale: 1 }
                  }
                  transition={
                    step === 'validar'
                      ? { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
                      : {}
                  }
                  className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30"
                >
                  {step === 'concluido' ? (
                    <ShieldCheck className="h-7 w-7 text-primary-foreground" />
                  ) : step === 'criar' ? (
                    <KeyRound className="h-7 w-7 text-primary-foreground" />
                  ) : (
                    <Lock className="h-7 w-7 text-primary-foreground" />
                  )}
                  {step === 'validar' && (
                    <span className="absolute -inset-1 animate-ping rounded-2xl border border-primary/40 opacity-40" />
                  )}
                </motion.div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">
                    Recuperação de conta
                  </p>
                  <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                    {step === 'validar' && 'Validando seu link'}
                    {step === 'criar' && 'Crie sua nova senha'}
                    {step === 'concluido' && 'Senha atualizada!'}
                  </h1>
                </div>
              </div>

              <div className="mt-4 flex gap-2 lg:hidden">
                {steps.map((s, i) => (
                  <span
                    key={s.id}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                      i <= stepIndex
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-8">{children}</div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
