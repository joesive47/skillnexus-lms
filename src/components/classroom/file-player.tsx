'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  Download,
  FileVideo,
  FileAudio
} from 'lucide-react'
import { updateLessonProgress } from '@/app/actions/lesson'

interface FilePlayerProps {
  fileUrl: string
  fileType: 'video' | 'audio'
  lessonId: string
  userId: string
  initialWatchTime?: number
}

export function FilePlayer({ 
  fileUrl, 
  fileType, 
  lessonId, 
  userId, 
  initialWatchTime = 0 
}: FilePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(initialWatchTime)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return

    const handleLoadedMetadata = () => {
      setDuration(media.duration)
      setIsLoading(false)
      
      // เริ่มจากตำแหน่งที่บันทึกไว้
      if (initialWatchTime > 0) {
        media.currentTime = initialWatchTime
        setCurrentTime(initialWatchTime)
      }
    }

    const handleTimeUpdate = () => {
      setCurrentTime(media.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      updateLessonProgress(userId, lessonId, media.duration)
    }

    const handleError = () => {
      setError('ไม่สามารถโหลดไฟล์ได้')
      setIsLoading(false)
    }

    const handleCanPlay = () => {
      setIsLoading(false)
    }

    media.addEventListener('loadedmetadata', handleLoadedMetadata)
    media.addEventListener('timeupdate', handleTimeUpdate)
    media.addEventListener('ended', handleEnded)
    media.addEventListener('error', handleError)
    media.addEventListener('canplay', handleCanPlay)

    return () => {
      media.removeEventListener('loadedmetadata', handleLoadedMetadata)
      media.removeEventListener('timeupdate', handleTimeUpdate)
      media.removeEventListener('ended', handleEnded)
      media.removeEventListener('error', handleError)
      media.removeEventListener('canplay', handleCanPlay)
    }
  }, [userId, lessonId, initialWatchTime])

  // บันทึกความคืบหน้าทุก 5 วินาที
  useEffect(() => {
    if (isPlaying) {
      progressRef.current = setInterval(() => {
        if (mediaRef.current) {
          updateLessonProgress(userId, lessonId, mediaRef.current.currentTime)
        }
      }, 5000)
    } else {
      if (progressRef.current) {
        clearInterval(progressRef.current)
      }
    }

    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current)
      }
    }
  }, [isPlaying, userId, lessonId])

  const togglePlay = () => {
    const media = mediaRef.current
    if (!media) return

    if (isPlaying) {
      media.pause()
    } else {
      media.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number) => {
    const media = mediaRef.current
    if (!media) return

    const newTime = (value / 100) * duration
    media.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number) => {
    const media = mediaRef.current
    if (!media) return

    const newVolume = value / 100
    media.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const media = mediaRef.current
    if (!media) return

    if (isMuted) {
      media.volume = volume
      setIsMuted(false)
    } else {
      media.volume = 0
      setIsMuted(true)
    }
  }

  const skip = (seconds: number) => {
    const media = mediaRef.current
    if (!media) return

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
    media.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">
              {fileType === 'video' ? <FileVideo className="w-12 h-12 mx-auto" /> : <FileAudio className="w-12 h-12 mx-auto" />}
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              ลองใหม่
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {fileType === 'video' ? <FileVideo className="w-5 h-5" /> : <FileAudio className="w-5 h-5" />}
          {fileType === 'video' ? 'วิดีโอ' : 'เสียง'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Media Element */}
          <div className="relative">
            {fileType === 'video' ? (
              <video
                ref={mediaRef as React.RefObject<HTMLVideoElement>}
                src={fileUrl}
                className="w-full rounded-lg bg-black"
                controls={false}
                preload="metadata"
              />
            ) : (
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <FileAudio className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-medium">กำลังเล่นเสียง</p>
                </div>
                <audio
                  ref={mediaRef as React.RefObject<HTMLAudioElement>}
                  src={fileUrl}
                  preload="metadata"
                />
              </div>
            )}
            
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p>กำลังโหลด...</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={duration > 0 ? (currentTime / duration) * 100 : 0}
              className="h-2 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const percentage = (x / rect.width) * 100
                handleSeek(percentage)
              }}
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => skip(-10)}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={togglePlay}
                variant="default"
                size="sm"
                disabled={isLoading}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                onClick={() => skip(10)}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="sm"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              
              <div className="w-20">
                <Progress 
                  value={isMuted ? 0 : volume * 100}
                  className="h-1 cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const percentage = (x / rect.width) * 100
                    handleVolumeChange(percentage)
                  }}
                />
              </div>

              <Button
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = fileUrl
                  link.download = `lesson-${lessonId}.${fileType === 'video' ? 'mp4' : 'mp3'}`
                  link.click()
                }}
                variant="ghost"
                size="sm"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span>ความคืบหน้า: {Math.round((currentTime / duration) * 100) || 0}%</span>
              <span>ประเภท: {fileType === 'video' ? 'วิดีโอ' : 'เสียง'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}