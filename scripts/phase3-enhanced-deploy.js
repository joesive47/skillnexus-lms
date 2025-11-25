// Phase 3: Enhanced Deployment Script
// 🎮 Gamification, 🏆 Achievements, 📊 Analytics, 🤝 Collaboration

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function deployPhase3() {
  console.log('🚀 Starting Phase 3 Enhanced Deployment...')
  
  try {
    // 1. Create default badges
    await createDefaultBadges()
    
    // 2. Initialize system metrics
    await initializeSystemMetrics()
    
    // 3. Create sample study groups
    await createSampleStudyGroups()
    
    // 4. Setup gamification for existing users
    await setupExistingUserProfiles()
    
    console.log('✅ Phase 3 deployment completed successfully!')
    
  } catch (error) {
    console.error('❌ Phase 3 deployment failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function createDefaultBadges() {
  console.log('📛 Creating default badges...')
  
  const badges = [
    {
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      color: '#10B981',
      rarity: 'COMMON',
      points: 50,
      criteria: JSON.stringify({ type: 'lesson_completion', count: 1 })
    },
    {
      name: 'Quick Learner',
      description: 'Complete 5 lessons in one day',
      icon: '⚡',
      color: '#F59E0B',
      rarity: 'RARE',
      points: 200,
      criteria: JSON.stringify({ type: 'daily_lessons', count: 5 })
    },
    {
      name: 'Course Master',
      description: 'Complete an entire course',
      icon: '🏆',
      color: '#EF4444',
      rarity: 'EPIC',
      points: 500,
      criteria: JSON.stringify({ type: 'course_completion', count: 1 })
    },
    {
      name: 'Streak Champion',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      color: '#8B5CF6',
      rarity: 'LEGENDARY',
      points: 1000,
      criteria: JSON.stringify({ type: 'lesson_streak', days: 7 })
    },
    {
      name: 'Quiz Master',
      description: 'Score 90% or higher on 10 quizzes',
      icon: '🧠',
      color: '#06B6D4',
      rarity: 'EPIC',
      points: 750,
      criteria: JSON.stringify({ type: 'quiz_score', minScore: 0.9, count: 10 })
    },
    {
      name: 'Social Learner',
      description: 'Join your first study group',
      icon: '👥',
      color: '#84CC16',
      rarity: 'COMMON',
      points: 100,
      criteria: JSON.stringify({ type: 'study_group_join', count: 1 })
    },
    {
      name: 'Discussion Leader',
      description: 'Start 5 discussions in study groups',
      icon: '💬',
      color: '#F97316',
      rarity: 'RARE',
      points: 300,
      criteria: JSON.stringify({ type: 'discussion_start', count: 5 })
    },
    {
      name: 'Peer Helper',
      description: 'Give 10 peer reviews',
      icon: '🤝',
      color: '#EC4899',
      rarity: 'RARE',
      points: 400,
      criteria: JSON.stringify({ type: 'peer_reviews_given', count: 10 })
    }
  ]

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: badge,
      create: badge
    })
  }
  
  console.log(`✅ Created ${badges.length} badges`)
}

async function initializeSystemMetrics() {
  console.log('📊 Initializing system metrics...')
  
  const today = new Date().toISOString().split('T')[0]
  const thisWeek = `${new Date().getFullYear()}-W${Math.ceil(new Date().getDate() / 7)}`
  const thisMonth = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`
  
  const metrics = [
    {
      metricType: 'user_activity',
      metricName: 'daily_active_users',
      period: 'daily',
      periodValue: today,
      value: 0,
      unit: 'count'
    },
    {
      metricType: 'course_completion',
      metricName: 'courses_completed',
      period: 'daily',
      periodValue: today,
      value: 0,
      unit: 'count'
    },
    {
      metricType: 'system_performance',
      metricName: 'avg_response_time',
      period: 'hourly',
      periodValue: `${today}-${new Date().getHours()}`,
      value: 0,
      unit: 'milliseconds'
    }
  ]

  for (const metric of metrics) {
    await prisma.systemMetrics.upsert({
      where: {
        metricType_metricName_period_periodValue: {
          metricType: metric.metricType,
          metricName: metric.metricName,
          period: metric.period,
          periodValue: metric.periodValue
        }
      },
      update: metric,
      create: metric
    })
  }
  
  console.log(`✅ Initialized ${metrics.length} system metrics`)
}

async function createSampleStudyGroups() {
  console.log('👥 Creating sample study groups...')
  
  // Get admin user
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })
  
  if (!adminUser) {
    console.log('⚠️ No admin user found, skipping study groups creation')
    return
  }

  // Get some courses
  const courses = await prisma.course.findMany({
    where: { published: true },
    take: 3
  })

  const studyGroups = [
    {
      name: 'JavaScript Beginners',
      description: 'Learn JavaScript fundamentals together',
      courseId: courses[0]?.id,
      isPublic: true,
      maxMembers: 20,
      creatorId: adminUser.id
    },
    {
      name: 'Web Development Study Circle',
      description: 'Advanced web development discussions and projects',
      courseId: courses[1]?.id,
      isPublic: true,
      maxMembers: 15,
      creatorId: adminUser.id
    },
    {
      name: 'Programming Practice Group',
      description: 'Daily coding challenges and peer reviews',
      isPublic: true,
      maxMembers: 25,
      creatorId: adminUser.id
    }
  ]

  for (const groupData of studyGroups) {
    const group = await prisma.studyGroup.create({
      data: {
        ...groupData,
        members: {
          create: {
            userId: adminUser.id,
            role: 'ADMIN'
          }
        }
      }
    })

    // Create a welcome discussion
    await prisma.groupDiscussion.create({
      data: {
        groupId: group.id,
        title: 'Welcome to the group!',
        content: 'Hello everyone! Welcome to our study group. Let\'s introduce ourselves and share our learning goals.',
        authorId: adminUser.id,
        isPinned: true
      }
    })
  }
  
  console.log(`✅ Created ${studyGroups.length} sample study groups`)
}

async function setupExistingUserProfiles() {
  console.log('👤 Setting up gamification profiles for existing users...')
  
  const users = await prisma.user.findMany({
    select: { id: true }
  })

  let profilesCreated = 0
  
  for (const user of users) {
    // Check if profile already exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId: user.id }
    })

    if (!existingProfile) {
      await prisma.userProfile.create({
        data: {
          userId: user.id,
          level: 1,
          experience: 0,
          totalPoints: 0,
          streak: 0,
          longestStreak: 0,
          title: 'New Learner'
        }
      })
      profilesCreated++
    }

    // Initialize leaderboard entries
    const today = new Date()
    const weekPeriod = `${today.getFullYear()}-W${Math.ceil(today.getDate() / 7)}`
    const monthPeriod = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`

    const leaderboardEntries = [
      { userId: user.id, category: 'weekly', period: weekPeriod, points: 0 },
      { userId: user.id, category: 'monthly', period: monthPeriod, points: 0 },
      { userId: user.id, category: 'all_time', period: 'all', points: 0 }
    ]

    for (const entry of leaderboardEntries) {
      await prisma.leaderboardEntry.upsert({
        where: {
          userId_category_period: {
            userId: entry.userId,
            category: entry.category,
            period: entry.period
          }
        },
        update: {},
        create: entry
      })
    }
  }
  
  console.log(`✅ Created ${profilesCreated} user profiles and initialized leaderboards`)
}

// Run deployment
deployPhase3()