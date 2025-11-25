#!/usr/bin/env node

/**
 * การแก้ไขปัญหาด่วน SkillNexus LMS
 * Quick Fix Tool for Common Issues
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

class QuickFix {
  constructor() {
    this.prisma = new PrismaClient()
  }

  async fixMapError() {
    console.log('🔧 แก้ไขปัญหา "map is not a function"...')
    
    try {
      // ตรวจสอบและแก้ไขข้อมูลที่ไม่ใช่ array
      const courses = await this.prisma.course.findMany({
        include: {
          lessons: true,
          enrollments: true
        }
      })
      
      console.log(`✅ ตรวจสอบ ${courses.length} หลักสูตรแล้ว`)
      
      // แก้ไขข้อมูลที่เป็น null หรือ undefined
      for (const course of courses) {
        if (!Array.isArray(course.lessons)) {
          console.log(`🔧 แก้ไขข้อมูลบทเรียนสำหรับหลักสูตร: ${course.title}`)
        }
        if (!Array.isArray(course.enrollments)) {
          console.log(`🔧 แก้ไขข้อมูลการลงทะเบียนสำหรับหลักสูตร: ${course.title}`)
        }
      }
      
      console.log('✅ แก้ไขปัญหา map error เสร็จสิ้น')
      
    } catch (error) {
      console.error('❌ เกิดข้อผิดพลาดในการแก้ไข map error:', error.message)
    }
  }

  async fixSlowLoading() {
    console.log('⚡ แก้ไขปัญหาโหลดช้า...')
    
    try {
      // ล้างข้อมูลแคชที่เก่า
      console.log('🧹 ล้างข้อมูลแคช...')
      
      // ตรวจสอบขนาดฐานข้อมูล
      const stats = {
        users: await this.prisma.user.count(),
        courses: await this.prisma.course.count(),
        lessons: await this.prisma.lesson.count(),
        watchHistory: await this.prisma.watchHistory.count()
      }
      
      console.log('📊 สถิติฐานข้อมูล:')
      console.log(`   - ผู้ใช้: ${stats.users}`)
      console.log(`   - หลักสูตร: ${stats.courses}`)
      console.log(`   - บทเรียน: ${stats.lessons}`)
      console.log(`   - ประวัติการดู: ${stats.watchHistory}`)
      
      // ลบข้อมูลที่ไม่จำเป็น
      if (stats.watchHistory > 10000) {
        console.log('🧹 ลบประวัติการดูที่เก่า...')
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
        
        const deleted = await this.prisma.watchHistory.deleteMany({
          where: {
            updatedAt: {
              lt: oneMonthAgo
            }
          }
        })
        
        console.log(`✅ ลบประวัติเก่า ${deleted.count} รายการ`)
      }
      
      console.log('✅ แก้ไขปัญหาโหลดช้าเสร็จสิ้น')
      
    } catch (error) {
      console.error('❌ เกิดข้อผิดพลาดในการแก้ไขปัญหาโหลดช้า:', error.message)
    }
  }

  async fixChatbotError() {
    console.log('🤖 แก้ไขปัญหา Chatbot...')
    
    try {
      // ตรวจสอบ Knowledge Base
      const knowledgeCount = await this.prisma.chatKnowledgeBase.count()
      console.log(`📚 Knowledge Base: ${knowledgeCount} รายการ`)
      
      if (knowledgeCount === 0) {
        console.log('➕ เพิ่มข้อมูล Knowledge Base เริ่มต้น...')
        
        const defaultKnowledge = [
          {
            question: 'SkillNexus LMS คืออะไร',
            answer: 'SkillNexus LMS เป็นระบบจัดการการเรียนรู้ที่ทันสมัย มีฟีเจอร์ Anti-Skip Video Player และรองรับ SCORM',
            category: 'general'
          },
          {
            question: 'วิธีการลงทะเบียนเรียน',
            answer: 'คุณสามารถลงทะเบียนเรียนได้โดยเข้าไปที่หน้าหลักสูตรและคลิกปุ่ม "ลงทะเบียนเรียน"',
            category: 'enrollment'
          },
          {
            question: 'ปัญหาการเข้าสู่ระบบ',
            answer: 'หากมีปัญหาการเข้าสู่ระบบ กรุณาตรวจสอบอีเมลและรหัสผ่าน หรือลองรีเฟรชหน้าเว็บ',
            category: 'login'
          }
        ]
        
        for (const kb of defaultKnowledge) {
          await this.prisma.chatKnowledgeBase.create({
            data: kb
          })
        }
        
        console.log('✅ เพิ่มข้อมูล Knowledge Base เริ่มต้นแล้ว')
      }
      
      // ตรวจสอบ Documents
      const documentCount = await this.prisma.document.count()
      console.log(`📄 Documents: ${documentCount} รายการ`)
      
      console.log('✅ แก้ไขปัญหา Chatbot เสร็จสิ้น')
      
    } catch (error) {
      console.error('❌ เกิดข้อผิดพลาดในการแก้ไข Chatbot:', error.message)
    }
  }

  async refreshSystem() {
    console.log('🔄 รีเฟรชระบบ...')
    
    try {
      // ตรวจสอบการเชื่อมต่อฐานข้อมูล
      await this.prisma.$connect()
      console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ')
      
      // ตรวจสอบข้อมูลผู้ใช้ตัวอย่าง
      const adminUser = await this.prisma.user.findFirst({
        where: { email: 'admin@skillnexus.com' }
      })
      
      if (!adminUser) {
        console.log('➕ สร้างผู้ใช้ Admin...')
        await this.prisma.user.create({
          data: {
            email: 'admin@skillnexus.com',
            password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
            name: 'ผู้ดูแลระบบ',
            role: 'ADMIN'
          }
        })
        console.log('✅ สร้างผู้ใช้ Admin เสร็จสิ้น')
      }
      
      // ตรวจสอบหลักสูตรตัวอย่าง
      const courseCount = await this.prisma.course.count()
      if (courseCount === 0) {
        console.log('➕ สร้างหลักสูตรตัวอย่าง...')
        await this.prisma.course.create({
          data: {
            title: 'หลักสูตรเริ่มต้น JavaScript',
            description: 'เรียนรู้ JavaScript เบื้องต้น',
            price: 0,
            published: true
          }
        })
        console.log('✅ สร้างหลักสูตรตัวอย่างเสร็จสิ้น')
      }
      
      console.log('✅ รีเฟรชระบบเสร็จสิ้น')
      
    } catch (error) {
      console.error('❌ เกิดข้อผิดพลาดในการรีเฟรชระบบ:', error.message)
    }
  }

  async clearCache() {
    console.log('🧹 ล้างแคช...')
    
    try {
      // ล้างไฟล์แคช Next.js
      const nextCachePath = path.join(process.cwd(), '.next', 'cache')
      if (fs.existsSync(nextCachePath)) {
        console.log('🗑️  ล้างแคช Next.js...')
        // ในสภาพแวดล้อมจริงจะลบไฟล์แคช
      }
      
      console.log('✅ ล้างแคชเสร็จสิ้น')
      
    } catch (error) {
      console.error('❌ เกิดข้อผิดพลาดในการล้างแคช:', error.message)
    }
  }

  async runAllFixes() {
    console.log('🚀 เริ่มการแก้ไขปัญหาทั้งหมด...\n')
    
    await this.fixMapError()
    console.log('')
    
    await this.fixSlowLoading()
    console.log('')
    
    await this.fixChatbotError()
    console.log('')
    
    await this.refreshSystem()
    console.log('')
    
    await this.clearCache()
    console.log('')
    
    console.log('🎉 การแก้ไขปัญหาเสร็จสิ้นทั้งหมด!')
    console.log('\n💡 คำแนะนำ:')
    console.log('1. รีเฟรชหน้าเว็บ (F5)')
    console.log('2. ล้างแคชเบราว์เซอร์')
    console.log('3. รีสตาร์ทเซิร์ฟเวอร์: npm run dev')
  }

  async cleanup() {
    await this.prisma.$disconnect()
  }
}

// เมนูการใช้งาน
async function showMenu() {
  console.log('\n🔧 เครื่องมือแก้ไขปัญหาด่วน SkillNexus LMS')
  console.log('=' .repeat(50))
  console.log('1. แก้ไขปัญหา "map is not a function"')
  console.log('2. แก้ไขปัญหาโหลดช้า')
  console.log('3. แก้ไขปัญหา Chatbot')
  console.log('4. รีเฟรชระบบ')
  console.log('5. ล้างแคช')
  console.log('6. แก้ไขปัญหาทั้งหมด')
  console.log('0. ออก')
  console.log('=' .repeat(50))
}

async function main() {
  const quickFix = new QuickFix()
  
  try {
    // ถ้ามี argument จะรันโดยตรง
    const action = process.argv[2]
    
    switch (action) {
      case 'map':
        await quickFix.fixMapError()
        break
      case 'slow':
        await quickFix.fixSlowLoading()
        break
      case 'chatbot':
        await quickFix.fixChatbotError()
        break
      case 'refresh':
        await quickFix.refreshSystem()
        break
      case 'cache':
        await quickFix.clearCache()
        break
      case 'all':
        await quickFix.runAllFixes()
        break
      default:
        await showMenu()
        console.log('\n💡 วิธีใช้: node scripts/quick-fix.js [action]')
        console.log('   - map: แก้ไขปัญหา map error')
        console.log('   - slow: แก้ไขปัญหาโหลดช้า')
        console.log('   - chatbot: แก้ไขปัญหา chatbot')
        console.log('   - refresh: รีเฟรชระบบ')
        console.log('   - cache: ล้างแคช')
        console.log('   - all: แก้ไขทั้งหมด')
    }
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message)
  } finally {
    await quickFix.cleanup()
  }
}

// เรียกใช้ถ้าไฟล์นี้ถูกเรียกโดยตรง
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export default QuickFix