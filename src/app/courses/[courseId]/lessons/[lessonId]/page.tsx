import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VideoPlayerWrapper } from '@/components/video/VideoPlayerWrapper'
import { extractYouTubeID } from '@/lib/youtube'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NoteTaking } from '@/components/advanced/NoteTaking'
import { StudyPlanner } from '@/components/advanced/StudyPlanner'
import InteractivePlayer from '@/components/lesson/InteractivePlayer'
import { ScormFullscreenWrapper } from '@/components/scorm/scorm-fullscreen-wrapper'
import Link from 'next/link'
import { ProgressIndicator } from '@/components/learning-flow'

interface LessonPageProps {
  params: Promise<{ courseId: string; lessonId: string }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = await params
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Check user role for quiz data access
  const isAdminOrTeacher = session.user.role === 'ADMIN' || session.user.role === 'TEACHER'

  // Get lesson data - only include quiz answers for admin/teacher
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: true,
      module: true,
      quiz: isAdminOrTeacher ? {
        include: {
          questions: {
            include: {
              options: true
            }
          }
        }
      } : {
        // For students: only get quiz metadata, no questions/options
        select: {
          id: true,
          title: true,
          timeLimit: true,
          randomize: true,
          shuffleOptions: true,
          questionsToShow: true,
          questionPoolSize: true,
          _count: {
            select: {
              questions: true
            }
          }
        }
      },
      scormPackage: true,
      watchHistory: {
        where: { userId: session.user.id }
      }
    }
  })

  if (!lesson) {
    console.log('Lesson not found:', lessonId)
    redirect(`/courses/${courseId}`)
  }

  if (lesson.courseId !== courseId) {
    console.log('Course ID mismatch:', lesson.courseId, 'vs', courseId)
    redirect(`/courses/${courseId}`)
  }

  // Check enrollment or admin/teacher access
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: courseId
      }
    }
  })

  const hasAccess = enrollment || session.user.role === 'ADMIN' || session.user.role === 'TEACHER'
  if (!hasAccess) {
    redirect(`/courses/${courseId}`)
  }

  const watchHistory = lesson.watchHistory[0]
  const youtubeId = extractYouTubeID(lesson.youtubeUrl || '')

  // Get Learning Node and Progress (for Learning Flow system)
  const learningNode = await prisma.learningNode.findFirst({
    where: {
      courseId: courseId,
      refId: lessonId
    },
    include: {
      progress: {
        where: { userId: session.user.id }
      }
    }
  })
  const nodeProgress = learningNode?.progress[0]

  // If SCORM lesson, use fullscreen layout
  if (lesson.lessonType === 'SCORM' && lesson.scormPackage) {
    return (
      <ScormFullscreenWrapper
        packagePath={lesson.scormPackage.packagePath}
        lessonId={lesson.id}
        userId={session.user.id}
        courseId={courseId}
        lessonTitle={lesson.title || 'Untitled Lesson'}
        courseTitle={lesson.course.title || 'Untitled Course'}
      />
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-4">
        <Button variant="outline" asChild>
          <Link href={`/courses/${courseId}`}>← Back to Course</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {lesson.lessonType === 'VIDEO' ? '🎥' : 
               lesson.lessonType === 'INTERACTIVE' ? '🎮' : 
               lesson.lessonType === 'SCORM' ? '📦' : '📝'} {lesson.title || `Lesson ${lesson.order}`}
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">{lesson.lessonType}</Badge>
              {watchHistory?.completed && (
                <Badge variant="default">Completed</Badge>
              )}
            </div>
          </div>
          {lesson.module ? (
            <p className="text-sm text-muted-foreground">
              Module: {lesson.module.title}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Course: {lesson.course.title}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {lesson.lessonType === 'VOICE_PRACTICE' ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">🎤 Voice Practice</h3>
                <p className="text-muted-foreground mb-4">
                  ฝึกทักษะการพูดและรับ Feedback จาก AI
                </p>
                <Button asChild size="lg">
                  <Link href={`/lesson/${lesson.id}/voice-practice`}>เริ่มฝึกพูด</Link>
                </Button>
              </div>
            </div>
          ) : lesson.lessonType === 'VIDEO' && youtubeId ? (
            <VideoPlayerWrapper
              youtubeId={youtubeId}
              lessonId={lesson.id}
              courseId={courseId}
              userId={session.user.id}
              initialProgress={watchHistory?.watchTime || 0}
              requiredWatchPercentage={lesson.requiredCompletionPercentage || 80}
            />
          ) : lesson.lessonType === 'INTERACTIVE' && lesson.launchUrl ? (
            <InteractivePlayer
              lessonId={lesson.id}
              launchUrl={lesson.launchUrl}
            />
          ) : lesson.lessonType === 'SCORM' && lesson.scormPackage ? (
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
              <div className="text-center p-6">
                <p className="text-lg font-semibold text-blue-900 mb-2">📦 SCORM Content</p>
                <p className="text-sm text-blue-700">This lesson uses fullscreen SCORM layout</p>
              </div>
            </div>
          ) : lesson.lessonType === 'QUIZ' && lesson.quiz ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{lesson.quiz.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This quiz has {'questions' in lesson.quiz 
                    ? lesson.quiz.questions.length 
                    : lesson.quiz._count?.questions ?? 0} questions.
                </p>
                <Button asChild>
                  <Link href={`/courses/${courseId}/lessons/${lessonId}/quiz`}>Start Quiz</Link>
                </Button>
              </div>
              
              {/* Preview questions for admin/teacher only */}
              {isAdminOrTeacher && 'questions' in lesson.quiz && lesson.quiz.questions && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Quiz Preview (Admin/Teacher only):</h4>
                  <div className="space-y-4">
                    {lesson.quiz.questions.map((question, index) => (
                      <div key={question.id} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium mb-2">
                          {index + 1}. {question.text}
                        </p>
                        <div className="space-y-1">
                          {question.options.map((option) => (
                            <div key={option.id} className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${
                                option.isCorrect ? 'bg-green-500' : 'bg-gray-300'
                              }`} />
                              <span className={option.isCorrect ? 'font-medium' : ''}>
                                {option.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Content not available</p>
                <p className="text-sm text-muted-foreground">
                  {lesson.lessonType === 'VIDEO' ? 'No video URL provided' : 
                   lesson.lessonType === 'INTERACTIVE' ? 'No interactive content found' :
                   lesson.lessonType === 'SCORM' ? 'No SCORM package found' :
                   'No quiz content found'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
          </Card>
        </div>

        {/* Sidebar with Advanced Features */}
        <div className="space-y-6">
          {/* Learning Progress - Only show if learning node exists */}
          {learningNode && (
            <ProgressIndicator
              nodeId={learningNode.id}
              nodeType={learningNode.nodeType as 'VIDEO' | 'SCORM' | 'QUIZ'}
              currentProgress={nodeProgress?.progressPercent || 0}
              requiredProgress={learningNode.requiredProgress || (learningNode.nodeType === 'VIDEO' ? 80 : 100)}
              score={nodeProgress?.score}
              requiredScore={learningNode.requiredScore}
              status={nodeProgress?.status as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | undefined}
              timeSpent={nodeProgress?.timeSpent}
            />
          )}
          
          <NoteTaking 
            lessonId={lesson.id}
            userId={session.user.id}
          />
          <StudyPlanner userId={session.user.id} />
        </div>
      </div>
    </div>
  )
}