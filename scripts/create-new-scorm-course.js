import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createNewScormCourse() {
  try {
    console.log('🚀 Creating new SCORM course...')

    // สร้างหลักสูตรใหม่
    const course = await prisma.course.create({
      data: {
        title: 'Web Development Fundamentals (SCORM)',
        description: 'เรียนรู้การพัฒนาเว็บไซต์พื้นฐานผ่าน SCORM Package แบบ Interactive',
        price: 299,
        published: true,
        imageUrl: '/images/web-dev-course.jpg',
        category: 'Programming',
        level: 'BEGINNER',
        duration: 180, // 3 ชั่วโมง
        tags: ['HTML', 'CSS', 'JavaScript', 'Web Development', 'SCORM']
      }
    })

    console.log(`✅ Course created: ${course.title} (ID: ${course.id})`)

    // สร้างบทเรียน SCORM หลายบท
    const lessons = [
      {
        title: 'HTML Basics - Structure and Elements',
        description: 'เรียนรู้โครงสร้างพื้นฐานของ HTML และ Elements สำคัญ',
        order: 1,
        duration: 45,
        packagePath: '/scorm-packages/web-dev-fundamentals/html-basics'
      },
      {
        title: 'CSS Styling and Layout',
        description: 'การจัดรูปแบบและ Layout ด้วย CSS',
        order: 2,
        duration: 60,
        packagePath: '/scorm-packages/web-dev-fundamentals/css-styling'
      },
      {
        title: 'JavaScript Interactivity',
        description: 'เพิ่มความโต้ตอบให้เว็บไซต์ด้วย JavaScript',
        order: 3,
        duration: 75,
        packagePath: '/scorm-packages/web-dev-fundamentals/javascript-basics'
      }
    ]

    for (const lessonData of lessons) {
      // สร้างบทเรียน
      const lesson = await prisma.lesson.create({
        data: {
          courseId: course.id,
          title: lessonData.title,
          description: lessonData.description,
          type: 'SCORM',
          lessonType: 'SCORM',
          order: lessonData.order,
          duration: lessonData.duration,
          published: true
        }
      })

      console.log(`✅ Lesson created: ${lesson.title} (ID: ${lesson.id})`)

      // สร้าง SCORM Package สำหรับแต่ละบทเรียน
      const scormPackage = await prisma.scormPackage.create({
        data: {
          lessonId: lesson.id,
          packagePath: lessonData.packagePath,
          manifest: JSON.stringify({
            identifier: `web-dev-${lessonData.order}`,
            title: lessonData.title,
            version: '2004.4',
            organizations: {
              organization: [{
                identifier: `org-${lessonData.order}`,
                title: lessonData.title,
                item: [{
                  identifier: `item-${lessonData.order}`,
                  title: lessonData.title,
                  identifierref: `resource-${lessonData.order}`
                }]
              }]
            },
            resources: {
              resource: [{
                identifier: `resource-${lessonData.order}`,
                type: 'webcontent',
                scormType: 'sco',
                href: 'index.html',
                file: [
                  { href: 'index.html' },
                  { href: 'script.js' },
                  { href: 'style.css' },
                  { href: '../shared/scorm-api.js' }
                ]
              }]
            }
          }),
          version: '2004.4',
          title: lessonData.title,
          identifier: `web-dev-${lessonData.order}`,
          launchUrl: 'index.html'
        }
      })

      console.log(`✅ SCORM package created for lesson: ${scormPackage.id}`)
    }

    // สร้างแบบทดสอบ Quiz สำหรับหลักสูตร
    const quiz = await prisma.quiz.create({
      data: {
        courseId: course.id,
        title: 'Web Development Fundamentals Assessment',
        description: 'แบบทดสอบประเมินความรู้ Web Development พื้นฐาน',
        timeLimit: 30,
        passingScore: 80,
        published: true
      }
    })

    // สร้างคำถาม Quiz
    const questions = [
      {
        question: 'HTML ย่อมาจากอะไร?',
        type: 'MULTIPLE_CHOICE',
        options: [
          'HyperText Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlink and Text Markup Language'
        ],
        correctAnswer: 0,
        points: 10
      },
      {
        question: 'CSS ใช้สำหรับอะไร?',
        type: 'MULTIPLE_CHOICE',
        options: [
          'สร้างโครงสร้างเว็บไซต์',
          'จัดรูปแบบและการแสดงผล',
          'เพิ่มความโต้ตอบ',
          'จัดการฐานข้อมูล'
        ],
        correctAnswer: 1,
        points: 10
      },
      {
        question: 'JavaScript เป็นภาษาโปรแกรมประเภทใด?',
        type: 'MULTIPLE_CHOICE',
        options: [
          'Compiled Language',
          'Interpreted Language',
          'Assembly Language',
          'Machine Language'
        ],
        correctAnswer: 1,
        points: 10
      }
    ]

    for (let i = 0; i < questions.length; i++) {
      const questionData = questions[i]
      await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          question: questionData.question,
          type: questionData.type,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer,
          points: questionData.points,
          order: i + 1
        }
      })
    }

    console.log(`✅ Quiz created with ${questions.length} questions`)

    // ลงทะเบียนนักเรียนตัวอย่าง
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT'
      },
      take: 5
    })

    for (const student of students) {
      try {
        await prisma.enrollment.create({
          data: {
            userId: student.id,
            courseId: course.id,
            enrolledAt: new Date()
          }
        })
        console.log(`✅ Enrolled student: ${student.email}`)
      } catch (error) {
        // Skip if already enrolled
        console.log(`⚠️ Student ${student.email} already enrolled or error occurred`)
      }
    }

    // สร้างใบรับรอง
    const certificate = await prisma.certificate.create({
      data: {
        courseId: course.id,
        title: 'Web Development Fundamentals Certificate',
        description: 'ใบรับรองการจบหลักสูตร Web Development พื้นฐาน',
        template: JSON.stringify({
          background: '#ffffff',
          border: '#2563eb',
          logo: '/images/skillnexus-logo.png',
          signature: 'ทวีศักดิ์ เจริญศิลป์',
          position: 'ผู้อำนวยการ SkillNexus Academy'
        })
      }
    })

    console.log(`✅ Certificate template created: ${certificate.id}`)

    console.log('\\n🎉 New SCORM course created successfully!')
    console.log('=' .repeat(50))
    console.log(`📚 Course: ${course.title}`)
    console.log(`🆔 Course ID: ${course.id}`)
    console.log(`💰 Price: ${course.price} บาท`)
    console.log(`⏱️ Duration: ${course.duration} นาที`)
    console.log(`📖 Lessons: ${lessons.length} บทเรียน`)
    console.log(`❓ Quiz Questions: ${questions.length} ข้อ`)
    console.log(`👥 Enrolled Students: ${students.length} คน`)
    console.log(`🏆 Certificate: Available`)
    console.log(`🌐 Access URL: /courses/${course.id}`)
    console.log('=' .repeat(50))

    return {
      courseId: course.id,
      title: course.title,
      lessonsCount: lessons.length,
      studentsEnrolled: students.length
    }

  } catch (error) {
    console.error('❌ Error creating SCORM course:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// เรียกใช้ฟังก์ชัน
if (import.meta.url === `file://${process.argv[1]}`) {
  createNewScormCourse()
    .then((result) => {
      console.log('\\n✨ Course creation completed successfully!')
      console.log('Result:', result)
    })
    .catch((error) => {
      console.error('💥 Failed to create course:', error)
      process.exit(1)
    })
}

export default createNewScormCourse