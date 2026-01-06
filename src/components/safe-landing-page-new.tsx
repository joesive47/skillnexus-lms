'use client'

import Link from 'next/link'
import { SafeWrapper } from '@/components/safe-wrapper'
import LiveStatsCounter from '@/components/marketing/live-stats-counter'
import SocialProof from '@/components/marketing/social-proof'
import TrustBadges from '@/components/marketing/trust-badges'
import CountdownTimer from '@/components/marketing/countdown-timer'
import PromoPopup from '@/components/marketing/promo-popup'
import VisitorCounter from '@/components/visitor-counter'
import dynamic from 'next/dynamic'

const UnifiedChatWidget = dynamic(() => import('@/components/chatbot/UnifiedChatWidget'), { ssr: false })

export default function SafeLandingPageNew() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header - New Layout */}
      <header className="relative z-30 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Left: Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                upPowerSkill
              </h1>
            </div>
            
            {/* Center: Visitor Counter */}
            <div className="flex justify-center">
              <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-xl px-6 py-3">
                <VisitorCounter />
              </div>
            </div>
            
            {/* Right: Login Buttons */}
            <div className="flex items-center justify-end space-x-3">
              <Link href="/login" className="bg-white/10 border border-white/30 text-white px-5 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 text-sm font-medium">
                เข้าสู่ระบบ
              </Link>
              <Link href="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg text-sm font-medium">
                เริ่มต้นเลย
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* System Status - Bottom Left */}
      <div className="fixed bottom-6 left-6 z-20">
        <div className="bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>System Online</span>
          </div>
        </div>
      </div>

      {/* Floating Widgets - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-20 flex flex-col gap-3">
        {/* Skill Assessment Button */}
        <Link
          href="/skills-assessment"
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          title="ทดสอบทักษะ"
        >
          <span className="text-xl">🎯</span>
        </Link>
      </div>

      {/* Chatbot Widget */}
      <UnifiedChatWidget />

      {/* Countdown Timer */}
      <SafeWrapper>
        <CountdownTimer endDate={new Date('2025-02-28')} />
      </SafeWrapper>

      {/* Hero Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-pulse-slow">
              upPowerSkill
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
              🚀 แพลตฟอร์มการเรียนรู้ที่ขับเคลื่อนด้วย AI ระดับองค์กร<br/>
              <span className="text-lg text-blue-300">พร้อมเทคโนโลยี Anti-Skip และระบบรักษาความปลอดภัยระดับ Enterprise</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-500">
            <Link href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg px-10 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl font-semibold">
              🎯 เข้าสู่ระบบ
            </Link>
            <Link href="/register" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg px-10 py-3 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-2xl font-semibold">
              🚀 สมัครสมาชิก
            </Link>
            <Link href="/skills-assessment" className="border-2 border-white/30 text-white text-lg px-10 py-3 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-semibold">
              📊 ทดสอบทักษะ
            </Link>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto animate-fade-in-up animation-delay-1000">
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-2xl p-6 backdrop-blur-sm hover:bg-blue-500/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl font-bold text-white mb-2">100K+</div>
              <div className="text-gray-300 text-sm">👥 ผู้เรียนทั่วโลก</div>
            </div>
            <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-6 backdrop-blur-sm hover:bg-green-500/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-gray-300 text-sm">📚 คอร์สคุณภาพ</div>
            </div>
            <div className="bg-purple-500/20 border border-purple-400/30 rounded-2xl p-6 backdrop-blur-sm hover:bg-purple-500/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-gray-300 text-sm">🎯 อัตราความสำเร็จ</div>
            </div>
            <div className="bg-cyan-500/20 border border-cyan-400/30 rounded-2xl p-6 backdrop-blur-sm hover:bg-cyan-500/30 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-300 text-sm">🤖 AI ช่วยเหลือ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ⚡ เครื่องมือที่ทรงพลัง
            </h2>
            <p className="text-xl text-gray-300">เทคโนโลยีล้ำสมัยสำหรับการเรียนรู้ยุคใหม่</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI ทดสอบทักษะ</h3>
              <p className="text-gray-300 leading-relaxed mb-4">วิเคราะห์ความสามารถด้วย AI และสร้างเส้นทางการเรียนรู้ที่เหมาะสม</p>
              <Link href="/skills-assessment" className="inline-block text-blue-400 hover:text-blue-300 transition-colors font-medium">
                เริ่มทดสอบ →
              </Link>
            </div>
            
            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-white text-2xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">คอร์สเรียน AI</h3>
              <p className="text-gray-300 leading-relaxed mb-4">เรียนรู้ทักษะใหม่ด้วยระบบ Anti-Skip และ AI Tutor ที่ช่วยเหลือตลอด 24/7</p>
              <Link href="/courses" className="inline-block text-green-400 hover:text-green-300 transition-colors font-medium">
                ดูคอร์ส →
              </Link>
            </div>
            
            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-white text-2xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">ใบรับรอง Blockchain</h3>
              <p className="text-gray-300 leading-relaxed mb-4">รับใบรับรองที่ยืนยันด้วย Blockchain และได้รับการยอมรับจากอุตสาหกรรม</p>
              <Link href="/certificates" className="inline-block text-purple-400 hover:text-purple-300 transition-colors font-medium">
                ดูใบรับรอง →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              🏢 Enterprise Ready
            </h2>
            <p className="text-xl text-gray-300">ระบบระดับองค์กรที่พร้อมใช้งานจริง</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="text-lg font-bold text-white mb-2">Security 95/100</h3>
              <p className="text-sm text-gray-300">MFA, AES-256, Audit Logging</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2">Ultra Fast</h3>
              <p className="text-sm text-gray-300">&lt;100ms, 100K+ users</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="text-lg font-bold text-white mb-2">Global CDN</h3>
              <p className="text-sm text-gray-300">99.99% uptime</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-3">📜</div>
              <h3 className="text-lg font-bold text-white mb-2">Compliance</h3>
              <p className="text-sm text-gray-300">GDPR, SOC 2, ISO 27001</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Counter */}
      <SafeWrapper>
        <LiveStatsCounter />
      </SafeWrapper>

      {/* Trust Badges */}
      <SafeWrapper>
        <TrustBadges />
      </SafeWrapper>

      {/* Newsletter Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl p-8 text-center backdrop-blur-sm">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-2xl font-bold text-white mb-4">รับข่าวสารล่าสุด</h3>
            <p className="text-gray-300 mb-6">
              สมัครรับข่าวสารและอัพเดทใหม่ๆ จาก SkillNexus
            </p>
            <Link 
              href="/register"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-pulse-slow">
            🚀 พร้อมเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            เข้าร่วมกับผู้คนหลายแสนคนที่กำลังสร้างอนาคตที่สดใสด้วย AI และเทคโนโลยีล้ำสมัย
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Link href="/login" className="bg-white text-purple-600 text-xl px-12 py-4 rounded-3xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl font-semibold">
              🎯 เข้าสู่ระบบ
            </Link>
            <Link href="/skills-assessment" className="border-2 border-white/30 text-white text-xl px-12 py-4 rounded-3xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-semibold">
              📊 ทดสอบทักษะฟรี
            </Link>
          </div>
          
          <p className="text-white/70 text-sm">
            ✅ ไม่มีค่าใช้จ่าย | ✅ ทดลองใช้ฟรี | ✅ ไม่ต้องใส่บัตรเครดิต
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <SafeWrapper>
        <SocialProof />
      </SafeWrapper>

      {/* Promo Popup */}
      <SafeWrapper>
        <PromoPopup />
      </SafeWrapper>
    </div>
  )
}
