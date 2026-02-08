/**
 * =============================================================================
 * UNLOCK STATUS API
 * =============================================================================
 * 
 * Server actions for checking which nodes are unlocked/locked for a user.
 */

'use server'

import { auth } from '@/auth'
import { LearningFlowRuleEngine, CourseUnlockState } from '@/lib/learning-flow-engine'
import prisma from '@/lib/prisma'

/**
 * Get unlock status for entire course
 */
export async function getCourseUnlockStatus(courseId: string): Promise<{
  success: boolean
  data?: CourseUnlockState
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const engine = new LearningFlowRuleEngine(session.user.id, courseId)
    const state = await engine.evaluateCourseUnlockState()

    return {
      success: true,
      data: {
        ...state,
        nodes: Object.fromEntries(state.nodes) as any
      }
    }
  } catch (error) {
    console.error('Error getting unlock status:', error)
    return { success: false, error: 'Failed to get unlock status' }
  }
}

/**
 * Get next recommended node for user
 */
export async function getNextNode(courseId: string): Promise<{
  success: boolean
  nodeId?: string | null
  node?: any
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const engine = new LearningFlowRuleEngine(session.user.id, courseId)
    const nextNodeId = await engine.getNextRecommendedNode()

    if (!nextNodeId) {
      return {
        success: true,
        nodeId: null
        // Course completed!
      }
    }

    const node = await prisma.learningNode.findUnique({
      where: { id: nextNodeId }
    })

    return {
      success: true,
      nodeId: nextNodeId,
      node
    }
  } catch (error) {
    console.error('Error getting next node:', error)
    return { success: false, error: 'Failed to get next node' }
  }
}

/**
 * Check if user can access a specific node
 */
export async function checkNodeAccess(nodeId: string): Promise<{
  success: boolean
  canAccess?: boolean
  reason?: string
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const node = await prisma.learningNode.findUnique({
      where: { id: nodeId }
    })

    if (!node) {
      return { success: false, error: 'Node not found' }
    }

    const engine = new LearningFlowRuleEngine(session.user.id, node.courseId)
    const state = await engine.evaluateCourseUnlockState()

    const result = state.nodes.get(nodeId)

    if (!result) {
      return { success: false, error: 'Node status not found' }
    }

    return {
      success: true,
      canAccess: result.canAccess,
      reason: result.reason
    }
  } catch (error) {
    console.error('Error checking node access:', error)
    return { success: false, error: 'Failed to check access' }
  }
}

/**
 * Get course progress summary
 */
export async function getCourseProgress(courseId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const summary = await prisma.courseProgressSummary.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId
        }
      }
    })

    if (!summary) {
      // Create initial summary
      const nodes = await prisma.learningNode.findMany({
        where: { courseId, isOptional: false }
      })

      return {
        success: true,
        data: {
          totalNodes: nodes.length,
          completedNodes: 0,
          progressPercent: 0,
          canTakeFinalExam: false,
          finalExamPassed: false,
          certificateIssued: false
        }
      }
    }

    return {
      success: true,
      data: summary
    }
  } catch (error) {
    console.error('Error getting progress:', error)
    return { success: false, error: 'Failed to get progress' }
  }
}

/**
 * Get unlock history/audit log for debugging
 */
export async function getUnlockHistory(courseId: string, limit: number = 50) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const logs = await prisma.unlockLog.findMany({
      where: {
        userId: session.user.id,
        courseId
      },
      include: {
        node: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return {
      success: true,
      data: logs
    }
  } catch (error) {
    console.error('Error getting unlock history:', error)
    return { success: false, error: 'Failed to get history' }
  }
}
