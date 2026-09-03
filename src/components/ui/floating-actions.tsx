'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* Quick Actions */}
      <div className="flex flex-col gap-3">
        {/* Skills Assessment */}
        <Link
          href="/skills-assessment"
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
          title="ทดสอบทักษะ"
        >
          <span className="text-xl">🎯</span>
          <div className="absolute right-16 bg-black/80 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            ทดสอบทักษะ
          </div>
        </Link>

        {/* Login */}
        <Link
          href="/login"
          className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
          title="เข้าสู่ระบบ"
        >
          <span className="text-xl">🔐</span>
          <div className="absolute right-16 bg-black/80 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            เข้าสู่ระบบ
          </div>
        </Link>

        {/* Live Chat */}
        <button
          className="w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group animate-pulse-slow"
          title="แชทสด"
          onClick={() => {
            // Add chat functionality here
            alert('🤖 AI Assistant จะเปิดใช้งานเร็วๆ นี้!')
          }}
        >
          <span className="text-xl">💬</span>
          <div className="absolute right-16 bg-black/80 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            แชทสด AI
          </div>
        </button>
      </div>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-14 h-14 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-fade-in-up"
          title="กลับขึ้นด้านบน"
        >
          <span className="text-xl">⬆️</span>
        </button>
      )}
    </div>
  )
}