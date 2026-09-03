import { issueVerifiedCertificate } from '@/lib/issue-certificate'
import { BARDScorer } from '@/lib/bard-scorer'
import { requireCertificateEligibility } from '@/lib/learning-evidence'
import { AccessError, requireUser } from '@/lib/access-control'
export class CertificateGenerator {
  async generateCertificate(userId: string, courseId: string) {
    const actor = await requireUser()
    if (actor.id !== userId && actor.role !== 'ADMIN') throw new AccessError('Forbidden')
    await requireCertificateEligibility(userId, courseId)
    const scorer = new BARDScorer()
    const competencies = await scorer.scoreUserByCourse(userId, courseId)
    const careerReadiness = await scorer.calculateCareerFit(userId, courseId)
    return issueVerifiedCertificate(userId, courseId, JSON.stringify({ competencies, careerReadiness }))
  }
}
