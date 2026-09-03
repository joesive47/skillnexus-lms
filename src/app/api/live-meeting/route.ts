import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, maxParticipants } = body

    const meetingId = `meeting-${Date.now()}`
    const meetingUrl = `${process.env.NEXTAUTH_URL}/live-meeting/${meetingId}`

    return NextResponse.json({
      success: true,
      data: {
        id: meetingId,
        title,
        description,
        maxParticipants,
        url: meetingUrl,
        createdBy: session.user.email,
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    })
  } catch (error) {
    console.error('Error creating meeting:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create meeting' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      data: [],
      message: 'No active meetings'
    })
  } catch (error) {
    console.error('Error fetching meetings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch meetings' },
      { status: 500 }
    )
  }
}