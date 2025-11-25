import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createSampleCourse() {
  try {
    console.log('🚀 Creating sample course with videos and quizzes...')

    // สร้างหลักสูตรตัวอย่าง
    const course = await prisma.course.create({
      data: {
        title: 'JavaScript Fundamentals',
        description: 'เรียนรู้พื้นฐาน JavaScript สำหรับผู้เริ่มต้น พร้อมทั้ง Video และแบบทดสอบ',
        price: 0,
        published: true,
        imageUrl: '/uploads/courses/javascript-course.jpg'
      }
    })

    console.log('✅ Course created:', course.title)

    // สร้าง Module
    const module1 = await prisma.module.create({
      data: {
        title: 'Introduction to JavaScript',
        order: 1,
        courseId: course.id
      }
    })

    const module2 = await prisma.module.create({
      data: {
        title: 'Variables and Data Types',
        order: 2,
        courseId: course.id
      }
    })

    console.log('✅ Modules created')

    // สร้าง Quiz สำหรับ JavaScript Basics
    const quiz1 = await prisma.quiz.create({
      data: {
        title: 'JavaScript Basics Quiz',
        courseId: course.id
      }
    })

    // สร้างคำถามสำหรับ Quiz 1
    const question1 = await prisma.question.create({
      data: {
        text: 'JavaScript เป็นภาษาโปรแกรมประเภทใด?',
        quizId: quiz1.id
      }
    })

    await prisma.answerOption.createMany({
      data: [
        { text: 'Compiled Language', isCorrect: false, questionId: question1.id },
        { text: 'Interpreted Language', isCorrect: true, questionId: question1.id },
        { text: 'Assembly Language', isCorrect: false, questionId: question1.id },
        { text: 'Machine Language', isCorrect: false, questionId: question1.id }
      ]
    })

    const question2 = await prisma.question.create({
      data: {
        text: 'คำสั่งใดใช้สำหรับแสดงผลใน Console?',
        quizId: quiz1.id
      }
    })

    await prisma.answerOption.createMany({
      data: [
        { text: 'print()', isCorrect: false, questionId: question2.id },
        { text: 'console.log()', isCorrect: true, questionId: question2.id },
        { text: 'echo()', isCorrect: false, questionId: question2.id },
        { text: 'display()', isCorrect: false, questionId: question2.id }
      ]
    })

    // สร้าง Quiz สำหรับ Variables
    const quiz2 = await prisma.quiz.create({
      data: {
        title: 'Variables and Data Types Quiz',
        courseId: course.id
      }
    })

    const question3 = await prisma.question.create({
      data: {
        text: 'คำสั่งใดใช้สำหรับประกาศตัวแปรใน JavaScript?',
        quizId: quiz2.id
      }
    })

    await prisma.answerOption.createMany({
      data: [
        { text: 'var, let, const', isCorrect: true, questionId: question3.id },
        { text: 'int, float, string', isCorrect: false, questionId: question3.id },
        { text: 'define, declare, set', isCorrect: false, questionId: question3.id },
        { text: 'variable, value, data', isCorrect: false, questionId: question3.id }
      ]
    })

    console.log('✅ Quizzes and questions created')

    // สร้าง Lessons
    const lessons = [
      {
        title: 'What is JavaScript?',
        lessonType: 'VIDEO',
        order: 1,
        moduleId: module1.id,
        courseId: course.id,
        youtubeUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', // JavaScript Tutorial for Beginners
        duration: 600, // 10 minutes
        requiredCompletionPercentage: 80
      },
      {
        title: 'JavaScript Basics Quiz',
        lessonType: 'QUIZ',
        order: 2,
        moduleId: module1.id,
        courseId: course.id,
        quizId: quiz1.id,
        requiredCompletionPercentage: 80
      },
      {
        title: 'Variables in JavaScript',
        lessonType: 'VIDEO',
        order: 3,
        moduleId: module2.id,
        courseId: course.id,
        youtubeUrl: 'https://www.youtube.com/watch?v=9WIJQDvt4Us', // JavaScript Variables
        duration: 480, // 8 minutes
        requiredCompletionPercentage: 80
      },
      {
        title: 'Data Types Explained',
        lessonType: 'VIDEO',
        order: 4,
        moduleId: module2.id,
        courseId: course.id,
        youtubeUrl: 'https://www.youtube.com/watch?v=808eYu9B9Yw', // JavaScript Data Types
        duration: 720, // 12 minutes
        requiredCompletionPercentage: 80
      },
      {
        title: 'Variables and Data Types Quiz',
        lessonType: 'QUIZ',
        order: 5,
        moduleId: module2.id,
        courseId: course.id,
        quizId: quiz2.id,
        requiredCompletionPercentage: 80,
        isFinalExam: true // Final exam for certificate
      }
    ]

    // สร้าง lessons และเชื่อมโยง sequence
    const createdLessons = []
    for (const lessonData of lessons) {
      const lesson = await prisma.lesson.create({
        data: lessonData
      })
      createdLessons.push(lesson)
    }

    // เชื่อมโยง nextLessonId
    for (let i = 0; i < createdLessons.length - 1; i++) {
      await prisma.lesson.update({
        where: { id: createdLessons[i].id },
        data: { nextLessonId: createdLessons[i + 1].id }
      })
    }

    console.log('✅ Lessons created and linked')

    // สร้าง Admin user ถ้ายังไม่มี
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@skillnexus.com' },
      update: {},
      create: {
        email: 'admin@skillnexus.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN'
      }
    })

    // สร้าง Student user สำหรับทดสอบ
    const studentPassword = await bcrypt.hash('student123', 10)
    const student = await prisma.user.upsert({
      where: { email: 'student@skillnexus.com' },
      update: {},
      create: {
        email: 'student@skillnexus.com',
        password: studentPassword,
        name: 'Test Student',
        role: 'STUDENT'
      }
    })

    // Enroll student ในหลักสูตร
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId: course.id
        }
      },
      update: {},
      create: {
        userId: student.id,
        courseId: course.id
      }
    })

    console.log('✅ Users created and enrolled')

    console.log(`
🎉 Sample course created successfully!

📚 Course: ${course.title}
🎯 Modules: 2 modules with 5 lessons
📹 Videos: 3 video lessons with anti-skip technology
📝 Quizzes: 2 quizzes with multiple choice questions
🏆 Final Exam: Lesson 5 (generates certificate when passed)

👤 Test Accounts:
   Admin: admin@skillnexus.com / admin123
   Student: student@skillnexus.com / student123

🚀 Start the development server and visit:
   http://localhost:3000/courses/${course.id}
`)

  } catch (error) {
    console.error('❌ Error creating sample course:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleCourse()