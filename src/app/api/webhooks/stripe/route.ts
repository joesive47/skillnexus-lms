import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe, isStripeConfigured } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import { completePayment } from '@/lib/payment-processing'

export async function POST(request: NextRequest) {
  if (!isStripeConfigured || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: 'Payment system not configured' }, { status: 503 })
  const signature = request.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'Signature required' }, { status: 400 })
  let event: Stripe.Event
  try { event = stripe.webhooks.constructEvent(await request.text(), signature, process.env.STRIPE_WEBHOOK_SECRET) }
  catch { return NextResponse.json({ error: 'Invalid signature' }, { status: 400 }) }
  if (!['payment_intent.succeeded', 'payment_intent.payment_failed'].includes(event.type)) return NextResponse.json({ received: true })
  const intent = event.data.object as Stripe.PaymentIntent
  const paymentId = intent.metadata.paymentId
  if (!paymentId) return NextResponse.json({ error: 'Missing payment reference' }, { status: 400 })
  try {
    await prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM payments WHERE id = ${paymentId} FOR UPDATE`
      const payment = await tx.payment.findUnique({ where: { id: paymentId } })
      if (!payment || payment.paymentMethod !== 'CREDIT_CARD' || (payment.stripePaymentId && payment.stripePaymentId !== intent.id) ||
          payment.userId !== intent.metadata.userId || payment.courseId !== intent.metadata.courseId ||
          payment.amount * 100 !== intent.amount || payment.currency.toLowerCase() !== intent.currency ||
          (event.type === 'payment_intent.succeeded' && intent.amount_received !== intent.amount)) throw new Error('Payment verification failed')
      if (await tx.paymentWebhookEvent.findUnique({ where: { id: event.id } })) return
      await tx.paymentWebhookEvent.create({ data: { id: event.id, paymentId } })
      if (!payment.stripePaymentId) await tx.payment.update({ where: { id: paymentId }, data: { stripePaymentId: intent.id } })
      if (event.type === 'payment_intent.succeeded') await completePayment(tx, paymentId)
      else await tx.payment.updateMany({ where: { id: paymentId, status: 'PENDING' }, data: { status: 'FAILED' } })
    })
    return NextResponse.json({ received: true })
  } catch { return NextResponse.json({ error: 'Payment could not be processed' }, { status: 500 }) }
}
