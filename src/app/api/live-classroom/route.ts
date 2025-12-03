import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { roomName, roomCode, description } = body

    const roomId = `room-${Date.now()}`
    const streamUrl = `${process.env.NEXTAUTH_URL}/live-classroom/stream/${roomId}`

    return NextResponse.json({
      success: true,
      data: {
        id: roomId,
        roomName,
        roomCode: roomCode || Math.random().toString(36).substring(7).toUpperCase(),
        description,
        streamUrl,
        inviteLink: `${process.env.NEXTAUTH_URL}/live-classroom/join/${roomId}`,
        createdBy: session.user.email,
        createdAt: new Date().toISOString(),
        status: 'live',
        viewers: 0
      }
    })
  } catch (error) {
    console.error('Error creating classroom:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create classroom' },
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
      data: [
        {
          id: 'room-demo',
          roomName: 'คณิตศาสตร์ ม.3',
          status: 'live',
          viewers: 12,
          teacher: session.user.name,
          startedAt: new Date().toISOString()
        }
      ]
    })
  } catch (error) {
    console.error('Error fetching classrooms:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch classrooms' },
      { status: 500 }
    )
  }
}