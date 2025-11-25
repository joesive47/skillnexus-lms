import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function checkCourse() {
  try {
    const courseId = 'cmicko3ga0000y4vdyjmrvbqh'
    
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      }
    })
    
    if (!course) {
      console.log('Course not found!')
      return
    }
    
    console.log('Course found:')
    console.log('ID:', course.id)
    console.log('Title:', course.title)
    console.log('Published:', course.published)
    
    console.log('\nModules:')
    course.modules.forEach(module => {
      console.log(`- Module ${module.order}: ${module.title} (ID: ${module.id})`)
      
      console.log('  Lessons:')
      module.lessons.forEach(lesson => {
        console.log(`    - Lesson ${lesson.order}: ${lesson.title || 'No title'} (ID: ${lesson.id})`)
        console.log(`      Type: ${lesson.lessonType}`)
        console.log(`      URL: ${lesson.youtubeUrl || lesson.launchUrl || 'No URL'}`)
      })
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCourse()