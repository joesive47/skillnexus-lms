'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const UnifiedChatWidget = dynamic(() => import('@/components/chatbot/UnifiedChatWidget'), { 
  ssr: false,
  loading: () => null
})

export default function GlobalWidgets() {
  return (
    <>
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
