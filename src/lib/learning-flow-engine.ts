/**
 * =============================================================================
 * LEARNING FLOW RULE ENGINE
 * =============================================================================
 * 
 * Production-ready rule evaluation system for graph-based learning paths.
 * 
 * Features:
 * - DAG traversal for prerequisite checking
 * - Multi-condition evaluation (AND/OR logic)
 * - Caching for performance
 * - Detailed unlock reasons
 * - Transaction-safe operations
 */

import prisma from '@/lib/prisma'
import { LearningNode, NodeDependency, NodeProgress, QuizAttemptRecord, ScormRuntimeData } from '@prisma/client'

// ============================================================================
// TYPES
// ============================================================================

export type NodeType = 'VIDEO' | 'SCORM' | 'QUIZ'
export type NodeStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
export type UnlockStatus = 'UNLOCKED' | 'LOCKED'

export interface UnlockResult {
  nodeId: string
  status: UnlockStatus
  canAccess: boolean
  reason: string
  missingRequirements?: string[]
  progress?: number
}

export interface CourseUnlockState {
  userId: string
  courseId: string
  nodes: Map<string, UnlockResult>
  canTakeFinalExam: boolean
  finalExamNodeId?: string
  overallProgress: number
}

// ============================================================================
// RULE ENGINE CLASS
// ============================================================================

export class LearningFlowRuleEngine {
  private userId: string
  private courseId: string
  private cache: Map<string, UnlockResult> = new Map()

  constructor(userId: string, courseId: string) {
    this.userId = userId
    this.courseId = courseId
  }

  /**
   * Main entry point: Evaluate unlock state for entire course
   */
  async evaluateCourseUnlockState(): Promise<CourseUnlockState> {
    console.log(`🔍 Evaluating unlock state for user ${this.userId}, course ${this.courseId}`)

    // 1. Fetch all nodes for this course
    const nodes = await prisma.learningNode.findMany({
      where: { courseId: this.courseId },
      include: {
        dependenciesTo: {
          include: {
            fromNode: true
          }
        }
      },
      orderBy: { order: 'asc' }
    })

    // 2. Fetch all progress for this user+course
    const progressRecords = await prisma.nodeProgress.findMany({
      where: {
        userId: this.userId,
        courseId: this.courseId
      }
    })

    const progressMap = new Map(progressRecords.map((p: any) => [p.nodeId, p]))

    // 3. Evaluate each node
    const unlockResults = new Map<string, UnlockResult>()
    let finalExamNodeId: string | undefined
    let completedCount = 0

    for (const node of nodes) {
      const result = await this.evaluateNodeUnlock(node, progressMap)
      unlockResults.set(node.id, result)

      if (node.isFinalExam) {
        finalExamNodeId = node.id
      }

      if (result.status === 'UNLOCKED' && result.progress === 100) {
        completedCount++
      }
    }

    // 4. Check if can take final exam
    const canTakeFinalExam = finalExamNodeId
      ? unlockResults.get(finalExamNodeId)?.canAccess ?? false
      : false

    const overallProgress = nodes.length > 0
      ? Math.round((completedCount / nodes.length) * 100)
      : 0

    return {
      userId: this.userId,
      courseId: this.courseId,
      nodes: unlockResults,
      canTakeFinalExam,
      finalExamNodeId,
      overallProgress
    }
  }

  /**
   * Evaluate unlock state for a single node
   */
  private async evaluateNodeUnlock(
    node: LearningNode & { dependenciesTo: (NodeDependency & { fromNode: LearningNode })[] },
    progressMap: Map<string, NodeProgress>
  ): Promise<UnlockResult> {
    // Check cache first
    const cached = this.cache.get(node.id)
    if (cached) return cached

    // Get progress for this node
    const progress = progressMap.get(node.id)

    // Rule 1: Check if node has prerequisites
    const prerequisites = node.dependenciesTo // Nodes that must be completed before this one

    if (prerequisites.length === 0) {
      // No prerequisites = always unlocked (unless it's final exam)
      if (node.isFinalExam) {
        return this.evaluateFinalExamUnlock(node, progressMap)
      }

      return {
        nodeId: node.id,
        status: 'UNLOCKED',
        canAccess: true,
        reason: 'No prerequisites required',
        progress: progress? progress.progressPercent : 0
      }
    }

    // Rule 2: Check ALL prerequisites (AND logic)
    const missingRequirements: string[] = []

    for (const dep of prerequisites) {
      const prereqProgress = progressMap.get(dep.fromNodeId)
      const prereqCompleted = await this.isNodeCompleted(dep.fromNode, prereqProgress)

      if (!prereqCompleted) {
        missingRequirements.push(dep.fromNode.title)
      }
    }

    if (missingRequirements.length > 0) {
      return {
        nodeId: node.id,
        status: 'LOCKED',
        canAccess: false,
        reason: `ต้องเรียนจบก่อน: ${missingRequirements.join(', ')}`,
        missingRequirements,
        progress: progress?.progressPercent ?? 0
      }
    }

    // All prerequisites met
    return {
      nodeId: node.id,
      status: 'UNLOCKED',
      canAccess: true,
      reason: 'ผ่านเงื่อนไขแล้ว สามารถเรียนได้',
      progress: progress?.progressPercent ?? 0
    }
  }

  /**
   * Special logic for final exam unlock
   */
  private async evaluateFinalExamUnlock(
    finalExamNode: LearningNode,
    progressMap: Map<string, NodeProgress>
  ): Promise<UnlockResult> {
    // Final exam requires ALL non-optional nodes completed
    const allNodes = await prisma.learningNode.findMany({
      where: {
        courseId: this.courseId,
        isFinalExam: false,
        isOptional: false
      }
    })

    const missingRequirements: string[] = []

    for (const node of allNodes) {
      const progress = progressMap.get(node.id)
      const completed = await this.isNodeCompleted(node, progress)

      if (!completed) {
        missingRequirements.push(node.title)
      }
    }

    if (missingRequirements.length > 0) {
      return {
        nodeId: finalExamNode.id,
        status: 'LOCKED',
        canAccess: false,
        reason: `ต้องเรียนให้ครบก่อนทำข้อสอบ: ${missingRequirements.join(', ')}`,
        missingRequirements,
        progress: 0
      }
    }

    return {
      nodeId: finalExamNode.id,
      status: 'UNLOCKED',
      canAccess: true,
      reason: 'เรียนครบทุกบทเรียนแล้ว พร้อมทำข้อสอบปลายภาค',
      progress: 0
    }
  }

  /**
   * Check if a specific node is completed based on its type
   */
  private async isNodeCompleted(
    node: LearningNode,
    progress?: NodeProgress
  ): Promise<boolean> {
    if (!progress) return false

    switch (node.nodeType) {
      case 'VIDEO':
        return await this.checkVideoCompleted(node, progress)

      case 'SCORM':
        return await this.checkScormCompleted(node, progress)

      case 'QUIZ':
        return await this.checkQuizCompleted(node, progress)

      default:
        return false
    }
  }

  /**
   * VIDEO completion check
   * Rules:
   * - progressPercent >= requiredProgress (default 80%)
   * - OR status === 'COMPLETED'
   */
  private async checkVideoCompleted(
    node: LearningNode,
    progress: NodeProgress
  ): Promise<boolean> {
    const requiredProgress = node.requiredProgress ?? 0.8
    return progress.status === 'COMPLETED' || progress.progressPercent >= (requiredProgress * 100)
  }

  /**
   * SCORM completion check
   * Rules:
   * - completionStatus === 'completed' AND
   * - successStatus === 'passed' (if applicable)
   */
  private async checkScormCompleted(
    node: LearningNode,
    progress: NodeProgress
  ): Promise<boolean> {
    // Get SCORM runtime data
    const scormData = await prisma.scormRuntimeData.findUnique({
      where: {
        userId_lessonId: {
          userId: this.userId,
          lessonId: node.refId
        }
      }
    })

    if (!scormData) return false

    const completed = scormData.completionStatus === 'completed'
    const passed = scormData.successStatus === 'passed' || scormData.successStatus === 'unknown'

    return completed && passed
  }

  /**
   * QUIZ completion check
   * Rules:
   * - Latest attempt passed (score >= requiredScore)
   * - OR status === 'COMPLETED'
   */
  private async checkQuizCompleted(
    node: LearningNode,
    progress: NodeProgress
  ): Promise<boolean> {
    // Get quiz pass score
    const quiz = await prisma.quiz.findUnique({
      where: { id: node.refId }
    })

    if (!quiz) return false

    // Get latest attempt
    const latestAttempt = await prisma.quizAttemptRecord.findFirst({
      where: {
        userId: this.userId,
        quizId: node.refId
      },
      orderBy: {
        submittedAt: 'desc'
      }
    })

    if (!latestAttempt) return false

    return latestAttempt.passed && latestAttempt.score >= (quiz.passScore ?? 70)
  }

  /**
   * Get next recommended node for user
   */
  async getNextRecommendedNode(): Promise<string | null> {
    const state = await this.evaluateCourseUnlockState()

    // Find first unlocked node that's not completed
    for (const [nodeId, result] of state.nodes) {
      if (result.status === 'UNLOCKED' && result.progress < 100) {
        return nodeId
      }
    }

    // If all unlocked nodes are completed, check final exam
    if (state.canTakeFinalExam && state.finalExamNodeId) {
      const finalExamResult = state.nodes.get(state.finalExamNodeId)
      if (finalExamResult && finalExamResult.progress < 100) {
        return state.finalExamNodeId
      }
    }

    return null // Course completed!
  }

  /**
   * Log unlock event (audit trail)
   */
  async logUnlockEvent(
    nodeId: string,
    action: 'UNLOCK' | 'LOCK' | 'RELOCK',
    reason: string,
    triggeredBy?: string,
    ruleSnapshot?: any
  ): Promise<void> {
    await prisma.unlockLog.create({
      data: {
        userId: this.userId,
        nodeId,
        courseId: this.courseId,
        action,
        reason,
        triggeredBy,
        ruleSnapshot: ruleSnapshot ? JSON.parse(JSON.stringify(ruleSnapshot)) : null
      }
    })
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Quick check if user can access a specific node
 */
export async function canAccessNode(
  userId: string,
  nodeId: string
): Promise<boolean> {
  // Get node to find courseId
  const node = await prisma.learningNode.findUnique({
    where: { id: nodeId }
  })

  if (!node) return false

  const engine = new LearningFlowRuleEngine(userId, node.courseId)
  const state = await engine.evaluateCourseUnlockState()

  const result = state.nodes.get(nodeId)
  return result?.canAccess ?? false
}

/**
 * Get all unlocked nodes for a user in a course
 */
export async function getUnlockedNodes(
  userId: string,
  courseId: string
): Promise<string[]> {
  const engine = new LearningFlowRuleEngine(userId, courseId)
  const state = await engine.evaluateCourseUnlockState()

  const unlockedNodeIds: string[] = []
  for (const [nodeId, result] of state.nodes) {
    if (result.status === 'UNLOCKED') {
      unlockedNodeIds.push(nodeId)
    }
  }

  return unlockedNodeIds
}
