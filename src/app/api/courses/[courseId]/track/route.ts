import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { AccessError, publicError, requireUser } from '@/lib/access-control'

const trackingSchema = z.object({
  event: z.enum(['VIEW', 'START', 'RESUME']),
  sessionId: z.string().max(100).optional(),
  source: z.string().max(40).default('web'),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const user = await requireUser()
    const { courseId } = await params
    const payload = trackingSchema.parse(await request.json())

    if (user.role !== 'STUDENT') return NextResponse.json({ tracked: false }, { status: 202 })

    const course = await prisma.course.findFirst({ where: { id: courseId, published: true }, select: { id: true } })
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } }, select: { id: true },
    })
    if (payload.event !== 'VIEW' && !enrollment) {
      return NextResponse.json({ error: 'Course enrollment required' }, { status: 403 })
    }

    const duplicateWindow = new Date(Date.now() - 30 * 60 * 1000)
    const duplicate = await prisma.courseTrackingEvent.findFirst({
      where: { courseId, userId: user.id, event: payload.event, occurredAt: { gte: duplicateWindow } },
      select: { id: true },
    })
    if (!duplicate) {
      await prisma.courseTrackingEvent.create({
        data: { courseId, userId: user.id, event: payload.event, sessionId: payload.sessionId, source: payload.source },
      })
    }

    return NextResponse.json({ tracked: !duplicate }, { status: 202 })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid tracking event' }, { status: 400 })
    return NextResponse.json(
      { error: publicError(error) },
      { status: error instanceof AccessError ? error.status : 500 },
    )
  }
}
