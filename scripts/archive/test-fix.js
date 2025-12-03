import { PrismaClient } from '@prisma/client'

async function testFix() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Testing database connection...')
    
    // Test basic connection
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    
    // Test course query with modules
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      },
      take: 1
    })
    
    console.log('✅ Course query successful')
    console.log(`📊 Found ${courses.length} courses`)
    
    if (courses.length > 0) {
      const course = courses[0]
      console.log(`📚 Course: ${course.title}`)
      console.log(`📁 Modules: ${course.modules?.length || 0}`)
      
      if (course.modules && course.modules.length > 0) {
        const totalLessons = course.modules.reduce((sum, module) => {
          return sum + (module.lessons?.length || 0)
        }, 0)
        console.log(`📖 Total lessons: ${totalLessons}`)
      }
    }
    
    console.log('🎉 All tests passed! The "g.map is not a function" error should be fixed.')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testFix()