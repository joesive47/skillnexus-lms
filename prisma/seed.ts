import { PrismaClient } from '@prisma/client'
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create admin users
  const hashedPassword = await bcrypt.hash('Admin@123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@skillnexus.com' },
    update: {},
    create: {
      email: 'admin@skillnexus.com',
      password: hashedPassword,
      name: 'นายทวีศักดิ์ เจริญศิลป์ (Mr. Taweesak Jaroensin)',
      role: 'ADMIN',
    },
  })

  await prisma.user.upsert({
    where: { email: 'admin@bizsolve-ai.com' },
    update: {},
    create: {
      email: 'admin@bizsolve-ai.com',
      password: hashedPassword,
      name: 'ผู้ดูแลระบบ BizSolve AI',
      role: 'ADMIN',
    },
  })

  // Create teacher user
  const teacherPassword = await bcrypt.hash('Teacher@123!', 12)
  await prisma.user.upsert({
    where: { email: 'teacher@skillnexus.com' },
    update: {},
    create: {
      email: 'teacher@skillnexus.com',
      password: teacherPassword,
      name: 'นายทวีศักดิ์ เจริญศิลป์ (Mr. Taweesak Jaroensin)',
      role: 'TEACHER',
    },
  })

  // Create student users with credits
  const studentPassword = await bcrypt.hash('Student@123!', 12)
  const students = [
    {
      email: 'student@skillnexus.com',
      name: 'นักเรียนตัวอย่าง',
      credits: 1000
    },
    {
      email: 'john@example.com', 
      name: 'John Doe',
      credits: 500
    },
    {
      email: 'alice@example.com',
      name: 'Alice Johnson', 
      credits: 750
    },
    {
      email: 'joesive47@gmail.com',
      name: 'Joe Sive',
      credits: 1000
    },
    {
      email: 'bob@example.com',
      name: 'Bob Smith',
      credits: 300
    },
    {
      email: 'emma@example.com',
      name: 'Emma Wilson',
      credits: 1200
    },
    {
      email: 'david@example.com',
      name: 'David Brown',
      credits: 800
    },
    {
      email: 'sarah@example.com',
      name: 'Sarah Davis',
      credits: 600
    },
    {
      email: 'mike@example.com',
      name: 'Mike Miller',
      credits: 900
    },
    {
      email: 'lisa@example.com',
      name: 'Lisa Garcia',
      credits: 400
    }
  ]

  for (const student of students) {
    await prisma.user.upsert({
      where: { email: student.email },
      update: { credits: student.credits },
      create: {
        email: student.email,
        password: studentPassword,
        name: student.name,
        role: 'STUDENT',
        credits: student.credits,
      },
    })
  }

  // Create sample course
  const course = await prisma.course.create({
    data: {
      title: 'Introduction to Programming',
      description: 'Learn the basics of programming with hands-on examples and quizzes',
      price: 99,
      published: true,
      imageUrl: '/uploads/courses/sample-course.svg',
    },
  })

  // Create modules
  const module1 = await prisma.module.create({
    data: {
      title: 'Getting Started',
      order: 1,
      courseId: course.id,
    },
  })

  const module2 = await prisma.module.create({
    data: {
      title: 'Advanced Topics',
      order: 2,
      courseId: course.id,
    },
  })

  // Create sample quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: 'Programming Basics Quiz',
      courseId: course.id,
      questions: {
        create: [
          {
            text: 'What is a variable in programming?',
            options: {
              create: [
                { text: 'A storage location for data', isCorrect: true },
                { text: 'A function that returns a value', isCorrect: false },
                { text: 'A loop structure', isCorrect: false },
                { text: 'A conditional statement', isCorrect: false },
              ]
            }
          },
          {
            text: 'Which of the following is a programming language?',
            options: {
              create: [
                { text: 'HTML', isCorrect: false },
                { text: 'CSS', isCorrect: false },
                { text: 'JavaScript', isCorrect: true },
                { text: 'JSON', isCorrect: false },
              ]
            }
          },
          {
            text: 'What does "debugging" mean?',
            options: {
              create: [
                { text: 'Writing new code', isCorrect: false },
                { text: 'Finding and fixing errors in code', isCorrect: true },
                { text: 'Deleting old code', isCorrect: false },
                { text: 'Compiling the program', isCorrect: false },
              ]
            }
          }
        ]
      }
    }
  })

  // Create lessons
  await prisma.lesson.createMany({
    data: [
      {
        title: 'Introduction Video',
        courseId: course.id,
        lessonType: 'VIDEO',
        youtubeUrl: 'https://youtu.be/rfscVS0vtbw',
        duration: 300, // 5 minutes in seconds
        requiredCompletionPercentage: 80,
        order: 1,
        moduleId: module1.id,
      },
      {
        title: 'Programming Basics Quiz',
        courseId: course.id,
        lessonType: 'QUIZ',
        quizId: quiz.id,
        order: 2,
        moduleId: module1.id,
        isFinalExam: false,
      },
      {
        title: 'Advanced Concepts',
        courseId: course.id,
        lessonType: 'VIDEO',
        youtubeUrl: 'https://youtu.be/8aGhZQkoFbQ',
        duration: 600, // 10 minutes in seconds
        requiredCompletionPercentage: 80,
        order: 3,
        moduleId: module2.id,
      },
    ],
  })

  // Create enrollments for some students
  const studentUsers = await prisma.user.findMany({
    where: { role: 'STUDENT' }
  })

  // Enroll first 5 students in the course
  for (let i = 0; i < Math.min(5, studentUsers.length); i++) {
    const student = studentUsers[i]
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

    // Add credit purchase transaction
    await prisma.transaction.create({
      data: {
        userId: student.id,
        type: 'CREDIT_PURCHASE',
        amount: student.credits,
        description: `Initial credit allocation for ${student.name}`
      }
    })

    // Add course enrollment transaction
    await prisma.transaction.create({
      data: {
        userId: student.id,
        courseId: course.id,
        type: 'COURSE_ENROLLMENT',
        amount: -course.price,
        description: `Enrolled in ${course.title}`
      }
    })
  }

  console.log('Database seeded successfully')
  console.log(`Created ${students.length} student users with credits`)
  console.log('\n=== ข้อมูลการเข้าสู่ระบบ SkillNexus LMS ===')
  console.log('\n## บัญชีผู้ดูแลระบบ (Admin)')
  console.log('- อีเมล: admin@skillnexus.com | รหัสผ่าน: Admin@123!')
  console.log('- ชื่อ: นายทวีศักดิ์ เจริญศิลป์ (Mr. Taweesak Jaroensin)')
  console.log('- อีเมล: admin@bizsolve-ai.com | รหัสผ่าน: Admin@123!')
  console.log('\n## บัญชีครู (Teacher)')
  console.log('- อีเมล: teacher@skillnexus.com | รหัสผ่าน: Teacher@123!')
  console.log('- ชื่อ: นายทวีศักดิ์ เจริญศิลป์ (Mr. Taweesak Jaroensin)')
  console.log('\n## บัญชีนักเรียน (Student)')
  console.log('- อีเมล: student@skillnexus.com | รหัสผ่าน: Student@123!')
  console.log('- อีเมล: john@example.com | รหัสผ่าน: Student@123!')
  console.log('- อีเมล: alice@example.com | รหัสผ่าน: Student@123!')
  console.log('- อีเมล: joesive47@gmail.com | รหัสผ่าน: Student@123! | เครดิต: 1000')
  console.log('(และอีก 6 บัญชีนักเรียนใช้รหัสผ่าน: Student@123!)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })