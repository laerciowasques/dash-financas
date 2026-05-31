import { Suspense } from 'react'
import { LoginForm } from '@/components/login-form'
import { AuthPageShell } from '@/components/auth-page-shell'
import { AuthErrorToast } from '@/components/auth-error-toast'

export default function LoginPage() {
  return (
    <AuthPageShell>
      <Suspense fallback={null}>
        <AuthErrorToast />
      </Suspense>
      <LoginForm />
    </AuthPageShell>
  )
}
