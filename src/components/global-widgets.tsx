'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const UnifiedChatWidget = dynamic(
  () => import('@/components/chatbot/UnifiedChatWidget').catch((err) => {
    console.error('Failed to load UnifiedChatWidget:', err)
    // Return a fallback component
    return { default: () => null }
  }),
  {
    ssr: false,
    loading: () => null
  }
)

const NotificationCenter = dynamic(
  () => import('@/components/notifications/notification-center').then(mod => ({ default: mod.NotificationCenter })),
  {
    ssr: false,
    loading: () => null
  }
)

export default function GlobalWidgets() {
  return (
    <>
      {/* Notification Center - Fixed Position Top Right */}
      <div className="fixed top-4 right-4 z-[9999]">
        <Suspense fallback={null}>
          <NotificationCenter />
        </Suspense>
      </div>

      {/* Skill Assessment Button - Fixed Position */}
      <Link
        href="/skills-assessment"
        className="fixed bottom-6 right-24 z-[9998] w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        title="ทดสอบทักษะ"
      >
        <span className="text-xl">🎯</span>
      </Link>

      {/* Chatbot Widget - Always visible */}
      <Suspense fallback={null}>
        <UnifiedChatWidget />
      </Suspense>
    </>
  )
}
