'use client'

import { useState, useEffect, useRef } from 'react'
import { ScormPlayer } from '@/components/scorm/scorm-player'
import { Menu, X, Maximize, Minimize, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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
  // Initialize from localStorage (default: desktop=show, mobile=hide)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const fullscreenRef = useRef<HTMLDivElement>(null)

  // Detect mobile & restore sidebar state from localStorage
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      
      // On mount, restore from localStorage or use default
      const stored = localStorage.getItem('scorm-sidebar-collapsed')
      if (stored !== null) {
        setIsSidebarCollapsed(stored === 'true')
      } else {
        // Default: mobile=collapsed, desktop=expanded
        setIsSidebarCollapsed(mobile)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('scorm-sidebar-collapsed', String(isSidebarCollapsed))
  }, [isSidebarCollapsed])

  // Fullscreen change listener (ESC key support + auto-hide sidebar)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement
      setIsFullscreen(isNowFullscreen)
      
      // Auto-hide sidebar when entering fullscreen
      if (isNowFullscreen) {
        setIsSidebarCollapsed(true)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed)
  
  const toggleFullscreen = async () => {
    if (!fullscreenRef.current) return

    try {
      if (!document.fullscreenElement) {
        await fullscreenRef.current.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
    }
  }

  // Close sidebar on backdrop click (mobile only)
  const handleBackdropClick = () => {
    if (isMobile && !isSidebarCollapsed) {
      setIsSidebarCollapsed(true)
    }
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && !isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={handleBackdropClick}
          aria-label="Close sidebar"
        />
      )}

      {/* Main Container - Fullscreen support */}
      <div ref={fullscreenRef} className={`relative flex h-screen overflow-hidden ${isFullscreen ? 'bg-black' : 'bg-gray-50'}`}>
        
        {/* Toggle Sidebar Button - Hide in fullscreen */}
        {!isFullscreen && (
          <button
            onClick={toggleSidebar}
            className={`fixed top-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg shadow-lg transition-all duration-300 ${
              isSidebarCollapsed ? 'left-4' : 'left-[304px] md:left-[324px]'
            }`}
            title={isSidebarCollapsed ? 'แสดงเมนู' : 'ซ่อนเมนู'}
            aria-label={isSidebarCollapsed ? 'แสดงเมนู' : 'ซ่อนเมนู'}
          >
            {isSidebarCollapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Sidebar - Drawer on mobile, Fixed on desktop */}
        <aside
          className={`
            fixed md:relative inset-y-0 left-0 z-40
            w-80 max-w-[85vw] bg-white border-r border-gray-200
            transform transition-transform duration-300 ease-in-out
            overflow-y-auto
            ${isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}
          `}
        >
          <div className="p-6 space-y-6">
            {/* Back to Course */}
            {!isFullscreen && (
              <Link 
                href={`/courses/${courseId}`}
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">กลับไปยังคอร์ส</span>
              </Link>
            )}

            {/* Lesson Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {lessonTitle}
              </h1>
              <p className="text-gray-600 mt-2">{courseTitle}</p>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <span className="text-xl">💡</span>
                <span>เคลับลับการใช้งาน</span>
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>กดปุ่ม <Menu className="inline w-4 h-4" /> เพื่อซ่อน/แสดงเมนู</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>กดปุ่ม <Maximize className="inline w-4 h-4" /> เพื่อเปิดเต็มจอ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>กด <kbd className="px-1.5 py-0.5 bg-white rounded border border-blue-300 text-xs font-mono">ESC</kbd> เพื่อออกจากเต็มจอ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>ความคืบหน้าถูกบันทึกอัตโนมัติ</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* SCORM Content Area - Flexible, no scroll overlap */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Content Container - No padding in fullscreen */}
          <div className={`flex-1 flex flex-col min-h-0 ${isFullscreen ? '' : 'p-4 md:p-6'}`}>
            <ScormPlayer
              packagePath={packagePath}
              lessonId={lessonId}
              userId={userId}
              hideHeader={isFullscreen}
              fullHeight={true}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              className={isFullscreen ? 'h-full border-0 rounded-none' : 'h-full'}
            />
          </div>
        </main>
      </div>
    </>
  )
}
