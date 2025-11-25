import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function checkLessons() {
  try {
    const courseId = 'cmicko3ga0000y4vdyjmrvbqh'
    const lessonId = 'cmicko3go0002y4vdsg9y25zr'
    
    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: true,
        module: true
      }
    })
    
    if (!lesson) {
      console.log('Lesson not found!')
      
      // Check all lessons in the course
      const allLessons = await prisma.lesson.findMany({
        where: { courseId: courseId }
      })
      
      console.log(`\nAll lessons in course ${courseId}:`)
      allLessons.forEach(l => {
        console.log(`- ${l.id}: ${l.title || 'No title'} (Type: ${l.lessonType})`)
      })
      
      return
    }
    
    console.log('Lesson found:')
    console.log('ID:', lesson.id)
    console.log('Title:', lesson.title)
    console.log('Type:', lesson.lessonType)
    console.log('Course ID:', lesson.courseId)
    console.log('Module ID:', lesson.moduleId)
    
    if (lesson.course) {
      console.log('Course:', lesson.course.title)
    }
    
    if (lesson.module) {
      console.log('Module:', lesson.module.title)
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkLessons()