import type { Prisma } from '@prisma/client'

export async function refreshProgressSummary(tx: Prisma.TransactionClient, userId: string, courseId: string) {
  const nodes = await tx.learningNode.findMany({ where: { courseId, isOptional: false }, select: { id: true, isFinalExam: true } })
  if (!nodes.length) return
  const completed = await tx.nodeProgress.findMany({ where: { userId, courseId, nodeId: { in: nodes.map(node => node.id) }, status: 'COMPLETED' }, select: { nodeId: true } })
  const ids = new Set(completed.map(entry => entry.nodeId))
  const finalExams = nodes.filter(node => node.isFinalExam)
  const data = { totalNodes: nodes.length, completedNodes: ids.size, progressPercent: ids.size / nodes.length * 100,
    canTakeFinalExam: nodes.filter(node => !node.isFinalExam).every(node => ids.has(node.id)),
    finalExamPassed: finalExams.length > 0 && finalExams.every(node => ids.has(node.id)),
    lastActivity: new Date(), completedAt: ids.size === nodes.length ? new Date() : null }
  await tx.courseProgressSummary.upsert({ where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, ...data }, update: data })
}
