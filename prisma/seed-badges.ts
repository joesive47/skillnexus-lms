import { prisma } from '@/lib/prisma'

async function seedBadgesAndCertifications() {
  console.log('🌱 Seeding badges and certifications...')

  // Create gamification badges (using the Badge model)
  const badges = await Promise.all([
    prisma.badge.upsert({
      where: { id: 'badge-js-beginner' },
      update: {},
      create: {
        id: 'badge-js-beginner',
        name: 'JavaScript Beginner',
        description: 'Basic JavaScript knowledge',
        icon: '🟨',
        color: '#f59e0b',
        points: 100,
        criteria: JSON.stringify({ type: 'QUIZ_SCORE', minScore: 70, quizId: 'js-basics' }),
        isActive: true
      }
    }),
    prisma.badge.upsert({
      where: { id: 'badge-js-expert' },
      update: {},
      create: {
        id: 'badge-js-expert',
        name: 'JavaScript Expert',
        description: 'Advanced JavaScript mastery',
        icon: '🟩',
        color: '#10b981',
        points: 500,
        criteria: JSON.stringify({ type: 'QUIZ_SCORE', minScore: 85, quizId: 'js-advanced' }),
        isActive: true
      }
    }),
    prisma.badge.upsert({
      where: { id: 'badge-react-master' },
      update: {},
      create: {
        id: 'badge-react-master',
        name: 'React Master',
        description: 'React framework expertise',
        icon: '⚛️',
        color: '#3b82f6',
        points: 750,
        criteria: JSON.stringify({ 
          type: 'COMBINED', 
          minScore: 90, 
          quizId: 'react-advanced',
          minHours: 20 
        }),
        isActive: true
      }
    }),
    prisma.badge.upsert({
      where: { id: 'badge-nodejs-pro' },
      update: {},
      create: {
        id: 'badge-nodejs-pro',
        name: 'Node.js Professional',
        description: 'Server-side JavaScript expertise',
        icon: '🟢',
        color: '#059669',
        points: 600,
        criteria: JSON.stringify({ 
          type: 'ASSESSMENT', 
          minScore: 80, 
          assessmentId: 'nodejs-career' 
        }),
        isActive: true
      }
    })
  ])

  // Create achievements
  const achievements = await Promise.all([
    prisma.achievement.upsert({
      where: { name: 'First Course Complete' },
      update: {},
      create: {
        name: 'First Course Complete',
        description: 'Complete your first course',
        icon: '🎓',
        xpReward: 100,
        badgeReward: 'badge-js-beginner',
        requirementType: 'course_complete',
        requirementValue: 1
      }
    }),
    prisma.achievement.upsert({
      where: { name: 'Quiz Master' },
      update: {},
      create: {
        name: 'Quiz Master',
        description: 'Pass 10 quizzes with 80%+ score',
        icon: '🧠',
        xpReward: 250,
        badgeReward: 'badge-js-expert',
        requirementType: 'quiz_pass',
        requirementValue: 10
      }
    }),
    prisma.achievement.upsert({
      where: { name: 'Learning Streak' },
      update: {},
      create: {
        name: 'Learning Streak',
        description: 'Login for 7 consecutive days',
        icon: '🔥',
        xpReward: 150,
        requirementType: 'login_streak',
        requirementValue: 7
      }
    })
  ])

  console.log('✅ Badges and achievements seeded successfully!')
  console.log(`Created ${badges.length} badges`)
  console.log(`Created ${achievements.length} achievements`)
}

if (require.main === module) {
  seedBadgesAndCertifications()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
}

export { seedBadgesAndCertifications }