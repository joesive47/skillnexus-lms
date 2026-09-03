import { NextRequest, NextResponse } from 'next/server'
import { AccessError, publicError, requireUser } from '@/lib/access-control'
import prisma from '@/lib/prisma'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser()
    const { id } = await params
    const payment = await prisma.payment.findFirst({ where: { id, ...(user.role === 'ADMIN' ? {} : { userId: user.id }) },
      include: { user: { select: { id: true, name: true, email: true } }, course: { select: { id: true, title: true, price: true } } } })
    if (!payment) throw new AccessError('Payment not found', 404)
    return NextResponse.json({ payment })
  } catch (error) { return NextResponse.json({ error: publicError(error) }, { status: error instanceof AccessError ? error.status : 500 }) }
}

// Settlement is accepted only through the verified Stripe webhook. The old PATCH
// endpoint could self-approve payments and is intentionally no longer supported.
export async function PATCH() {
  return NextResponse.json({ error: 'Payment settlement requires a verified provider event' }, { status: 405, headers: { Allow: 'GET' } })
}
