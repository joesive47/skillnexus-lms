'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Maximize2, Minimize2 } from 'lucide-react'
import InteractivePlayer from './InteractivePlayer'

interface ScormPlayerWithControlsProps {
  lessonId: string
  launchUrl: string
  title?: string
}

export function ScormPlayerWithControls({
  lessonId,
  launchUrl,
  title = 'SCORM Content'
}: ScormPlayerWithControlsProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={toggleFullscreen}
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white shadow-lg"
          >
            <Minimize2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Exit Fullscreen</span>
          </Button>
        </div>
        <div className="w-full h-full">
          <InteractivePlayer
            lessonId={lessonId}
            launchUrl={launchUrl}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Control Bar */}
      <div className="flex items-center justify-between mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📦</span>
          <div>
            <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Interactive SCORM Content
            </p>
          </div>
        </div>
        <Button
          onClick={toggleFullscreen}
          size="sm"
          variant="default"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Maximize2 className="h-4 w-4 mr-0 sm:mr-2" />
          <span className="hidden sm:inline">Fullscreen</span>
        </Button>
      </div>

      {/* SCORM Player - Responsive Heights */}
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        <div className="w-full" style={{ 
          height: 'calc(100vh - 400px)',
          minHeight: '400px',
          maxHeight: '600px'
        }}>
          <InteractivePlayer
            lessonId={lessonId}
            launchUrl={launchUrl}
          />
        </div>
      </div>

      {/* Mobile Instructions */}
      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg sm:hidden">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          💡 Tip: Use fullscreen mode for better viewing on mobile devices
        </p>
      </div>
    </div>
  )
}
