import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkNewCourse() {
  try {
    console.log('🔍 Checking newly created SCORM course...')

    // Find the latest course
    const latestCourse = await prisma.course.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        lessons: {
          include: {
            scormPackage: true
          }
        },
        quizzes: {
          include: {
            questions: {
              include: {
                options: true
              }
            }
          }
        },
        enrollments: {
          include: {
            user: {
              select: {
                email: true,
                name: true
              }
            }
          }
        }
      }
    })

    if (!latestCourse) {
      console.log('❌ No courses found')
      return
    }

    console.log('\n📚 Course Information:')
    console.log('=' .repeat(50))
    console.log(`🆔 ID: ${latestCourse.id}`)
    console.log(`📖 Title: ${latestCourse.title}`)
    console.log(`📝 Description: ${latestCourse.description}`)
    console.log(`💰 Price: ${latestCourse.price} บาท`)
    console.log(`📅 Created: ${latestCourse.createdAt.toLocaleString('th-TH')}`)
    console.log(`✅ Published: ${latestCourse.published ? 'Yes' : 'No'}`)

    console.log('\n📖 Lessons:')
    console.log('-' .repeat(30))
    latestCourse.lessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ${lesson.title}`)
      console.log(`   📁 Type: ${lesson.type}`)
      console.log(`   ⏱️ Duration: ${lesson.duration} minutes`)
      console.log(`   📦 SCORM Package: ${lesson.scormPackage ? 'Yes' : 'No'}`)
      if (lesson.scormPackage) {
        console.log(`   📂 Package Path: ${lesson.scormPackage.packagePath}`)
        console.log(`   🔖 Version: ${lesson.scormPackage.version}`)
      }
      console.log('')
    })

    console.log('❓ Quizzes:')
    console.log('-' .repeat(30))
    latestCourse.quizzes.forEach((quiz, index) => {
      console.log(`${index + 1}. ${quiz.title}`)
      console.log(`   ⏰ Time Limit: ${quiz.timeLimit} minutes`)
      console.log(`   📝 Questions: ${quiz.questions.length}`)
      
      quiz.questions.forEach((question, qIndex) => {
        console.log(`   ${qIndex + 1}. ${question.text}`)
        console.log(`      Type: ${question.type}`)
        console.log(`      Options: ${question.options.length}`)
        console.log(`      Correct: ${question.correctAnswer}`)
      })
      console.log('')
    })

    console.log('👥 Enrollments:')
    console.log('-' .repeat(30))
    latestCourse.enrollments.forEach((enrollment, index) => {
      console.log(`${index + 1}. ${enrollment.user.email}`)
      console.log(`   📅 Enrolled: ${enrollment.createdAt.toLocaleString('th-TH')}`)
    })

    console.log('\n🌐 Access Information:')
    console.log('=' .repeat(50))
    console.log(`🔗 Course URL: /courses/${latestCourse.id}`)
    console.log(`📱 Dashboard: /dashboard`)
    console.log(`🎓 Learning: /courses/${latestCourse.id}/learn`)

    console.log('\n📁 SCORM Files Check:')
    console.log('-' .repeat(30))
    
    // Check if SCORM files exist
    const fs = await import('fs')
    const path = await import('path')
    
    const scormBasePath = 'c:/API/The-SkillNexus/public/scorm-packages/web-dev-fundamentals'
    const lessons = ['html-basics', 'css-styling', 'javascript-basics']
    
    for (const lesson of lessons) {
      const lessonPath = path.join(scormBasePath, lesson)
      const indexPath = path.join(lessonPath, 'index.html')
      const scriptPath = path.join(lessonPath, 'script.js')
      const stylePath = path.join(lessonPath, 'style.css')
      
      console.log(`📂 ${lesson}:`)
      console.log(`   📄 index.html: ${fs.existsSync(indexPath) ? '✅' : '❌'}`)
      console.log(`   📄 script.js: ${fs.existsSync(scriptPath) ? '✅' : '❌'}`)
      console.log(`   📄 style.css: ${fs.existsSync(stylePath) ? '✅' : '❌'}`)
    }
    
    // Check shared files
    const sharedPath = path.join(scormBasePath, 'shared')
    const apiPath = path.join(sharedPath, 'scorm-api.js')
    const manifestPath = path.join(scormBasePath, 'imsmanifest.xml')
    
    console.log(`📂 shared:`)
    console.log(`   📄 scorm-api.js: ${fs.existsSync(apiPath) ? '✅' : '❌'}`)
    console.log(`📄 imsmanifest.xml: ${fs.existsSync(manifestPath) ? '✅' : '❌'}`)

    console.log('\n🎉 Course Check Complete!')
    console.log('=' .repeat(50))
    console.log(`✅ Course Created: ${latestCourse.title}`)
    console.log(`✅ Lessons: ${latestCourse.lessons.length}`)
    console.log(`✅ Quiz Questions: ${latestCourse.quizzes.reduce((total, quiz) => total + quiz.questions.length, 0)}`)
    console.log(`✅ Enrolled Students: ${latestCourse.enrollments.length}`)
    console.log(`✅ SCORM Packages: ${latestCourse.lessons.filter(l => l.scormPackage).length}`)

  } catch (error) {
    console.error('❌ Error checking course:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkNewCourse()