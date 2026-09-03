// 🔍 ตรวจสอบและสร้าง Test User สำหรับ Production
// Quick fix สำหรับปัญหา login

import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 กำลังตรวจสอบ Production Database...\n')

  try {
    // Test Database Connection
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database เชื่อมต่อสำเร็จ!\n')

    // ตรวจสอบว่ามี users กี่คน
    const userCount = await prisma.user.count()
    console.log(`📊 จำนวน Users ในระบบ: ${userCount}`)

    if (userCount === 0) {
      console.log('⚠️  ไม่พบ User ในระบบ - กำลังสร้าง Test Users...\n')
      await createTestUsers()
    } else {
      console.log('\n📋 รายชื่อ Users ที่มีอยู่:')
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        },
        take: 10
      })
      
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (${user.role}) - ${user.name}`)
      })
      
      console.log('\n🔧 ตัวเลือก:')
      console.log('   1. ลอง Login ด้วย email ด้านบน + password: admin@123! / teacher@123! / student@123!')
      console.log('   2. หรือสร้าง Test User ใหม่\n')
      
      const readline = require('readline')
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      
      rl.question('ต้องการสร้าง Test User ใหม่ไหม? (y/n): ', async (answer) => {
        if (answer.toLowerCase() === 'y') {
          await createTestUsers()
        }
        rl.close()
        await prisma.$disconnect()
      })
      
      return
    }

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
    throw error
  }
}

async function createTestUsers() {
  console.log('🔨 กำลังสร้าง Test Users...\n')

  // 1. Admin User
  const adminPassword = await bcrypt.hash('admin@123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@uppowerskill.com' },
    update: {},
    create: {
      email: 'admin@uppowerskill.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
      image: null,
    }
  })
  console.log('✅ Admin: admin@uppowerskill.com / admin@123!')

  // 2. Teacher User
  const teacherPassword = await bcrypt.hash('teacher@123!', 12)
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@uppowerskill.com' },
    update: {},
    create: {
      email: 'teacher@uppowerskill.com',
      name: 'Teacher User',
      password: teacherPassword,
      role: 'TEACHER',
      emailVerified: new Date(),
      image: null,
    }
  })
  console.log('✅ Teacher: teacher@uppowerskill.com / teacher@123!')

  // 3. Student User
  const studentPassword = await bcrypt.hash('student@123!', 12)
  const student = await prisma.user.upsert({
    where: { email: 'student@uppowerskill.com' },
    update: {},
    create: {
      email: 'student@uppowerskill.com',
      name: 'Student User',
      password: studentPassword,
      role: 'STUDENT',
      emailVerified: new Date(),
      image: null,
    }
  })
  console.log('✅ Student: student@uppowerskill.com / student@123!')

  // 4. Test User (ง่ายจำ)
  const testPassword = await bcrypt.hash('test1234', 12)
  const testUser = await prisma.user.upsert({
    where: { email: 'test@uppowerskill.com' },
    update: {},
    create: {
      email: 'test@uppowerskill.com',
      name: 'Test User',
      password: testPassword,
      role: 'STUDENT',
      emailVerified: new Date(),
      image: null,
    }
  })
  console.log('✅ Test: test@uppowerskill.com / test1234')

  console.log('\n🎉 สร้าง Test Users เรียบร้อย!')
  console.log('\n📝 ทดสอบ Login ที่: https://www.uppowerskill.com/login')
  console.log('   Email: test@uppowerskill.com')
  console.log('   Password: test1234')
  console.log('')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
