/**
 * Production Migration Runner
 * 
 * This script runs the Learning Flow migration on the production database.
 * Safe to run multiple times - it will skip existing nodes.
 * 
 * Usage: node scripts/deploy-migration.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function runProductionMigration() {
  try {
    console.log('🌍 Starting Production Migration...\n')

    // Import the migration function
    const migrateLearningFlow = require('./migrate-to-learning-flow.js')

    // Get all courses
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true
      }
    })

    if (courses.length === 0) {
      console.log('⚠️  No courses found. Nothing to migrate.')
      return
    }

    console.log(`📊 Found ${courses.length} courses to migrate\n`)

    let totalCreated = 0
    let totalSkipped = 0

    // Migrate each course
    for (const course of courses) {
      console.log(`\n📖 Course: ${course.title}`)

      try {
        // Run the actual migration (this is handled by migrate-to-learning-flow.js when required)
        // For now, just run the script directly
        const { execSync } = require('child_process')
        const result = execSync(`node scripts/migrate-to-learning-flow.js ${course.id}`, {
          encoding: 'utf-8',
          stdio: 'pipe'
        })
        
        console.log(result)

      } catch (error) {
        console.error(`❌ Failed to migrate course ${course.title}:`, error.message)
        // Continue with next course
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('🎉 PRODUCTION MIGRATION COMPLETE!')
    console.log('='.repeat(60))

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  runProductionMigration()
    .then(() => {
      console.log('\n✅ All done!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

module.exports = runProductionMigration
