'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Play, Pause } from 'lucide-react'

// YouTube API types
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

interface AntiSkipPlayerProps {
  youtubeId: string
  onProgress: (watchedTime: number, totalTime: number) => void
  onComplete: () => void
  initialWatchedTime?: number
  requiredWatchPercentage?: number
}

export function AntiSkipPlayer({
  youtubeId,
  onProgress,
  onComplete,
  initialWatchedTime = 0,
  requiredWatchPercentage = 80
}: AntiSkipPlayerProps) {
  const playerRef = useRef<any>(null)
  const lastTimeRef = useRef(initialWatchedTime)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(initialWatchedTime)
  const [duration, setDuration] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [skipWarning, setSkipWarning] = useState(false)

  useEffect(() => {
    const loadPlayer = () => {
      if (!window.YT) {
        const script = document.createElement('script')
        script.src = 'https://www.youtube.com/iframe_api'
        script.onload = () => {
          ;(window as any).onYouTubeIframeAPIReady = initPlayer
        }
        document.head.appendChild(script)
      } else {
        initPlayer()
      }
    }

    const initPlayer = () => {
      playerRef.current = new window.YT.Player('anti-skip-player', {
        videoId: youtubeId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,              // ไม่แสดงคลิปแนะนำจาก YouTube
          fs: 0,
          iv_load_policy: 3,   // ปิด video annotations
          cc_load_policy: 0,   // ปิด captions
          showinfo: 0,         // ไม่แสดงข้อมูลวิดีโอ
          enablejsapi: 1,      // เปิด JavaScript API
          playsinline: 1,      // เล่นแบบ inline (สำหรับมือถือ)
          start: Math.floor(initialWatchedTime)
        },
        events: {
          onReady: handleReady,
          onStateChange: handleStateChange
        }
      })
    }

    const handleReady = () => {
      startAntiSkipTracking()
    }

    const handleStateChange = (event: any) => {
      setIsPlaying(event.data === 1)
      if (event.data === 0 && !isCompleted) {
        setIsCompleted(true)
        onComplete()
      }
    }

    const startAntiSkipTracking = () => {
      setInterval(() => {
        if (playerRef.current?.getCurrentTime && playerRef.current?.getDuration) {
          const watchedTime = playerRef.current.getCurrentTime()
          const videoDuration = playerRef.current.getDuration()
          
          // Validate values
          if (!isFinite(watchedTime) || !isFinite(videoDuration) || videoDuration <= 0) {
            return
          }
          
          // Update duration state
          setDuration(videoDuration)
          
          // Anti-skip detection
          const timeDiff = watchedTime - lastTimeRef.current
          if (timeDiff > 3 && isPlaying) {
            // User skipped forward, rewind to last position
            playerRef.current.seekTo(lastTimeRef.current)
            setSkipWarning(true)
            setTimeout(() => setSkipWarning(false), 3000)
            return
          }

          lastTimeRef.current = watchedTime
          const progressPercentage = (watchedTime / videoDuration) * 100
          
          // Update state and call progress callback
          setCurrentTime(watchedTime)
          onProgress(watchedTime, videoDuration)

          if (progressPercentage >= requiredWatchPercentage && !isCompleted) {
            setIsCompleted(true)
            onComplete()
          }
        }
      }, 500)
    }

    loadPlayer()
  }, [youtubeId])

  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current?.pauseVideo()
    } else {
      playerRef.current?.playVideo()
    }
  }

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <div id="anti-skip-player" className="w-full h-full" />
      
      {/* Skip Warning */}
      {skipWarning && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 z-10">
          <AlertTriangle size={20} />
          <span>ไม่สามารถข้ามวีดีโอได้ กรุณาดูให้ครบ</span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute top-4 left-4 right-4">
        <div className="bg-black/70 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-medium">
                {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-gray-300 text-xs">
              ต้องดู {requiredWatchPercentage}%
            </span>
          </div>
          <div className="bg-gray-600 rounded-full h-3 relative">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                duration > 0 && (currentTime / duration) * 100 >= requiredWatchPercentage 
                  ? 'bg-gradient-to-r from-green-500 to-green-400' 
                  : 'bg-gradient-to-r from-red-500 to-orange-500'
              }`}
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
            <div 
              className="absolute top-0 bg-yellow-400 h-full w-0.5 rounded-full"
              style={{ left: `${requiredWatchPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-white text-xs">
              ความคืบหน้า: {Math.round(duration > 0 ? (currentTime / duration) * 100 : 0)}%
            </span>
            <span className="text-gray-300 text-xs">
              เหลือ: {Math.floor((duration - currentTime) / 60)}:{Math.floor((duration - currentTime) % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Simple Controls */}
      <div className="absolute bottom-4 left-4">
        <button
          onClick={togglePlay}
          className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
      </div>

      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
          ✓ เสร็จสิ้น ({Math.round(duration > 0 ? (currentTime / duration) * 100 : 0)}%)
        </div>
      )}
    </div>
  )
}