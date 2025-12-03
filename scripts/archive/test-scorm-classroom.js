import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function testScormClassroom() {
  try {
    console.log('🧪 Testing SCORM classroom functionality...')

    // Find or create a test course
    let course = await prisma.course.findFirst({
      where: { title: 'SCORM Test Course' }
    })

    if (!course) {
      console.log('📚 Creating test course...')
      course = await prisma.course.create({
        data: {
          title: 'SCORM Test Course',
          description: 'Test course for SCORM functionality',
          published: true,
          price: 0
        }
      })
    }

    console.log(`✅ Course: ${course.title} (ID: ${course.id})`)

    // Create or find a test lesson
    let lesson = await prisma.lesson.findFirst({
      where: { 
        courseId: course.id,
        lessonType: 'SCORM'
      },
      include: { scormPackage: true }
    })

    if (!lesson) {
      console.log('📝 Creating SCORM lesson...')
      lesson = await prisma.lesson.create({
        data: {
          courseId: course.id,
          title: 'Sample SCORM Lesson',
          lessonType: 'SCORM',
          type: 'SCORM',
          order: 1
        }
      })

      // Create SCORM package entry
      const scormPackage = await prisma.scormPackage.create({
        data: {
          lessonId: lesson.id,
          packagePath: '/scorm-sample',
          title: 'Sample SCORM Course',
          identifier: 'sample-scorm-001',
          version: '1.2'
        }
      })

      console.log(`✅ SCORM Package created: ${scormPackage.id}`)
    }

    console.log(`✅ SCORM Lesson: ${lesson.title} (ID: ${lesson.id})`)

    // Find a test user
    const testUser = await prisma.user.findFirst({
      where: { email: 'student@skillnexus.com' }
    })

    if (!testUser) {
      console.log('❌ Test user not found. Please run the seed script first.')
      return
    }

    // Create enrollment if not exists
    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: testUser.id,
          courseId: course.id
        }
      },
      update: {},
      create: {
        userId: testUser.id,
        courseId: course.id
      }
    })

    console.log('✅ User enrolled in course')

    // Test URLs
    const classroomUrl = `http://localhost:3000/dashboard/admin/courses/${course.id}/classroom?lesson=${lesson.id}`
    const scormContentUrl = `http://localhost:3000/scorm-sample/index.html`

    console.log('\n🎯 Test Results:')
    console.log('================')
    console.log(`📚 Course ID: ${course.id}`)
    console.log(`📝 Lesson ID: ${lesson.id}`)
    console.log(`👤 Test User: ${testUser.email}`)
    console.log(`🔗 Classroom URL: ${classroomUrl}`)
    console.log(`📦 SCORM Content URL: ${scormContentUrl}`)
    
    console.log('\n📋 Testing Instructions:')
    console.log('========================')
    console.log('1. Login with: student@skillnexus.com / Student@123!')
    console.log('2. Navigate to the classroom URL above')
    console.log('3. The SCORM content should load in an iframe')
    console.log('4. Test the SCORM interactions (Start Lesson, Complete Lesson, Set Score)')
    console.log('5. Check that progress is saved to the database')

    // Verify SCORM package exists
    const packageExists = await prisma.scormPackage.findUnique({
      where: { lessonId: lesson.id }
    })

    if (packageExists) {
      console.log('✅ SCORM package is properly linked to lesson')
    } else {
      console.log('❌ SCORM package not found for lesson')
    }

    // Check if SCORM content files exist
    const scormPath = path.join(process.cwd(), 'public', 'scorm-sample', 'index.html')
    if (fs.existsSync(scormPath)) {
      console.log('✅ SCORM content files exist')
    } else {
      console.log('❌ SCORM content files not found')
    }

    console.log('\n🎉 SCORM classroom test setup complete!')

  } catch (error) {
    console.error('❌ Error testing SCORM classroom:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testScormClassroom()