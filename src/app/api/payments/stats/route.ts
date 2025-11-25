import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Total revenue
    const totalRevenue = await prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true }
    })

    // Monthly revenue
    const monthlyRevenue = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
        paidAt: { gte: startOfMonth }
      },
      _sum: { amount: true }
    })

    // Total payments count
    const totalPayments = await prisma.payment.count({
      where: { status: 'COMPLETED' }
    })

    // Unique paying customers
    const payingCustomers = await prisma.payment.findMany({
      where: { status: 'COMPLETED' },
      select: { userId: true },
      distinct: ['userId']
    })

    // Payment methods breakdown
    const paymentMethods = await prisma.payment.groupBy({
      by: ['paymentMethod'],
      where: { status: 'COMPLETED' },
      _count: { _all: true },
      _sum: { amount: true }
    })

    // Recent payments
    const recentPayments = await prisma.payment.findMany({
      where: { status: 'COMPLETED' },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } }
      },
      orderBy: { paidAt: 'desc' },
      take: 10
    })

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.amount || 0,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      totalPayments,
      payingCustomers: payingCustomers.length,
      paymentMethods,
      recentPayments
    })
  } catch (error) {
    console.error('Error fetching payment stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}