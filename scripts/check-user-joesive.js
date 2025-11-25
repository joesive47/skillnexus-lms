import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'joesive47@gmail.com' },
      include: {
        transactions: true,
        enrollments: {
          include: {
            course: true
          }
        }
      }
    })

    if (user) {
      console.log('✅ พบผู้ใช้ในฐานข้อมูล:')
      console.log('📧 อีเมล:', user.email)
      console.log('👤 ชื่อ:', user.name)
      console.log('🎭 บทบาท:', user.role)
      console.log('💰 เครดิต:', user.credits)
      console.log('📅 สร้างเมื่อ:', user.createdAt)
      console.log('🔄 อัปเดตล่าสุด:', user.updatedAt)
      console.log('💳 ธุรกรรม:', user.transactions.length, 'รายการ')
      console.log('📚 ลงทะเบียนคอร์ส:', user.enrollments.length, 'คอร์ส')
    } else {
      console.log('❌ ไม่พบผู้ใช้ในฐานข้อมูล')
    }
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()