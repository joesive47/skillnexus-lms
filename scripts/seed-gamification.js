const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedGamification() {
  console.log('🎮 Seeding gamification data...')

  try {
    // Seed Daily Missions
    const missions = [
      {
        title: 'เข้าสู่ระบบประจำวัน',
        description: 'เข้าสู่ระบบวันนี้',
        type: 'login',
        target: 1,
        xpReward: 10,
        creditReward: 1
      },
      {
        title: 'เรียนบทเรียน',
        description: 'เรียนบทเรียนให้จบ 1 บท',
        type: 'lesson_complete',
        target: 1,
        xpReward: 50,
        creditReward: 2
      },
      {
        title: 'ทำแบบทดสอบ',
        description: 'ผ่านแบบทดสอบ 1 ข้อ',
        type: 'quiz_pass',
        target: 1,
        xpReward: 100,
        creditReward: 5
      },
      {
        title: 'เรียนต่อเนื่อง',
        description: 'เรียนบทเรียน 3 บทในวันเดียว',
        type: 'lesson_complete',
        target: 3,
        xpReward: 200,
        creditReward: 10
      }
    ]

    for (const mission of missions) {
      await prisma.dailyMission.create({
        data: mission
      })
    }

    // Seed Achievements
    const achievements = [
      {
        name: 'Rising Star',
        description: 'ถึงเลเวล 5',
        icon: '⭐',
        xpReward: 100,
        badgeReward: 'Rising Star',
        requirementType: 'level',
        requirementValue: 5
      },
      {
        name: 'Week Warrior',
        description: 'เข้าสู่ระบบต่อเนื่อง 7 วัน',
        icon: '🔥',
        xpReward: 500,
        badgeReward: 'Week Warrior',
        requirementType: 'login_streak',
        requirementValue: 7
      },
      {
        name: 'Quiz Master',
        description: 'ผ่านแบบทดสอบ 10 ข้อ',
        icon: '🏆',
        xpReward: 300,
        badgeReward: 'Quiz Master',
        requirementType: 'quiz_complete',
        requirementValue: 10
      },
      {
        name: 'Learning Legend',
        description: 'เรียนจบ 50 บทเรียน',
        icon: '👑',
        xpReward: 1000,
        badgeReward: 'Learning Legend',
        requirementType: 'lesson_complete',
        requirementValue: 50
      }
    ]

    for (const achievement of achievements) {
      await prisma.achievement.create({
        data: achievement
      })
    }

    // Seed Credit Store Items
    const storeItems = [
      {
        title: 'Premium Course Access',
        description: 'ปลดล็อคคอร์สพรีเมียม 1 เดือน',
        type: 'course',
        cost: 100
      },
      {
        title: 'Double XP Boost',
        description: 'รับ XP เพิ่ม 2 เท่า เป็นเวลา 24 ชั่วโมง',
        type: 'feature',
        cost: 50
      },
      {
        title: 'Custom Avatar',
        description: 'ปรับแต่งรูปโปรไฟล์ของคุณ',
        type: 'cosmetic',
        cost: 25
      },
      {
        title: 'Skip Quiz',
        description: 'ข้ามแบบทดสอบ 1 ข้อ',
        type: 'feature',
        cost: 30
      },
      {
        title: 'Certificate Template',
        description: 'เทมเพลตใบประกาศนียบัตรพิเศษ',
        type: 'cosmetic',
        cost: 75
      },
      {
        title: 'Priority Support',
        description: 'รับการสนับสนุนแบบพิเศษ 7 วัน',
        type: 'feature',
        cost: 150
      }
    ]

    for (const item of storeItems) {
      await prisma.creditStore.create({
        data: item
      })
    }

    console.log('✅ Gamification data seeded successfully!')
    console.log(`📋 Created ${missions.length} daily missions`)
    console.log(`🏆 Created ${achievements.length} achievements`)
    console.log(`🏪 Created ${storeItems.length} store items`)

  } catch (error) {
    console.error('❌ Error seeding gamification data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedGamification()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })