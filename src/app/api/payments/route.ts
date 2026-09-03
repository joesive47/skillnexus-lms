import { NextRequest, NextResponse } from 'next/server'
import { AccessError, publicError, requireUser } from '@/lib/access-control'
import prisma from '@/lib/prisma'
import { stripe, isStripeConfigured } from '@/lib/stripe'
import { createHash, randomUUID } from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser()
    const params = request.nextUrl.searchParams
    const page = Math.max(1, Math.min(10000, Number(params.get('page')) || 1))
    const limit = Math.max(1, Math.min(100, Number(params.get('limit')) || 10))
    if (!Number.isInteger(page) || !Number.isInteger(limit)) throw new AccessError('Invalid pagination', 400)
    const where = { userId: user.role === 'ADMIN' ? params.get('userId') || undefined : user.id, status: params.get('status') || undefined }
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({ where, include: { user: { select: { id: true, name: true, email: true } }, course: { select: { id: true, title: true, price: true } } }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      prisma.payment.count({ where })
    ])
    return NextResponse.json({ payments, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (error) { return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 }) }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()
    const { courseId, paymentMethod } = await request.json()
    if (paymentMethod !== 'CREDIT_CARD') throw new AccessError('This payment method is not configured; demo bank and PromptPay details are disabled', 503)
    if (!isStripeConfigured) throw new AccessError('Payment system not configured', 503)
    if (typeof courseId !== 'string') throw new AccessError('Course ID required', 400)
    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course?.published || course.price <= 0) throw new AccessError('Course is not available for payment', 400)
    if (await prisma.enrollment.findUnique({ where: { userId_courseId: { userId: user.id, courseId } } })) {
      throw new AccessError('You are already enrolled in this course', 409)
    }
    const suppliedKey = request.headers.get('idempotency-key')?.trim()
    if (suppliedKey && (suppliedKey.length < 8 || suppliedKey.length > 200)) throw new AccessError('Invalid idempotency key', 400)
    const idempotencyKey = createHash('sha256').update(`${user.id}:${suppliedKey || randomUUID()}`).digest('hex')
    let payment = await prisma.payment.findUnique({ where: { idempotencyKey } })
    if (payment && (payment.userId !== user.id || payment.courseId !== courseId || payment.amount !== course.price)) {
      throw new AccessError('Idempotency key was used for another payment', 409)
    }
    if (!payment) payment = await prisma.payment.create({ data: { userId: user.id, courseId, amount: course.price,
      paymentMethod: 'CREDIT_CARD', currency: 'THB', status: 'PENDING', idempotencyKey,
      expiresAt: new Date(Date.now() + 86400000) } })
    if (payment.status === 'COMPLETED') return NextResponse.json({ payment, alreadyCompleted: true })

    const oldMetadata = payment.metadata ? JSON.parse(payment.metadata) as { checkoutSessionId?: string } : null
    if (oldMetadata?.checkoutSessionId) {
      const existingSession = await stripe.checkout.sessions.retrieve(oldMetadata.checkoutSessionId)
      if (existingSession.url) return NextResponse.json({ payment, checkoutUrl: existingSession.url })
    }
    const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.AUTH_URL || request.nextUrl.origin
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ quantity: 1, price_data: { currency: 'thb', unit_amount: course.price * 100,
        product_data: { name: course.title } } }],
      payment_intent_data: { metadata: { paymentId: payment.id, courseId, userId: user.id } },
      success_url: `${baseUrl}/dashboard/student/courses?payment=success`,
      cancel_url: `${baseUrl}/courses/${courseId}?payment=cancelled`,
    }, { idempotencyKey: `checkout:${idempotencyKey}` })
    payment = await prisma.payment.update({ where: { id: payment.id },
      data: { metadata: JSON.stringify({ checkoutSessionId: session.id }) } })
    return NextResponse.json({ payment, checkoutUrl: session.url })
  } catch (error) { return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 }) }
}
