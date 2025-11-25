import { PrismaClient } from '@prisma/client'

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

    // Create SCORM package record
    const scormPackage = await prisma.scormPackage.create({
      data: {
        lessonId: lesson.id,
        packagePath: '/scorm-packages/javascript-fundamentals',
        manifest: JSON.stringify({
          identifier: 'js-fundamentals',
          title: 'JavaScript Fundamentals',
          version: '1.2',
          organizations: {
            organization: [{
              identifier: 'org1',
              title: 'JavaScript Course',
              item: [{
                identifier: 'item1',
                title: 'Introduction',
                identifierref: 'resource1'
              }]
            }]
          },
          resources: {
            resource: [{
              identifier: 'resource1',
              type: 'webcontent',
              href: 'modules/introduction/index.html',
              file: [{ href: 'modules/introduction/index.html' }]
            }]
          }
        }),
        version: '1.2',
        title: 'JavaScript Fundamentals',
        identifier: 'js-fundamentals'
      }
    })

    console.log(`✅ SCORM package created: ${scormPackage.id}`)

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
          courseId: course.id
        }
      })
      console.log(`✅ Enrolled user: ${user.email}`)
    }

    console.log('\n🎉 SCORM course created successfully!')
    console.log(`Course ID: ${course.id}`)
    console.log(`Lesson ID: ${lesson.id}`)
    console.log(`SCORM Package ID: ${scormPackage.id}`)
    console.log(`Access URL: /courses/${course.id}`)

  } catch (error) {
    console.error('❌ Error creating SCORM course:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createScormCourse()