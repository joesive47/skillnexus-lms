import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId, amount, description } = await request.json()

    const user = await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } }
    })

    await prisma.transaction.create({
      data: {
        userId,
        type: 'CREDIT_ADD',
        amount,
        description: description || 'Admin added credits'
      }
    })

    return NextResponse.json({ success: true, credits: user.credits })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 })
  }
}