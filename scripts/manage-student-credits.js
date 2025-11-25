import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addCreditsToStudent(email, credits) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log(`❌ ไม่พบผู้ใช้ที่มีอีเมล: ${email}`)
      return
    }

    if (user.role !== 'STUDENT') {
      console.log(`❌ ผู้ใช้ ${email} ไม่ใช่นักเรียน`)
      return
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        credits: user.credits + credits
      }
    })

    // บันทึก transaction
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'CREDIT_PURCHASE',
        amount: credits,
        description: `เพิ่มเครดิต ${credits} credits โดย admin`
      }
    })

    console.log(`✅ เพิ่มเครดิตสำเร็จ!`)
    console.log(`   ผู้ใช้: ${updatedUser.name} (${email})`)
    console.log(`   เครดิตเดิม: ${user.credits}`)
    console.log(`   เครดิตใหม่: ${updatedUser.credits}`)
    console.log(`   เพิ่มขึ้น: +${credits}`)

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message)
  }
}

async function listStudentCredits() {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        email: true,
        name: true,
        credits: true,
        createdAt: true
      },
      orderBy: { credits: 'desc' }
    })

    console.log('\n📊 รายการเครดิตของนักเรียนทั้งหมด:')
    console.log('=' .repeat(60))
    
    students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.name}`)
      console.log(`   อีเมล: ${student.email}`)
      console.log(`   เครดิต: ${student.credits} credits`)
      console.log(`   สมัครเมื่อ: ${student.createdAt.toLocaleDateString('th-TH')}`)
      console.log('')
    })

    console.log(`รวมนักเรียนทั้งหมด: ${students.length} คน`)
    const totalCredits = students.reduce((sum, student) => sum + student.credits, 0)
    console.log(`รวมเครดิตทั้งหมด: ${totalCredits} credits`)

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message)
  }
}

async function addCreditsToAllStudents(credits) {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' }
    })

    console.log(`🎁 กำลังเพิ่มเครดิต ${credits} ให้นักเรียนทั้งหมด ${students.length} คน...`)

    for (const student of students) {
      await prisma.user.update({
        where: { id: student.id },
        data: {
          credits: student.credits + credits
        }
      })

      await prisma.transaction.create({
        data: {
          userId: student.id,
          type: 'CREDIT_BONUS',
          amount: credits,
          description: `โบนัสเครดิต ${credits} credits สำหรับนักเรียนทุกคน`
        }
      })
    }

    console.log(`✅ เพิ่มเครดิตสำเร็จให้นักเรียนทั้งหมด!`)
    console.log(`   จำนวนนักเรียน: ${students.length} คน`)
    console.log(`   เครดิตที่เพิ่ม: ${credits} credits ต่อคน`)
    console.log(`   รวมเครดิตที่แจก: ${credits * students.length} credits`)

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message)
  }
}

// รับ arguments จาก command line
const args = process.argv.slice(2)
const command = args[0]

async function main() {
  try {
    switch (command) {
      case 'list':
        await listStudentCredits()
        break
      
      case 'add':
        const email = args[1]
        const credits = parseInt(args[2])
        
        if (!email || !credits) {
          console.log('❌ กรุณาระบุอีเมลและจำนวนเครดิต')
          console.log('ตัวอย่าง: node manage-student-credits.js add student@example.com 500')
          return
        }
        
        await addCreditsToStudent(email, credits)
        break
      
      case 'add-all':
        const allCredits = parseInt(args[1])
        
        if (!allCredits) {
          console.log('❌ กรุณาระบุจำนวนเครดิต')
          console.log('ตัวอย่าง: node manage-student-credits.js add-all 100')
          return
        }
        
        await addCreditsToAllStudents(allCredits)
        break
      
      default:
        console.log('📖 วิธีใช้งาน:')
        console.log('  node manage-student-credits.js list                    - ดูรายการเครดิตทั้งหมด')
        console.log('  node manage-student-credits.js add <email> <credits>   - เพิ่มเครดิตให้นักเรียนคนใดคนหนึ่ง')
        console.log('  node manage-student-credits.js add-all <credits>       - เพิ่มเครดิตให้นักเรียนทุกคน')
        console.log('')
        console.log('ตัวอย่าง:')
        console.log('  node manage-student-credits.js list')
        console.log('  node manage-student-credits.js add student@skillnexus.com 500')
        console.log('  node manage-student-credits.js add-all 100')
    }
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()