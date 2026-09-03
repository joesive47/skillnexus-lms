'use client'

import { useState } from 'react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubscribed(true)
    setIsSubmitting(false)
    setEmail('')
    
    // Reset after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  if (isSubscribed) {
    return (
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-8 text-center animate-fade-in-up">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-white mb-2">ขอบคุณที่สมัครสมาชิก!</h3>
        <p className="text-green-300">เราจะส่งข่าวสารและอัพเดทใหม่ๆ ให้คุณทราบ</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl p-8 text-center">
      <div className="text-4xl mb-4">📧</div>
      <h3 className="text-2xl font-bold text-white mb-4">รับข่าวสารล่าสุด</h3>
      <p className="text-gray-300 mb-6">
        สมัครรับข่าวสารและอัพเดทใหม่ๆ จาก SkillNexus<br/>
        รวมถึงคอร์สใหม่ และเทคนิคการเรียนรู้
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="กรอกอีเมลของคุณ"
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              กำลังสมัคร...
            </div>
          ) : (
            'สมัครเลย'
          )}
        </button>
      </form>
      
      <p className="text-xs text-gray-400 mt-4">
        เราจะไม่ส่งสแปมหรือแชร์อีเมลของคุณกับบุคคลที่สาม
      </p>
    </div>
  )
}