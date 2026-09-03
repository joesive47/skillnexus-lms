'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'

interface AudioPlayerProps {
  src: string
  title: string
  instructor: string
  duration: number
  onProgress?: (progress: number) => void
  antiSkip?: boolean
}

export default function AudioPlayer({ 
  src, 
  title, 
  instructor, 
  duration, 
  onProgress, 
  antiSkip = true 
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      const progress = (audio.currentTime / audio.duration) * 100
      onProgress?.(progress)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate)
  }, [onProgress])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    
    if (antiSkip && seconds > 0) return
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl p-6 text-white">
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-purple-200">by {instructor}</p>
        {antiSkip && (
          <div className="inline-block bg-red-500 px-3 py-1 rounded-full text-sm font-semibold mt-2">
            🔒 Audio Anti-Skip
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="relative h-2 bg-white/20 rounded-full cursor-pointer">
          <div 
            className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-sm mt-2 text-purple-200">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-6 mb-6">
        <button 
          onClick={() => skip(-30)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <SkipBack className="w-6 h-6" />
        </button>

        <button
          onClick={togglePlay}
          className="bg-white text-purple-900 p-4 rounded-full hover:bg-purple-100 transition-colors"
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
        </button>

        <button 
          onClick={() => skip(30)}
          className={`p-2 hover:bg-white/10 rounded-full transition-colors ${
            antiSkip ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={antiSkip}
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value)
              setVolume(newVolume)
              if (audioRef.current) audioRef.current.volume = newVolume
            }}
            className="w-20"
          />
        </div>

        <select
          value={playbackRate}
          onChange={(e) => {
            const rate = parseFloat(e.target.value)
            setPlaybackRate(rate)
            if (audioRef.current) audioRef.current.playbackRate = rate
          }}
          className="bg-white/10 rounded px-2 py-1 text-sm"
        >
          <option value={0.5}>0.5x</option>
          <option value={0.75}>0.75x</option>
          <option value={1}>1x</option>
          <option value={1.25}>1.25x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>
    </div>
  )
}