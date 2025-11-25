import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { learningPathService } from '@/lib/learning-path-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const resolvedParams = await params
    const pathId = resolvedParams.id

    const path = await learningPathService.getPathById(pathId, session?.user?.id)
    
    if (!path) {
      return NextResponse.json({ error: 'Path not found' }, { status: 404 })
    }

    const stats = await learningPathService.getPathStats(pathId)

    return NextResponse.json({ path, stats })
  } catch (error) {
    console.error('Error fetching learning path:', error)
    return NextResponse.json(
      { error: 'Failed to fetch learning path' },
      { status: 500 }
    )
  }
}