import { Suspense } from 'react'
import { ResetPasswordForm } from '@/components/reset-password-form'
import { AuthErrorToast } from '@/components/auth-error-toast'

export default function RedefinirSenhaPage() {
  return (
    <>
      <Suspense fallback={null}>
        <AuthErrorToast />
      </Suspense>
      <ResetPasswordForm />
    </>
  )
}
