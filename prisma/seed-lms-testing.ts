/**
 * LMS Testing Seed Data
 * Creates complete course structure with lessons, quizzes, and test users
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting LMS seed...')

  // 1️⃣ Create Test Users
  console.log('\n👥 Creating test users...')
  
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const student = await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: {},
    create: {
      email: 'student@test.com',
      password: hashedPassword,
      name: 'สมชาย ทดสอบ',
      role: 'STUDENT',
      credits: 100,
      totalXP: 0,
      level: 1
    }
  })
  console.log('✅ Student created:', student.email)

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@test.com' },
    update: {},
    create: {
      email: 'teacher@test.com',
      password: hashedPassword,
      name: 'ครูสมหญิง',
      role: 'TEACHER',
      credits: 0
    }
  })
  console.log('✅ Teacher created:', teacher.email)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      credits: 9999
    }
  })
  console.log('✅ Admin created:', admin.email)

  // 2️⃣ Create Sample Course
  console.log('\n📚 Creating sample course...')
  
  const course = await prisma.course.create({
    data: {
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js และ Database จากพื้นฐานจนเป็น Full-Stack Developer',
      price: 0, // Free for testing
      published: true,
      imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800'
    }
  })
  console.log('✅ Course created:', course.title)

  // 3️⃣ Create Module
  const module = await prisma.module.create({
    data: {
      title: 'Module 1: HTML & CSS Fundamentals',
      order: 1,
      courseId: course.id
    }
  })
  console.log('✅ Module created:', module.title)

  // 4️⃣ Create Video Lessons
  console.log('\n🎥 Creating lessons...')
  
  const videoLesson1 = await prisma.lesson.create({
    data: {
      courseId: course.id,
      moduleId: module.id,
      lessonType: 'VIDEO',
      order: 1,
      title: 'Introduction to HTML',
      youtubeUrl: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
      duration: 600, // 10 minutes
      requiredCompletionPercentage: 80,
      isFinalExam: false
    }
  })

  const videoLesson2 = await prisma.lesson.create({
    data: {
      courseId: course.id,
      moduleId: module.id,
      lessonType: 'VIDEO',
      order: 2,
      title: 'HTML Tags and Elements',
      youtubeUrl: 'https://www.youtube.com/watch?v=HDGVgYuSmQ0',
      duration: 720,
      requiredCompletionPercentage: 80
    }
  })

  const videoLesson3 = await prisma.lesson.create({
    data: {
      courseId: course.id,
      moduleId: module.id,
      lessonType: 'VIDEO',
      order: 3,
      title: 'CSS Basics',
      youtubeUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
      duration: 900,
      requiredCompletionPercentage: 80
    }
  })

  console.log(`✅ Created ${3} video lessons`)

  // 5️⃣ Create Quiz
  console.log('\n📝 Creating quiz...')
  
  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'HTML Fundamentals Quiz',
      courseId: course.id,
      timeLimit: 15, // 15 minutes
      passScore: 70,
      randomize: true,
      questionsToShow: 5
    }
  })

  // Create Questions
  const question1 = await prisma.question.create({
    data: {
      text: 'What does HTML stand for?',
      type: 'MULTIPLE_CHOICE',
      quizId: quiz1.id,
      order: 1,
      correctAnswer: 'opt_a',
      options: {
        create: [
          { text: 'Hyper Text Markup Language', isCorrect: true },
          { text: 'High Tech Modern Language', isCorrect: false },
          { text: 'Home Tool Markup Language', isCorrect: false },
          { text: 'Hyperlinks and Text Markup Language', isCorrect: false }
        ]
      }
    }
  })

  const question2 = await prisma.question.create({
    data: {
      text: 'Which HTML element is used for the largest heading?',
      type: 'MULTIPLE_CHOICE',
      quizId: quiz1.id,
      order: 2,
      correctAnswer: 'opt_a',
      options: {
        create: [
          { text: '<h1>', isCorrect: true },
          { text: '<h6>', isCorrect: false },
          { text: '<heading>', isCorrect: false },
          { text: '<head>', isCorrect: false }
        ]
      }
    }
  })

  const question3 = await prisma.question.create({
    data: {
      text: 'What is the correct HTML element for inserting a line break?',
      type: 'MULTIPLE_CHOICE',
      quizId: quiz1.id,
      order: 3,
      correctAnswer: 'opt_a',
      options: {
        create: [
          { text: '<br>', isCorrect: true },
          { text: '<break>', isCorrect: false },
          { text: '<lb>', isCorrect: false },
          { text: '<newline>', isCorrect: false }
        ]
      }
    }
  })

  const question4 = await prisma.question.create({
    data: {
      text: 'Which CSS property controls the text size?',
      type: 'MULTIPLE_CHOICE',
      quizId: quiz1.id,
      order: 4,
      correctAnswer: 'opt_b',
      options: {
        create: [
          { text: 'text-style', isCorrect: false },
          { text: 'font-size', isCorrect: true },
          { text: 'text-size', isCorrect: false },
          { text: 'font-style', isCorrect: false }
        ]
      }
    }
  })

  const question5 = await prisma.question.create({
    data: {
      text: 'How do you select an element with id "demo" in CSS?',
      type: 'MULTIPLE_CHOICE',
      quizId: quiz1.id,
      order: 5,
      correctAnswer: 'opt_c',
      options: {
        create: [
          { text: '.demo', isCorrect: false },
          { text: 'demo', isCorrect: false },
          { text: '#demo', isCorrect: true },
          { text: '*demo', isCorrect: false }
        ]
      }
    }
  })

  console.log(`✅ Created quiz with ${5} questions`)

  // Create quiz lesson
  const quizLesson = await prisma.lesson.create({
    data: {
      courseId: course.id,
      moduleId: module.id,
      lessonType: 'QUIZ',
      order: 4,
      title: 'HTML & CSS Knowledge Check',
      quizId: quiz1.id,
      duration: 900
    }
  })

  // 6️⃣ Create SCORM Lesson (placeholder)
  const scormLesson = await prisma.lesson.create({
    data: {
      courseId: course.id,
      moduleId: module.id,
      lessonType: 'SCORM',
      order: 5,
      title: 'Interactive HTML Workshop',
      duration: 1200
    }
  })

  // Create SCORM package
  await prisma.scormPackage.create({
    data: {
      lessonId: scormLesson.id,
      packagePath: 'https://scorm-demo.vercel.app/demo',
      version: '1.2',
      title: 'HTML Interactive Workshop',
      identifier: 'HTML_WORKSHOP_001'
    }
  })

  console.log('✅ SCORM package created')

  // 7️⃣ Create Final Exam
  console.log('\n🎯 Creating final exam...')
  
  const finalQuiz = await prisma.quiz.create({
    data: {
      title: 'Final Exam - Web Development',
      courseId: course.id,
      timeLimit: 30,
      passScore: 70,
      randomize: true,
      questionsToShow: 10
    }
  })

  // Create final exam questions (10 questions)
  for (let i = 1; i <= 10; i++) {
    await prisma.question.create({
      data: {
        text: `Final Exam Question ${i}: Sample question about web development`,
        type: 'MULTIPLE_CHOICE',
        quizId: finalQuiz.id,
        order: i,
        correctAnswer: 'opt_a',
        options: {
          create: [
            { text: 'Correct Answer', isCorrect: true },
            { text: 'Wrong Answer 1', isCorrect: false },
            { text: 'Wrong Answer 2', isCorrect: false },
            { text: 'Wrong Answer 3', isCorrect: false }
          ]
        }
      }
    })
  }

  const finalLesson = await prisma.lesson.create({
    data: {
      courseId: course.id,
      moduleId: module.id,
      lessonType: 'QUIZ',
      order: 6,
      title: 'Final Exam',
      quizId: finalQuiz.id,
      isFinalExam: true,
      duration: 1800
    }
  })

  console.log('✅ Final exam created')

  // 8️⃣ Create Learning Nodes (Graph-based path)
  console.log('\n🔗 Creating learning path (nodes)...')
  
  const lessons = [videoLesson1, videoLesson2, videoLesson3, quizLesson, scormLesson, finalLesson]
  const nodes = []

  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i]
    const node = await prisma.learningNode.create({
      data: {
        courseId: course.id,
        nodeType: lesson.lessonType,
        refId: lesson.id,
        title: lesson.title || `Lesson ${i + 1}`,
        order: i,
        requiredScore: lesson.lessonType === 'QUIZ' ? 70 : null,
        requiredProgress: lesson.lessonType === 'VIDEO' ? 0.8 : null,
        isFinalExam: lesson.isFinalExam
      }
    })
    nodes.push(node)
  }

  // Create dependencies (sequential)
  for (let i = 0; i < nodes.length - 1; i++) {
    await prisma.nodeDependency.create({
      data: {
        fromNodeId: nodes[i].id,
        toNodeId: nodes[i + 1].id,
        dependencyType: 'AND'
      }
    })
  }

  console.log(`✅ Created ${nodes.length} nodes with ${nodes.length - 1} dependencies`)

  // 9️⃣ Create Certificate Template
  console.log('\n🏆 Creating certificate template...')
  
  await prisma.courseCertificateDefinition.create({
    data: {
      courseId: course.id,
      templateHtml: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Certificate of Completion</title>
          <style>
            body { font-family: 'Georgia', serif; text-align: center; padding: 50px; }
            .certificate { border: 10px solid #0066cc; padding: 40px; max-width: 800px; margin: auto; }
            h1 { color: #0066cc; font-size: 48px; margin-bottom: 10px; }
            h2 { font-size: 32px; color: #333; margin: 20px 0; }
            p { font-size: 18px; color: #666; }
            .name { font-size: 36px; color: #000; font-weight: bold; margin: 30px 0; }
          </style>
        </head>
        <body>
          <div class="certificate">
            <h1>CERTIFICATE OF COMPLETION</h1>
            <p>This is to certify that</p>
            <div class="name">{{recipientName}}</div>
            <p>has successfully completed</p>
            <h2>{{courseName}}</h2>
            <p>Issued on {{issueDate}}</p>
            <p>Verification Code: {{verificationCode}}</p>
            <br>
            <p><strong>{{issuerName}}</strong><br>{{issuerTitle}}</p>
          </div>
        </body>
        </html>
      `,
      issuerName: 'SkillNexus Academy',
      issuerTitle: 'Director of Learning',
      expiryMonths: null,
      isActive: true
    }
  })

  console.log('✅ Certificate template created')

  // 🔟 Enroll Student in Course
  console.log('\n📝 Enrolling student...')
  
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id
    }
  })

  console.log('✅ Student enrolled in course')

  // 1️⃣1️⃣ Create Sample Progress (student watched first video 50%)
  await prisma.watchHistory.create({
    data: {
      userId: student.id,
      lessonId: videoLesson1.id,
      watchTime: 300, // 5 minutes out of 10
      totalTime: 600,
      completed: false
    }
  })

  await prisma.nodeProgress.create({
    data: {
      userId: student.id,
      nodeId: nodes[0].id,
      courseId: course.id,
      status: 'IN_PROGRESS',
      progressPercent: 50,
      startedAt: new Date()
    }
  })

  console.log('✅ Sample progress created')

  // 1️⃣2️⃣ Create Achievements
  console.log('\n🏅 Creating achievements...')
  
  const achievements = [
    {
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      xpReward: 50,
      requirementType: 'lesson_complete',
      requirementValue: 1
    },
    {
      name: 'Quiz Master',
      description: 'Pass 5 quizzes',
      icon: '📝',
      xpReward: 100,
      requirementType: 'quiz_pass',
      requirementValue: 5
    },
    {
      name: 'Course Completer',
      description: 'Complete a full course',
      icon: '🏆',
      xpReward: 500,
      requirementType: 'course_complete',
      requirementValue: 1
    },
    {
      name: 'Streak Master',
      description: 'Login 7 days in a row',
      icon: '🔥',
      xpReward: 200,
      requirementType: 'login_streak',
      requirementValue: 7
    }
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: achievement
    })
  }

  console.log(`✅ Created ${achievements.length} achievements`)

  // 1️⃣3️⃣ Create Daily Missions
  console.log('\n🎯 Creating daily missions...')
  
  const missions = [
    {
      title: 'Watch a Video',
      description: 'Complete watching 1 video lesson today',
      type: 'lesson_complete',
      target: 1,
      xpReward: 50,
      creditReward: 1,
      isActive: true
    },
    {
      title: 'Pass a Quiz',
      description: 'Successfully pass 1 quiz today',
      type: 'quiz_pass',
      target: 1,
      xpReward: 75,
      creditReward: 2,
      isActive: true
    },
    {
      title: 'Study Time',
      description: 'Spend 30 minutes learning',
      type: 'study_time',
      target: 30,
      xpReward: 100,
      creditReward: 3,
      isActive: true
    }
  ]

  for (const mission of missions) {
    await prisma.dailyMission.upsert({
      where: { title: mission.title },
      update: {},
      create: mission
    })
  }

  console.log(`✅ Created ${missions.length} daily missions`)

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('✨ SEED COMPLETED SUCCESSFULLY!')
  console.log('='.repeat(50))
  console.log('\n📊 Summary:')
  console.log(`   Users: 3 (student, teacher, admin)`)
  console.log(`   Courses: 1`)
  console.log(`   Lessons: 6 (3 video, 1 quiz, 1 scorm, 1 final)`)
  console.log(`   Quiz Questions: 15`)
  console.log(`   Learning Nodes: 6`)
  console.log(`   Achievements: ${achievements.length}`)
  console.log(`   Daily Missions: ${missions.length}`)
  console.log('\n🔐 Test Credentials:')
  console.log('   Student: student@test.com / password123')
  console.log('   Teacher: teacher@test.com / password123')
  console.log('   Admin:   admin@test.com / password123')
  console.log('\n🚀 Ready to test!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
