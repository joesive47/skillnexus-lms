import { adminAccessDenied } from '@/lib/access-control'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const denied = await adminAccessDenied()
  if (denied) return denied

  try {
    const { userId, amount, description } = await request.json()

    if (typeof userId !== 'string' || !Number.isSafeInteger(amount) || amount <= 0) return NextResponse.json({ error: 'Invalid credit amount' }, { status: 400 })
    const user = await prisma.$transaction(async tx => {
      const updated = await tx.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } }
    })

    await tx.transaction.create({
      data: {
        userId,
        type: 'CREDIT_ADD',
        amount,
        description: description || 'Admin added credits'
      }
    })

      return updated
    })
    return NextResponse.json({ success: true, credits: user.credits })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 })
  }
}