'use client'

import { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createCourse, updateCourse } from '@/app/actions/course'
import { createCourseWithScorm, updateCourseWithScorm } from '@/app/actions/course-scorm'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react'

interface Course {
  id: string
  title: string
  description?: string | null
  price?: number | null
  imageUrl?: string | null
  published: boolean
  lessons?: any[]
}

interface CourseFormProps {
  course?: Course
  mode?: 'create' | 'edit'
}

interface Lesson {
  id?: string
  type: 'VIDEO' | 'QUIZ' | 'SCORM'
  order: number
  title?: string
  youtubeUrl?: string
  requiredPct?: number
  durationMin?: number
  quizId?: string
  scormFile?: File
  scormPackagePath?: string
}

interface Quiz {
  id: string
  title: string
}

function SubmitButton({ mode }: { mode: 'create' | 'edit' }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (mode === 'create' ? 'Creating...' : 'Updating...') : (mode === 'create' ? 'Create Course' : 'Update Course')}
    </Button>
  )
}

export function CourseForm({ course, mode = 'create' }: CourseFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    course?.imageUrl ? (
      course.imageUrl.startsWith('/uploads/') 
        ? `/api/images${course.imageUrl.replace('/uploads/', '/')}`
        : course.imageUrl.startsWith('/') 
          ? course.imageUrl 
          : `/${course.imageUrl}`
    ) : null
  )
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchQuizzes()
    // Load existing lessons if editing
    if (course?.lessons) {
      const existingLessons = course.lessons.map(lesson => ({
        id: lesson.id,
        type: (lesson.type || lesson.lessonType) as 'VIDEO' | 'QUIZ' | 'SCORM',
        order: lesson.order,
        title: lesson.title || '',
        youtubeUrl: lesson.youtubeUrl || '',
        requiredPct: lesson.requiredCompletionPercentage || 80,
        durationMin: lesson.duration ? Math.round(lesson.duration / 60) : 0,
        quizId: lesson.quizId || '',
        scormPackagePath: lesson.scormPackage?.packagePath || '',
      }))
      setLessons(existingLessons)
    }
  }, [course])

  async function fetchQuizzes() {
    try {
      const response = await fetch('/api/admin/quizzes')
      if (response.ok) {
        const data = await response.json()
        setQuizzes(data)
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, PNG, and WebP images are allowed')
        return
      }
      
      const url = URL.createObjectURL(file)
      setImagePreview(url)
      setError(null)
    }
  }

  function addLesson(type: 'VIDEO' | 'QUIZ' | 'SCORM') {
    const newLesson: Lesson = {
      type,
      order: lessons.length + 1,
      ...(type === 'VIDEO' && { title: '', youtubeUrl: '', requiredPct: 90, durationMin: 0 }),
      ...(type === 'QUIZ' && { quizId: '' }),
      ...(type === 'SCORM' && { title: '', durationMin: 0 })
    }
    setLessons([...lessons, newLesson])
  }

  function removeLesson(index: number) {
    const newLessons = lessons.filter((_, i) => i !== index)
    setLessons(newLessons.map((lesson, i) => ({ ...lesson, order: i + 1 })))
  }

  function moveLesson(index: number, direction: 'up' | 'down') {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === lessons.length - 1)) return
    
    const newLessons = [...lessons]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    const temp = newLessons[index]
    newLessons[index] = newLessons[targetIndex]
    newLessons[targetIndex] = temp
    setLessons(newLessons.map((lesson, i) => ({ ...lesson, order: i + 1 })))
  }

  function updateLesson(index: number, field: string, value: any) {
    const newLessons = [...lessons]
    newLessons[index] = { ...newLessons[index], [field]: value }
    setLessons(newLessons)
  }

  function validateLessons(): string | null {
    if (lessons.length === 0) {
      return null // Allow courses without lessons
    }

    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i]
      const lessonNumber = i + 1
      
      if (lesson.type === 'VIDEO') {
        if (!lesson.title?.trim()) {
          return `Lesson ${lessonNumber}: Video lesson title is required`
        }
        if (!lesson.youtubeUrl?.trim()) {
          return `Lesson ${lessonNumber}: YouTube URL is required for video lessons`
        }
        // Validate YouTube URL format
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
        if (!youtubeRegex.test(lesson.youtubeUrl)) {
          return `Lesson ${lessonNumber}: Please enter a valid YouTube URL`
        }
      }
      if (lesson.type === 'QUIZ' && !lesson.quizId) {
        return `Lesson ${lessonNumber}: Quiz selection is required for quiz lessons`
      }
      if (lesson.type === 'SCORM') {
        if (!lesson.title?.trim()) {
          return `Lesson ${lessonNumber}: SCORM lesson title is required`
        }
        // สำหรับบทเรียนใหม่ ต้องมี URL หรือ file
        if (!lesson.id && !lesson.scormFile && !lesson.scormPackagePath?.trim()) {
          return `Lesson ${lessonNumber}: SCORM package URL or file is required for new SCORM lessons`
        }
        // สำหรับบทเรียนเก่า ถ้ามี URL ใหม่ ต้อง validate
        if (lesson.scormPackagePath?.trim()) {
          try {
            new URL(lesson.scormPackagePath)
          } catch {
            return `Lesson ${lessonNumber}: Please enter a valid SCORM package URL`
          }
        }
      }
    }
    return null
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(null)
    
    const lessonError = validateLessons()
    if (lessonError) {
      setError(lessonError)
      return
    }
    
    // Handle SCORM files - add them to formData separately
    lessons.forEach((lesson, index) => {
      if (lesson.type === 'SCORM' && lesson.scormFile) {
        formData.append(`scorm_${lesson.order}`, lesson.scormFile)
      }
    })
    
    // Add lessons data to form data (without file objects)
    if (lessons.length > 0) {
      const lessonsData = lessons.map(lesson => {
        const { scormFile, ...lessonWithoutFile } = lesson
        return lessonWithoutFile
      })
      formData.append('lessons', JSON.stringify(lessonsData))
    }
    
    try {
      const hasScormLessons = lessons.some(l => l.type === 'SCORM')
      const result = mode === 'create' 
        ? (hasScormLessons ? await createCourseWithScorm(formData) : await createCourse(formData))
        : (hasScormLessons ? await updateCourseWithScorm(course!.id, formData) : await updateCourse(course!.id, formData))
      
      if (result.success) {
        setSuccess(`Course ${mode === 'create' ? 'created' : 'updated'} successfully!`)
        
        // Force refresh the current page to show updated image
        if (mode === 'edit') {
          window.location.reload()
        } else {
          setTimeout(() => {
            router.push('/dashboard/admin/courses')
            router.refresh()
          }, 1500)
        }
      } else {
        setError(result.error || `Failed to ${mode} course`)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setError('An unexpected error occurred')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Create New Course' : 'Edit Course'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter course title"
              defaultValue={course?.title || ''}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              defaultValue={course?.price ? (course.price / 100).toString() : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter course description"
              rows={4}
              defaultValue={course?.description || ''}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="published"
              name="published"
              defaultChecked={course?.published || false}
              className="rounded border-gray-300"
            />
            <Label htmlFor="published">Published</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Course Image (Optional)</Label>
            <p className="text-sm text-gray-600">Recommended: 400x240px (16:9), Max: 5MB, JPEG/PNG/WebP</p>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2">
                <div className="relative w-[200px] h-[120px] border rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Course preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Lessons Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Lessons Builder</Label>
              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addLesson('VIDEO')}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Video Lesson
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addLesson('QUIZ')}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Quiz Lesson
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addLesson('SCORM')}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add SCORM Lesson
                </Button>
              </div>
            </div>

            {lessons.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No lessons added yet. Click the buttons above to add lessons.
              </div>
            )}

            {lessons.map((lesson, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                      {lesson.order}. {lesson.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveLesson(index, 'up')}
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveLesson(index, 'down')}
                      disabled={index === lessons.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLesson(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {lesson.type === 'VIDEO' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Title *</Label>
                      <Input
                        value={lesson.title || ''}
                        onChange={(e) => updateLesson(index, 'title', e.target.value)}
                        placeholder="Enter lesson title"
                        className={!lesson.title?.trim() ? 'border-red-300' : ''}
                      />
                      {!lesson.title?.trim() && (
                        <p className="text-red-500 text-xs mt-1">Lesson title is required</p>
                      )}
                    </div>
                    <div>
                      <Label>YouTube URL *</Label>
                      <Input
                        value={lesson.youtubeUrl || ''}
                        onChange={(e) => updateLesson(index, 'youtubeUrl', e.target.value)}
                        placeholder="https://youtu.be/... or https://youtube.com/watch?v=..."
                        className={!lesson.youtubeUrl?.trim() ? 'border-red-300' : ''}
                      />
                      {!lesson.youtubeUrl?.trim() && (
                        <p className="text-red-500 text-xs mt-1">YouTube URL is required</p>
                      )}
                    </div>
                    <div>
                      <Label>Duration (min)</Label>
                      <Input
                        type="number"
                        value={lesson.durationMin || ''}
                        onChange={(e) => updateLesson(index, 'durationMin', parseInt(e.target.value) || 0)}
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <Label>Required Watch Percent</Label>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={lesson.requiredPct || 90}
                        onChange={(e) => updateLesson(index, 'requiredPct', parseInt(e.target.value) || 90)}
                        placeholder="90"
                      />
                    </div>
                  </div>
                )}

                {lesson.type === 'QUIZ' && (
                  <div>
                    <Label>Select Quiz *</Label>
                    <Select
                      value={lesson.quizId || ''}
                      onValueChange={(value) => updateLesson(index, 'quizId', value)}
                    >
                      <SelectTrigger className={!lesson.quizId ? 'border-red-300' : ''}>
                        <SelectValue placeholder="Choose a quiz..." />
                      </SelectTrigger>
                      <SelectContent>
                        {quizzes.map((quiz) => (
                          <SelectItem key={quiz.id} value={quiz.id}>
                            {quiz.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!lesson.quizId && (
                      <p className="text-red-500 text-xs mt-1">Quiz selection is required</p>
                    )}
                  </div>
                )}

                {lesson.type === 'SCORM' && (
                  <div className="space-y-4">
                    {/* แสดงประวัติ SCORM ที่มีอยู่แล้ว */}
                    {lesson.id && lesson.scormPackagePath && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-800 mb-1">✅ SCORM Package ที่มีอยู่แล้ว</p>
                            <p className="text-xs text-green-700 break-all">
                              📦 {lesson.scormPackagePath}
                            </p>
                            <p className="text-xs text-green-600 mt-2">
                              💡 ถ้าต้องการเปลี่ยน SCORM ใหม่ ให้ใส่ URL ใหม่ด้านล่าง
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Title *</Label>
                        <Input
                          value={lesson.title || ''}
                          onChange={(e) => updateLesson(index, 'title', e.target.value)}
                          placeholder="Enter SCORM lesson title"
                          className={!lesson.title?.trim() ? 'border-red-300' : ''}
                        />
                        {!lesson.title?.trim() && (
                          <p className="text-red-500 text-xs mt-1">SCORM lesson title is required</p>
                        )}
                      </div>
                      <div>
                        <Label>Duration (min)</Label>
                        <Input
                          type="number"
                          value={lesson.durationMin || ''}
                          onChange={(e) => updateLesson(index, 'durationMin', parseInt(e.target.value) || 0)}
                          placeholder="30"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>SCORM Package URL {!lesson.id && '*'}</Label>
                      <Input
                        type="url"
                        value={lesson.scormPackagePath || ''}
                        onChange={(e) => updateLesson(index, 'scormPackagePath', e.target.value)}
                        placeholder="https://your-storage.com/scorm-package.zip"
                        className={!lesson.id && !lesson.scormPackagePath?.trim() && !lesson.scormFile ? 'border-red-300' : ''}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        📦 URL ของ SCORM package (.zip) จาก Google Drive, Dropbox, AWS S3, Cloudflare R2, etc.
                      </p>
                      {!lesson.id && !lesson.scormPackagePath?.trim() && !lesson.scormFile && (
                        <p className="text-red-500 text-xs mt-1">SCORM package URL is required</p>
                      )}
                    </div>

                    <div>
                      <Label>Or Upload SCORM Package (.zip) - Local Only</Label>
                      <Input
                        type="file"
                        accept=".zip"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            if (file.size > 50 * 1024 * 1024) {
                              setError('SCORM package size must be less than 50MB')
                              return
                            }
                            updateLesson(index, 'scormFile', file)
                            setError(null)
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        ⚠️ File upload not supported on Vercel. Use URL instead.
                      </p>
                      {lesson.scormFile && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ File selected: {lesson.scormFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>
          )}
          
          {success && (
            <div className="text-green-500 text-sm bg-green-50 p-3 rounded">{success}</div>
          )}

          <SubmitButton mode={mode} />
        </form>
      </CardContent>
    </Card>
  )
}