import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent, createCustomer } from '@/lib/stripe-production'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, courseId, planType } = await req.json()

    const customer = await createCustomer(
      session.user.email!,
      session.user.name!
    )

    const paymentIntent = await createPaymentIntent(amount, 'thb')

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id
    })

  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Payment failed' },
      { status: 500 }
    )
  }
}