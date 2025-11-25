import prisma from '@/lib/prisma'

export default async function TestLessonPage() {
  try {
    // Test database connection and get some sample data
    const courses = await prisma.course.findMany({
      take: 5,
      include: {
        modules: {
          include: {
            lessons: {
              take: 3
            }
          }
        }
      }
    })

    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Test Lesson Routes</h1>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Available Courses and Lessons:</h2>
          
          {courses.map(course => (
            <div key={course.id} className="border p-4 rounded">
              <h3 className="font-medium">Course: {course.title}</h3>
              <p className="text-sm text-gray-600">ID: {course.id}</p>
              
              {course.modules.map(module => (
                <div key={module.id} className="ml-4 mt-2">
                  <h4 className="font-medium">Module: {module.title}</h4>
                  
                  {module.lessons.map(lesson => (
                    <div key={lesson.id} className="ml-4 mt-1">
                      <p className="text-sm">
                        Lesson: {lesson.title || `Lesson ${lesson.order}`}
                      </p>
                      <p className="text-xs text-gray-500">ID: {lesson.id}</p>
                      <a 
                        href={`/courses/${course.id}/lessons/${lesson.id}`}
                        className="text-blue-500 hover:underline text-xs"
                      >
                        → Test Link
                      </a>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
          
          {courses.length === 0 && (
            <p className="text-gray-500">No courses found in database</p>
          )}
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Database Error</h1>
        <pre className="bg-red-50 p-4 rounded text-sm">
          {error instanceof Error ? error.message : 'Unknown error'}
        </pre>
      </div>
    )
  }
}