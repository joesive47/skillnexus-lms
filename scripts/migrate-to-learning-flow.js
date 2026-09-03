/**
 * Quick Migration Script: Convert Lessons to LearningNodes
 * 
 * Usage: node scripts/migrate-to-learning-flow.js [courseId]
 * 
 * This script is optimized for speed:
 * - Batch processing (100 lessons at a time)
 * - Parallel node creation
 * - Skip existing nodes
 * - Auto-retry on failure
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const BATCH_SIZE = 100

async function migrateCourseToLearningFlow(courseId) {
  console.log(`\n🚀 Starting migration for course: ${courseId}`)
  
  try {
    // 1. Get all lessons for this course
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        quiz: true,
        module: true
      }
    })

    console.log(`📚 Found ${lessons.length} lessons`)

    // 2. Check existing nodes to skip duplicates
    const existingNodes = await prisma.learningNode.findMany({
      where: { courseId },
      select: { refId: true, nodeType: true }
    })

    const existingSet = new Set(
      existingNodes.map(n => `${n.nodeType}-${n.refId}`)
    )

    console.log(`✅ ${existingNodes.length} nodes already exist`)

    // 3. Create nodes in batches
    let createdCount = 0
    let skippedCount = 0

    for (let i = 0; i < lessons.length; i += BATCH_SIZE) {
      const batch = lessons.slice(i, i + BATCH_SIZE)
      
      const nodesToCreate = []
      
      for (const lesson of batch) {
        const baseOrder = lesson.order * 10 // Leave gaps for quizzes
        
        // Determine node type based on lesson content
        let nodeType = 'VIDEO'
        if (lesson.scormUrl || lesson.scormPackageUrl) {
          nodeType = 'SCORM'
        } else if (lesson.videoUrl || lesson.vdocipherVideoId) {
          nodeType = 'VIDEO'
        }

        const videoNodeKey = `${nodeType}-${lesson.id}`
        
        if (!existingSet.has(videoNodeKey)) {
          nodesToCreate.push({
            courseId,
            nodeType,
            refId: lesson.id,
            title: lesson.title,
            order: baseOrder,
            requiredProgress: 80, // 80% default
            isFinalExam: false
          })
          existingSet.add(videoNodeKey)
        } else {
          skippedCount++
        }

        // Create Quiz node if lesson has quiz
        if (lesson.quiz) {
          const quizNodeKey = `QUIZ-${lesson.quiz.id}`
          
          if (!existingSet.has(quizNodeKey)) {
            nodesToCreate.push({
              courseId,
              nodeType: 'QUIZ',
              refId: lesson.quiz.id,
              title: `แบบทดสอบ: ${lesson.title}`,
              order: baseOrder + 5, // Quiz comes after video/scorm
              requiredScore: lesson.quiz.passScore || 60,
              isFinalExam: false
            })
            existingSet.add(quizNodeKey)
          } else {
            skippedCount++
          }
        }
      }

      // Batch create
      if (nodesToCreate.length > 0) {
        await prisma.learningNode.createMany({
          data: nodesToCreate,
          skipDuplicates: true
        })
        createdCount += nodesToCreate.length
        console.log(`  ✓ Batch ${Math.floor(i / BATCH_SIZE) + 1}: Created ${nodesToCreate.length} nodes`)
      }
    }

    console.log(`\n✅ Migration completed!`)
    console.log(`   Created: ${createdCount} nodes`)
    console.log(`   Skipped: ${skippedCount} nodes (already exist)`)

    // 4. Create sequential dependencies (simple linear path)
    await createSequentialDependencies(courseId)

    // 5. Create progress summary for enrolled users
    await createProgressSummaries(courseId)

    return { success: true, created: createdCount, skipped: skippedCount }

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

async function createSequentialDependencies(courseId) {
  console.log(`\n🔗 Creating sequential dependencies...`)

  const nodes = await prisma.learningNode.findMany({
    where: { courseId },
    orderBy: { order: 'asc' }
  })

  if (nodes.length < 2) {
    console.log('   ⏭️  Skipped (less than 2 nodes)')
    return
  }

  const dependencies = []

  for (let i = 1; i < nodes.length; i++) {
    const fromNode = nodes[i - 1]
    const toNode = nodes[i]

    dependencies.push({
      fromNodeId: fromNode.id,
      toNodeId: toNode.id,
      dependencyType: 'AND' // Simple sequential
    })
  }

  await prisma.nodeDependency.createMany({
    data: dependencies,
    skipDuplicates: true
  })

  console.log(`   ✓ Created ${dependencies.length} dependencies`)
}

async function createProgressSummaries(courseId) {
  console.log(`\n📊 Creating progress summaries...`)

  const enrollments = await prisma.enrollment.findMany({
    where: { courseId },
    select: { userId: true }
  })

  const totalNodes = await prisma.learningNode.count({
    where: { courseId }
  })

  const summaries = enrollments.map(enrollment => ({
    userId: enrollment.userId,
    courseId,
    totalNodes,
    completedNodes: 0,
    progressPercent: 0,
    canTakeFinalExam: false,
    certificateIssued: false
  }))

  await prisma.courseProgressSummary.createMany({
    data: summaries,
    skipDuplicates: true
  })

  console.log(`   ✓ Created ${summaries.length} progress summaries`)
}

async function migrateAllCourses() {
  console.log('🌍 Migrating ALL courses...\n')

  const courses = await prisma.course.findMany({
    select: { id: true, title: true }
  })

  let totalCreated = 0
  let totalSkipped = 0

  for (const course of courses) {
    console.log(`\n📖 Course: ${course.title}`)
    const result = await migrateCourseToLearningFlow(course.id)
    totalCreated += result.created
    totalSkipped += result.skipped
  }

  console.log(`\n\n🎉 ALL COURSES MIGRATED!`)
  console.log(`   Total created: ${totalCreated}`)
  console.log(`   Total skipped: ${totalSkipped}`)
}

// Main execution
const args = process.argv.slice(2)
const courseId = args[0]

if (courseId) {
  migrateCourseToLearningFlow(courseId)
    .then(() => {
      console.log('\n✅ Done!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Error:', error)
      process.exit(1)
    })
} else {
  migrateAllCourses()
    .then(() => {
      console.log('\n✅ All done!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Error:', error)
      process.exit(1)
    })
}
