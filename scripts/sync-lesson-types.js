/**
 * Sync Lesson Type Migration Script (JavaScript version)
 * 
 * This script synchronizes the 'type' and 'lessonType' fields in the Lesson table.
 * Run this to fix any inconsistencies in existing data.
 * 
 * Usage: node scripts/sync-lesson-types.js
 */

// Load environment variables from multiple sources
const dotenv = require('dotenv')
const path = require('path')

// Try to load from .env.postgresql first, then fall back to .env
const envFiles = ['.env.postgresql', '.env.production', '.env']
for (const envFile of envFiles) {
  const result = dotenv.config({ path: path.join(__dirname, '..', envFile) })
  if (!result.error && process.env.DATABASE_URL) {
    console.log(`✅ Loaded environment from ${envFile}`)
    break
  }
}

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in any .env file')
  console.error('   Checked: .env.postgresql, .env.production, .env')
  process.exit(1)
}

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function syncLessonTypes() {
  try {
    console.log('🔄 Starting lesson type synchronization...')

    // Get all lessons
    const lessons = await prisma.lesson.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        lessonType: true,
      }
    })

    console.log(`📊 Found ${lessons.length} lessons to check`)

    let syncCount = 0
    let alreadySyncedCount = 0

    for (const lesson of lessons) {
      if (lesson.type !== lesson.lessonType) {
        console.log(`⚠️  Lesson "${lesson.title}" (${lesson.id}):`)
        console.log(`   type: ${lesson.type} → lessonType: ${lesson.lessonType}`)
        
        // Use lessonType as the source of truth
        await prisma.lesson.update({
          where: { id: lesson.id },
          data: {
            type: lesson.lessonType,
            lessonType: lesson.lessonType,
          }
        })
        
        console.log(`   ✅ Synced to: ${lesson.lessonType}`)
        syncCount++
      } else {
        alreadySyncedCount++
      }
    }

    console.log('\n✨ Synchronization complete!')
    console.log(`   ✅ Synced: ${syncCount} lessons`)
    console.log(`   ℹ️  Already synced: ${alreadySyncedCount} lessons`)
    console.log(`   📝 Total: ${lessons.length} lessons`)

  } catch (error) {
    console.error('❌ Error during synchronization:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

syncLessonTypes()
  .then(() => {
    console.log('\n🎉 Script completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error)
    process.exit(1)
  })
