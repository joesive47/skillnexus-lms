'use client'

import { useState } from 'react'
import { ScormPlayer } from '@/components/scorm/scorm-player'
import { ChevronLeft, ChevronRight, Maximize, Minimize, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ScormFullscreenWrapperProps {
  packagePath: string
  lessonId: string
  userId: string
  courseId: string
  lessonTitle: string
  courseTitle: string
}

export function ScormFullscreenWrapper({
  packagePath,
  lessonId,
  userId,
  courseId,
  lessonTitle,
  courseTitle
}: ScormFullscreenWrapperProps) {
  const [isMenuHidden, setIsMenuHidden] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleMenu = () => setIsMenuHidden(!isMenuHidden)
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Sidebar Toggle Button - Always visible */}
      <button
        onClick={toggleMenu}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-lg shadow-lg transition-all"
        title={isMenuHidden ? 'แสดงเมนู' : 'ซ่อนเมนู'}
      >
        {isMenuHidden ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>

      {/* Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        className="fixed right-4 top-4 z-50 bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-lg shadow-lg transition-all"
        title={isFullscreen ? 'ออกจาก Fullscreen' : 'Fullscreen'}
      >
        {isFullscreen ? (
          <Minimize className="w-5 h-5" />
        ) : (
          <Maximize className="w-5 h-5" />
        )}
      </button>

      <div className="flex min-h-screen">
        {/* Sidebar/Header - Can be hidden */}
        <div
          className={`transition-all duration-300 ${
            isMenuHidden ? 'w-0 opacity-0 overflow-hidden' : 'w-full md:w-80 opacity-100'
          }`}
        >
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Link 
                href={`/courses/${courseId}`}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>กลับไปยังคอร์ส</span>
              </Link>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{lessonTitle}</h1>
              <p className="text-gray-600 mt-2">{courseTitle}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">💡 เคลับลับ</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• คลิกปุ่มด้านซ้ายเพื่อซ่อน/แสดงเมนู</li>
                <li>• คลิกปุ่มด้านขวาบนเพื่อเปิด Fullscreen</li>
                <li>• ความคืบหน้าจะถูกบันทึกอัตโนมัติ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SCORM Content - Full width when menu hidden */}
        <div
          className={`flex-1 transition-all duration-300 ${
            isMenuHidden ? 'w-full' : 'w-full md:w-[calc(100%-320px)]'
          }`}
        >
          <div className={isMenuHidden ? 'h-screen' : 'container mx-auto px-4 py-8'}>
            <ScormPlayer
              packagePath={packagePath}
              lessonId={lessonId}
              userId={userId}
              hideHeader={isMenuHidden}
              fullHeight={isMenuHidden}
              className={isMenuHidden ? 'h-screen border-0 rounded-none' : ''}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
