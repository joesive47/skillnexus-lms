// Script to check if a course exists in the database
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkCourse(courseId) {
  try {
    console.log(`\n🔍 Checking course: ${courseId}\n`)
    
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        _count: {
          select: {
            lessons: true,
            enrollments: true,
            modules: true
          }
        }
      }
    })

    if (!course) {
      console.log('❌ Course NOT FOUND')
      console.log('\n📋 Getting list of available courses...\n')
      
      const courses = await prisma.course.findMany({
        select: {
          id: true,
          title: true,
          published: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
      
      console.log(`Found ${courses.length} courses:\n`)
      courses.forEach((c, i) => {
        console.log(`${i + 1}. ${c.title}`)
        console.log(`   ID: ${c.id}`)
        console.log(`   Published: ${c.published ? 'Yes' : 'No'}`)
        console.log(`   Created: ${c.createdAt.toLocaleDateString()}\n`)
      })
    } else {
      console.log('✅ Course FOUND!')
      console.log(`\nTitle: ${course.title}`)
      console.log(`Published: ${course.published ? 'Yes' : 'No'}`)
      console.log(`Lessons: ${course._count.lessons}`)
      console.log(`Modules: ${course._count.modules}`)
      console.log(`Enrollments: ${course._count.enrollments}`)
      console.log(`Created: ${course.createdAt.toLocaleDateString()}`)
      console.log(`\nEdit URL: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/admin/courses/${courseId}/edit`)
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Get course ID from command line argument
const courseId = process.argv[2] || 'cmlccqk0i00015hih00few2zi'
checkCourse(courseId)
