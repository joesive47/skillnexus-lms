'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'

const UnifiedChatWidget = dynamic(() => import('@/components/chatbot/UnifiedChatWidget'), { ssr: false })

export default function GlobalWidgets() {
  return (
    <>
      {/* Floating Widgets - Bottom Right (Horizontal Layout) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-row-reverse gap-3 items-end">
        {/* Chatbot Widget will appear here */}
        
        {/* Skill Assessment Button */}
        <Link
          href="/skills-assessment"
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex-shrink-0"
          title="ทดสอบทักษะ"
        >
          <span className="text-xl">🎯</span>
        </Link>
      </div>

      {/* Chatbot Widget */}
      <UnifiedChatWidget />
    </>
  )
}
