import { NextRequest, NextResponse } from 'next/server'
import { scormService } from '@/lib/scorm-service'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 })
    }

    const scormPackage = await scormService.getPackage(lessonId)
    
    if (!scormPackage) {
      return NextResponse.json({ error: 'SCORM package not found' }, { status: 404 })
    }

    const progress = await scormService.getProgress(session.user.id, scormPackage.id)
    
    // Construct the correct player URL
    const playerUrl = scormPackage.packagePath.startsWith('/') 
      ? `${scormPackage.packagePath}/index.html`
      : `/${scormPackage.packagePath}/index.html`
    
    return NextResponse.json({ 
      package: scormPackage,
      progress,
      playerUrl
    })
  } catch (error) {
    console.error('SCORM player error:', error)
    return NextResponse.json(
      { error: 'Failed to load SCORM player' },
      { status: 500 }
    )
  }
}