import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function addUser() {
  try {
    // Hash password (ใช้รหัสผ่านเดียวกับ student อื่นๆ)
    const hashedPassword = await bcrypt.hash('student123', 12)
    
    // เพิ่มผู้ใช้ใหม่
    const newUser = await prisma.user.upsert({
      where: { email: 'joesive47@gmail.com' },
      update: {
        name: 'Joe Sive',
        credits: 1000,
        role: 'STUDENT'
      },
      create: {
        email: 'joesive47@gmail.com',
        password: hashedPassword,
        name: 'Joe Sive',
        role: 'STUDENT',
        credits: 1000,
      },
    })

    // เพิ่ม transaction สำหรับ credits เริ่มต้น
    await prisma.transaction.create({
      data: {
        userId: newUser.id,
        type: 'CREDIT_PURCHASE',
        amount: 1000,
        description: 'Initial credit allocation for Joe Sive'
      }
    })

    console.log('✅ เพิ่มผู้ใช้สำเร็จ!')
    console.log('📧 อีเมล: joesive47@gmail.com')
    console.log('🔑 รหัสผ่าน: student123')
    console.log('💰 เครดิต: 1000')
    console.log('👤 บทบาท: STUDENT')
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addUser()