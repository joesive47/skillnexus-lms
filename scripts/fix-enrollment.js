import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixEnrollment() {
  try {
    // Get admin user
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@skillnexus.com' }
    })

    if (!admin) {
      console.log('Admin user not found')
      return
    }

    // Get the course with the specific ID
    const courseId = 'cmhivzf9h0004giz3flhpzjr7'
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      console.log(`Course not found with ID: ${courseId}`)
      return
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: admin.id,
          courseId: courseId
        }
      },
      update: {},
      create: {
        userId: admin.id,
        courseId: courseId
      }
    })

    console.log('Enrollment created/updated:', enrollment)
    console.log('Admin user can now access the course')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixEnrollment()