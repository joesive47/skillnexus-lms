import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedAnalytics() {
  console.log('🌱 Seeding analytics data...')

  try {
    // Get user count
    const userCount = await prisma.user.count()
    console.log(`📊 Found ${userCount} users`)

    // Create realistic visitor data (3-5x users)
    const visitorCount = Math.floor(userCount * 3.5)
    
    // Delete old analytics
    await prisma.analytics.deleteMany({
      where: { event: 'page_view' }
    })

    // Create visitor records
    const now = new Date()
    const analytics = []
    
    for (let i = 0; i < visitorCount; i++) {
      const daysAgo = Math.floor(Math.random() * 30)
      const timestamp = new Date(now)
      timestamp.setDate(timestamp.getDate() - daysAgo)
      
      analytics.push({
        event: 'page_view',
        page: '/',
        timestamp,
        createdAt: timestamp
      })
    }

    // Batch insert
    await prisma.analytics.createMany({
      data: analytics
    })

    console.log(`✅ Created ${visitorCount} visitor records`)

    // Show stats
    const stats = {
      visitors: await prisma.analytics.count({ where: { event: 'page_view' } }),
      members: await prisma.user.count(),
      certificates: await prisma.certificate.count() + await prisma.courseCertificate.count()
    }

    console.log('\n📊 Current Stats:')
    console.log(`   👥 Visitors: ${stats.visitors.toLocaleString()}`)
    console.log(`   👤 Members: ${stats.members.toLocaleString()}`)
    console.log(`   🏆 Certificates: ${stats.certificates.toLocaleString()}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedAnalytics()
