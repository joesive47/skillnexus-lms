import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

interface DebugCoursePageProps {
  params: Promise<{ courseId: string }>
}

export default async function DebugCoursePage({ params }: DebugCoursePageProps) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const { courseId } = await params

  // Get course with all related data
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            include: {
              watchHistory: {
                where: { userId: session.user.id }
              },
              quiz: {
                include: {
                  questions: {
                    include: {
                      options: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { order: 'asc' }
      },
      enrollments: {
        where: { userId: session.user.id }
      }
    }
  })

  if (!course) {
    return <div className="p-6">Course not found with ID: {courseId}</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Debug Course Data</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Course Info</h2>
        <p><strong>ID:</strong> {course.id}</p>
        <p><strong>Title:</strong> {course.title}</p>
        <p><strong>Published:</strong> {course.published ? 'Yes' : 'No'}</p>
        <p><strong>Modules Count:</strong> {course.modules.length}</p>
        <p><strong>Is Enrolled:</strong> {course.enrollments.length > 0 ? 'Yes' : 'No'}</p>
      </div>

      <div className="space-y-4">
        {course.modules.map((module) => (
          <div key={module.id} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              Module {module.order}: {module.title}
            </h3>
            
            <div className="space-y-2">
              {module.lessons.map((lesson) => (
                <div key={lesson.id} className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p><strong>Lesson {lesson.order}:</strong> {lesson.title || 'Untitled'}</p>
                      <p><strong>Type:</strong> {lesson.lessonType}</p>
                      {lesson.youtubeUrl && (
                        <p><strong>YouTube URL:</strong> {lesson.youtubeUrl}</p>
                      )}
                      {lesson.quizId && (
                        <p><strong>Quiz ID:</strong> {lesson.quizId}</p>
                      )}
                      <p><strong>Required %:</strong> {lesson.requiredCompletionPercentage}%</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Watch History: {lesson.watchHistory.length > 0 ? 'Yes' : 'No'}</p>
                      {lesson.watchHistory.length > 0 && (
                        <p>Progress: {lesson.watchHistory[0].watchTime}%</p>
                      )}
                    </div>
                  </div>
                  
                  {lesson.quiz && (
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <p><strong>Quiz:</strong> {lesson.quiz.title}</p>
                      <p><strong>Questions:</strong> {lesson.quiz.questions.length}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <a 
          href={`/courses/${courseId}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Course Page
        </a>
      </div>
    </div>
  )
}