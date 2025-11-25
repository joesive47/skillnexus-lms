import { PrismaClient } from '@prisma/client'
import { scormService } from '../src/lib/scorm-service.js'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function addScormLesson() {
  try {
    console.log('🚀 Adding SCORM lesson to existing course...')

    // Find the existing course
    const course = await prisma.course.findFirst({
      where: { title: 'Introduction to Programming' },
      include: { modules: true }
    })

    if (!course) {
      console.error('❌ Course not found')
      return
    }

    console.log(`✅ Found course: ${course.title}`)

    // Create a SCORM lesson
    const scormLesson = await prisma.lesson.create({
      data: {
        title: 'Interactive SCORM Demo',
        courseId: course.id,
        lessonType: 'SCORM',
        type: 'SCORM',
        order: 4,
        moduleId: course.modules[1]?.id, // Add to second module
        content: 'Interactive SCORM content with quiz and progress tracking',
        duration: 900, // 15 minutes
        requiredCompletionPercentage: 100
      }
    })

    console.log(`✅ Created SCORM lesson: ${scormLesson.title} (ID: ${scormLesson.id})`)

    // Create SCORM package from sample content
    const sampleScormPath = path.join(process.cwd(), 'public', 'scorm-sample')
    const zipPath = path.join(process.cwd(), 'public', 'scorm-test.zip')

    // Check if sample SCORM exists
    if (fs.existsSync(zipPath)) {
      console.log('📦 Found existing SCORM package, uploading...')
      
      const zipBuffer = fs.readFileSync(zipPath)
      const packageId = await scormService.uploadPackage(zipBuffer, scormLesson.id)
      
      console.log(`✅ SCORM package uploaded successfully: ${packageId}`)
    } else {
      console.log('📦 Creating SCORM package from sample content...')
      
      // Create a simple SCORM package manually
      await prisma.scormPackage.create({
        data: {
          lessonId: scormLesson.id,
          packagePath: '/scorm-sample',
          title: 'Sample SCORM Course',
          identifier: 'com.example.scorm.sample',
          version: '2004 4th Edition',
          manifest: JSON.stringify({
            identifier: 'com.example.scorm.sample',
            title: 'Sample SCORM Course',
            version: '2004 4th Edition',
            organizations: {
              organization: [{
                identifier: 'ORG-001',
                title: 'Sample SCORM Course',
                item: [{
                  identifier: 'ITEM-001',
                  title: 'Introduction to SCORM',
                  identifierref: 'RES-001'
                }]
              }]
            },
            resources: {
              resource: [{
                identifier: 'RES-001',
                type: 'webcontent',
                href: 'index.html'
              }]
            }
          })
        }
      })
      
      console.log('✅ SCORM package created manually')
    }

    // Enroll existing students in the updated course
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: course.id },
      include: { user: true }
    })

    console.log(`📚 Found ${enrollments.length} existing enrollments`)

    console.log('✅ SCORM lesson setup complete!')
    console.log('\n📋 Summary:')
    console.log(`- Course: ${course.title}`)
    console.log(`- SCORM Lesson: ${scormLesson.title}`)
    console.log(`- Lesson ID: ${scormLesson.id}`)
    console.log(`- Students enrolled: ${enrollments.length}`)
    console.log('\n🎯 Students can now access the SCORM content in their dashboard!')

  } catch (error) {
    console.error('❌ Error adding SCORM lesson:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addScormLesson()