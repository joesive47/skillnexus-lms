import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { findCareerPath } from '@/lib/career/path-finder'

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { currentCareer, targetCareer } = body

    if (!currentCareer || !targetCareer) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const path = findCareerPath(currentCareer, targetCareer)

    if (!path) {
      return NextResponse.json(
        { success: false, error: 'No path found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: path
    })
  } catch (error) {
    console.error('Error finding career path:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to find career path' },
      { status: 500 }
    )
  }
}