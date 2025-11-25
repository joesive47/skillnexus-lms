import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testScormAccess() {
  try {
    console.log('🔍 Testing SCORM lesson access...')

    // Find SCORM lessons
    const scormLessons = await prisma.lesson.findMany({
      where: { 
        OR: [
          { lessonType: 'SCORM' },
          { type: 'SCORM' }
        ]
      },
      include: {
        course: true,
        scormPackage: true
      }
    })

    console.log(`✅ Found ${scormLessons.length} SCORM lessons`)

    for (const lesson of scormLessons) {
      console.log(`\n📦 SCORM Lesson: ${lesson.title}`)
      console.log(`   - Course: ${lesson.course.title}`)
      console.log(`   - Lesson ID: ${lesson.id}`)
      console.log(`   - Lesson Type: ${lesson.lessonType}`)
      console.log(`   - Type: ${lesson.type}`)
      
      if (lesson.scormPackage) {
        console.log(`   - Package ID: ${lesson.scormPackage.id}`)
        console.log(`   - Package Path: ${lesson.scormPackage.packagePath}`)
        console.log(`   - Package Title: ${lesson.scormPackage.title}`)
        console.log(`   - SCORM URL: ${lesson.scormPackage.packagePath}/index.html`)
      } else {
        console.log(`   ❌ No SCORM package found`)
      }
    }

    // Check enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: {
        course: {
          lessons: {
            some: {
              OR: [
                { lessonType: 'SCORM' },
                { type: 'SCORM' }
              ]
            }
          }
        }
      },
      include: {
        user: true,
        course: true
      }
    })

    console.log(`\n👥 Found ${enrollments.length} students enrolled in courses with SCORM content`)
    
    for (const enrollment of enrollments) {
      console.log(`   - ${enrollment.user.name} (${enrollment.user.email}) enrolled in ${enrollment.course.title}`)
    }

    console.log('\n🎯 Test URLs to try:')
    for (const lesson of scormLessons) {
      console.log(`   - Lesson: http://localhost:3000/courses/${lesson.courseId}/lessons/${lesson.id}`)
      if (lesson.scormPackage) {
        console.log(`   - SCORM Direct: http://localhost:3000${lesson.scormPackage.packagePath}/index.html`)
      }
    }

  } catch (error) {
    console.error('❌ Error testing SCORM access:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testScormAccess()