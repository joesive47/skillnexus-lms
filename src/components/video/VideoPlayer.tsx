'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Clock } from 'lucide-react'

interface VideoPlayerProps {
  youtubeId: string
  onProgress: (watchedTime: number, totalTime: number) => void
  onComplete: () => void
  initialWatchedTime?: number
  requiredWatchPercentage?: number
  onTimeUpdate?: (currentTime: number) => void
}

export function VideoPlayer({
  youtubeId,
  onProgress,
  onComplete,
  initialWatchedTime = 0,
  requiredWatchPercentage = 80,
  onTimeUpdate
}: VideoPlayerProps) {
  const playerRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(initialWatchedTime)
  const [duration, setDuration] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (window.YT) {
        initPlayer()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.onload = () => {
        window.onYouTubeIframeAPIReady = initPlayer
      }
      document.head.appendChild(script)
    }

    const initPlayer = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: youtubeId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          fs: 0
        },
        events: {
          onReady: handleReady,
          onStateChange: handleStateChange,
          onError: handleError
        }
      })
    }

    const handleReady = () => {
      const videoDuration = playerRef.current.getDuration()
      setDuration(videoDuration)
      
      if (initialWatchedTime > 0) {
        playerRef.current.seekTo(initialWatchedTime)
      }
      
      startProgressTracking()
    }

    const handleStateChange = (event: any) => {
      if (event.data === 1) setIsPlaying(true)
      if (event.data === 2) setIsPlaying(false)
      if (event.data === 0 && !isCompleted) {
        setIsCompleted(true)
        onComplete()
      }
    }

    const handleError = () => {
      setError('ไม่สามารถโหลดวีดีโอได้')
    }

    const startProgressTracking = () => {
      setInterval(() => {
        if (playerRef.current?.getCurrentTime && playerRef.current?.getDuration) {
          const watchedTime = playerRef.current.getCurrentTime()
          const videoDuration = playerRef.current.getDuration()
          
          // Validate values
          if (isFinite(watchedTime) && isFinite(videoDuration) && videoDuration > 0 && watchedTime >= 0) {
            const progressPercentage = (watchedTime / videoDuration) * 100
            
            setCurrentTime(watchedTime)
            setDuration(videoDuration)
            onProgress(watchedTime, videoDuration)
            onTimeUpdate?.(watchedTime)
            
            if (progressPercentage >= requiredWatchPercentage && !isCompleted) {
              setIsCompleted(true)
              onComplete()
            }
          }
        }
      }, 1000)
    }

    loadYouTubeAPI()
  }, [youtubeId])

  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current?.pauseVideo()
    } else {
      playerRef.current?.playVideo()
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      playerRef.current?.unMute()
    } else {
      playerRef.current?.mute()
    }
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    const element = document.getElementById('video-container')
    if (element?.requestFullscreen) {
      element.requestFullscreen()
    }
  }

  if (error) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <p className="mb-4">{error}</p>
          <a 
            href={`https://www.youtube.com/watch?v=${youtubeId}`}
            target="_blank"
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            เปิดใน YouTube
          </a>
        </div>
      </div>
    )
  }

  return (
    <div id="video-container" className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <div id="youtube-player" className="w-full h-full" />
      
      {/* Progress Bar */}
      <div className="absolute top-4 left-4 right-4">
        <div className="bg-black/70 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-white" />
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
              className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-300"
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

      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={togglePlay}
            className="bg-black/70 hover:bg-black/90 text-white p-2 rounded"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={toggleMute}
            className="bg-black/70 hover:bg-black/90 text-white p-2 rounded"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
        
        <div className="flex gap-2">
          {isCompleted && (
            <div className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
              ✓ เสร็จสิ้น ({Math.round(duration > 0 ? (currentTime / duration) * 100 : 0)}%)
            </div>
          )}
          <button
            onClick={toggleFullscreen}
            className="bg-black/70 hover:bg-black/90 text-white p-2 rounded"
          >
            <Maximize size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}