import { Suspense } from 'react'
import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      >
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-2xl bg-card" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
