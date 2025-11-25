'use client'

import { useState } from 'react'
import { AntiSkipYouTubePlayer } from '@/components/lesson/anti-skip-youtube-player'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { extractYouTubeID, isValidYouTubeID } from '@/lib/video'

export default function DebugVideoPage() {
  const [videoInput, setVideoInput] = useState('W6NZfCO5SIk')
  const [currentVideoId, setCurrentVideoId] = useState('W6NZfCO5SIk')

  const handleTest = () => {
    const extractedId = extractYouTubeID(videoInput)
    if (extractedId) {
      setCurrentVideoId(extractedId)
    } else {
      setCurrentVideoId(videoInput)
    }
  }

  const isValid = isValidYouTubeID(currentVideoId)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>YouTube Video ID Debug Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter YouTube URL or Video ID"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
            />
            <Button onClick={handleTest}>Test</Button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div>Input: <code className="bg-gray-100 px-2 py-1 rounded">{videoInput}</code></div>
            <div>Extracted ID: <code className="bg-gray-100 px-2 py-1 rounded">{currentVideoId}</code></div>
            <div>Length: <span className="font-mono">{currentVideoId.length}</span></div>
            <div>Valid: <span className={isValid ? 'text-green-600' : 'text-red-600'}>{isValid ? '✅ Yes' : '❌ No'}</span></div>
          </div>
        </CardContent>
      </Card>

      {isValid && (
        <Card>
          <CardHeader>
            <CardTitle>Video Player Test</CardTitle>
          </CardHeader>
          <CardContent>
            <AntiSkipYouTubePlayer
              key={currentVideoId}
              youtubeId={currentVideoId}
              lessonId="debug-lesson"
              initialWatchTime={0}
              userId="debug-user"
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}