import { prisma } from '@/lib/prisma'
import { generateVerificationCode } from '@/lib/utils'

export interface CourseCompletionData {
  userId: string
  courseId: string
  completionPercentage: number
  quizScores: { quizId: string; score: number }[]
  lessonsCompleted: number
  totalLessons: number
}

export interface CareerPathProgress {
  userId: string
  careerPathId: string
  completedCourses: string[]
  earnedCourseCertificates: string[]
}

export class CertificationService {
  
  /**
   * Main entry point: Evaluate course completion and issue certificates/badges
   */
  async evaluateCourseCompletionAndIssue(data: CourseCompletionData) {
    const { userId, courseId } = data
    
    // Check if certificate already exists
    const existingCert = await prisma.courseCertificate.findUnique({
      where: { userId_courseId: { userId, courseId } }
    })
    
    if (existingCert) {
      console.log(`Certificate already exists for user ${userId}, course ${courseId}`)
      return existingCert
    }
    
    // Get certificate definition and criteria
    const certDef = await prisma.courseCertificateDefinition.findUnique({
      where: { courseId },
      include: { criteria: true }
    })
    
    if (!certDef || !certDef.isActive) {
      console.log(`No active certificate definition for course ${courseId}`)
      return null
    }
    
    // Evaluate criteria
    const meetsRequirements = await this.evaluateCourseCriteria(certDef.criteria, data)
    
    if (!meetsRequirements) {
      console.log(`User ${userId} does not meet criteria for course ${courseId}`)
      return null
    }
    
    // Issue certificate first, then badge
    const certificate = await this.issueCourseCertificate(userId, courseId, certDef.id)
    if (certificate) {
      await this.issueCourseBadge(userId, courseId, certificate.id)
      
      // Evaluate career paths after course completion
      await this.evaluateCareerPathsForUser(userId)
    }
    
    return certificate
  }
  
  /**
   * Evaluate if user meets course certificate criteria
   */
  private async evaluateCourseCriteria(
    criteria: any[], 
    data: CourseCompletionData
  ): Promise<boolean> {
    for (const criterion of criteria) {
      if (!criterion.isRequired) continue
      
      const criteriaValue = JSON.parse(criterion.criteriaValue)
      
      switch (criterion.criteriaType) {
        case 'COMPLETION_PERCENTAGE':
          if (data.completionPercentage < criteriaValue.minPercentage) {
            return false
          }
          break
          
        case 'QUIZ_SCORE':
          const quizScore = data.quizScores.find(q => q.quizId === criteriaValue.quizId)
          if (!quizScore || quizScore.score < criteriaValue.minScore) {
            return false
          }
          break
          
        case 'ALL_LESSONS':
          if (data.lessonsCompleted < data.totalLessons) {
            return false
          }
          break
          
        default:
          console.warn(`Unknown criteria type: ${criterion.criteriaType}`)
      }
    }
    
    return true
  }
  
  /**
   * Issue course certificate
   */
  async issueCourseCertificate(userId: string, courseId: string, definitionId: string) {
    try {
      const verificationCode = generateVerificationCode()
      
      // Get definition for expiry calculation
      const definition = await prisma.courseCertificateDefinition.findUnique({
        where: { id: definitionId }
      })
      
      const expiryDate = definition?.expiryMonths 
        ? new Date(Date.now() + definition.expiryMonths * 30 * 24 * 60 * 60 * 1000)
        : null
      
      const certificate = await prisma.courseCertificate.create({
        data: {
          userId,
          courseId,
          definitionId,
          verificationCode,
          expiryDate,
          status: 'ACTIVE'
        },
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true } },
          definition: true
        }
      })
      
      // Create verification record
      await this.createVerificationRecord({
        verificationCode,
        entityType: 'COURSE_CERTIFICATE',
        entityId: certificate.id,
        recipientName: certificate.user.name || certificate.user.email,
        issuerName: certificate.definition.issuerName,
        issueDate: certificate.issueDate,
        expiryDate: certificate.expiryDate,
        status: certificate.status
      })
      
      console.log(`Course certificate issued: ${certificate.id}`)
      return certificate
      
    } catch (error) {
      console.error('Error issuing course certificate:', error)
      throw error
    }
  }
  
  /**
   * Issue course badge (must be called AFTER certificate)
   */
  async issueCourseBadge(userId: string, courseId: string, certificateId: string) {
    try {
      // Get badge definition
      const badgeDef = await prisma.courseBadgeDefinition.findUnique({
        where: { courseId }
      })
      
      if (!badgeDef || !badgeDef.isActive) {
        console.log(`No active badge definition for course ${courseId}`)
        return null
      }
      
      const badge = await prisma.courseBadge.create({
        data: {
          userId,
          courseId,
          definitionId: badgeDef.id,
          certificateId,
          status: 'ACTIVE'
        },
        include: {
          definition: true,
          course: { select: { title: true } }
        }
      })
      
      console.log(`Course badge issued: ${badge.id}`)
      return badge
      
    } catch (error) {
      console.error('Error issuing course badge:', error)
      throw error
    }
  }
  
  /**
   * Evaluate all career paths for user after course completion
   */
  async evaluateCareerPathsForUser(userId: string) {
    try {
      // Get all active career paths
      const careerPaths = await prisma.careerPath.findMany({
        where: { isActive: true },
        include: {
          courses: { include: { course: true } },
          requirements: true,
          certificateDef: true,
          badgeDef: true
        }
      })
      
      // Get user's earned course certificates
      const userCertificates = await prisma.courseCertificate.findMany({
        where: { userId, status: 'ACTIVE' },
        select: { courseId: true, id: true }
      })
      
      const userCourseIds = userCertificates.map(c => c.courseId)
      
      for (const careerPath of careerPaths) {
        // Check if user already has career certificate
        const existingCareerCert = await prisma.careerCertificate.findUnique({
          where: { userId_careerPathId: { userId, careerPathId: careerPath.id } }
        })
        
        if (existingCareerCert) continue
        
        // Evaluate requirements
        const meetsRequirements = this.evaluateCareerRequirements(
          careerPath.requirements,
          careerPath.courses,
          userCourseIds
        )
        
        if (meetsRequirements && careerPath.certificateDef) {
          await this.issueCareerCertificate(userId, careerPath.id, careerPath.certificateDef.id)
        }
      }
      
    } catch (error) {
      console.error('Error evaluating career paths:', error)
      throw error
    }
  }
  
  /**
   * Evaluate career path requirements
   */
  private evaluateCareerRequirements(
    requirements: any[],
    pathCourses: any[],
    userCourseIds: string[]
  ): boolean {
    for (const requirement of requirements) {
      const requirementValue = JSON.parse(requirement.requirementValue)
      
      switch (requirement.requirementType) {
        case 'ALL_COURSES':
          const requiredCourseIds = pathCourses
            .filter(pc => pc.isRequired)
            .map(pc => pc.courseId)
          
          const hasAllRequired = requiredCourseIds.every(courseId => 
            userCourseIds.includes(courseId)
          )
          
          if (!hasAllRequired) return false
          break
          
        case 'MIN_COURSES':
          const completedRequiredCount = pathCourses
            .filter(pc => pc.isRequired && userCourseIds.includes(pc.courseId))
            .length
          
          if (completedRequiredCount < requirementValue.minCount) return false
          break
          
        case 'SPECIFIC_COURSES':
          const hasSpecificCourses = requirementValue.courseIds.every((courseId: string) =>
            userCourseIds.includes(courseId)
          )
          
          if (!hasSpecificCourses) return false
          break
          
        default:
          console.warn(`Unknown requirement type: ${requirement.requirementType}`)
      }
    }
    
    return true
  }
  
  /**
   * Issue career certificate
   */
  async issueCareerCertificate(userId: string, careerPathId: string, definitionId: string) {
    try {
      const verificationCode = generateVerificationCode()
      
      // Get user's course badges for this career path
      const careerPath = await prisma.careerPath.findUnique({
        where: { id: careerPathId },
        include: { courses: true }
      })
      
      const courseBadges = await prisma.courseBadge.findMany({
        where: {
          userId,
          courseId: { in: careerPath?.courses.map(c => c.courseId) || [] },
          status: 'ACTIVE'
        },
        select: { id: true }
      })
      
      const definition = await prisma.careerCertificateDefinition.findUnique({
        where: { id: definitionId }
      })
      
      const expiryDate = definition?.expiryMonths
        ? new Date(Date.now() + definition.expiryMonths * 30 * 24 * 60 * 60 * 1000)
        : null
      
      const certificate = await prisma.careerCertificate.create({
        data: {
          userId,
          careerPathId,
          definitionId,
          verificationCode,
          expiryDate,
          courseBadgesSnapshot: JSON.stringify(courseBadges.map(b => b.id)),
          status: 'ACTIVE'
        },
        include: {
          user: { select: { name: true, email: true } },
          careerPath: { select: { name: true } },
          definition: true
        }
      })
      
      // Create verification record
      await this.createVerificationRecord({
        verificationCode,
        entityType: 'CAREER_CERTIFICATE',
        entityId: certificate.id,
        recipientName: certificate.user.name || certificate.user.email,
        issuerName: certificate.definition.issuerName,
        issueDate: certificate.issueDate,
        expiryDate: certificate.expiryDate,
        status: certificate.status
      })
      
      // Issue career badge
      await this.issueCareerBadge(userId, careerPathId, certificate.id)
      
      console.log(`Career certificate issued: ${certificate.id}`)
      return certificate
      
    } catch (error) {
      console.error('Error issuing career certificate:', error)
      throw error
    }
  }
  
  /**
   * Issue career badge (must be called AFTER career certificate)
   */
  async issueCareerBadge(userId: string, careerPathId: string, certificateId: string) {
    try {
      const badgeDef = await prisma.careerBadgeDefinition.findUnique({
        where: { careerPathId }
      })
      
      if (!badgeDef || !badgeDef.isActive) {
        console.log(`No active career badge definition for path ${careerPathId}`)
        return null
      }
      
      const badge = await prisma.careerBadge.create({
        data: {
          userId,
          careerPathId,
          definitionId: badgeDef.id,
          certificateId,
          status: 'ACTIVE'
        },
        include: {
          definition: true,
          careerPath: { select: { name: true } }
        }
      })
      
      console.log(`Career badge issued: ${badge.id}`)
      return badge
      
    } catch (error) {
      console.error('Error issuing career badge:', error)
      throw error
    }
  }
  
  /**
   * Create verification record for public verification
   */
  private async createVerificationRecord(data: {
    verificationCode: string
    entityType: string
    entityId: string
    recipientName: string
    issuerName: string
    issueDate: Date
    expiryDate: Date | null
    status: string
  }) {
    return await prisma.verificationRecord.create({ data })
  }
  
  /**
   * Public verification by code
   */
  async verifyByCode(verificationCode: string) {
    return await prisma.verificationRecord.findUnique({
      where: { verificationCode }
    })
  }
  
  /**
   * Revoke certificate/badge
   */
  async revokeCertificate(certificateId: string, reason: string, entityType: 'COURSE' | 'CAREER') {
    const table = entityType === 'COURSE' ? 'courseCertificate' : 'careerCertificate'
    
    await (prisma as any)[table].update({
      where: { id: certificateId },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
        revokedReason: reason
      }
    })
    
    // Update verification record
    const cert = await (prisma as any)[table].findUnique({
      where: { id: certificateId },
      select: { verificationCode: true }
    })
    
    if (cert) {
      await prisma.verificationRecord.update({
        where: { verificationCode: cert.verificationCode },
        data: { status: 'REVOKED' }
      })
    }
  }
}

export const certificationService = new CertificationService()