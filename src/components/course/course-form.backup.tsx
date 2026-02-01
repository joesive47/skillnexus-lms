'use client'

import { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { createCourse, updateCourse } from '@/app/actions/course'
import { createCourseWithScorm, updateCourseWithScorm } from '@/app/actions/course-scorm'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronUp, ChevronDown, Trash2, Plus, Copy, GripVertical, Eye, Trash } from 'lucide-react'
import { toast } from 'sonner'

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
  isFinalExam?: boolean
  requiresPreviousQuizPass?: boolean
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

// 🎯 Preview Modal Component
function LessonPreviewModal({ lesson, quiz, onClose }: { lesson: Lesson, quiz?: Quiz, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <Card className="w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>📋 Preview: {lesson.title || 'Untitled Lesson'}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold text-blue-900">Type: {lesson.type}</p>
            <p className="text-sm text-blue-700">Order: #{lesson.order}</p>
          </div>

          {lesson.type === 'VIDEO' && (
            <div className="space-y-2">
              <p><strong>Title:</strong> {lesson.title}</p>
              <p><strong>YouTube URL:</strong> {lesson.youtubeUrl}</p>
              <p><strong>Duration:</strong> {lesson.durationMin} minutes</p>
              <p><strong>Required Watch:</strong> {lesson.requiredPct}%</p>
            </div>
          )}

          {lesson.type === 'QUIZ' && (
            <div className="space-y-2">
              <p><strong>Quiz:</strong> {quiz?.title || 'Not selected'}</p>
              <p><strong>Quiz ID:</strong> {lesson.quizId}</p>
            </div>
          )}

          {lesson.type === 'SCORM' && (
            <div className="space-y-2">
              <p><strong>Title:</strong> {lesson.title}</p>
              <p><strong>Duration:</strong> {lesson.durationMin} minutes</p>
              <p><strong>Package URL:</strong> {lesson.scormPackagePath || 'Not set'}</p>
              {lesson.scormFile && <p><strong>File:</strong> {lesson.scormFile.name}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function CourseForm({ course, mode = 'create' }: CourseFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(
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
  const [selectedLessons, setSelectedLessons] = useState<number[]>([]) // 🎯 Bulk selection
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null) // 🎯 Preview
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null) // 🎯 Drag & Drop
  const router = useRouter()

  useEffect(() => {
    fetchQuizzes()
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
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
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

  // 🎯 Lesson Management Functions
  function addLesson(type: 'VIDEO' | 'QUIZ' | 'SCORM') {
    const newLesson: Lesson = {
      type,
      order: lessons.length + 1,
      ...(type === 'VIDEO' && { title: '', youtubeUrl: '', requiredPct: 90, durationMin: 0 }),
      ...(type === 'QUIZ' && { quizId: '' }),
      ...(type === 'SCORM' && { title: '', durationMin: 0 })
    }
    setLessons([...lessons, newLesson])
    toast.success(`Added ${type} lesson`)
  }

  function removeLesson(index: number) {
    const newLessons = lessons.filter((_, i) => i !== index)
    setLessons(newLessons.map((lesson, i) => ({ ...lesson, order: i + 1 })))
    toast.success('Lesson removed')
  }

  // 🎯 NEW: Duplicate Lesson
  function duplicateLesson(index: number) {
    const lessonToDuplicate = lessons[index]
    const newLesson: Lesson = {
      ...lessonToDuplicate,
      id: undefined, // Remove ID for new lesson
      order: lessons.length + 1,
      title: lessonToDuplicate.title ? `${lessonToDuplicate.title} (Copy)` : ''
    }
    setLessons([...lessons, newLesson])
    toast.success('Lesson duplicated')
  }

  // 🎯 NEW: Bulk Delete
  function bulkDeleteLessons() {
    if (selectedLessons.length === 0) {
      toast.error('No lessons selected')
      return
    }
    const newLessons = lessons.filter((_, i) => !selectedLessons.includes(i))
    setLessons(newLessons.map((lesson, i) => ({ ...lesson, order: i + 1 })))
    setSelectedLessons([])
    toast.success(`Deleted ${selectedLessons.length} lesson(s)`)
  }

  // 🎯 NEW: Toggle Selection
  function toggleSelection(index: number) {
    setSelectedLessons(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  // 🎯 NEW: Select All
  function toggleSelectAll() {
    if (selectedLessons.length === lessons.length) {
      setSelectedLessons([])
    } else {
      setSelectedLessons(lessons.map((_, i) => i))
    }
  }

  // 🎯 NEW: Drag & Drop Functions
  function handleDragStart(index: number) {
    setDraggedIndex(index)
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    
    const newLessons = [...lessons]
    const draggedLesson = newLessons[draggedIndex]
    newLessons.splice(draggedIndex, 1)
    newLessons.splice(index, 0, draggedLesson)
    
    setLessons(newLessons.map((lesson, i) => ({ ...lesson, order: i + 1 })))
    setDraggedIndex(index)
  }

  function handleDragEnd() {
    setDraggedIndex(null)
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
    if (lessons.length === 0) return null

    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i]
      const lessonNumber = i + 1
      
      if (lesson.type === 'VIDEO') {
        if (!lesson.title?.trim()) return `Lesson ${lessonNumber}: Video lesson title is required`
        if (!lesson.youtubeUrl?.trim()) return `Lesson ${lessonNumber}: YouTube URL is required`
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
        if (!youtubeRegex.test(lesson.youtubeUrl)) return `Lesson ${lessonNumber}: Invalid YouTube URL`
      }
      if (lesson.type === 'QUIZ' && !lesson.quizId) return `Lesson ${lessonNumber}: Quiz selection required`
      if (lesson.type === 'SCORM') {
        if (!lesson.title?.trim()) return `Lesson ${lessonNumber}: SCORM title required`
        if (!lesson.id && !lesson.scormFile && !lesson.scormPackagePath?.trim()) {
          return `Lesson ${lessonNumber}: SCORM package URL or file required`
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
      toast.error(lessonError)
      return
    }
    
    lessons.forEach((lesson, index) => {
      if (lesson.type === 'SCORM' && lesson.scormFile) {
        formData.append(`scorm_${lesson.order}`, lesson.scormFile)
      }
    })
    
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
        toast.success(`Course ${mode === 'create' ? 'created' : 'updated'} successfully!`)
        
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
        toast.error(result.error || `Failed to ${mode} course`)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setError('An unexpected error occurred')
      toast.error('An unexpected error occurred')
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Create New Course' : 'Edit Course'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {/* Course Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter course title"
              defaultValue={course?.title || ''}
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">ราคา (บาท)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="1"
              min="0"
              placeholder="0"
              defaultValue={course?.price?.toString() || ''}
            />
          </div>

          {/* Description */}
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

          {/* Published */}
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

          {/* Course Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Course Image (Optional)</Label>
            <p className="text-sm text-gray-600">Recommended: 400x240px (16:9), Max: 5MB, JPEG/PNG/WebP</p>
            
            {mode === 'edit' && course?.imageUrl && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">📸 รูปหน้าปกปัจจุบัน:</p>
                <div className="relative w-[200px] h-[120px] border-2 border-blue-300 rounded-lg overflow-hidden bg-white">
                  <Image
                    src={course.imageUrl.startsWith('/uploads/') 
                      ? `/api/images${course.imageUrl.replace('/uploads/', '/')}`
                      : course.imageUrl.startsWith('/') 
                        ? course.imageUrl 
                        : `/${course.imageUrl}`}
                    alt="Current course cover"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <p className="text-xs text-blue-600 mt-2">💡 อัปโหลดรูปใหม่ด้านล่างเพื่อเปลี่ยนรูปหน้าปก</p>
              </div>
            )}
            
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
            />
            
            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm font-medium text-green-700 mb-2">✅ Preview รูปใหม่:</p>
                <div className="relative w-[200px] h-[120px] border-2 border-green-500 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="New course preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            )}
          </div>

          {/* 🎯 Lessons Builder with NEW Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Lessons Builder ({lessons.length})</Label>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => addLesson('VIDEO')}>
                  <Plus className="w-4 h-4 mr-1" />Video
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addLesson('QUIZ')}>
                  <Plus className="w-4 h-4 mr-1" />Quiz
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addLesson('SCORM')}>
                  <Plus className="w-4 h-4 mr-1" />SCORM
                </Button>
              </div>
            </div>

            {/* 🎯 Bulk Actions Toolbar */}
            {lessons.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedLessons.length === lessons.length && lessons.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                  <span className="text-sm font-medium">
                    {selectedLessons.length > 0 ? `${selectedLessons.length} selected` : 'Select all'}
                  </span>
                </div>
                {selectedLessons.length > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={bulkDeleteLessons}
                  >
                    <Trash className="w-4 h-4 mr-1" />
                    Delete Selected
                  </Button>
                )}
              </div>
            )}

            {lessons.length === 0 && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                No lessons added yet. Click the buttons above to add lessons.
              </div>
            )}

            {/* 🎯 Lesson Cards with Drag & Drop */}
            {lessons.map((lesson, index) => (
              <Card
                key={index}
                className={`p-4 transition-all ${
                  draggedIndex === index ? 'opacity-50' : ''
                } ${selectedLessons.includes(index) ? 'ring-2 ring-blue-500' : ''}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* 🎯 Checkbox for bulk selection */}
                    <Checkbox
                      checked={selectedLessons.includes(index)}
                      onCheckedChange={() => toggleSelection(index)}
                    />
                    
                    {/* 🎯 Drag handle */}
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                    
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                      {lesson.order}. {lesson.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {/* 🎯 Preview Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewLesson(lesson)}
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {/* 🎯 Duplicate Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => duplicateLesson(index)}
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    
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

                {/* VIDEO Lesson Form */}
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
                    </div>
                    <div>
                      <Label>YouTube URL *</Label>
                      <Input
                        value={lesson.youtubeUrl || ''}
                        onChange={(e) => updateLesson(index, 'youtubeUrl', e.target.value)}
                        placeholder="https://youtu.be/..."
                        className={!lesson.youtubeUrl?.trim() ? 'border-red-300' : ''}
                      />
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
                      <Label>Required Watch %</Label>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={lesson.requiredPct || 90}
                        onChange={(e) => updateLesson(index, 'requiredPct', parseInt(e.target.value) || 90)}
                      />
                    </div>
                  </div>
                )}

                {/* QUIZ Lesson Form */}
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
                  </div>
                )}

                {/* SCORM Lesson Form */}
                {lesson.type === 'SCORM' && (
                  <div className="space-y-4">
                    {lesson.id && lesson.scormPackagePath && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-green-800 mb-1">✅ SCORM Package ที่มีอยู่แล้ว</p>
                        <p className="text-xs text-green-700 break-all">📦 {lesson.scormPackagePath}</p>
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
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        📦 URL ของ SCORM package (.zip)
                      </p>
                    </div>

                    <div>
                      <Label>Or Upload SCORM Package (.zip)</Label>
                      <Input
                        type="file"
                        accept=".zip"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            if (file.size > 50 * 1024 * 1024) {
                              setError('SCORM package must be less than 50MB')
                              return
                            }
                            updateLesson(index, 'scormFile', file)
                            setError(null)
                          }
                        }}
                      />
                      {lesson.scormFile && (
                        <p className="text-xs text-green-600 mt-1">✓ File: {lesson.scormFile.name}</p>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">
              ❌ {error}
            </div>
          )}
          
          {success && (
            <div className="text-green-500 text-sm bg-green-50 p-3 rounded border border-green-200">
              ✅ {success}
            </div>
          )}

          {/* Submit Button */}
          <SubmitButton mode={mode} />
        </form>

        {/* 🎯 Preview Modal */}
        {previewLesson && (
          <LessonPreviewModal
            lesson={previewLesson}
            quiz={quizzes.find(q => q.id === previewLesson.quizId)}
            onClose={() => setPreviewLesson(null)}
          />
        )}
      </CardContent>
    </Card>
  )
}
