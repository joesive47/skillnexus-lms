import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { scormService } from '@/lib/scorm-service'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')
    const userId = searchParams.get('userId') || session.user.id

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 })
    }

    // Get SCORM package for this lesson
    const scormPackage = await scormService.getPackage(lessonId)
    if (!scormPackage) {
      return NextResponse.json({ error: 'SCORM package not found' }, { status: 404 })
    }

    // Get progress for this user and package
    const progress = await scormService.getProgress(userId, scormPackage.id)

    return NextResponse.json({ 
      success: true, 
      progress,
      package: scormPackage 
    })
  } catch (error) {
    console.error('Error fetching SCORM progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { lessonId, userId, cmiData } = await request.json()

    if (!lessonId || !cmiData) {
      return NextResponse.json({ error: 'Lesson ID and CMI data required' }, { status: 400 })
    }

    const targetUserId = userId || session.user.id

    // Get SCORM package for this lesson
    const scormPackage = await scormService.getPackage(lessonId)
    if (!scormPackage) {
      return NextResponse.json({ error: 'SCORM package not found' }, { status: 404 })
    }

    // Update progress
    const progress = await scormService.updateProgress(targetUserId, scormPackage.id, cmiData)

    return NextResponse.json({ 
      success: true, 
      progress,
      message: 'Progress saved successfully' 
    })
  } catch (error) {
    console.error('Error saving SCORM progress:', error)
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    )
  }
}