import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getDiscussions, createDiscussion } from '@/lib/social'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const { courseId } = await params

    const result = await getDiscussions(courseId, page, limit)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch discussions' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content } = await request.json()
    const { courseId } = await params
    
    const discussion = await createDiscussion(
      courseId,
      session.user.id,
      title,
      content
    )

    return NextResponse.json(discussion)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create discussion' }, { status: 500 })
  }
}