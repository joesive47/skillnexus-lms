'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Users, 
  Settings,
  Share2,
  Heart,
  Eye
} from 'lucide-react'

interface LiveStreamPlayerProps {
  streamId: string
  title: string
  instructor: string
  isLive: boolean
  viewerCount: number
  onJoin?: () => void
}

export default function LiveStreamPlayer({
  streamId,
  title,
  instructor,
  isLive,
  viewerCount,
  onJoin
}: LiveStreamPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(100)
  const [likes, setLikes] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isLive && onJoin) {
      onJoin()
    }
  }, [isLive, onJoin])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1)
      setHasLiked(true)
    }
  }

  return (
    <Card className="w-full bg-black border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-lg">{title}</CardTitle>
            <p className="text-gray-400 text-sm">โดย {instructor}</p>
          </div>
          <div className="flex items-center space-x-2">
            {isLive && (
              <Badge className="bg-red-600 text-white animate-pulse">
                🔴 LIVE
              </Badge>
            )}
            <div className="flex items-center text-gray-400 text-sm">
              <Eye className="w-4 h-4 mr-1" />
              {viewerCount.toLocaleString()}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative bg-black aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={`/api/streams/${streamId}`} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-black/50 hover:bg-black/70 rounded-full w-16 h-16"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </Button>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button size="sm" variant="ghost" className="text-white" onClick={togglePlay}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  
                  <Button size="sm" variant="ghost" className="text-white" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`text-white ${hasLiked ? 'text-red-500' : ''}`}
                    onClick={handleLike}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${hasLiked ? 'fill-current' : ''}`} />
                    {likes}
                  </Button>
                  
                  <div className="flex items-center text-white text-sm">
                    <Users className="w-4 h-4 mr-1" />
                    {viewerCount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!isLive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>กำลังเตรียมการถ่ายทอดสด...</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}