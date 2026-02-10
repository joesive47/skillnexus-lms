import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CourseImage } from '@/components/ui/course-image'
import { CourseProgressCard } from '@/components/course/CourseProgressCard'
import { CourseProgressBar } from '@/components/course/CourseProgressBar'
import { getCourseProgress } from '@/app/actions/video'
import { LessonProgressIndicator } from '@/components/lesson/LessonProgressIndicator'
import { PurchaseButton } from '@/components/course/purchase-button'
import { DiscussionList } from '@/components/social/DiscussionList'
import { LearningPathViewer } from '@/components/learning-flow'

interface CoursePageProps {
  params: Promise<{
    courseId: string
  }>
}

async function getCourseData(courseId: string, userId: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                watchHistory: {
                  where: { userId }
                }
              }
            }
          },
          orderBy: { order: 'asc' }
        },
        enrollments: {
          where: { userId }
        }
      }
    })

    return course
  } catch (error) {
    console.error('Error fetching course data:', error)
    return null
  }
}

async function getFirstLesson(courseId: string) {
  try {
    const firstLesson = await prisma.lesson.findFirst({
      where: { courseId },
      orderBy: [{ order: 'asc' }]
    })
    
    return firstLesson
  } catch (error) {
    console.error('Error fetching first lesson:', error)
    return null
  }
}

async function getUserCredits(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true }
  })
  return user?.credits || 0
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const { courseId } = await params
  const course = await getCourseData(courseId, session.user.id)
  
  if (!course) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <p>Course not found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isEnrolled = course.enrollments.length > 0 || session.user.role === 'ADMIN' || session.user.role === 'TEACHER'
  const firstLesson = await getFirstLesson(courseId)
  const userCredits = await getUserCredits(session.user.id)
  const isStudent = session.user.role === 'STUDENT'
  
  // Get detailed progress data
  const progressData = isEnrolled ? await getCourseProgress(session.user.id, courseId) : null
  
  // Calculate basic progress for display
  const allLessons = course.modules.flatMap(m => m.lessons)
  const completedLessons = allLessons.filter(l => 
    l.watchHistory.some(wh => wh.completed)
  )
  const progressPercentage = allLessons.length > 0 
    ? Math.round((completedLessons.length / allLessons.length) * 100)
    : 0

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                {course.imageUrl && (
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <CourseImage
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={course.published ? "default" : "secondary"}>
                      {course.published ? "Published" : "Draft"}
                    </Badge>
                    <Badge variant="outline">
                      ${course.price === 0 ? "Free" : course.price}
                    </Badge>
                  </div>
                  {isEnrolled && (
                    <div className="mb-3">
                      <div className="text-sm text-muted-foreground mb-1">
                        Progress: {progressPercentage}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                {course.description || "No description available."}
              </p>
              
              {isEnrolled ? (
                <div className="flex gap-3">
                  {firstLesson ? (
                    <Button asChild>
                      <Link href={`/courses/${courseId}/lessons/${firstLesson.id}`}>
                        {session.user.role === 'ADMIN' || session.user.role === 'TEACHER' 
                          ? "Preview Course" 
                          : progressPercentage > 0 ? "Continue Learning" : "Start Course"}
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled>No lessons available</Button>
                  )}
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">Back to Dashboard</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  {isStudent ? (
                    <PurchaseButton 
                      courseId={courseId} 
                      price={course.price} 
                      userCredits={userCredits}
                    />
                  ) : (
                    <Button>Enroll Now</Button>
                  )}
                  <Button variant="outline" asChild>
                    <Link href="/courses">Browse Courses</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Learning Path Flow - Only show if enrolled */}
          {isEnrolled && (
            <>
              {/* New Course Progress Bar with Certificate */}
              <CourseProgressBar courseId={courseId} showDetails={true} />
              
              <LearningPathViewer 
                courseId={courseId} 
                userId={session.user.id} 
              />
            </>
          )}

          {/* Social Features - Only show if enrolled */}
          {isEnrolled && (
            <Card>
              <CardHeader>
                <CardTitle>Course Discussion</CardTitle>
              </CardHeader>
              <CardContent>
                <DiscussionList courseId={courseId} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          {isEnrolled && progressData && (
            <CourseProgressCard
              totalLessons={progressData.totalLessons}
              completedLessons={progressData.completedLessons}
              totalVideoDuration={progressData.totalVideoDuration}
              watchedDuration={progressData.watchedDuration}
              courseName={progressData.courseName}
            />
          )}
          
          {/* Course Structure */}
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {course.modules.map((module) => (
                  <div key={module.id} className="border rounded-lg p-3">
                    <h4 className="font-medium mb-2">{module.title}</h4>
                    <div className="space-y-1">
                      {module.lessons.map((lesson) => {
                        const watchHistory = lesson.watchHistory[0]
                        const isCompleted = watchHistory?.completed || false
                        const watchProgress = watchHistory?.watchTime || 0
                        
                        return (
                          <div key={lesson.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${
                                isCompleted ? 'line-through text-muted-foreground' : ''
                              }`}>
                                {lesson.title || `Lesson ${lesson.order}`}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {lesson.lessonType}
                              </Badge>
                            </div>
                            <LessonProgressIndicator
                              lessonType={lesson.lessonType}
                              isCompleted={isCompleted}
                              watchProgress={watchProgress}
                              requiredProgress={lesson.requiredCompletionPercentage}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
                
                {course.modules.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No modules available yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}