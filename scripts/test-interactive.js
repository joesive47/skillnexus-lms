const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testInteractiveFeature() {
  try {
    console.log('🎮 Testing Interactive Game Module...')

    // Find a course to add interactive lesson to
    const course = await prisma.course.findFirst({
      where: { published: true }
    })

    if (!course) {
      console.log('❌ No published course found. Please create a course first.')
      return
    }

    console.log(`✅ Found course: ${course.title}`)

    // Create an interactive lesson
    const interactiveLesson = await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: 'Sample Interactive Game',
        type: 'interactive',
        lessonType: 'INTERACTIVE',
        launchUrl: '/interactive/sample-game.html',
        order: 999,
        requiredCompletionPercentage: 70
      }
    })

    console.log(`✅ Created interactive lesson: ${interactiveLesson.title}`)

    // Find a test user
    const user = await prisma.user.findFirst({
      where: { role: 'STUDENT' }
    })

    if (!user) {
      console.log('❌ No student user found.')
      return
    }

    console.log(`✅ Found test user: ${user.email}`)

    // Create enrollment if not exists
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id
        }
      },
      update: {},
      create: {
        userId: user.id,
        courseId: course.id
      }
    })

    console.log('✅ Ensured user enrollment')

    // Simulate interactive result
    const result = await prisma.interactiveResults.create({
      data: {
        userId: user.id,
        lessonId: interactiveLesson.id,
        score: 85,
        passed: true
      }
    })

    console.log(`✅ Created test result: ${result.score}% (${result.passed ? 'PASSED' : 'FAILED'})`)

    // Test fetching results
    const results = await prisma.interactiveResults.findMany({
      where: { lessonId: interactiveLesson.id },
      include: {
        user: { select: { name: true, email: true } },
        lesson: { select: { title: true } }
      }
    })

    console.log(`✅ Found ${results.length} interactive results`)

    console.log('\n🎯 Interactive Game Module Test Summary:')
    console.log(`- Course: ${course.title}`)
    console.log(`- Interactive Lesson: ${interactiveLesson.title}`)
    console.log(`- Launch URL: ${interactiveLesson.launchUrl}`)
    console.log(`- Test Result: ${result.score}% (${result.passed ? 'PASSED' : 'FAILED'})`)
    console.log(`- User: ${user.email}`)

    console.log('\n🚀 Ready to test! Visit:')
    console.log(`   Lesson: /courses/${course.id}/lessons/${interactiveLesson.id}`)
    console.log(`   Admin: /dashboard/admin/interactive`)
    console.log(`   Course Admin: /dashboard/admin/courses/${course.id}`)

  } catch (error) {
    console.error('❌ Error testing interactive feature:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testInteractiveFeature()