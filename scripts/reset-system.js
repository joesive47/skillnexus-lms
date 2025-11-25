#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

console.log('🔄 เริ่มรีเซตระบบ SkillNexus...')

async function resetSystem() {
  try {
    // 1. ลบข้อมูลเก่าทั้งหมด
    console.log('🗑️  ลบข้อมูลเก่า...')
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

    // 2. สร้าง Admin User
    console.log('👤 สร้าง Admin User...')
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
    console.log('✅ Admin User สร้างแล้ว:', adminUser.email)

    // 3. สร้าง Test User
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
    console.log('✅ Test User สร้างแล้ว:', testUser.email)

    // 4. สร้าง Sample Course
    console.log('📚 สร้าง Sample Course...')
    const course = await prisma.course.create({
      data: {
        title: 'JavaScript Fundamentals',
        description: 'เรียนรู้พื้นฐาน JavaScript สำหรับผู้เริ่มต้น',
        price: 0,
        published: true,
        imageUrl: '/uploads/courses/js-fundamentals.jpg'
      }
    })

    // 5. สร้าง Module
    const module1 = await prisma.module.create({
      data: {
        title: 'บทที่ 1: พื้นฐาน JavaScript',
        order: 1,
        courseId: course.id
      }
    })

    // 6. สร้าง Lessons
    const lesson1 = await prisma.lesson.create({
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

    const lesson2 = await prisma.lesson.create({
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

    // 7. สร้าง Quiz
    const quiz = await prisma.quiz.create({
      data: {
        title: 'แบบทดสอบ JavaScript พื้นฐาน',
        courseId: course.id,
        timeLimit: 30
      }
    })

    // 8. สร้าง Questions
    const question1 = await prisma.question.create({
      data: {
        text: 'JavaScript เป็นภาษาโปรแกรมประเภทใด?',
        type: 'MULTIPLE_CHOICE',
        quizId: quiz.id,
        order: 1
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

    // 9. สร้าง Quiz Lesson
    await prisma.lesson.create({
      data: {
        title: 'แบบทดสอบ JavaScript พื้นฐาน',
        courseId: course.id,
        moduleId: module1.id,
        type: 'QUIZ',
        order: 3,
        quizId: quiz.id,
        requiredCompletionPercentage: 70
      }
    })

    // 10. สร้าง Skills
    const skills = [
      { name: 'JavaScript', description: 'JavaScript programming language' },
      { name: 'HTML', description: 'HyperText Markup Language' },
      { name: 'CSS', description: 'Cascading Style Sheets' },
      { name: 'React', description: 'React JavaScript library' },
      { name: 'Node.js', description: 'Node.js runtime environment' }
    ]

    for (const skill of skills) {
      await prisma.skill.create({ data: skill })
    }

    // 11. Enroll Test User
    await prisma.enrollment.create({
      data: {
        userId: testUser.id,
        courseId: course.id
      }
    })

    console.log('✅ ระบบรีเซตเสร็จสิ้น!')
    console.log('\n📋 ข้อมูลการเข้าสู่ระบบ:')
    console.log('Admin: admin@skillnexus.com / admin123')
    console.log('Test User: test@skillnexus.com / test123')
    console.log('\n🌐 เข้าสู่ระบบที่: http://localhost:3000/login')

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetSystem()