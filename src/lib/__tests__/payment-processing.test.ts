jest.mock('@/lib/prisma', () => ({ __esModule: true, default: {} }))
jest.mock('@/lib/access-control', () => ({
  AccessError: class AccessError extends Error { constructor(message: string, public status = 403) { super(message) } },
  requireUser: jest.fn(),
}))

import { completePayment } from '@/lib/payment-processing'

function transactionClient(status: string) {
  const payment = { id: 'pay-1', userId: 'user-1', courseId: 'course-1', amount: 2500,
    currency: 'THB', paymentMethod: 'CREDIT_CARD', status }
  return {
    payment: {
      findUniqueOrThrow: jest.fn().mockResolvedValue(payment),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    enrollment: { upsert: jest.fn() },
    user: { update: jest.fn() },
    transaction: { create: jest.fn() },
  }
}

describe('payment settlement', () => {
  it('applies enrollment and rewards once for a pending payment', async () => {
    const tx = transactionClient('PENDING')
    await completePayment(tx as never, 'pay-1')
    expect(tx.payment.updateMany).toHaveBeenCalledTimes(1)
    expect(tx.enrollment.upsert).toHaveBeenCalledTimes(1)
    expect(tx.user.update).toHaveBeenCalledTimes(1)
    expect(tx.transaction.create).toHaveBeenCalledTimes(1)
  })

  it('has no side effects when the payment is already complete', async () => {
    const tx = transactionClient('COMPLETED')
    await completePayment(tx as never, 'pay-1')
    expect(tx.payment.updateMany).not.toHaveBeenCalled()
    expect(tx.enrollment.upsert).not.toHaveBeenCalled()
  })
})
