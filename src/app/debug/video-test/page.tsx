'use client'

import { useState } from 'react'
import { extractYouTubeID, isValidYouTubeID, getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/video'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function VideoTestPage() {
  const [inputUrl, setInputUrl] = useState('')
  const [result, setResult] = useState<{
    videoId: string | null
    isValid: boolean
    embedUrl: string
    thumbnail: string
  } | null>(null)

  const testUrls = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=invalid',
    'not-a-url'
  ]

  const handleTest = () => {
    const videoId = extractYouTubeID(inputUrl)
    const isValid = videoId ? isValidYouTubeID(videoId) : false
    
    setResult({
      videoId,
      isValid,
      embedUrl: videoId ? getYouTubeEmbedUrl(videoId) : '',
      thumbnail: videoId ? getYouTubeThumbnail(videoId) : ''
    })
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">YouTube Video ID Extraction Test</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test URL Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter YouTube URL or Video ID"
                className="flex-1"
              />
              <Button onClick={handleTest}>Test</Button>
            </div>
            
            {result && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Input:</strong> {inputUrl}
                  </div>
                  <div>
                    <strong>Extracted ID:</strong> {result.videoId || 'null'}
                  </div>
                  <div>
                    <strong>Valid:</strong> 
                    <span className={result.isValid ? 'text-green-600' : 'text-red-600'}>
                      {result.isValid ? ' ✅ Yes' : ' ❌ No'}
                    </span>
                  </div>
                  <div>
                    <strong>Embed URL:</strong> {result.embedUrl}
                  </div>
                </div>
                
                {result.videoId && result.isValid && (
                  <div className="mt-4">
                    <strong>Thumbnail Preview:</strong>
                    <img 
                      src={result.thumbnail} 
                      alt="Video thumbnail" 
                      className="mt-2 max-w-xs rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testUrls.map((url, index) => {
                const videoId = extractYouTubeID(url)
                const isValid = videoId ? isValidYouTubeID(videoId) : false
                
                return (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1 truncate">
                      <code className="text-sm">{url}</code>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-mono">{videoId || 'null'}</span>
                      <span className={isValid ? 'text-green-600' : 'text-red-600'}>
                        {isValid ? '✅' : '❌'}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setInputUrl(url)}
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supported Formats</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✅ Standard: <code>https://www.youtube.com/watch?v=VIDEO_ID</code></li>
              <li>✅ Short: <code>https://youtu.be/VIDEO_ID</code></li>
              <li>✅ Shorts: <code>https://www.youtube.com/shorts/VIDEO_ID</code></li>
              <li>✅ Embed: <code>https://www.youtube.com/embed/VIDEO_ID</code></li>
              <li>✅ Direct ID: <code>VIDEO_ID</code> (11 characters)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}