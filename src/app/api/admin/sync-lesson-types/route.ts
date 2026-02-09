import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

/**
 * API Endpoint to sync lesson type and lessonType fields
 * GET /api/admin/sync-lesson-types
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    // Check admin authentication
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

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
    const syncedLessons: any[] = []

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
        syncedLessons.push({
          id: lesson.id,
          title: lesson.title,
          from: lesson.type,
          to: lesson.lessonType,
        })
        syncCount++
      } else {
        alreadySyncedCount++
      }
    }

    const result = {
      success: true,
      message: 'Synchronization completed',
      stats: {
        total: lessons.length,
        synced: syncCount,
        alreadySynced: alreadySyncedCount,
      },
      syncedLessons,
    }

    console.log('\n✨ Synchronization complete!')
    console.log(`   ✅ Synced: ${syncCount} lessons`)
    console.log(`   ℹ️  Already synced: ${alreadySyncedCount} lessons`)
    console.log(`   📝 Total: ${lessons.length} lessons`)

    return NextResponse.json(result, { status: 200 })

  } catch (error) {
    console.error('❌ Error during synchronization:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync lesson types',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
