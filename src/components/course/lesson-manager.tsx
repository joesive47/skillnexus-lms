'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getYouTubeThumbnail } from '@/lib/video'
import { createLesson } from '@/app/actions/lesson'
import { getQuizzes } from '@/app/actions/quiz'

interface LessonManagerProps {
  courseId: string
  moduleId: string
}

export function LessonManager({ courseId, moduleId }: LessonManagerProps) {
  const router = useRouter()
  const [lessonType, setLessonType] = useState<'VIDEO' | 'QUIZ' | 'TEXT' | 'SCORM'>('VIDEO')
  const [isLoading, setIsLoading] = useState(false)
  const [videoId, setVideoId] = useState('')
  const [videoPreview, setVideoPreview] = useState<{ id: string; thumbnail: string } | null>(null)
  const [error, setError] = useState('')
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [selectedQuizId, setSelectedQuizId] = useState<string>('')

  // Fetch quizzes on component mount
  useEffect(() => {
    async function loadQuizzes() {
      const result = await getQuizzes()
      if (result.success && result.quizzes) {
        setQuizzes(result.quizzes)
      }
    }
    loadQuizzes()
  }, [])

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
      const duration = formData.get('duration') ? parseFloat(formData.get('duration') as string) : null
      
      const lessonData = {
        type: lessonType,
        title: formData.get('title') as string,
        youtubeUrl: lessonType === 'VIDEO' ? videoId.trim() : null,
        content: formData.get('content') as string || null,
        launchUrl: formData.get('launchUrl') as string || null,
        durationMin: duration,
        duration: duration,
        requiredPct: parseInt(formData.get('completionPercentage') as string) || 80,
        quizId: lessonType === 'QUIZ' ? selectedQuizId : null,
        order: 1, // This should be calculated based on existing lessons
      }

      const result = await createLesson(courseId, lessonData)
      
      if (result.success) {
        // Redirect to course edit page after successful creation
        router.push(`/dashboard/admin/courses/${courseId}/edit`)
        router.refresh()
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
                  placeholder="dQw4w9WgXcQ (11 characters)"
                  className={error ? 'border-red-500' : ''}
                  maxLength={11}
                  required
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
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input 
                  id="duration" 
                  name="duration" 
                  type="number" 
                  min="0"
                  step="0.1"
                  placeholder="10"
                  required
                />
              </div>
            </>
          )}

          {lessonType === 'QUIZ' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="quizSelect">Select Quiz</Label>
                <Select value={selectedQuizId} onValueChange={setSelectedQuizId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a quiz" />
                  </SelectTrigger>
                  <SelectContent>
                    {quizzes.map((quiz) => (
                      <SelectItem key={quiz.id} value={quiz.id}>
                        {quiz.title} ({quiz._count?.questions || 0} questions)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {quizzes.length === 0 && (
                  <p className="text-sm text-amber-600">⚠️ No quizzes available. Create a quiz first.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input 
                  id="duration" 
                  name="duration" 
                  type="number" 
                  min="0"
                  step="0.1"
                  placeholder="30"
                  required
                />
              </div>
            </>
          )}

          {lessonType === 'TEXT' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  rows={8} 
                  placeholder="Enter lesson content here..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="launchUrl">Document URL (Optional)</Label>
                <Input 
                  id="launchUrl" 
                  name="launchUrl" 
                  type="url" 
                  placeholder="https://example.com/document.pdf"
                />
                <p className="text-sm text-muted-foreground">
                  📄 Add a link to PDF, Google Docs, or any external document
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input 
                  id="duration" 
                  name="duration" 
                  type="number" 
                  min="0"
                  step="0.1"
                  placeholder="15"
                  required
                />
              </div>
            </>
          )}

          {lessonType === 'SCORM' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="launchUrl">SCORM Package URL</Label>
                <Input 
                  id="launchUrl" 
                  name="launchUrl" 
                  type="url" 
                  placeholder="https://your-storage.com/scorm-package/index.html"
                  required
                />
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    📦 Enter the URL to your SCORM package's launch file (usually index.html or index_lms.html)
                  </p>
                  <p className="text-sm text-blue-700 mt-2">
                    💡 You can upload SCORM packages to AWS S3, Google Drive, or Vercel Blob Storage
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input 
                  id="duration" 
                  name="duration" 
                  type="number" 
                  min="0"
                  step="0.1"
                  placeholder="45"
                  required
                />
              </div>
            </>
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

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={
              isLoading || 
              (lessonType === 'VIDEO' && (!videoPreview || !!error)) ||
              (lessonType === 'QUIZ' && !selectedQuizId)
            }
            className="w-full"
          >
            {isLoading ? 'Creating Lesson...' : 'Create Lesson'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}