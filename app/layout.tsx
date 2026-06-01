import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { AppFooter } from '@/components/app-footer'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Dash Finanças - Gestão Financeira',
  description: 'Dashboard financeiro com Next.js, Supabase e Vercel',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        <AppFooter />
        <Toaster richColors position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
