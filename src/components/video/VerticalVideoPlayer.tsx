'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, RotateCcw, Share2 } from 'lucide-react'

interface VerticalVideoPlayerProps {
  src: string
  title: string
  duration: number
  onProgress: (progress: number) => void
  antiSkip?: boolean
}

export default function VerticalVideoPlayer({ 
  src, 
  title, 
  duration, 
  onProgress, 
  antiSkip = true 
}: VerticalVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100
      setCurrentTime(video.currentTime)
      onProgress(progress)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [onProgress])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (antiSkip) return // Prevent seeking when anti-skip is enabled
    
    const video = videoRef.current
    if (!video) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const percentage = clickY / rect.height
    video.currentTime = percentage * video.duration
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        playsInline
        muted={isMuted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Mobile Controls Overlay */}
      <div 
        className={`absolute inset-0 flex flex-col justify-between p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setShowControls(!showControls)}
      >
        {/* Top Bar */}
        <div className="flex justify-between items-start text-white">
          <h3 className="text-lg font-semibold max-w-[70%] truncate">{title}</h3>
          <Share2 className="w-6 h-6" />
        </div>

        {/* Center Play Button */}
        <div className="flex justify-center items-center">
          <button
            onClick={(e) => {
              e.stopPropagation()
              togglePlay()
            }}
            className="bg-black/50 rounded-full p-4 text-white"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="space-y-4">
          {/* Progress Bar */}
          <div 
            className="relative h-1 bg-white/30 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            {antiSkip && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMuted(!isMuted)
                }}
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              <span className="text-sm">
                {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / 
                {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (videoRef.current) {
                  videoRef.current.currentTime = 0
                }
              }}
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Anti-Skip Indicator */}
      {antiSkip && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          🔒 Anti-Skip
        </div>
      )}
    </div>
  )
}