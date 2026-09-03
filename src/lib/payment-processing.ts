import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { AccessError, requireUser } from '@/lib/access-control'

export async function purchaseCourse(courseId: string) {
  const user = await requireUser()
  if (typeof courseId !== 'string' || !courseId) throw new AccessError('Course ID required', 400)
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT id FROM users WHERE id = ${user.id} FOR UPDATE`
    const course = await tx.course.findUnique({ where: { id: courseId } })
    if (!course?.published || course.price < 0) throw new AccessError('Course is not available', 404)
    const existing = await tx.enrollment.findUnique({ where: { userId_courseId: { userId: user.id, courseId } } })
    if (existing) return { success: true, alreadyEnrolled: true }
    const changed = await tx.user.updateMany({ where: { id: user.id, credits: { gte: course.price } }, data: { credits: { decrement: course.price } } })
    if (changed.count !== 1) throw new AccessError('Insufficient credits', 409)
    await tx.enrollment.create({ data: { userId: user.id, courseId } })
    await tx.transaction.create({ data: { userId: user.id, courseId, type: 'COURSE_PURCHASE', amount: -course.price, description: `Purchased course: ${course.title}` } })
    const balance = await tx.user.findUniqueOrThrow({ where: { id: user.id }, select: { credits: true } })
    return { success: true, remainingCredits: balance.credits }
  })
}

// Caller holds a payment-row lock. The conditional transition guards side effects
// even if Stripe delivers different event IDs for the same payment intent.
export async function completePayment(tx: Prisma.TransactionClient, paymentId: string) {
  const payment = await tx.payment.findUniqueOrThrow({ where: { id: paymentId } })
  if (payment.status === 'COMPLETED') return payment
  const changed = await tx.payment.updateMany({ where: { id: paymentId, status: { in: ['PENDING', 'FAILED'] } }, data: { status: 'COMPLETED', paidAt: new Date() } })
  if (changed.count !== 1) throw new AccessError('Payment cannot be completed in its current state', 409)
  if (payment.courseId) {
    await tx.enrollment.upsert({ where: { userId_courseId: { userId: payment.userId, courseId: payment.courseId } },
      create: { userId: payment.userId, courseId: payment.courseId }, update: {} })
    const credits = Math.floor(payment.amount / 100)
    if (credits > 0) {
      await tx.user.update({ where: { id: payment.userId }, data: { credits: { increment: credits } } })
      await tx.transaction.create({ data: { userId: payment.userId, courseId: payment.courseId, amount: credits,
        type: 'PAYMENT_REWARD', description: `Payment reward: ${payment.id}` } })
    }
  }
  return tx.payment.findUniqueOrThrow({ where: { id: paymentId } })
}
