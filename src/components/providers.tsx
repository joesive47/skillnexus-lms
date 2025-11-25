'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { initializeDebugUtils } from '@/lib/debug-utils'
import { initGlobalErrorFix } from '@/lib/global-error-fix'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize global error fix first for maximum safety
    initGlobalErrorFix()
    
    // Initialize debug utilities on client side
    initializeDebugUtils()
  }, [])

  return (
    <SessionProvider>
      {children}
      <Toaster richColors position="top-right" />
      <ChatbotWidget />
    </SessionProvider>
  )
}