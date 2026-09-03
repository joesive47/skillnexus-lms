'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  FileText, 
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  Menu,
  X,
  Package
} from 'lucide-react'
import Link from 'next/link'

interface ClassroomLayoutProps {
  course: {
    id: string
    title: string
    published: boolean
    lessons: Array<{
      id: string
      title: string | null
      lessonType: 'VIDEO' | 'TEXT' | 'QUIZ' | 'SCORM'
      order: number
    }>
  }
  selectedLesson: {
    id: string
    title: string | null
    order: number
  } | null
  watchHistory: Array<{
    lessonId: string
    watchTime: number
    completed: boolean
  }>
  children: React.ReactNode
}

export function ClassroomLayout({ 
  course, 
  selectedLesson, 
  watchHistory, 
  children 
}: ClassroomLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const completedLessons = new Set(
    watchHistory.filter(h => h.completed).map(h => h.lessonId)
  )
  
  const currentIndex = selectedLesson 
    ? course.lessons.findIndex(l => l.id === selectedLesson.id)
    : -1
  
  const previousLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null
  
  const totalLessons = course.lessons.length
  const completedCount = completedLessons.size
  const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/admin/courses">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  กลับ
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
              
              <div>
                <h1 className="text-lg sm:text-xl font-bold truncate max-w-xs sm:max-w-md">
                  {course.title}
                </h1>
                {selectedLesson && (
                  <p className="text-sm text-gray-600">
                    บทเรียนที่ {currentIndex + 1} จาก {totalLessons}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium">ความคืบหน้า</div>
                <div className="text-xs text-gray-600">
                  {completedCount}/{totalLessons} บทเรียน
                </div>
              </div>
              <div className="w-20 sm:w-32">
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <Badge variant={course.published ? "default" : "secondary"}>
                {course.published ? "เผยแพร่" : "ร่าง"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* Sidebar */}
          <div className={`
            fixed lg:static inset-y-0 left-0 z-30 w-80 bg-white border-r transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="h-full overflow-y-auto">
              <div className="p-4 border-b lg:hidden">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">เนื้อหาคอร์ส</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-2">
                  {course.lessons.map((lesson, index) => {
                    const isSelected = selectedLesson?.id === lesson.id
                    const isCompleted = completedLessons.has(lesson.id)
                    const watchTime = watchHistory.find(h => h.lessonId === lesson.id)?.watchTime || 0
                    
                    return (
                      <Link
                        key={lesson.id}
                        href={`/dashboard/admin/courses/${course.id}/classroom?lesson=${lesson.id}`}
                        onClick={() => setSidebarOpen(false)}
                        className={`block p-3 rounded-lg border transition-all hover:shadow-sm ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-200 shadow-sm' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium flex-shrink-0 ${
                            isCompleted 
                              ? 'bg-green-100 text-green-800' 
                              : isSelected
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {isCompleted ? '✓' : index + 1}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-1">
                              {lesson.lessonType === 'VIDEO' && (
                                <Play className="w-3 h-3 text-blue-500" />
                              )}
                              {lesson.lessonType === 'QUIZ' && (
                                <FileText className="w-3 h-3 text-green-500" />
                              )}
                              {lesson.lessonType === 'TEXT' && (
                                <BookOpen className="w-3 h-3 text-purple-500" />
                              )}
                              {lesson.lessonType === 'SCORM' && (
                                <Package className="w-3 h-3 text-orange-500" />
                              )}
                              <span className={`text-sm font-medium truncate ${
                                isCompleted ? 'line-through text-gray-500' : ''
                              }`}>
                                {lesson.title || `บทเรียนที่ ${lesson.order}`}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {lesson.lessonType}
                              </span>
                              {watchTime > 0 && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  {Math.floor(watchTime / 60)}:{(watchTime % 60).toFixed(0).padStart(2, '0')}
                                </div>
                              )}
                            </div>
                            
                            {isCompleted && (
                              <div className="text-xs text-green-600 mt-1">
                                ✅ เสร็จสิ้น
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
                
                {/* Progress Summary */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">ความคืบหน้าทั้งหมด</span>
                    <span className="text-sm text-gray-600">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">
                    {completedCount} จาก {totalLessons} บทเรียน
                  </div>
                  
                  {progressPercentage === 100 && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg text-center">
                      <Award className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <div className="text-xs text-green-800 font-medium">
                        🎉 เสร็จสิ้นคอร์สแล้ว!
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 lg:ml-0">
            <div className="p-4 sm:p-6">
              {children}
              
              {/* Navigation */}
              {selectedLesson && (
                <Card className="mt-6">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        {previousLesson && (
                          <Link href={`/dashboard/admin/courses/${course.id}/classroom?lesson=${previousLesson.id}`}>
                            <Button variant="outline">
                              <ChevronLeft className="w-4 h-4 mr-1" />
                              <span className="hidden sm:inline">บทก่อนหน้า</span>
                              <span className="sm:hidden">ก่อนหน้า</span>
                            </Button>
                          </Link>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-600">
                          {currentIndex + 1} / {totalLessons}
                        </div>
                        <Progress 
                          value={((currentIndex + 1) / totalLessons) * 100} 
                          className="w-20 sm:w-32 h-2 mt-1" 
                        />
                      </div>
                      
                      <div>
                        {nextLesson && (
                          <Link href={`/dashboard/admin/courses/${course.id}/classroom?lesson=${nextLesson.id}`}>
                            <Button>
                              <span className="hidden sm:inline">บทถัดไป</span>
                              <span className="sm:hidden">ถัดไป</span>
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}