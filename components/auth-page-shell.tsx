import { Suspense } from 'react'

export function AuthPageShell({
  children,
  fallbackHeight = 'h-96',
}: {
  children: React.ReactNode
  fallbackHeight?: string
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
      </div>
      <Suspense
        fallback={
          <div className={`${fallbackHeight} w-full max-w-md animate-pulse rounded-2xl bg-card`} />
        }
      >
        {children}
      </Suspense>
    </div>
  )
}
