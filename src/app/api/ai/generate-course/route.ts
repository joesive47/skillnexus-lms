import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { CourseGenerator, CourseRequest } from '@/lib/ai/course-generator'

export async function POST(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const request: CourseRequest = await req.json()

  if (!request.topic || !request.level || !request.duration) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const course = await CourseGenerator.generate(request)

  return NextResponse.json({
    success: true,
    course,
    message: 'Course generated successfully'
  })
}
