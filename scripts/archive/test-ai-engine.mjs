import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAIEngine() {
  console.log('🧠 Testing AI Learning Path Engine...')

  try {
    // Test user (assuming student exists)
    const testUser = await prisma.user.findFirst({
      where: { email: 'student@skillnexus.com' }
    })

    if (!testUser) {
      console.log('❌ Test user not found')
      return
    }

    console.log(`✅ Found test user: ${testUser.email}`)

    // Test career
    const career = await prisma.career.findFirst({
      where: { title: 'Full-Stack Developer' }
    })

    if (!career) {
      console.log('❌ Career not found')
      return
    }

    console.log(`✅ Found career: ${career.title}`)

    // Create some sample skill assessments
    const skills = await prisma.skill.findMany({ take: 3 })
    
    for (const skill of skills) {
      await prisma.skillAssessment.upsert({
        where: {
          userId_skillId: {
            userId: testUser.id,
            skillId: skill.id
          }
        },
        update: { level: Math.floor(Math.random() * 3) + 1 },
        create: {
          userId: testUser.id,
          skillId: skill.id,
          level: Math.floor(Math.random() * 3) + 1
        }
      })
    }

    console.log('✅ Created sample skill assessments')

    // Test learning path creation
    const testPath = await prisma.learningPath.create({
      data: {
        title: 'AI Generated Test Path',
        description: 'Test path created by AI engine',
        careerId: career.id,
        difficulty: 'INTERMEDIATE',
        estimatedHours: 60,
        isPublic: false,
        createdBy: testUser.id
      }
    })

    console.log(`✅ Created test learning path: ${testPath.id}`)

    // Add test steps
    const steps = [
      {
        title: 'Foundation Assessment',
        description: 'Evaluate current knowledge',
        type: 'SKILL_ASSESSMENT',
        estimatedHours: 1,
        order: 1
      },
      {
        title: 'Core Learning Module',
        description: 'Learn fundamental concepts',
        type: 'COURSE',
        estimatedHours: 20,
        order: 2,
        prerequisites: JSON.stringify(['step1'])
      },
      {
        title: 'Practical Project',
        description: 'Apply learned skills',
        type: 'PROJECT',
        estimatedHours: 15,
        order: 3,
        prerequisites: JSON.stringify(['step2'])
      }
    ]

    for (const stepData of steps) {
      await prisma.learningPathStep.create({
        data: {
          ...stepData,
          pathId: testPath.id
        }
      })
    }

    console.log('✅ Added test steps to learning path')

    // Test enrollment
    const enrollment = await prisma.learningPathEnrollment.create({
      data: {
        userId: testUser.id,
        pathId: testPath.id,
        learningStyle: 'mixed',
        timeGoal: 10
      }
    })

    console.log(`✅ Created enrollment: ${enrollment.id}`)

    // Test step completion
    const firstStep = await prisma.learningPathStep.findFirst({
      where: { pathId: testPath.id, order: 1 }
    })

    if (firstStep) {
      await prisma.stepCompletion.create({
        data: {
          userId: testUser.id,
          stepId: firstStep.id,
          score: 85,
          timeSpent: 45,
          difficulty: 3
        }
      })

      console.log('✅ Created step completion')
    }

    // Test learning streak
    await prisma.learningStreak.upsert({
      where: { userId: testUser.id },
      update: {
        currentStreak: 5,
        longestStreak: 12,
        lastActivity: new Date()
      },
      create: {
        userId: testUser.id,
        currentStreak: 5,
        longestStreak: 12,
        lastActivity: new Date()
      }
    })

    console.log('✅ Updated learning streak')

    // Test queries
    const userPaths = await prisma.learningPathEnrollment.findMany({
      where: { userId: testUser.id },
      include: {
        path: {
          include: {
            steps: {
              include: {
                completions: { where: { userId: testUser.id } }
              }
            }
          }
        }
      }
    })

    console.log(`✅ Found ${userPaths.length} enrolled paths`)

    // Calculate progress
    for (const enrollment of userPaths) {
      const totalSteps = enrollment.path.steps.length
      const completedSteps = enrollment.path.steps.filter(step => 
        step.completions.length > 0
      ).length
      const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

      await prisma.learningPathEnrollment.update({
        where: { id: enrollment.id },
        data: { progress }
      })

      console.log(`✅ Updated progress: ${Math.round(progress)}%`)
    }

    console.log('🎉 AI Engine test completed successfully!')

  } catch (error) {
    console.error('❌ AI Engine test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAIEngine()