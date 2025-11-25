import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkCourseData() {
  try {
    const courseId = 'cmhivzf9h0004giz3flhpzjr7'
    
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
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
        }
      }
    })

    if (!course) {
      console.log(`Course not found with ID: ${courseId}`)
      return
    }

    console.log('=== COURSE DATA ===')
    console.log(`Course: ${course.title}`)
    console.log(`Published: ${course.published}`)
    console.log(`Modules: ${course.modules.length}`)

    course.modules.forEach((module, moduleIndex) => {
      console.log(`\n--- Module ${moduleIndex + 1}: ${module.title} ---`)
      console.log(`Lessons: ${module.lessons.length}`)
      
      module.lessons.forEach((lesson, lessonIndex) => {
        console.log(`  Lesson ${lessonIndex + 1}: ${lesson.title || 'Untitled'}`)
        console.log(`    Type: ${lesson.lessonType}`)
        console.log(`    Order: ${lesson.order}`)
        
        if (lesson.lessonType === 'VIDEO') {
          console.log(`    YouTube URL: ${lesson.youtubeUrl || 'None'}`)
        }
        
        if (lesson.lessonType === 'QUIZ' && lesson.quiz) {
          console.log(`    Quiz: ${lesson.quiz.title}`)
          console.log(`    Questions: ${lesson.quiz.questions.length}`)
        }
      })
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCourseData()