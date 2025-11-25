import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function createScormCourse() {
  try {
    console.log('🚀 Creating SCORM course...')

    // Create course
    const course = await prisma.course.create({
      data: {
        title: 'JavaScript Fundamentals (SCORM)',
        description: 'เรียนรู้พื้นฐาน JavaScript ผ่าน SCORM Package',
        price: 0,
        published: true,
        imageUrl: '/images/javascript-course.jpg'
      }
    })

    console.log(`✅ Course created: ${course.title} (ID: ${course.id})`)

    // Create lesson
    const lesson = await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: 'JavaScript Fundamentals Interactive',
        type: 'SCORM',
        lessonType: 'SCORM',
        order: 1,
        duration: 60
      }
    })

    console.log(`✅ Lesson created: ${lesson.title} (ID: ${lesson.id})`)

    // Upload SCORM package
    const scormPath = path.join(process.cwd(), 'public', 'scorm-packages', 'javascript-fundamentals.zip')
    
    if (fs.existsSync(scormPath)) {
      console.log('📦 Found SCORM package, uploading...')
      const packageBuffer = fs.readFileSync(scormPath)
      
      const { scormService } = await import('../src/lib/scorm-service.ts')
      const packageId = await scormService.uploadPackage(packageBuffer, lesson.id, false)
      
      console.log(`✅ SCORM package uploaded: ${packageId}`)
    } else {
      console.log('⚠️ SCORM package not found, creating placeholder...')
      
      // Create SCORM package record manually
      await prisma.scormPackage.create({
        data: {
          lessonId: lesson.id,
          packagePath: '/scorm-packages/javascript-fundamentals',
          manifest: JSON.stringify({
            identifier: 'js-fundamentals',
            title: 'JavaScript Fundamentals',
            version: '1.2'
          }),
          version: '1.2',
          title: 'JavaScript Fundamentals',
          identifier: 'js-fundamentals'
        }
      })
    }

    // Enroll sample users
    const users = await prisma.user.findMany({
      where: {
        role: 'STUDENT'
      },
      take: 3
    })

    for (const user of users) {
      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
          enrolledAt: new Date()
        }
      })
      console.log(`✅ Enrolled user: ${user.email}`)
    }

    console.log('\n🎉 SCORM course created successfully!')
    console.log(`Course ID: ${course.id}`)
    console.log(`Lesson ID: ${lesson.id}`)
    console.log(`Access URL: /courses/${course.id}`)

  } catch (error) {
    console.error('❌ Error creating SCORM course:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createScormCourse()