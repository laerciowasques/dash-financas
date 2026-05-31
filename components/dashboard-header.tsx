'use client'

import { LogoutButton } from '@/components/logout-button'

type DashboardHeaderProps = {
  title: string
  subtitle?: string
  userEmail?: string | null
}

export function DashboardHeader({ title, subtitle, userEmail }: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="ml-12 lg:ml-0">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
        {userEmail && (
          <p className="mt-2 text-xs text-muted-foreground">
            Ambiente individual: <span className="text-foreground">{userEmail}</span>
          </p>
        )}
      </div>
      <div className="flex shrink-0 justify-end lg:justify-start">
        <LogoutButton variant="header" />
      </div>
    </div>
  )
}
