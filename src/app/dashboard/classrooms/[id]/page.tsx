'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play, BookOpen, Users, Clock } from 'lucide-react'
import Link from 'next/link'

interface Lesson {
  id: string
  title: string
  lessonType: string
  order: number
  youtubeUrl?: string
  duration?: number
}

interface Course {
  id: string
  title: string
  description?: string
  imageUrl?: string
  lessons: Lesson[]
}

interface Classroom {
  id: string
  name: string
  description?: string
  isActive: boolean
  course: Course
}

export default function ClassroomPage() {
  const params = useParams()
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchClassroom(params.id as string)
    }
  }, [params.id])

  const fetchClassroom = async (id: string) => {
    try {
      const response = await fetch(`/api/classrooms/${id}`)
      if (response.ok) {
        const data = await response.json()
        setClassroom(data)
      }
    } catch (error) {
      console.error('Failed to fetch classroom:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!classroom) {
    return <div className="p-6">Classroom not found</div>
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/classrooms">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Classrooms
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{classroom.name}</h1>
          <p className="text-muted-foreground">{classroom.description}</p>
        </div>
        <Badge variant={classroom.isActive ? 'default' : 'secondary'}>
          {classroom.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Course Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{classroom.course.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {classroom.course.description || 'No description available'}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    {classroom.course.lessons.length} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {Math.round(classroom.course.lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0) / 60)} min
                  </span>
                </div>
                <Link href={`/courses/${classroom.course.id}`} className="block">
                  <Button className="w-full">
                    Start Learning
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lessons List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classroom.course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{lesson.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {lesson.lessonType}
                          </Badge>
                          {lesson.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {Math.round(lesson.duration / 60)} min
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {classroom.course.lessons.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No lessons available in this course
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}