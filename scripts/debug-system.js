#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

console.log('🔍 เริ่มตรวจสอบระบบ SkillNexus...')

async function debugSystem() {
  try {
    console.log('\n=== 📊 สถิติฐานข้อมูล ===')
    
    // ตรวจสอบจำนวนข้อมูลในแต่ละตาราง
    const userCount = await prisma.user.count()
    const courseCount = await prisma.course.count()
    const lessonCount = await prisma.lesson.count()
    const enrollmentCount = await prisma.enrollment.count()
    const quizCount = await prisma.quiz.count()
    const skillCount = await prisma.skill.count()

    console.log(`👥 Users: ${userCount}`)
    console.log(`📚 Courses: ${courseCount}`)
    console.log(`📖 Lessons: ${lessonCount}`)
    console.log(`📝 Enrollments: ${enrollmentCount}`)
    console.log(`❓ Quizzes: ${quizCount}`)
    console.log(`🎯 Skills: ${skillCount}`)

    console.log('\n=== 👥 ข้อมูล Users ===')
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        credits: true,
        createdAt: true
      }
    })
    
    users.forEach(user => {
      console.log(`📧 ${user.email} | ${user.role} | Credits: ${user.credits}`)
    })

    console.log('\n=== 📚 ข้อมูล Courses ===')
    const courses = await prisma.course.findMany({
      include: {
        lessons: true,
        enrollments: true,
        _count: {
          select: {
            lessons: true,
            enrollments: true
          }
        }
      }
    })

    courses.forEach(course => {
      console.log(`📖 ${course.title}`)
      console.log(`   Published: ${course.published}`)
      console.log(`   Lessons: ${course._count.lessons}`)
      console.log(`   Enrollments: ${course._count.enrollments}`)
      console.log(`   Price: ${course.price} credits`)
    })

    console.log('\n=== 🔧 การตั้งค่าระบบ ===')
    
    // ตรวจสอบไฟล์ .env
    const envPath = path.join(process.cwd(), '.env')
    if (fs.existsSync(envPath)) {
      console.log('✅ ไฟล์ .env พบแล้ว')
      const envContent = fs.readFileSync(envPath, 'utf8')
      
      // ตรวจสอบตัวแปรสำคัญ
      const requiredVars = ['DATABASE_URL', 'AUTH_SECRET', 'NEXTAUTH_URL']
      requiredVars.forEach(varName => {
        if (envContent.includes(varName)) {
          console.log(`✅ ${varName} ตั้งค่าแล้ว`)
        } else {
          console.log(`❌ ${varName} ยังไม่ได้ตั้งค่า`)
        }
      })
    } else {
      console.log('❌ ไฟล์ .env ไม่พบ')
    }

    // ตรวจสอบไฟล์ database
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath)
      console.log(`✅ Database file: ${(stats.size / 1024).toFixed(2)} KB`)
    } else {
      console.log('❌ Database file ไม่พบ')
    }

    console.log('\n=== 🚀 การทดสอบการเชื่อมต่อ ===')
    
    // ทดสอบการเชื่อมต่อฐานข้อมูล
    try {
      await prisma.$queryRaw`SELECT 1`
      console.log('✅ การเชื่อมต่อฐานข้อมูลปกติ')
    } catch (error) {
      console.log('❌ การเชื่อมต่อฐานข้อมูลมีปัญหา:', error.message)
    }

    console.log('\n=== 📋 สรุปปัญหาที่พบ ===')
    
    const issues = []
    
    if (userCount === 0) {
      issues.push('ไม่มี Users ในระบบ - ใช้ npm run reset:system')
    }
    
    if (courseCount === 0) {
      issues.push('ไม่มี Courses ในระบบ - ใช้ npm run reset:system')
    }
    
    if (!fs.existsSync(envPath)) {
      issues.push('ไฟล์ .env ไม่พบ - คัดลอกจาก .env.example')
    }
    
    if (issues.length === 0) {
      console.log('✅ ไม่พบปัญหา ระบบพร้อมใช้งาน!')
    } else {
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`)
      })
    }

    console.log('\n=== 🛠️  คำสั่งที่มีประโยชน์ ===')
    console.log('npm run reset:system  - รีเซตระบบทั้งหมด')
    console.log('npm run debug:system  - ตรวจสอบระบบ')
    console.log('npm run dev          - เริ่มเซิร์ฟเวอร์')
    console.log('npm run db:studio    - เปิด Prisma Studio')

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการตรวจสอบ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugSystem()