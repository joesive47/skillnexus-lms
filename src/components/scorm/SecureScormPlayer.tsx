'use client'

import { useEffect, useState, useRef } from 'react'
import { Loader2, Maximize2, Minimize2, Monitor, Smartphone, Tablet } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SecureScormPlayerProps {
  lessonId: string
  onComplete?: () => void
}

type DeviceMode = 'auto' | 'mobile' | 'tablet' | 'desktop'

export function SecureScormPlayer({ lessonId, onComplete }: SecureScormPlayerProps) {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('auto')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function getToken() {
      try {
        const res = await fetch('/api/scorm/proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId })
        })

        if (!res.ok) {
          throw new Error('Failed to get access token')
        }

        const data = await res.json()
        setToken(data.token)
        setLoading(false)
      } catch (err) {
        setError('ไม่สามารถเข้าถึงเนื้อหาได้ กรุณาลองใหม่อีกครั้ง')
        setLoading(false)
      }
    }

    getToken()
  }, [lessonId])

  // Prevent right-click and inspect
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => {
      if (iframeRef.current?.contains(e.target as Node)) {
        e.preventDefault()
      }
    }

    const preventDevTools = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault()
      }
    }

    document.addEventListener('contextmenu', preventContextMenu)
    document.addEventListener('keydown', preventDevTools)

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu)
      document.removeEventListener('keydown', preventDevTools)
    }
  }, [])

  // Fullscreen handler
  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Get container dimensions based on device mode
  const getContainerClass = () => {
    if (deviceMode === 'mobile') return 'max-w-[375px] mx-auto'
    if (deviceMode === 'tablet') return 'max-w-[768px] mx-auto'
    if (deviceMode === 'desktop') return 'max-w-full'
    return 'w-full' // auto
  }

  const getAspectRatio = () => {
    if (deviceMode === 'mobile') return 'aspect-[9/16]' // Portrait
    if (deviceMode === 'tablet') return 'aspect-[4/3]'
    return 'aspect-video' // 16:9 for desktop
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">กำลังโหลดเนื้อหา...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black">
      {/* Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={deviceMode === 'auto' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDeviceMode('auto')}
              className="text-white"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={deviceMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDeviceMode('mobile')}
              className="text-white"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
            <Button
              variant={deviceMode === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDeviceMode('tablet')}
              className="text-white"
            >
              <Tablet className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="text-white"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* SCORM Content */}
      <div className={`flex items-center justify-center h-full p-4 ${isFullscreen ? 'p-0' : ''}`}>
        <div className={`${getContainerClass()} w-full`}>
          <div className={`relative ${isFullscreen ? 'h-screen' : getAspectRatio()} bg-white rounded-lg overflow-hidden shadow-2xl`}>
            <iframe
              ref={iframeRef}
              src={`/api/scorm/proxy?token=${token}&path=/index.html`}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms"
              title="SCORM Content"
              onLoad={() => {
                if (onComplete) {
                  window.addEventListener('message', (event) => {
                    if (event.data?.type === 'scorm-complete') {
                      onComplete()
                    }
                  })
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
