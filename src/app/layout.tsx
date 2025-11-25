import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { ErrorBoundary } from '@/components/error-boundary'
import { ChatWidget } from '@/components/chatbot/ChatWidget'
import AIVirtualAssistant from '@/components/ai/AIVirtualAssistant'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            {children}
            <ChatWidget />
            <AIVirtualAssistant />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}