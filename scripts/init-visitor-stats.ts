import { prisma } from '@/lib/prisma'

async function initVisitorStats() {
  try {
    console.log('🔧 Initializing visitor stats...')
    
    const existing = await prisma.visitorStats.findUnique({
      where: { id: 1 }
    })
    
    if (!existing) {
      await prisma.visitorStats.create({
        data: {
          id: 1,
          totalVisitors: 0,
          lastVisit: new Date()
        }
      })
      console.log('✅ Visitor stats initialized with 0 visitors')
    } else {
      console.log(`✅ Visitor stats already exists: ${existing.totalVisitors} visitors`)
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

initVisitorStats()
