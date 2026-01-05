'use client'

import Link from 'next/link'
import { Suspense } from 'react'

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 p-6">
        <div className="container mx-auto flex justify-center items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              upPowerSkill
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            upPowerSkill
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed">
            🚀 แพลตฟอร์มการเรียนรู้ที่ขับเคลื่อนด้วย AI ระดับองค์กร<br/>
            <span className="text-lg text-blue-300">พร้อมเทคโนโลยี Anti-Skip และระบบรักษาความปลอดภัยระดับ Enterprise</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl px-12 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              🎯 เข้าสู่ระบบ
            </Link>
            <Link href="/register" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xl px-12 py-4 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              🚀 เริ่มต้นเลย
            </Link>
            <Link href="/skills-assessment" className="border-2 border-white/30 text-white text-xl px-12 py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              📊 ทดสอบทักษะ
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-24 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ⚡ เครื่องมือที่ทรงพลัง
            </h2>
            <p className="text-xl text-gray-300">เทคโนโลยีล้ำสมัยสำหรับการเรียนรู้ยุคใหม่</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI ทดสอบทักษะ</h3>
              <p className="text-gray-300 leading-relaxed">วิเคราะห์ความสามารถด้วย AI และสร้างเส้นทางการเรียนรู้ที่เหมาะสม</p>
              <Link href="/skills-assessment" className="inline-block mt-4 text-blue-400 hover:text-blue-300 transition-colors">
                เริ่มทดสอบ →
              </Link>
            </div>
            
            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-white text-2xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">คอร์สเรียน AI</h3>
              <p className="text-gray-300 leading-relaxed">เรียนรู้ทักษะใหม่ด้วยระบบ Anti-Skip และ AI Tutor ที่ช่วยเหลือตลอด 24/7</p>
              <Link href="/courses" className="inline-block mt-4 text-green-400 hover:text-green-300 transition-colors">
                ดูคอร์ส →
              </Link>
            </div>
            
            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/20 transition-all duration-500">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-white text-2xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">ใบรับรอง Blockchain</h3>
              <p className="text-gray-300 leading-relaxed">รับใบรับรองที่ยืนยันด้วย Blockchain และได้รับการยอมรับจากอุตสาหกรรม</p>
              <Link href="/certificates" className="inline-block mt-4 text-purple-400 hover:text-purple-300 transition-colors">
                ดูใบรับรอง →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            🚀 พร้อมเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            เข้าร่วมกับผู้คนหลายแสนคนที่กำลังสร้างอนาคตที่สดใสด้วย AI และเทคโนโลยีล้ำสมัย
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/login" className="bg-white text-purple-600 text-xl px-12 py-4 rounded-3xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl font-semibold">
              🎯 เข้าสู่ระบบ
            </Link>
            <Link href="/skills-assessment" className="border-2 border-white/30 text-white text-xl px-12 py-4 rounded-3xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-semibold">
              📊 ทดสอบทักษะฟรี
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
