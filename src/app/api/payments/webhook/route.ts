import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { userId, courseId } = session.metadata ?? {}

        if (!userId || !courseId) break

        // สร้าง enrollment
        await prisma.enrollment.upsert({
          where: { userId_courseId: { userId, courseId } },
          update: {},
          create: { userId, courseId },
        })

        // บันทึก payment
        await prisma.payment.upsert({
          where: { idempotencyKey: session.id },
          update: { status: 'COMPLETED', paidAt: new Date() },
          create: {
            userId,
            courseId,
            amount: (session.amount_total ?? 0) / 100,
            currency: session.currency?.toUpperCase() ?? 'THB',
            status: 'COMPLETED',
            paymentMethod: 'STRIPE',
            stripePaymentId: session.payment_intent as string,
            idempotencyKey: session.id,
            paidAt: new Date(),
          },
        })

        console.log(`✅ Payment completed: user=${userId} course=${courseId}`)
        break
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        const { userId, courseId } = pi.metadata ?? {}
        if (!userId || !courseId) break

        await prisma.payment.updateMany({
          where: { stripePaymentId: pi.id },
          data: { status: 'FAILED' },
        })
        console.log(`❌ Payment failed: user=${userId} course=${courseId}`)
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
