import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testCourseQuery() {
  const courseId = 'cmhko4c6b0001g0gti94nwoxz'
  
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✓ Database connected')
    
    // Test the exact query from the course page
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                watchHistory: {
                  where: { userId: 'test-user-id' }
                }
              }
            }
          },
          orderBy: { order: 'asc' }
        },
        enrollments: {
          where: { userId: 'test-user-id' }
        }
      }
    })

    if (course) {
      console.log('✓ Course found!')
      console.log(`Title: ${course.title}`)
      console.log(`Published: ${course.published}`)
      console.log(`Modules: ${course.modules.length}`)
      console.log(`Enrollments: ${course.enrollments.length}`)
    } else {
      console.log('✗ Course not found')
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCourseQuery()