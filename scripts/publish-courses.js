import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function publishCourses() {
  try {
    const result = await prisma.course.updateMany({
      where: {
        published: false
      },
      data: {
        published: true
      }
    })

    console.log(`Updated ${result.count} courses to published status`)
    
    // List all courses after update
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        published: true
      }
    })

    console.log('\nAll courses after update:')
    console.log('========================')
    courses.forEach(course => {
      console.log(`${course.title}: ${course.published ? 'Published' : 'Draft'}`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

publishCourses()