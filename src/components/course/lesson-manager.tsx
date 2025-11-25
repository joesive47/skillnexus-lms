'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getYouTubeThumbnail } from '@/lib/video'
import { createLesson } from '@/app/actions/lesson'

interface LessonManagerProps {
  courseId: string
  moduleId: string
}

export function LessonManager({ courseId, moduleId }: LessonManagerProps) {
  const [lessonType, setLessonType] = useState<'VIDEO' | 'QUIZ' | 'TEXT' | 'SCORM'>('VIDEO')
  const [isLoading, setIsLoading] = useState(false)
  const [videoId, setVideoId] = useState('')
  const [videoPreview, setVideoPreview] = useState<{ id: string; thumbnail: string } | null>(null)
  const [error, setError] = useState('')

  const handleVideoIdChange = (id: string) => {
    setVideoId(id)
    setError('')
    
    if (id.trim()) {
      // Check if it's a valid 11-character YouTube ID
      if (/^[a-zA-Z0-9_-]{11}$/.test(id.trim())) {
        setVideoPreview({
          id: id.trim(),
          thumbnail: getYouTubeThumbnail(id.trim())
        })
      } else {
        setVideoPreview(null)
        setError('YouTube Video ID must be exactly 11 characters (letters, numbers, _ or -)')
      }
    } else {
      setVideoPreview(null)
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError('')
    
    try {
      const lessonData = {
        type: lessonType,
        title: formData.get('title') as string,
        youtubeUrl: lessonType === 'VIDEO' ? videoId.trim() : null,
        content: formData.get('content') as string,
        durationMin: formData.get('duration') ? parseFloat(formData.get('duration') as string) / 60 : null,
        requiredPct: parseInt(formData.get('completionPercentage') as string) || 80,
        order: 1, // This should be calculated based on existing lessons
      }

      const result = await createLesson(courseId, lessonData)
      
      if (result.success) {
        // Reset form
        setVideoId('')
        setVideoPreview(null)
        // You might want to redirect or show success message
        console.log('Lesson created successfully:', result.lesson)
      } else {
        setError(result.error || 'Failed to create lesson')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Error creating lesson:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Lesson</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Lesson Title</Label>
            <Input id="title" name="title" required />
          </div>

          <div className="space-y-2">
            <Label>Lesson Type</Label>
            <div className="flex gap-4">
              {(['VIDEO', 'QUIZ', 'TEXT', 'SCORM'] as const).map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="lessonType"
                    value={type}
                    checked={lessonType === type}
                    onChange={(e) => setLessonType(e.target.value as typeof lessonType)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {lessonType === 'VIDEO' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="videoId">YouTube Video ID</Label>
                <Input 
                  id="videoId" 
                  name="videoId" 
                  type="text" 
                  value={videoId}
                  onChange={(e) => handleVideoIdChange(e.target.value)}
                  placeholder="NI1W7glJ-to (11 characters)"
                  className={error ? 'border-red-500' : ''}
                  maxLength={11}
                />
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                {videoPreview && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600 mb-2">✅ Valid YouTube URL detected</p>
                    <div className="flex items-center gap-3">
                      <img 
                        src={videoPreview.thumbnail} 
                        alt="Video thumbnail" 
                        className="w-20 h-15 object-cover rounded"
                      />
                      <div className="text-sm">
                        <p><strong>Video ID:</strong> {videoPreview.id}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input id="duration" name="duration" type="number" />
              </div>
            </>
          )}

          {lessonType === 'TEXT' && (
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" name="content" rows={6} />
            </div>
          )}

          {lessonType === 'SCORM' && (
            <div className="space-y-2">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  📦 SCORM lessons require uploading a SCORM package after creating the lesson.
                  You can upload the package using the SCORM uploader component.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="completionPercentage">Required Completion %</Label>
            <Input 
              id="completionPercentage" 
              name="completionPercentage" 
              type="number" 
              min="1" 
              max="100" 
              defaultValue="80" 
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFinalExam"
              name="isFinalExam"
            />
            <Label htmlFor="isFinalExam">Mark as Final Exam</Label>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || (lessonType === 'VIDEO' && (!videoPreview || !!error))}
          >
            {isLoading ? 'Creating...' : 'Create Lesson'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}