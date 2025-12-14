'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[ERROR]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Error Icon */}
        <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mb-8 mx-auto animate-pulse-slow shadow-2xl">
          <span className="text-white text-6xl">⚠️</span>
        </div>
        
        {/* Error Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
          อุ๊ปส์! เกิดข้อผิดพลาด
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
          ระบบพบปัญหาที่ไม่คาดคิด แต่อย่างกังวล! เราจะแก้ไขให้คุณ
        </p>
        
        {/* Error Details */}
        <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8 text-left animate-fade-in-up animation-delay-400">
          <h3 className="text-lg font-semibold text-white mb-3">🔍 รายละเอียดข้อผิดพลาด:</h3>
          <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm text-gray-300 break-all">
            {error.message || 'ไม่ทราบสาเหตุข้อผิดพลาด'}
          </div>
          {error.digest && (
            <p className="text-sm text-gray-400 mt-2">
              <strong>Digest:</strong> {error.digest}
            </p>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up animation-delay-600">
          <button 
            onClick={reset}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🔄 ลองใหม่อีกครั้ง
          </button>
          
          <Link 
            href="/"
            className="border-2 border-white/30 text-white px-8 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
          >
            🏠 กลับหน้าหลัก
          </Link>
        </div>
        
        {/* Help Section */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 animate-fade-in-up animation-delay-800">
          <h3 className="text-lg font-semibold text-white mb-4">🛠️ วิธีแก้ไขปัญหา:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <p className="font-semibold text-blue-300 mb-2">ตรวจสอบพื้นฐาน:</p>
              <ul className="space-y-1">
                <li>• การเชื่อมต่ออินเทอร์เน็ต</li>
                <li>• สถานะเซิร์ฟเวอร์</li>
                <li>• ฐานข้อมูล</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-green-300 mb-2">ลิงก์ที่มีประโยชน์:</p>
              <ul className="space-y-1">
                <li>• <Link href="/login" className="text-blue-400 hover:underline">เข้าสู่ระบบ</Link></li>
                <li>• <Link href="/skills-assessment" className="text-blue-400 hover:underline">ทดสอบทักษะ</Link></li>
                <li>• <Link href="/courses" className="text-blue-400 hover:underline">คอร์สเรียน</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mt-6 animate-fade-in-up animation-delay-1000">
          หากปัญหายังคงอยู่ กรุณาติดต่อทีมพัฒนาของเรา
        </p>
      </div>
    </div>
  )
}