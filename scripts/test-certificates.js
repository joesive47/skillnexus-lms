const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testCertificates() {
  try {
    console.log('🧪 Testing Certificate System...')

    // 1. หาผู้ใช้และคอร์สที่มีอยู่
    const user = await prisma.user.findFirst({
      where: { role: 'STUDENT' }
    })

    const course = await prisma.course.findFirst({
      where: { published: true }
    })

    if (!user || !course) {
      console.log('❌ ไม่พบผู้ใช้หรือคอร์สสำหรับทดสอบ')
      return
    }

    console.log(`👤 ผู้ใช้: ${user.name} (${user.email})`)
    console.log(`📚 คอร์ส: ${course.title}`)

    // 2. ตรวจสอบการลงทะเบียน
    let enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id
        }
      }
    })

    if (!enrollment) {
      console.log('📝 สร้างการลงทะเบียนใหม่...')
      enrollment = await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id
        }
      })
    }

    // 3. จำลองการเรียนจบ - สร้าง watch history สำหรับทุก lesson
    const lessons = await prisma.lesson.findMany({
      where: { courseId: course.id }
    })

    console.log(`📖 พบ ${lessons.length} บทเรียน`)

    for (const lesson of lessons) {
      await prisma.watchHistory.upsert({
        where: {
          userId_lessonId: {
            userId: user.id,
            lessonId: lesson.id
          }
        },
        update: {
          completed: true,
          watchTime: lesson.duration || 100
        },
        create: {
          userId: user.id,
          lessonId: lesson.id,
          completed: true,
          watchTime: lesson.duration || 100
        }
      })
    }

    console.log('✅ อัปเดต watch history เรียบร้อย')

    // 4. สร้างใบประกาศนียบัตร
    const existingCertificate = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id
        }
      }
    })

    let certificate
    if (existingCertificate) {
      certificate = existingCertificate
      console.log('📜 พบใบประกาศนียบัตรที่มีอยู่แล้ว')
    } else {
      certificate = await prisma.certificate.create({
        data: {
          userId: user.id,
          courseId: course.id
        }
      })
      console.log('🎉 สร้างใบประกาศนียบัตรใหม่สำเร็จ!')
    }

    console.log(`🆔 Certificate ID: ${certificate.uniqueId}`)
    console.log(`🔗 URL: http://localhost:3000/certificates/${certificate.uniqueId}`)
    console.log(`✅ Verification URL: http://localhost:3000/verify`)

    // 5. แสดงสถิติ
    const totalCertificates = await prisma.certificate.count()
    const userCertificates = await prisma.certificate.count({
      where: { userId: user.id }
    })

    console.log('\n📊 สถิติใบประกาศนียบัตร:')
    console.log(`   - ทั้งหมดในระบบ: ${totalCertificates}`)
    console.log(`   - ของผู้ใช้นี้: ${userCertificates}`)

    console.log('\n🎯 การทดสอบเสร็จสิ้น!')
    console.log('   1. เข้าไปดูใบประกาศนียบัตรที่ URL ด้านบน')
    console.log('   2. ทดสอบ download HTML')
    console.log('   3. ทดสอบ share certificate')
    console.log('   4. ทดสอบ verification ด้วย Certificate ID')

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCertificates()