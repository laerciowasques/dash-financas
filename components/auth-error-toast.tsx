'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { getAuthErrorMessage, readAuthErrorsFromHash } from '@/lib/auth-url-errors'

export function AuthErrorToast() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const queryCode = searchParams.get('erro') ?? searchParams.get('error_code')
    const queryDescription = searchParams.get('error_description')

    const hashErrors = readAuthErrorsFromHash()
    const code = queryCode ?? hashErrors.code
    const description = queryDescription ?? hashErrors.description

    if (!code && !description) return

    toast.error(getAuthErrorMessage(code, description))

    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }

    const cleanUrl = new URL(window.location.href)
    cleanUrl.searchParams.delete('error')
    cleanUrl.searchParams.delete('error_code')
    cleanUrl.searchParams.delete('error_description')
    cleanUrl.searchParams.delete('erro')
    router.replace(cleanUrl.pathname + cleanUrl.search)
  }, [searchParams, router])

  return null
}
