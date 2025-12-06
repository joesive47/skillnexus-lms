import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { ErrorBoundary } from '@/components/error-boundary'
import UnifiedChatWidget from '@/components/chatbot/UnifiedChatWidget'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'SkillWorld Nexus - Global LMS Platform',
  description: 'ระบบจัดการการเรียนรู้ระดับโลกที่ทันสมัย',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.0/dist/tailwind.min.css" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            {children}
            <UnifiedChatWidget />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}