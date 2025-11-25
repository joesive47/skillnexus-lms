import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    console.log('[DEBUG] Starting system reset...')
    
    // ลบข้อมูลเก่าทั้งหมด
    await prisma.watchHistory.deleteMany()
    await prisma.studentSubmission.deleteMany()
    await prisma.answerOption.deleteMany()
    await prisma.question.deleteMany()
    await prisma.quiz.deleteMany()
    await prisma.lesson.deleteMany()
    await prisma.module.deleteMany()
    await prisma.enrollment.deleteMany()
    await prisma.certificate.deleteMany()
    await prisma.skillAssessment.deleteMany()
    await prisma.skill.deleteMany()
    await prisma.transaction.deleteMany()
    await prisma.chatMessage.deleteMany()
    await prisma.chatSession.deleteMany()
    await prisma.chatKnowledgeBase.deleteMany()
    await prisma.assessmentResult.deleteMany()
    await prisma.assessmentQuestion.deleteMany()
    await prisma.careerSkill.deleteMany()
    await prisma.career.deleteMany()
    await prisma.classroom.deleteMany()
    await prisma.course.deleteMany()
    await prisma.user.deleteMany()

    console.log('[DEBUG] Old data deleted')

    // สร้าง Admin User
    const hashedPassword = await bcrypt.hash('admin123', 12)
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@skillnexus.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        credits: 1000
      }
    })

    // สร้าง Test User
    const testPassword = await bcrypt.hash('test123', 12)
    const testUser = await prisma.user.create({
      data: {
        email: 'test@skillnexus.com',
        password: testPassword,
        name: 'Test User',
        role: 'STUDENT',
        credits: 100
      }
    })

    // สร้าง Sample Course
    const course = await prisma.course.create({
      data: {
        title: 'JavaScript Fundamentals',
        description: 'เรียนรู้พื้นฐาน JavaScript สำหรับผู้เริ่มต้น',
        price: 0,
        published: true,
        imageUrl: '/uploads/courses/js-fundamentals.jpg'
      }
    })

    // สร้าง Module
    const module1 = await prisma.module.create({
      data: {
        title: 'บทที่ 1: พื้นฐาน JavaScript',
        order: 1,
        courseId: course.id
      }
    })

    // สร้าง Lessons
    await prisma.lesson.create({
      data: {
        title: 'แนะนำ JavaScript',
        courseId: course.id,
        moduleId: module1.id,
        type: 'VIDEO',
        order: 1,
        youtubeUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
        durationMin: 10,
        requiredCompletionPercentage: 80
      }
    })

    await prisma.lesson.create({
      data: {
        title: 'Variables และ Data Types',
        courseId: course.id,
        moduleId: module1.id,
        type: 'VIDEO',
        order: 2,
        youtubeUrl: 'https://www.youtube.com/watch?v=9YffrCViTVk',
        durationMin: 15,
        requiredCompletionPercentage: 80
      }
    })

    // สร้าง Skills
    const skills = [
      { name: 'JavaScript', description: 'JavaScript programming language' },
      { name: 'HTML', description: 'HyperText Markup Language' },
      { name: 'CSS', description: 'Cascading Style Sheets' }
    ]

    for (const skill of skills) {
      await prisma.skill.create({ data: skill })
    }

    // Enroll Test User
    await prisma.enrollment.create({
      data: {
        userId: testUser.id,
        courseId: course.id
      }
    })

    console.log('[DEBUG] System reset completed')

    return NextResponse.json({
      success: true,
      message: 'ระบบรีเซตเสร็จสิ้น',
      data: {
        adminEmail: 'admin@skillnexus.com',
        testEmail: 'test@skillnexus.com',
        coursesCreated: 1,
        usersCreated: 2
      }
    })

  } catch (error) {
    console.error('[DEBUG] Reset error:', error)
    return NextResponse.json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการรีเซตระบบ: ' + (error as Error).message
    }, { status: 500 })
  }
}