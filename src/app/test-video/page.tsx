'use client'

import { AntiSkipYouTubePlayer } from '@/components/lesson/anti-skip-youtube-player'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestVideoPage() {
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>YouTube Player Test</CardTitle>
        </CardHeader>
        <CardContent>
          <AntiSkipYouTubePlayer
            youtubeId="W6NZfCO5SIk"
            lessonId="test-lesson"
            initialWatchTime={0}
            userId="test-user"
          />
        </CardContent>
      </Card>
    </div>
  )
}