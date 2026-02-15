import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...\n')

  // ========================================
  // 1. ADMIN USERS
  // ========================================
  console.log('👑 Creating ADMIN users...')
  const adminPassword = await bcrypt.hash('admin@123!', 12)

  const admins = [
    {
      email: 'admin@skillnexus.com',
      name: 'นายทวีศักดิ์ เจริญศิลป์ (Mr. Taweesak Jaroensin)',
      role: 'ADMIN'
    },
    {
      email: 'admin@bizsolve-ai.com',
      name: 'ผู้ดูแลระบบ BizSolve AI',
      role: 'ADMIN'
    },
    {
      email: 'admin@example.com',
      name: 'System Administrator',
      role: 'ADMIN'
    }
  ]

  for (const admin of admins) {
    await prisma.user.upsert({
      where: { email: admin.email },
      update: {
        role: admin.role, // CRITICAL: Ensure role is always ADMIN
        credits: 10000,
      },
      create: {
        email: admin.email,
        password: adminPassword,
        name: admin.name,
        role: admin.role,
        credits: 10000,
      },
    })
  }
  console.log(`✅ Created ${admins.length} admin users\n`)

  // ========================================
  // 2. TEACHER USERS
  // ========================================
  console.log('👨‍🏫 Creating TEACHER users...')
  const teacherPassword = await bcrypt.hash('teacher@123!', 12)

  const teachers = [
    {
      email: 'teacher@skillnexus.com',
      name: 'นายทวีศักดิ์ เจริญศิลป์ (Mr. Taweesak Jaroensin)',
      role: 'TEACHER'
    },
    {
      email: 'teacher@example.com',
      name: 'Prof. Sarah Johnson',
      role: 'TEACHER'
    },
    {
      email: 'instructor@skillnexus.com',
      name: 'Dr. Michael Chen',
      role: 'TEACHER'
    },
    {
      email: 'tutor@skillnexus.com',
      name: 'Emily Rodriguez',
      role: 'TEACHER'
    }
  ]

  for (const teacher of teachers) {
    await prisma.user.upsert({
      where: { email: teacher.email },
      update: {
        role: teacher.role, // CRITICAL: Ensure role is always TEACHER
        credits: 5000,
      },
      create: {
        email: teacher.email,
        password: teacherPassword,
        name: teacher.name,
        role: teacher.role,
        credits: 5000,
      },
    })
  }
  console.log(`✅ Created ${teachers.length} teacher users\n`)

  // ========================================
  // 3. STUDENT USERS
  // ========================================
  console.log('👨‍🎓 Creating STUDENT users...')
  const studentPassword = await bcrypt.hash('student@123!', 12)

  const students = [
    {
      email: 'student@skillnexus.com',
      name: 'นักเรียนตัวอย่าง',
      credits: 1000
    },
    {
      email: 'student@example.com',
      name: 'Alex Thompson',
      credits: 800
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
      update: { 
        credits: student.credits,
        role: 'STUDENT', // CRITICAL: Ensure role is always STUDENT
      },
      create: {
        email: student.email,
        password: studentPassword,
        name: student.name,
        role: 'STUDENT',
        credits: student.credits,
      },
    })
  }
  console.log(`✅ Created ${students.length} student users\n`)

  // ========================================
  // 4. ENTERPRISE USERS
  // ========================================
  console.log('🏢 Creating ENTERPRISE users...')
  const enterprisePassword = await bcrypt.hash('enterprise@123!', 12)

  const enterprises = [
    {
      email: 'enterprise@skillnexus.com',
      name: 'Enterprise Admin',
      role: 'ENTERPRISE'
    },
    {
      email: 'corporate@example.com',
      name: 'Corporate Training Manager',
      role: 'ENTERPRISE'
    },
    {
      email: 'business@skillnexus.com',
      name: 'Business Account Manager',
      role: 'ENTERPRISE'
    }
  ]

  for (const enterprise of enterprises) {
    await prisma.user.upsert({
      where: { email: enterprise.email },
      update: {},
      create: {
        email: enterprise.email,
        password: enterprisePassword,
        name: enterprise.name,
        role: enterprise.role,
        credits: 50000,
      },
    })
  }
  console.log(`✅ Created ${enterprises.length} enterprise users\n`)

  // ========================================
  // 5. MODERATOR USERS
  // ========================================
  console.log('🛡️ Creating MODERATOR users...')
  const moderatorPassword = await bcrypt.hash('moderator@123!', 12)

  const moderators = [
    {
      email: 'moderator@skillnexus.com',
      name: 'Content Moderator',
      role: 'MODERATOR'
    },
    {
      email: 'mod@example.com',
      name: 'Community Manager',
      role: 'MODERATOR'
    }
  ]

  for (const moderator of moderators) {
    await prisma.user.upsert({
      where: { email: moderator.email },
      update: {},
      create: {
        email: moderator.email,
        password: moderatorPassword,
        name: moderator.name,
        role: moderator.role,
        credits: 3000,
      },
    })
  }
  console.log(`✅ Created ${moderators.length} moderator users\n`)

  // ========================================
  // 6. CONTENT CREATOR USERS
  // ========================================
  console.log('🎨 Creating CONTENT_CREATOR users...')
  const creatorPassword = await bcrypt.hash('creator@123!', 12)

  const creators = [
    {
      email: 'creator@skillnexus.com',
      name: 'Content Creator',
      role: 'CONTENT_CREATOR'
    },
    {
      email: 'author@example.com',
      name: 'Course Author',
      role: 'CONTENT_CREATOR'
    }
  ]

  for (const creator of creators) {
    await prisma.user.upsert({
      where: { email: creator.email },
      update: {},
      create: {
        email: creator.email,
        password: creatorPassword,
        name: creator.name,
        role: creator.role,
        credits: 2000,
      },
    })
  }
  console.log(`✅ Created ${creators.length} content creator users\n`)

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

  // Create sample careers and assessment questions
  const careers = [
    {
      title: 'Full Stack Developer',
      description: 'ประเมินทักษะการพัฒนาเว็บแอปพลิเคชันแบบครบวงจร',
      category: 'Technology'
    },
    {
      title: 'Data Scientist',
      description: 'ประเมินทักษะการวิเคราะห์ข้อมูลและ Machine Learning',
      category: 'Technology'
    },
    {
      title: 'Digital Marketing',
      description: 'ประเมินทักษะการตลาดดิจิทัลและ Social Media',
      category: 'Marketing'
    }
  ]

  for (const careerData of careers) {
    const career = await prisma.career.create({
      data: careerData
    })

    // Create skills for each career
    const skills = {
      'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'Database Design'],
      'Data Scientist': ['Python', 'Statistics', 'Machine Learning', 'Data Visualization'],
      'Digital Marketing': ['SEO', 'Social Media', 'Content Marketing', 'Analytics']
    }

    const careerSkills = skills[career.title as keyof typeof skills] || []

    for (const skillName of careerSkills) {
      const skill = await prisma.careerSkill.upsert({
        where: { name: skillName },
        update: {},
        create: { name: skillName }
      })

      // Create sample questions for each skill
      const questions = {
        'JavaScript': [
          {
            questionId: `JS001_${career.id}`,
            questionText: 'What is closure in JavaScript?',
            option1: 'Function with access to parent scope',
            option2: 'Loop structure',
            option3: 'Data type',
            option4: 'Operator',
            correctAnswer: '1',
            score: 5
          },
          {
            questionId: `JS002_${career.id}`,
            questionText: 'Which method is used to add elements to an array?',
            option1: 'append()',
            option2: 'push()',
            option3: 'add()',
            option4: 'insert()',
            correctAnswer: '2',
            score: 3
          }
        ],
        'Python': [
          {
            questionId: `PY001_${career.id}`,
            questionText: 'What is Pandas DataFrame used for?',
            option1: 'Managing tabular data',
            option2: 'Creating graphs',
            option3: 'Building websites',
            option4: 'File management',
            correctAnswer: '1',
            score: 5
          }
        ],
        'SEO': [
          {
            questionId: `SEO001_${career.id}`,
            questionText: 'What does SEO stand for?',
            option1: 'Search Engine Optimization',
            option2: 'Social Engine Optimization',
            option3: 'Site Engine Optimization',
            option4: 'Search Email Optimization',
            correctAnswer: '1',
            score: 3
          }
        ]
      }

      const skillQuestions = questions[skillName as keyof typeof questions] || []

      for (const questionData of skillQuestions) {
        await prisma.assessmentQuestion.create({
          data: {
            ...questionData,
            careerId: career.id,
            skillId: skill.id,
            skillCategory: 'Technical',
            skillImportance: 'Critical',
            questionType: 'single',
            difficultyLevel: 'Intermediate'
          }
        })
      }
    }
  }

  console.log('Database seeded successfully')
  console.log(`Created ${students.length} student users with credits`)
  console.log(`Created ${careers.length} sample career assessments`)
  console.log('\n' + '='.repeat(60))
  console.log('📋 SkillNexus LMS - LOGIN CREDENTIALS')
  console.log('='.repeat(60) + '\n')

  console.log('👑 ADMIN ACCOUNTS (Password: admin@123!)')
  console.log('─'.repeat(60))
  console.log('  • admin@skillnexus.com')
  console.log('    Name: นายทวีศักดิ์ เจริญศิลป์ (Mr. Taweesak Jaroensin)')
  console.log('  • admin@bizsolve-ai.com')
  console.log('    Name: ผู้ดูแลระบบ BizSolve AI')
  console.log('  • admin@example.com')
  console.log('    Name: System Administrator')
  console.log('')

  console.log('👨‍🏫 TEACHER ACCOUNTS (Password: teacher@123!)')
  console.log('─'.repeat(60))
  console.log('  • teacher@skillnexus.com')
  console.log('    Name: นายทวีศักดิ์ เจริญศิลป์ (Mr. Taweesak Jaroensin)')
  console.log('  • teacher@example.com')
  console.log('    Name: Prof. Sarah Johnson')
  console.log('  • instructor@skillnexus.com')
  console.log('    Name: Dr. Michael Chen')
  console.log('  • tutor@skillnexus.com')
  console.log('    Name: Emily Rodriguez')
  console.log('')

  console.log('👨‍🎓 STUDENT ACCOUNTS (Password: student@123!)')
  console.log('─'.repeat(60))
  console.log('  • student@skillnexus.com (Credits: 1000)')
  console.log('  • student@example.com (Credits: 800)')
  console.log('  • john@example.com (Credits: 500)')
  console.log('  • alice@example.com (Credits: 750)')
  console.log('  • joesive47@gmail.com (Credits: 1000)')
  console.log('  • bob@example.com (Credits: 300)')
  console.log('  • emma@example.com (Credits: 1200)')
  console.log('  • david@example.com (Credits: 800)')
  console.log('  • sarah@example.com (Credits: 600)')
  console.log('  • mike@example.com (Credits: 900)')
  console.log('  • lisa@example.com (Credits: 400)')
  console.log('')

  console.log('🏢 ENTERPRISE ACCOUNTS (Password: enterprise@123!)')
  console.log('─'.repeat(60))
  console.log('  • enterprise@skillnexus.com')
  console.log('    Name: Enterprise Admin (Credits: 50000)')
  console.log('  • corporate@example.com')
  console.log('    Name: Corporate Training Manager (Credits: 50000)')
  console.log('  • business@skillnexus.com')
  console.log('    Name: Business Account Manager (Credits: 50000)')
  console.log('')

  console.log('🛡️ MODERATOR ACCOUNTS (Password: moderator@123!)')
  console.log('─'.repeat(60))
  console.log('  • moderator@skillnexus.com')
  console.log('    Name: Content Moderator (Credits: 3000)')
  console.log('  • mod@example.com')
  console.log('    Name: Community Manager (Credits: 3000)')
  console.log('')

  console.log('🎨 CONTENT CREATOR ACCOUNTS (Password: creator@123!)')
  console.log('─'.repeat(60))
  console.log('  • creator@skillnexus.com')
  console.log('    Name: Content Creator (Credits: 2000)')
  console.log('  • author@example.com')
  console.log('    Name: Course Author (Credits: 2000)')
  console.log('')

  console.log('='.repeat(60))
  console.log('🔗 QUICK LINKS')
  console.log('='.repeat(60))
  console.log('  • Login: http://localhost:3001/login')
  console.log('  • Skills Assessment: http://localhost:3001/skills-assessment')
  console.log('  • Import Questions: http://localhost:3001/skills-assessment/import')
  console.log('='.repeat(60) + '\n')

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })