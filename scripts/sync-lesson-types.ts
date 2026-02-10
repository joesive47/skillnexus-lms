/**
 * Sync Lesson Type Migration Script
 * 
 * This script synchronizes the 'type' and 'lessonType' fields in the Lesson table.
 * Run this to fix any inconsistencies in existing data.
 */

import { PrismaClient } from '@prisma/client'

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
