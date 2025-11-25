import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function enrollStudents() {
  try {
    console.log('🚀 Enrolling students in the course...')

    // Find the course
    const course = await prisma.course.findFirst({
      where: { title: 'Introduction to Programming' }
    })

    if (!course) {
      console.error('❌ Course not found')
      return
    }

    // Find student users
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' }
    })

    console.log(`✅ Found ${students.length} students`)

    // Enroll all students
    for (const student of students) {
      try {
        await prisma.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: student.id,
              courseId: course.id
            }
          },
          update: {},
          create: {
            userId: student.id,
            courseId: course.id
          }
        })
        console.log(`✅ Enrolled: ${student.name} (${student.email})`)
      } catch (error) {
        console.log(`⚠️ Already enrolled: ${student.name}`)
      }
    }

    console.log('\n✅ Student enrollment complete!')
    console.log(`📚 Course: ${course.title}`)
    console.log(`👥 Students enrolled: ${students.length}`)

  } catch (error) {
    console.error('❌ Error enrolling students:', error)
  } finally {
    await prisma.$disconnect()
  }
}

enrollStudents()