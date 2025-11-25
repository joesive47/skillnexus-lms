import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testUIIntegration() {
  console.log('🎨 Testing UI Integration...')

  try {
    // Test user paths query
    const testUser = await prisma.user.findFirst({
      where: { email: 'student@skillnexus.com' }
    })

    if (!testUser) {
      console.log('❌ Test user not found')
      return
    }

    console.log(`✅ Found test user: ${testUser.email}`)

    // Test getUserPaths equivalent query
    const userPaths = await prisma.learningPathEnrollment.findMany({
      where: { userId: testUser.id },
      include: {
        path: {
          include: {
            career: true,
            steps: {
              orderBy: { order: 'asc' },
              include: {
                completions: { where: { userId: testUser.id } }
              }
            },
            _count: { select: { enrollments: true } }
          }
        }
      },
      orderBy: { lastAccessAt: 'desc' }
    })

    console.log(`✅ Found ${userPaths.length} enrolled paths`)

    // Test path details for UI
    for (const enrollment of userPaths) {
      const path = enrollment.path
      console.log(`\n📚 Path: ${path.title}`)
      console.log(`   Progress: ${enrollment.progress}%`)
      console.log(`   Steps: ${path.steps.length}`)
      console.log(`   Enrollments: ${path._count.enrollments}`)
      
      // Test step status for UI
      const stepsWithStatus = path.steps.map(step => {
        const isCompleted = step.completions.length > 0
        const prerequisites = JSON.parse(step.prerequisites || '[]')
        
        // Simple prerequisite check
        const completedStepIds = path.steps
          .filter(s => s.completions.length > 0)
          .map(s => s.id)
        
        const isLocked = prerequisites.some(prereqId => 
          !completedStepIds.includes(prereqId)
        )
        
        return {
          ...step,
          isCompleted,
          isLocked: isLocked && !isCompleted,
          isActive: !isCompleted && !isLocked
        }
      })

      console.log(`   Completed steps: ${stepsWithStatus.filter(s => s.isCompleted).length}`)
      console.log(`   Active steps: ${stepsWithStatus.filter(s => s.isActive).length}`)
      console.log(`   Locked steps: ${stepsWithStatus.filter(s => s.isLocked).length}`)
    }

    // Test learning streak
    const streak = await prisma.learningStreak.findUnique({
      where: { userId: testUser.id }
    })

    if (streak) {
      console.log(`\n🔥 Learning Streak:`)
      console.log(`   Current: ${streak.currentStreak} days`)
      console.log(`   Longest: ${streak.longestStreak} days`)
      console.log(`   Last Activity: ${streak.lastActivity.toDateString()}`)
    }

    // Test skill assessments for UI
    const skillAssessments = await prisma.skillAssessment.findMany({
      where: { userId: testUser.id },
      include: { skill: true }
    })

    console.log(`\n🎯 Skills Assessed: ${skillAssessments.length}`)
    skillAssessments.forEach(assessment => {
      console.log(`   ${assessment.skill.name}: Level ${assessment.level}`)
    })

    // Test public paths for discovery
    const publicPaths = await prisma.learningPath.findMany({
      where: { isPublic: true, isActive: true },
      include: {
        career: true,
        creator: { select: { name: true } },
        _count: { select: { enrollments: true, reviews: true } }
      },
      orderBy: { enrollments: { _count: 'desc' } },
      take: 5
    })

    console.log(`\n🔍 Public Paths Available: ${publicPaths.length}`)
    publicPaths.forEach(path => {
      console.log(`   ${path.title} - ${path._count.enrollments} enrolled`)
    })

    // Test step completion data
    const completions = await prisma.stepCompletion.findMany({
      where: { userId: testUser.id },
      include: { step: { include: { path: true } } },
      orderBy: { completedAt: 'desc' },
      take: 5
    })

    console.log(`\n📊 Recent Completions: ${completions.length}`)
    completions.forEach(completion => {
      console.log(`   ${completion.step.title} - Score: ${completion.score || 'N/A'}`)
    })

    console.log('\n🎉 UI Integration test completed successfully!')

  } catch (error) {
    console.error('❌ UI Integration test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testUIIntegration()