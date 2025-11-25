const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateWatchHistory() {
  console.log('🔄 เริ่มต้นการ migrate watch history...')

  try {
    // อัปเดต watch history ที่มีอยู่
    const watchHistories = await prisma.watchHistory.findMany({
      include: {
        lesson: true
      }
    })

    console.log(`📊 พบ watch history ${watchHistories.length} รายการ`)

    for (const history of watchHistories) {
      // ถ้า watchTime เป็นเปอร์เซ็นต์ (0-100) ให้แปลงเป็นวินาที
      let newWatchTime = history.watchTime
      let newTotalTime = history.totalTime || 0

      // ถ้า lesson มี duration ให้ใช้เป็น totalTime
      if (history.lesson.duration && history.lesson.duration > 0) {
        newTotalTime = history.lesson.duration
        
        // ถ้า watchTime ดูเหมือนเป็นเปอร์เซ็นต์ (0-100)
        if (history.watchTime <= 100) {
          newWatchTime = (history.watchTime / 100) * newTotalTime
        }
      } else {
        // ถ้าไม่มี duration ให้ประมาณจาก YouTube (เฉลี่ย 10 นาที)
        newTotalTime = 600 // 10 minutes
        if (history.watchTime <= 100) {
          newWatchTime = (history.watchTime / 100) * newTotalTime
        }
      }

      await prisma.watchHistory.update({
        where: { id: history.id },
        data: {
          watchTime: newWatchTime,
          totalTime: newTotalTime
        }
      })
    }

    console.log('✅ Migration เสร็จสิ้น!')
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการ migrate:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateWatchHistory()