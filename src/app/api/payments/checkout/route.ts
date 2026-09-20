import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { stripe, isStripeConfigured } from '@/lib/stripe'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isStripeConfigured) {
    return NextResponse.json({ error: 'Payment not configured' }, { status: 503 })
  }

  const { courseId } = await req.json()
  if (!courseId) {
    return NextResponse.json({ error: 'courseId required' }, { status: 400 })
  }

  // หา course
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, title: true, price: true, published: true, imageUrl: true },
  })

  if (!course || !course.published) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  if (course.price === 0) {
    // ฟรี — enroll เลย
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: session.user.id, courseId } },
      update: {},
      create: { userId: session.user.id, courseId },
    })
    return NextResponse.json({ enrolled: true, free: true })
  }

  // เช็คว่า enroll แล้วหรือยัง
  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
  })
  if (existing) {
    return NextResponse.json({ enrolled: true, alreadyEnrolled: true })
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.uppowerskill.com'

  // สร้าง Stripe Checkout Session
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: session.user.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: 'thb',
          product_data: {
            name: course.title,
            images: course.imageUrl ? [course.imageUrl] : [],
          },
          unit_amount: course.price * 100, // satang
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: session.user.id,
      courseId: course.id,
    },
    success_url: `${baseUrl}/courses/${courseId}?payment=success`,
    cancel_url: `${baseUrl}/courses/${courseId}?payment=cancelled`,
  })

  // บันทึก payment pending
  await prisma.payment.create({
    data: {
      userId: session.user.id,
      courseId,
      amount: course.price,
      currency: 'THB',
      status: 'PENDING',
      paymentMethod: 'STRIPE',
      stripePaymentId: checkoutSession.id,
      idempotencyKey: checkoutSession.id,
    },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
