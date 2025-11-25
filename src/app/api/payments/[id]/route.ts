import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true, price: true } }
      }
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    return NextResponse.json({ payment })
  } catch (error) {
    console.error('Error fetching payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, metadata } = body

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        status,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
        paidAt: status === 'COMPLETED' ? new Date() : undefined
      },
      include: {
        user: true,
        course: true
      }
    })

    // If payment completed, enroll user in course
    if (status === 'COMPLETED' && payment.courseId) {
      await prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: payment.userId,
            courseId: payment.courseId
          }
        },
        create: {
          userId: payment.userId,
          courseId: payment.courseId
        },
        update: {}
      })

      // Add credits to user
      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          credits: {
            increment: Math.floor(payment.amount / 100) // 1 credit per 100 THB
          }
        }
      })
    }

    return NextResponse.json({ payment })
  } catch (error) {
    console.error('Error updating payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}