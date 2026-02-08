'use server'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { UserRole } from '@/lib/types'
import { revalidatePath } from 'next/cache'

/**
 * Add credits to a user account (Admin only)
 */
export async function addUserCredits(userId: string, amount: number, description?: string) {
  try {
    const session = await auth()
    
    // Check admin permission
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    // Validate amount
    if (!amount || amount <= 0 || !Number.isInteger(amount)) {
      return { success: false, error: 'Invalid amount: Must be a positive integer' }
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        credits: true
      }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    const oldCredits = user.credits
    const newCredits = oldCredits + amount

    // Update credits and create transaction record
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: newCredits }
      }),
      prisma.transaction.create({
        data: {
          userId: userId,
          type: 'CREDIT_ADD',
          amount: amount,
          description: description || `Admin ${session.user.email} added ${amount} credits`
        }
      })
    ])

    revalidatePath('/dashboard/admin/users')
    revalidatePath('/dashboard/admin/credits')
    
    return { 
      success: true, 
      oldCredits,
      newCredits,
      message: `Added ${amount} credits to ${user.name || user.email}`
    }
  } catch (error) {
    console.error('Error adding credits:', error)
    return { success: false, error: 'Failed to add credits' }
  }
}

/**
 * Get all users with their credit balances (Admin only)
 */
export async function getUsersWithCredits() {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        credits: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            transactions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, users }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { success: false, error: 'Failed to fetch users' }
  }
}

/**
 * Get credit transaction history (Admin only)
 */
export async function getCreditTransactions(userId?: string) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const transactions = await prisma.transaction.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        },
        course: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    })

    return { success: true, transactions }
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return { success: false, error: 'Failed to fetch transactions' }
  }
}
