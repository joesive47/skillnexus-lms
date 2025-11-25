'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  FileText, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Award,
  ChevronLeft,
  ChevronRight,
  Download,
  Package,
  FileVideo
} from 'lucide-react'
import Link from 'next/link'
import { StableVideoPlayer } from './stable-video-player'
import { QuizForm } from '@/components/lesson/quiz-form'
import { ScormPlayer } from '@/components/scorm/scorm-player'
import { FilePlayer } from './file-player'

interface Lesson {
  id: string
  title: string | null
  content: string | null
  youtubeUrl: string | null
  lessonType: 'VIDEO' | 'TEXT' | 'QUIZ' | 'SCORM' | 'FILE'
  order: number
  quizId: string | null
  isFinalExam: boolean
  scormPackage?: {
    id: string
    packagePath: string
    title?: string
  } | null
  launchUrl?: string | null
}

interface Course {
  id: string
  title: string
  description: string | null
  published: boolean
  lessons: Lesson[]
}

interface WatchHistory {
  lessonId: string
  watchTime: number
  completed: boolean
}

interface EnhancedClassroomProps {
  course: Course
  selectedLesson: Lesson | null
  watchHistory: WatchHistory[]
  userId: string
  quizData?: any
}

function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

export function EnhancedClassroom({ 
  course, 
  selectedLesson, 
  watchHistory, 
  userId,
  quizData 
}: EnhancedClassroomProps) {
  const [activeTab, setActiveTab] = useState('content')
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())

  useEffect(() => {
    const completed = new Set(
      watchHistory.filter(h => h.completed).map(h => h.lessonId)
    )
    setCompletedLessons(completed)
  }, [watchHistory])

  const currentIndex = selectedLesson 
    ? course.lessons.findIndex(l => l.id === selectedLesson.id)
    : -1
  
  const previousLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null
  
  const totalLessons = course.lessons.length
  const completedCount = completedLessons.size
  const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0

  const youtubeId = selectedLesson?.youtubeUrl ? extractYouTubeId(selectedLesson.youtubeUrl) : null
  const currentWatchHistory = selectedLesson 
    ? watchHistory.find(h => h.lessonId === selectedLesson.id)
    : null

  if (!selectedLesson) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">ไม่มีบทเรียนในคอร์สนี้</h3>
            <p className="text-gray-600">กรุณาเพิ่มบทเรียนเพื่อเริ่มการเรียนรู้</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/admin/courses">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  กลับ
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">{course.title}</h1>
                <p className="text-sm text-gray-600">
                  บทเรียนที่ {currentIndex + 1} จาก {totalLessons}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium">ความคืบหน้า</div>
                <div className="text-xs text-gray-600">
                  {completedCount}/{totalLessons} บทเรียน
                </div>
              </div>
              <div className="w-32">
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <Badge variant={course.published ? "default" : "secondary"}>
                {course.published ? "เผยแพร่แล้ว" : "ร่าง"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedLesson.lessonType === 'VIDEO' && (
                    <Play className="w-5 h-5 text-blue-500" />
                  )}
                  {selectedLesson.lessonType === 'QUIZ' && (
                    <FileText className="w-5 h-5 text-green-500" />
                  )}
                  {selectedLesson.lessonType === 'TEXT' && (
                    <BookOpen className="w-5 h-5 text-purple-500" />
                  )}
                  {selectedLesson.lessonType === 'SCORM' && (
                    <Package className="w-5 h-5 text-orange-500" />
                  )}
                  {selectedLesson.lessonType === 'FILE' && (
                    <FileVideo className="w-5 h-5 text-indigo-500" />
                  )}
                  {selectedLesson.title || `บทเรียนที่ ${selectedLesson.order}`}
                  {completedLessons.has(selectedLesson.id) && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">เนื้อหา</TabsTrigger>
                    <TabsTrigger value="notes">บันทึก</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="mt-6">
                    {/* Video Content */}
                    {selectedLesson.lessonType === 'VIDEO' && (
                      <div>
                        {youtubeId ? (
                          <StableVideoPlayer
                            youtubeId={youtubeId}
                            lessonId={selectedLesson.id}
                            initialWatchTime={currentWatchHistory?.watchTime || 0}
                            userId={userId}
                          />
                        ) : (
                          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600">URL วิดีโอไม่ถูกต้อง</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quiz Content */}
                    {selectedLesson.lessonType === 'QUIZ' && quizData && (
                      <div>
                        <QuizForm
                          quiz={quizData}
                          lessonId={selectedLesson.id}
                          userId={userId}
                          isFinalExam={selectedLesson.isFinalExam}
                        />
                      </div>
                    )}

                    {/* SCORM Content */}
                    {selectedLesson.lessonType === 'SCORM' && selectedLesson.scormPackage && (
                      <div>
                        <ScormPlayer
                          packagePath={selectedLesson.scormPackage.packagePath}
                          lessonId={selectedLesson.id}
                          userId={userId}
                          onComplete={() => {
                            // Handle SCORM completion
                            window.location.reload()
                          }}
                        />
                      </div>
                    )}

                    {/* File Content (Video/Audio) */}
                    {selectedLesson.lessonType === 'FILE' && selectedLesson.launchUrl && (
                      <div>
                        <FilePlayer
                          fileUrl={selectedLesson.launchUrl}
                          fileType={selectedLesson.launchUrl.includes('.mp4') || selectedLesson.launchUrl.includes('.webm') ? 'video' : 'audio'}
                          lessonId={selectedLesson.id}
                          userId={userId}
                          initialWatchTime={currentWatchHistory?.watchTime || 0}
                        />
                      </div>
                    )}

                    {/* Text Content */}
                    {selectedLesson.lessonType === 'TEXT' && (
                      <div className="prose max-w-none">
                        {selectedLesson.content ? (
                          <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                        ) : (
                          <div className="text-center py-8">
                            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">ไม่มีเนื้อหาสำหรับบทเรียนนี้</p>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="notes" className="mt-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="font-medium mb-2">บันทึกส่วนตัว</h3>
                      <textarea 
                        className="w-full h-32 p-3 border rounded-lg resize-none"
                        placeholder="เขียนบันทึกของคุณที่นี่..."
                      />
                      <Button size="sm" className="mt-2">
                        บันทึก
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    {previousLesson && (
                      <Link href={`/dashboard/admin/courses/${course.id}/classroom?lesson=${previousLesson.id}`}>
                        <Button variant="outline">
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          บทก่อนหน้า
                        </Button>
                      </Link>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-600">
                      บทเรียนที่ {currentIndex + 1} จาก {totalLessons}
                    </div>
                    <Progress value={((currentIndex + 1) / totalLessons) * 100} className="w-32 h-2 mt-1" />
                  </div>
                  
                  <div>
                    {nextLesson && (
                      <Link href={`/dashboard/admin/courses/${course.id}/classroom?lesson=${nextLesson.id}`}>
                        <Button>
                          บทถัดไป
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">เนื้อหาคอร์ส</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {course.lessons.map((lesson, index) => {
                    const isSelected = selectedLesson.id === lesson.id
                    const isCompleted = completedLessons.has(lesson.id)
                    const watchTime = watchHistory.find(h => h.lessonId === lesson.id)?.watchTime || 0
                    
                    return (
                      <Link
                        key={lesson.id}
                        href={`/dashboard/admin/courses/${course.id}/classroom?lesson=${lesson.id}`}
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
                              {lesson.lessonType === 'FILE' && (
                                <FileVideo className="w-3 h-3 text-indigo-500" />
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
                
                {/* Course Progress Summary */}
                <div className="mt-4 pt-4 border-t">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}