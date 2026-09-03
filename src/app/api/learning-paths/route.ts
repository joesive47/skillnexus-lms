import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { learningPathService } from '@/lib/learning-path-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const careerId = searchParams.get('careerId')
    const difficulty = searchParams.get('difficulty')
    const tags = searchParams.get('tags')?.split(',')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const paths = await learningPathService.getPublicPaths({
      careerId: careerId || undefined,
      difficulty: difficulty || undefined,
      tags,
      limit,
      offset
    })

    return NextResponse.json({ paths })
  } catch (error) {
    console.error('Error fetching learning paths:', error)
    return NextResponse.json(
      { error: 'Failed to fetch learning paths' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    const path = await learningPathService.createLearningPath({
      ...data,
      createdBy: session.user.id
    })

    return NextResponse.json({ path }, { status: 201 })
  } catch (error) {
    console.error('Error creating learning path:', error)
    return NextResponse.json(
      { error: 'Failed to create learning path' },
      { status: 500 }
    )
  }
}