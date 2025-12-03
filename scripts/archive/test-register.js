import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testRegister() {
  try {
    // ทดสอบสร้างผู้ใช้ใหม่
    const testEmail = 'test-register@example.com'
    
    // ลบผู้ใช้เก่าถ้ามี
    await prisma.user.deleteMany({
      where: { email: testEmail }
    })
    
    const hashedPassword = await bcrypt.hash('testpassword123', 12)
    
    const newUser = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        name: 'ทดสอบ ระบบ',
        nameEn: 'Test System',
        phone: '0812345678',
        birthDate: '1990-01-01',
        gender: 'male',
        education: 'bachelor',
        occupation: 'Developer',
        address: '123 Test Street',
        province: 'Bangkok',
        postalCode: '10100',
        role: 'STUDENT',
        credits: 1000
      }
    })

    // เพิ่ม transaction สำหรับเครดิตเริ่มต้น
    await prisma.transaction.create({
      data: {
        userId: newUser.id,
        type: 'CREDIT_PURCHASE',
        amount: 1000,
        description: 'Initial credit allocation for Test System'
      }
    })

    console.log('✅ ทดสอบการสมัครสมาชิกสำเร็จ!')
    console.log('📧 อีเมล:', newUser.email)
    console.log('👤 ชื่อ (ไทย):', newUser.name)
    console.log('👤 ชื่อ (อังกฤษ):', newUser.nameEn)
    console.log('🎭 บทบาท:', newUser.role)
    console.log('💰 เครดิต:', newUser.credits)
    console.log('📅 สร้างเมื่อ:', newUser.createdAt)
    
    // ทดสอบการเข้าสู่ระบบ
    const loginTest = await prisma.user.findUnique({
      where: { email: testEmail }
    })
    
    if (loginTest) {
      const passwordMatch = await bcrypt.compare('testpassword123', loginTest.password)
      console.log('🔐 ทดสอบการเข้าสู่ระบบ:', passwordMatch ? 'สำเร็จ' : 'ล้มเหลว')
    }
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testRegister()