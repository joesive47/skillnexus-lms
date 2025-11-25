import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testFullRegister() {
  try {
    console.log('🔍 ตรวจสอบโครงสร้างฐานข้อมูล...')
    
    // ตรวจสอบว่าฟิลด์ nameEn มีอยู่หรือไม่
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        nameEn: true,
        role: true,
        credits: true,
        createdAt: true
      },
      take: 5
    })
    
    console.log('✅ ฐานข้อมูลพร้อมใช้งาน')
    console.log('📊 ผู้ใช้ในระบบ:', users.length, 'คน')
    
    if (users.length > 0) {
      console.log('\n👥 ตัวอย่างผู้ใช้:')
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`)
        console.log(`   ชื่อ (ไทย): ${user.name || 'ไม่ระบุ'}`)
        console.log(`   ชื่อ (อังกฤษ): ${user.nameEn || 'ไม่ระบุ'}`)
        console.log(`   บทบาท: ${user.role}`)
        console.log(`   เครดิต: ${user.credits}`)
        console.log('')
      })
    }
    
    // ตรวจสอบ transactions
    const transactionCount = await prisma.transaction.count()
    console.log('💳 ธุรกรรมในระบบ:', transactionCount, 'รายการ')
    
    console.log('\n✅ ระบบพร้อมใช้งาน!')
    console.log('🌐 สามารถทดสอบการสมัครสมาชิกได้ที่: http://localhost:3000/register')
    console.log('🔐 สามารถเข้าสู่ระบบได้ที่: http://localhost:3000/login')
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testFullRegister()