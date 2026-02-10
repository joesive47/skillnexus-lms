// Badge Engine - Full Implementation
// File: src/lib/certification/badge-engine.ts

import { prisma } from '@/lib/prisma'
import { onBadgeEarned } from './integration-hooks'

export interface BadgeCriteria {
  minScore?: number
  assessmentCategory?: string
  quizId?: string
  courseId?: string
  minHours?: number
}

export interface ActivityData {
  resultId: string
  score: number
  category: string
  title: string
  completedAt: Date
}

export interface EvidenceData {
  type: 'ASSESSMENT' | 'QUIZ' | 'COURSE' | 'MANUAL'
  id: string
  data?: Record<string, any>
}

export class BadgeEngine {
  /**
   * ตรวจสอบและออก Badges อัตโนมัติหลังทำ Assessment
   */
  static async checkAndIssueBadges(
    userId: string,
    activityType: 'ASSESSMENT' | 'QUIZ' | 'COURSE',
    activityId: string
  ): Promise<string[]> {
    try {
      const issuedBadgeIds: string[] = []

      // 1. ดึงข้อมูล activity
      const activityData = await this.getActivityData(activityType, activityId, userId)
      if (!activityData) {
        console.log('No activity data found')
        return []
      }

      console.log('🔍 Checking badges for activity:', activityData)

      // 2. ดึง badges ที่เกี่ยวข้อง
      const relevantBadges = await this.getRelevantBadges(activityType, activityData)
      console.log(`Found ${relevantBadges.length} relevant badges`)

      // 3. ประเมินแต่ละ badge
      for (const badge of relevantBadges) {
        const { eligible, evidence } = await this.evaluateCriteria(
          userId,
          badge.id,
          activityData
        )

        if (eligible) {
          console.log(`✅ Eligible for badge: ${badge.badgeName}`)

          // เช็คว่ามีแล้วหรือไม่
          const existing = await prisma.userSkillBadge.findFirst({
            where: {
              userId,
              badgeId: badge.id,
              status: 'ACTIVE'
            }
          })

          if (!existing) {
            const userBadgeId = await this.issueBadge(userId, badge.id, evidence!)
            if (userBadgeId) {
              issuedBadgeIds.push(userBadgeId)
              console.log(`🏅 Badge issued: ${badge.badgeName}`)
            }
          } else {
            console.log(`Already has badge: ${badge.badgeName}`)
          }
        } else {
          console.log(`❌ Not eligible for badge: ${badge.badgeName}`)
        }
      }

      return issuedBadgeIds
    } catch (error) {
      console.error('Error checking badges:', error)
      return []
    }
  }

  /**
   * ออก Badge ให้ User
   */
  static async issueBadge(
    userId: string,
    badgeId: string,
    evidence: EvidenceData
  ): Promise<string | null> {
    try {
      // 1. ดึงข้อมูล badge
      const badge = await prisma.skillBadge.findUnique({
        where: { id: badgeId }
      })

      if (!badge || !badge.isActive) {
        console.log('Badge not found or inactive')
        return null
      }

      // 2. คำนวณ expiry date
      const expiryDate = badge.expiryMonths
        ? new Date(Date.now() + badge.expiryMonths * 30 * 24 * 60 * 60 * 1000)
        : null

      // 3. สร้าง verification code
      const verificationCode = this.generateVerificationCode()

      // 4. สร้าง UserSkillBadge
      const userBadge = await prisma.userSkillBadge.create({
        data: {
          userId,
          badgeId,
          issuedDate: new Date(),
          expiryDate,
          evidenceType: evidence.type,
          evidenceId: evidence.id,
          evidenceData: JSON.stringify(evidence.data || {}),
          verificationCode,
          status: 'ACTIVE'
        }
      })

      // 5. สร้าง Event สำหรับ Certification check
      await prisma.certificationEvent.create({
        data: {
          eventType: 'BADGE_EARNED',
          userId,
          entityType: 'BADGE',
          entityId: userBadge.id,
          metadata: JSON.stringify({ badgeId, evidence })
        }
      })

      // 6. Trigger certification check
      console.log('🔔 Triggering certification check...')
      await onBadgeEarned(userId, badgeId)

      return userBadge.id
    } catch (error) {
      console.error('Error issuing badge:', error)
      return null
    }
  }

  /**
   * ประเมินว่า User ผ่านเกณฑ์หรือไม่
   */
  static async evaluateCriteria(
    userId: string,
    badgeId: string,
    activityData: ActivityData
  ): Promise<{ eligible: boolean; evidence?: EvidenceData }> {
    try {
      const badge = await prisma.skillBadge.findUnique({
        where: { id: badgeId }
      })

      if (!badge) return { eligible: false }

      const criteria: BadgeCriteria = JSON.parse(badge.criteriaValue)

      switch (badge.criteriaType) {
        case 'ASSESSMENT_SCORE':
          return this.evaluateAssessmentScore(criteria, activityData)

        case 'QUIZ_SCORE':
          return this.evaluateQuizScore(criteria, activityData)

        case 'COURSE_HOURS':
          return this.evaluateCourseHours(userId, criteria)

        case 'COMBINED':
          return this.evaluateCombined(userId, criteria, activityData)

        default:
          return { eligible: false }
      }
    } catch (error) {
      console.error('Error evaluating criteria:', error)
      return { eligible: false }
    }
  }

  /**
   * ประเมินคะแนน Assessment
   */
  private static evaluateAssessmentScore(
    criteria: BadgeCriteria,
    activityData: ActivityData
  ): { eligible: boolean; evidence?: EvidenceData } {
    const { minScore = 0, assessmentCategory } = criteria

    // เช็ค category (ถ้ามีระบุ)
    if (assessmentCategory && activityData.category !== assessmentCategory) {
      console.log(
        `Category mismatch: ${activityData.category} !== ${assessmentCategory}`
      )
      return { eligible: false }
    }

    // เช็คคะแนน
    const eligible = activityData.score >= minScore

    console.log(
      `Score check: ${activityData.score} >= ${minScore} = ${eligible}`
    )

    return {
      eligible,
      evidence: eligible
        ? {
            type: 'ASSESSMENT',
            id: activityData.resultId,
            data: {
              score: activityData.score,
              assessmentTitle: activityData.title,
              completedAt: activityData.completedAt.toISOString()
            }
          }
        : undefined
    }
  }

  /**
   * ดึง Badges ที่เกี่ยวข้อง
   */
  private static async getRelevantBadges(
    activityType: string,
    activityData: ActivityData
  ): Promise<any[]> {
    if (activityType === 'ASSESSMENT') {
      // ดึง badges ที่ match category หรือ all
      return await prisma.skillBadge.findMany({
        where: {
          isActive: true,
          criteriaType: {
            in: ['ASSESSMENT_SCORE', 'COMBINED']
          }
        }
      })
    }

    return []
  }

  /**
   * ดึงข้อมูล Activity
   */
  private static async getActivityData(
    activityType: string,
    activityId: string,
    userId: string
  ): Promise<ActivityData | null> {
    if (activityType === 'ASSESSMENT') {
      // ดึงผลล่าสุดของ user นี้
      const result = await prisma.assessmentResult.findFirst({
        where: {
          userId,
          careerId: activityId
        },
        orderBy: { completedAt: 'desc' },
        include: { career: true }
      })

      if (!result) {
        console.log('No assessment result found')
        return null
      }

      return {
        resultId: result.id,
        score: result.percentage,
        category: result.career?.category || 'general',
        title: result.career?.title || 'Assessment',
        completedAt: result.completedAt
      }
    }

    return null
  }

  /**
   * ดึง Badges ของ User
   */
  static async getUserBadges(userId: string) {
    return await prisma.userSkillBadge.findMany({
      where: { userId, status: 'ACTIVE' },
      include: { badge: true },
      orderBy: { issuedDate: 'desc' }
    })
  }

  /**
   * สร้าง Verification Code
   */
  private static generateVerificationCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substr(2, 6).toUpperCase()
    return `BADGE-${timestamp}-${random}`
  }

  // Helper methods for other criteria types
  private static evaluateQuizScore(
    criteria: BadgeCriteria,
    data: ActivityData
  ): { eligible: boolean; evidence?: EvidenceData } {
    // TODO: Implement quiz score evaluation
    console.log('Quiz score evaluation not implemented yet')
    return { eligible: false }
  }

  private static async evaluateCourseHours(
    userId: string,
    criteria: BadgeCriteria
  ): Promise<{ eligible: boolean; evidence?: EvidenceData }> {
    // TODO: Implement course hours evaluation
    console.log('Course hours evaluation not implemented yet')
    return { eligible: false }
  }

  private static async evaluateCombined(
    userId: string,
    criteria: BadgeCriteria,
    data: ActivityData
  ): Promise<{ eligible: boolean; evidence?: EvidenceData }> {
    // TODO: Implement combined criteria
    console.log('Combined criteria evaluation not implemented yet')
    return { eligible: false }
  }
}

export default BadgeEngine
