import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listCourses() {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        published: true,
        createdAt: true
      }
    })

    console.log('All courses in database:')
    console.log('========================')
    
    if (courses.length === 0) {
      console.log('No courses found in database')
    } else {
      courses.forEach(course => {
        console.log(`ID: ${course.id}`)
        console.log(`Title: ${course.title}`)
        console.log(`Published: ${course.published}`)
        console.log(`Created: ${course.createdAt}`)
        console.log('---')
      })
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listCourses()