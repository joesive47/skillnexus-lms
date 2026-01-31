import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyCourses() {
  console.log('🔍 Verifying World-Changing Courses...\n')

  const courses = await prisma.course.findMany({
    where: {
      slug: {
        in: [
          'sdgs-leadership-2030',
          'circular-economy-zero-waste',
          'social-entrepreneurship-impact',
          'renewable-energy-cleantech',
          'regenerative-agriculture-food'
        ]
      }
    },
    include: {
      _count: {
        select: {
          modules: true,
          enrollments: true
        }
      }
    }
  })

  if (courses.length === 0) {
    console.log('❌ No courses found. Please run: npm run seed:world-change')
    return
  }

  console.log(`✅ Found ${courses.length} courses:\n`)

  courses.forEach((course, index) => {
    console.log(`${index + 1}. ${course.title}`)
    console.log(`   📊 Slug: ${course.slug}`)
    console.log(`   ⏱️  Duration: ${course.duration} minutes`)
    console.log(`   📚 Modules: ${course._count.modules}`)
    console.log(`   💰 Price: ฿${course.price}`)
    console.log(`   ⭐ Rating: ${course.rating}/5.0`)
    console.log(`   👥 Enrollments: ${course._count.enrollments}`)
    console.log('')
  })

  const totalDuration = courses.reduce((sum, c) => sum + c.duration, 0)
  const totalModules = courses.reduce((sum, c) => sum + c._count.modules, 0)
  const totalPrice = courses.reduce((sum, c) => sum + c.price, 0)

  console.log('📊 Summary:')
  console.log(`   Total Courses: ${courses.length}`)
  console.log(`   Total Duration: ${totalDuration} minutes (${(totalDuration / 60).toFixed(1)} hours)`)
  console.log(`   Total Modules: ${totalModules}`)
  console.log(`   Total Value: ฿${totalPrice}`)
  console.log(`   Average Rating: ${(courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(2)}/5.0`)
  console.log('\n🎉 All courses verified successfully!')
}

verifyCourses()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
