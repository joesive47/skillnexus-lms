import { getCourse } from '@/app/actions/course'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { ClassroomLayout } from '@/components/classroom/classroom-layout'
import { StableVideoPlayer } from '@/components/classroom/stable-video-player'
import { FilePlayer } from '@/components/classroom/file-player'
import { QuizForm } from '@/components/lesson/quiz-form'
import { ScormPlayer } from '@/components/scorm/scorm-player'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, FileText, BookOpen, CheckCircle, Package } from 'lucide-react'

interface ClassroomPageProps {
  params: Promise<{
    courseId: string
  }>
  searchParams: Promise<{
    lesson?: string
  }>
}

export default async function ClassroomPage({ params, searchParams }: ClassroomPageProps) {
  const session = await auth()
  if (!session?.user?.id) {
    return <div>กรุณาเข้าสู่ระบบ</div>
  }

  const { courseId } = await params
  const { lesson: selectedLessonId } = await searchParams
  
  const result = await getCourse(courseId)
  
  if (!result.success || !result.course) {
    notFound()
  }

  const course = result.course

  // Get the selected lesson or first lesson
  const selectedLesson = selectedLessonId 
    ? course.lessons.find(l => l.id === selectedLessonId)
    : course.lessons[0]

  // Get watch history for all lessons
  const allLessonsProgress = await prisma.watchHistory.findMany({
    where: {
      userId: session.user.id,
      lessonId: { in: course.lessons.map(l => l.id) }
    }
  })
  
  // Get quiz data if selected lesson is a quiz
  let quizData = null
  if (selectedLesson?.lessonType === 'QUIZ' && selectedLesson.quizId) {
    quizData = await prisma.quiz.findUnique({
      where: { id: selectedLesson.quizId },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    })
  }

  function extractYouTubeId(url: string): string | null {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const youtubeId = selectedLesson?.youtubeUrl ? extractYouTubeId(selectedLesson.youtubeUrl) : null
  const currentWatchHistory = selectedLesson 
    ? allLessonsProgress.find(h => h.lessonId === selectedLesson.id)
    : null

  return (
    <ClassroomLayout
      course={{
        ...course,
        lessons: course.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          lessonType: lesson.lessonType as 'VIDEO' | 'TEXT' | 'QUIZ' | 'SCORM',
          order: lesson.order
        }))
      }}
      selectedLesson={selectedLesson ? {
        id: selectedLesson.id,
        title: selectedLesson.title,
        order: selectedLesson.order
      } : null}
      watchHistory={allLessonsProgress}
    >
      {selectedLesson ? (
        <Card>
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
              {selectedLesson.title || `บทเรียนที่ ${selectedLesson.order}`}
              {currentWatchHistory?.completed && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              <Badge variant="outline" className="ml-auto">
                {selectedLesson.lessonType}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Video Content */}
            {selectedLesson.lessonType === 'VIDEO' && (
              <div>
                {youtubeId ? (
                  <StableVideoPlayer
                    youtubeId={youtubeId}
                    lessonId={selectedLesson.id}
                    initialWatchTime={currentWatchHistory?.watchTime || 0}
                    userId={session.user.id}
                  />
                ) : selectedLesson.youtubeUrl?.startsWith('/uploads/') ? (
                  <FilePlayer
                    fileUrl={selectedLesson.youtubeUrl}
                    fileType="video"
                    lessonId={selectedLesson.id}
                    userId={session.user.id}
                    initialWatchTime={currentWatchHistory?.watchTime || 0}
                  />
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">URL วิดีโอไม่ถูกต้อง</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedLesson.youtubeUrl || 'ไม่มี URL'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quiz Content */}
            {selectedLesson.lessonType === 'QUIZ' && quizData && (
              <QuizForm
                quiz={quizData}
                lessonId={selectedLesson.id}
                userId={session.user.id}
                isFinalExam={selectedLesson.isFinalExam}
              />
            )}

            {/* Quiz not found */}
            {selectedLesson.lessonType === 'QUIZ' && !quizData && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">ไม่พบแบบทดสอบหรือยังไม่ได้ตั้งค่า</p>
              </div>
            )}

            {/* SCORM Content */}
            {selectedLesson.lessonType === 'SCORM' && selectedLesson.scormPackage && (
              <ScormPlayer
                packagePath={selectedLesson.scormPackage.packagePath}
                lessonId={selectedLesson.id}
                userId={session.user.id}
              />
            )}

            {/* SCORM not found */}
            {selectedLesson.lessonType === 'SCORM' && !selectedLesson.scormPackage && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">ไม่พบแพ็กเกจ SCORM หรือยังไม่ได้อัปโหลด</p>
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
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">ไม่มีบทเรียนในคอร์สนี้</h3>
            <p className="text-gray-600">กรุณาเพิ่มบทเรียนเพื่อเริ่มการเรียนรู้</p>
          </CardContent>
        </Card>
      )}
    </ClassroomLayout>
  )
}