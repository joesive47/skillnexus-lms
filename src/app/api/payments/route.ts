import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { stripe, isStripeConfigured } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')

    const where: any = {}
    if (status) where.status = status
    if (userId) where.userId = userId

    const payments = await prisma.payment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true, price: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await prisma.payment.count({ where })

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { courseId, paymentMethod, amount } = body

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        courseId,
        amount,
        paymentMethod,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      },
      include: {
        course: true,
        user: true
      }
    })

    // Handle different payment methods
    let paymentData: any = { payment }

    switch (paymentMethod) {
      case 'CREDIT_CARD':
        if (!isStripeConfigured) {
          return NextResponse.json({ error: 'Payment system not configured' }, { status: 503 })
        }
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100,
          currency: 'thb',
          metadata: {
            paymentId: payment.id,
            courseId: courseId || '',
            userId: session.user.id
          }
        })
        
        await prisma.payment.update({
          where: { id: payment.id },
          data: { stripePaymentId: paymentIntent.id }
        })
        
        paymentData.clientSecret = paymentIntent.client_secret
        break

      case 'PROMPT_PAY':
        // Generate PromptPay QR code data
        const promptPayRef = `PP${Date.now()}`
        paymentData.promptPayRef = promptPayRef
        paymentData.qrCodeData = generatePromptPayQR(amount, promptPayRef)
        
        await prisma.payment.update({
          where: { id: payment.id },
          data: { promptPayRef, qrCodeData: paymentData.qrCodeData }
        })
        break

      case 'BANK_TRANSFER':
        const bankRef = `BT${Date.now()}`
        paymentData.bankTransferRef = bankRef
        paymentData.bankDetails = {
          bankName: 'ธนาคารกสิกรไทย',
          accountNumber: '123-4-56789-0',
          accountName: 'SkillNexus Co., Ltd.'
        }
        
        await prisma.payment.update({
          where: { id: payment.id },
          data: { bankTransferRef: bankRef }
        })
        break
    }

    return NextResponse.json(paymentData)
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generatePromptPayQR(amount: number, ref: string): string {
  // Simplified PromptPay QR generation
  // In production, use proper PromptPay QR library
  return `promptpay://0123456789?amount=${amount}&ref=${ref}`
}