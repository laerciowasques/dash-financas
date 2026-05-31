import { Suspense } from 'react'
import { ResetPasswordForm } from '@/components/reset-password-form'
import { AuthPageShell } from '@/components/auth-page-shell'
import { AuthErrorToast } from '@/components/auth-error-toast'

export default function RedefinirSenhaPage() {
  return (
    <AuthPageShell>
      <Suspense fallback={null}>
        <AuthErrorToast />
      </Suspense>
      <ResetPasswordForm />
    </AuthPageShell>
  )
}
