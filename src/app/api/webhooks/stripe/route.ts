import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  const { paymentId, courseId, userId } = paymentIntent.metadata

  if (paymentId) {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'COMPLETED',
        paidAt: new Date(),
        metadata: JSON.stringify({
          stripePaymentIntentId: paymentIntent.id,
          stripeChargeId: paymentIntent.charges?.data[0]?.id
        })
      }
    })

    if (courseId && userId) {
      await prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        },
        create: {
          userId,
          courseId
        },
        update: {}
      })

      const amount = paymentIntent.amount / 100
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: Math.floor(amount / 100)
          }
        }
      })
    }
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  const { paymentId } = paymentIntent.metadata

  if (paymentId) {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'FAILED',
        metadata: JSON.stringify({
          stripePaymentIntentId: paymentIntent.id,
          failureReason: paymentIntent.last_payment_error?.message
        })
      }
    })
  }
}