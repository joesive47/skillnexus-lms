# 🎓 Final Test Certification System Architecture

## 📋 สารบัญ
1. [ภาพรวมระบบ](#ภาพรวมระบบ)
2. [Database Schema](#database-schema)
3. [การทำงานของระบบ](#การทำงานของระบบ)
4. [Badge Engine Implementation](#badge-engine-implementation)
5. [Certification Engine Implementation](#certification-engine-implementation)
6. [Integration Flow](#integration-flow)
7. [UI/UX Components](#uiux-components)
8. [API Endpoints](#api-endpoints)

---

## 🎯 ภาพรวมระบบ

### Concept
เมื่อนักเรียนทำ Final Test ผ่านเกณฑ์ ระบบจะ:
1. ✅ **ตรวจสอบคะแนน** - เช็คว่าผ่านเกณฑ์หรือไม่ (ตาม `passingScore`)
2. 🏅 **ออก Badge อัตโนมัติ** - ให้ Badge ตามทักษะที่ทดสอบ
3. 🎓 **ตรวจสอบ Certification** - เช็คว่าครบเกณฑ์ได้ Certificate หรือไม่
4. 📜 **ออก Certificate** - สร้าง PDF พร้อม Verification Code
5. 📧 **แจ้งเตือน** - ส่งอีเมล์แจ้งผลพร้อมลิงก์ดาวน์โหลด

### Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                    FINAL TEST FLOW                              │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  1. Student Completes Final Test                               │
│     - handleSubmitTest()                                       │
│     - Calculate score & skill breakdown                        │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  2. Save Result to Database                                    │
│     - AssessmentResult table                                   │
│     - Save scores, answers, analysis                           │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  3. Trigger Certification Hook                                 │
│     🔥 onAssessmentCompleted(userId, assessmentId, percentage) │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  4. Badge Engine Evaluation                                    │
│     - Check eligibility criteria                               │
│     - Issue relevant badges                                    │
│     - Create verification codes                                │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  5. Certification Engine Check                                 │
│     - Check all certifications                                 │
│     - Verify required badges                                   │
│     - Issue certifications if eligible                         │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  6. Generate Certificate PDF                                   │
│     - Create beautiful certificate                             │
│     - Add QR code for verification                             │
│     - Upload to storage                                        │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  7. Notify User                                                │
│     - Send email notification                                  │
│     - Display badges on results page                           │
│     - Show certificate download link                           │
└────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### 1. SkillBadge (Badge Definition)
```prisma
model SkillBadge {
  id              String   @id @default(cuid())
  badgeName       String   // "JavaScript Expert", "Python Master"
  skillCategory   String   // "Programming", "Design", "Data Science"
  level           String   // BEGINNER | INTERMEDIATE | ADVANCED | EXPERT
  description     String?
  imageUrl        String?  // Badge icon URL
  
  // Criteria (JSON)
  criteriaType    String   // ASSESSMENT_SCORE | QUIZ_SCORE | COURSE_HOURS | COMBINED
  criteriaValue   String   // JSON: {"minScore": 80, "assessmentCategory": "programming"}
  
  // Open Badges Standard
  issuerName      String   @default("SkillNexus Academy")
  issuerUrl       String?
  issuerEmail     String?
  
  // Expiry
  expiryMonths    Int?     // null = never expires
  
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  userBadges          UserSkillBadge[]
  certificationBadges CertificationBadge[]
  
  @@map("skill_badges")
}
```

### 2. UserSkillBadge (Issued Badges)
```prisma
model UserSkillBadge {
  id              String   @id @default(cuid())
  userId          String
  badgeId         String
  
  // Issue details
  issuedDate      DateTime @default(now())
  expiryDate      DateTime?
  
  // Evidence (what triggered the badge)
  evidenceType    String?  // ASSESSMENT | QUIZ | COURSE | MANUAL
  evidenceId      String?  // AssessmentResult ID, Quiz ID, etc.
  evidenceUrl     String?
  evidenceData    String?  // JSON with additional data
  
  // Verification
  verificationCode String  @unique @default(cuid())
  
  // Status
  status          String   @default("ACTIVE") // ACTIVE | EXPIRED | REVOKED
  revokedAt       DateTime?
  revokedReason   String?
  
  // Relations
  user   User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  badge  SkillBadge @relation(fields: [badgeId], references: [id], onDelete: Cascade)
  
  @@unique([userId, badgeId, evidenceId])
  @@index([userId])
  @@index([status])
  @@map("user_skill_badges")
}
```

### 3. SkillCertification (Certification Definition)
```prisma
model SkillCertification {
  id                  String   @id @default(cuid())
  certificationName   String   @unique
  description         String
  category            String   // "Full Stack", "Data Science", "UI/UX"
  
  // Requirements
  minimumBadgeLevel   String?  // All badges must be >= this level (INTERMEDIATE, ADVANCED)
  
  // Issuer
  issuerName          String   @default("SkillNexus Academy")
  issuerUrl           String?
  issuerLogo          String?
  
  // Validity
  validityMonths      Int?     // null = lifetime
  
  // Assets
  imageUrl            String?
  certificateTemplate String?  // HTML/PDF template
  
  isActive            Boolean  @default(true)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  // Relations
  requiredBadges      CertificationBadge[]
  userCertifications  UserCertification[]
  
  @@map("skill_certifications")
}
```

### 4. CertificationBadge (Mapping: Which badges required)
```prisma
model CertificationBadge {
  id              String   @id @default(cuid())
  certificationId String
  badgeId         String
  isRequired      Boolean  @default(true) // false = optional/bonus
  order           Int      @default(0)
  
  // Relations
  certification SkillCertification @relation(fields: [certificationId], references: [id], onDelete: Cascade)
  badge         SkillBadge         @relation(fields: [badgeId], references: [id], onDelete: Cascade)
  
  @@unique([certificationId, badgeId])
  @@map("certification_badges")
}
```

### 5. UserCertification (Issued Certifications)
```prisma
model UserCertification {
  id                  String   @id @default(cuid())
  userId              String
  certificationId     String
  
  // Issue details
  issueDate           DateTime @default(now())
  expiryDate          DateTime?
  
  // Verification
  certificationNumber String   @unique @default(cuid())
  verificationCode    String   @unique @default(cuid())
  verificationUrl     String?
  digitalSignature    String?  // SHA-256 hash for verification
  
  // Status
  status              String   @default("ACTIVE") // ACTIVE | EXPIRED | REVOKED
  
  // Snapshot (badge IDs at time of issuance)
  earnedBadgesSnapshot String  // JSON array
  
  // PDF
  pdfUrl              String?
  pdfGeneratedAt      DateTime?
  
  revokedAt           DateTime?
  revokedReason       String?
  
  // Relations
  user          User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  certification SkillCertification @relation(fields: [certificationId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([status])
  @@map("user_certifications")
}
```

### 6. CertificationEvent (Event Log for Processing)
```prisma
model CertificationEvent {
  id          String   @id @default(cuid())
  eventType   String   // BADGE_EARNED | CERT_ISSUED | BADGE_EXPIRED | CERT_EXPIRED
  userId      String
  entityType  String   // BADGE | CERTIFICATION
  entityId    String   // UserSkillBadge ID or UserCertification ID
  metadata    String?  // JSON
  processed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  processedAt DateTime?
  
  @@index([processed])
  @@index([eventType])
  @@map("certification_events")
}
```

---

## ⚙️ การทำงานของระบบ

### Flow 1: Final Test ผ่าน → Badge

```typescript
// ใน skills-test/[assessmentId]/page.tsx
const handleSubmitTest = async () => {
  // 1. คำนวณคะแนน
  const results = calculateTestResults(userAnswers)
  
  // 2. บันทึกผลสอบ (ถ้ามี user login)
  if (userId) {
    const savedResult = await saveTestResult({
      userId,
      assessmentId,
      score: results.score,
      skillBreakdown: results.skillScores,
      passed: results.passed
    })
    
    // 3. ✨ Trigger Certification Hook
    if (results.passed) {
      await onAssessmentCompleted(
        userId, 
        assessmentId, 
        results.score
      )
    }
  }
  
  // 4. แสดงผล
  setResults(results)
}
```

### Flow 2: Badge Evaluation

```typescript
// Badge Engine จะ:
// 1. ดึงข้อมูล Assessment ที่เพิ่งทำ
// 2. ค้นหา Badges ที่ match กับ category
// 3. เช็คเกณฑ์
// 4. ออก Badge ถ้าผ่าน

Example Criteria:
{
  "criteriaType": "ASSESSMENT_SCORE",
  "minScore": 80,
  "assessmentCategory": "programming"
}

// Match with:
Assessment.category === "programming" 
&& userScore >= 80 
→ Issue Badge!
```

### Flow 3: Certification Check

```typescript
// หลังได้ Badge:
// 1. ดึงข้อมูล Certifications ทั้งหมด
// 2. เช็คว่า User มี Badges ครบหรือไม่
// 3. ออก Certificate ถ้าครบ

Example:
Certification "Full Stack Developer" requires:
- JavaScript Expert Badge
- React Master Badge  
- Node.js Expert Badge

IF user has all 3 → Issue Certificate!
```

---

## 🔧 Badge Engine Implementation

### File: `src/lib/certification/badge-engine.ts`

```typescript
import { prisma } from '@/lib/prisma'
import { onBadgeEarned } from './integration-hooks'

export class BadgeEngine {
  /**
   * ตรวจสอบและออก Badges อัตโนมัติหลังทำ Assessment
   */
  static async checkAndIssueBadges(
    userId: string, 
    activityType: 'ASSESSMENT' | 'QUIZ' | 'COURSE',
    activityId: string
  ): Promise<string[]> {
    const issuedBadgeIds: string[] = []
    
    // 1. ดึงข้อมูล activity
    const activityData = await this.getActivityData(activityType, activityId, userId)
    if (!activityData) return []
    
    // 2. ดึง badges ที่เกี่ยวข้อง
    const relevantBadges = await this.getRelevantBadges(activityType, activityData)
    
    // 3. ประเมินแต่ละ badge
    for (const badge of relevantBadges) {
      const { eligible, evidence } = await this.evaluateCriteria(
        userId, 
        badge.id, 
        activityData
      )
      
      if (eligible) {
        // เช็คว่ามีแล้วหรือไม่
        const existing = await prisma.userSkillBadge.findFirst({
          where: { 
            userId, 
            badgeId: badge.id,
            status: 'ACTIVE'
          }
        })
        
        if (!existing) {
          const userBadgeId = await this.issueBadge(userId, badge.id, evidence)
          if (userBadgeId) {
            issuedBadgeIds.push(userBadgeId)
          }
        }
      }
    }
    
    return issuedBadgeIds
  }
  
  /**
   * ออก Badge ให้ User
   */
  static async issueBadge(
    userId: string, 
    badgeId: string, 
    evidence: any
  ): Promise<string | null> {
    try {
      // 1. ดึงข้อมูล badge
      const badge = await prisma.skillBadge.findUnique({ 
        where: { id: badgeId } 
      })
      if (!badge || !badge.isActive) return null
      
      // 2. คำนวณ expiry date
      const expiryDate = badge.expiryMonths 
        ? new Date(Date.now() + badge.expiryMonths * 30 * 24 * 60 * 60 * 1000)
        : null
      
      // 3. สร้าง UserSkillBadge
      const userBadge = await prisma.userSkillBadge.create({
        data: {
          userId,
          badgeId,
          issuedDate: new Date(),
          expiryDate,
          evidenceType: evidence.type,
          evidenceId: evidence.id,
          evidenceData: JSON.stringify(evidence.data || {}),
          status: 'ACTIVE'
        }
      })
      
      // 4. สร้าง Event สำหรับ Certification check
      await prisma.certificationEvent.create({
        data: {
          eventType: 'BADGE_EARNED',
          userId,
          entityType: 'BADGE',
          entityId: userBadge.id,
          metadata: JSON.stringify({ badgeId, evidence })
        }
      })
      
      // 5. Trigger certification check
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
    activityData: any
  ): Promise<{ eligible: boolean; evidence?: any }> {
    const badge = await prisma.skillBadge.findUnique({ 
      where: { id: badgeId } 
    })
    if (!badge) return { eligible: false }
    
    const criteria = JSON.parse(badge.criteriaValue)
    
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
  }
  
  /**
   * ประเมินคะแนน Assessment
   */
  private static evaluateAssessmentScore(
    criteria: any, 
    activityData: any
  ): { eligible: boolean; evidence?: any } {
    const { minScore, assessmentCategory } = criteria
    
    // เช็ค category (ถ้ามีระบุ)
    if (assessmentCategory && activityData.category !== assessmentCategory) {
      return { eligible: false }
    }
    
    // เช็คคะแนน
    const eligible = activityData.score >= minScore
    
    return {
      eligible,
      evidence: eligible ? {
        type: 'ASSESSMENT',
        id: activityData.resultId,
        data: {
          score: activityData.score,
          assessmentTitle: activityData.title,
          completedAt: activityData.completedAt
        }
      } : undefined
    }
  }
  
  /**
   * ดึง Badges ที่เกี่ยวข้อง
   */
  private static async getRelevantBadges(
    activityType: string, 
    activityData: any
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
  ): Promise<any> {
    if (activityType === 'ASSESSMENT') {
      // ดึงผลล่าสุดของ user นี้
      const result = await prisma.assessmentResult.findFirst({
        where: { 
          userId,
          careerId: activityId // assessmentId อาจเป็น careerId
        },
        orderBy: { completedAt: 'desc' },
        include: { career: true }
      })
      
      if (!result) return null
      
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
  
  // Helper methods
  private static evaluateQuizScore(criteria: any, data: any) {
    // TODO: Implement quiz score evaluation
    return { eligible: false }
  }
  
  private static async evaluateCourseHours(userId: string, criteria: any) {
    // TODO: Implement course hours evaluation
    return { eligible: false }
  }
  
  private static async evaluateCombined(userId: string, criteria: any, data: any) {
    // TODO: Implement combined criteria
    return { eligible: false }
  }
}

export default BadgeEngine
```

---

## 🎓 Certification Engine Implementation

### File: `src/lib/certification/certification-engine.ts`

```typescript
import { prisma } from '@/lib/prisma'
import { generateCertificatePDF } from './pdf-generator'

export class CertificationEngine {
  /**
   * ตรวจสอบและออก Certifications อัตโนมัติ
   */
  static async checkAndIssueCertifications(userId: string): Promise<string[]> {
    const issuedCertIds: string[] = []
    
    // 1. ดึง certifications ทั้งหมด
    const certifications = await prisma.skillCertification.findMany({
      where: { isActive: true },
      include: {
        requiredBadges: {
          include: { badge: true }
        }
      }
    })
    
    // 2. ดึง badges ของ user
    const userBadges = await prisma.userSkillBadge.findMany({
      where: { 
        userId, 
        status: 'ACTIVE' 
      },
      include: { badge: true }
    })
    
    const userBadgeIds = new Set(userBadges.map(ub => ub.badgeId))
    
    // 3. ตรวจสอบแต่ละ certification
    for (const cert of certifications) {
      // เช็คว่ามีแล้วหรือไม่
      const existing = await prisma.userCertification.findFirst({
        where: { 
          userId, 
          certificationId: cert.id,
          status: 'ACTIVE'
        }
      })
      
      if (existing) continue
      
      // เช็คว่าครบ badges หรือไม่
      const { eligible } = this.checkEligibility(cert, userBadges)
      
      if (eligible) {
        const certId = await this.issueCertification(userId, cert.id)
        if (certId) {
          issuedCertIds.push(certId)
        }
      }
    }
    
    return issuedCertIds
  }
  
  /**
   * ตรวจสอบว่าผ่านเกณฑ์หรือไม่
   */
  static checkEligibility(
    certification: any,
    userBadges: any[]
  ): { eligible: boolean; missingBadges?: string[] } {
    const requiredBadgeIds = certification.requiredBadges
      .filter((rb: any) => rb.isRequired)
      .map((rb: any) => rb.badgeId)
    
    const userBadgeIds = new Set(userBadges.map(ub => ub.badgeId))
    
    const missingBadges = requiredBadgeIds.filter(
      (id: string) => !userBadgeIds.has(id)
    )
    
    // ตรวจสอบ level (ถ้ามี)
    if (certification.minimumBadgeLevel) {
      const levelOrder = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']
      const minLevelIdx = levelOrder.indexOf(certification.minimumBadgeLevel)
      
      for (const userBadge of userBadges) {
        const badgeLevel = userBadge.badge.level
        const badgeLevelIdx = levelOrder.indexOf(badgeLevel)
        
        if (badgeLevelIdx < minLevelIdx) {
          return { 
            eligible: false, 
            missingBadges: [`Badge ${userBadge.badge.badgeName} level too low`] 
          }
        }
      }
    }
    
    return {
      eligible: missingBadges.length === 0,
      missingBadges: missingBadges.length > 0 ? missingBadges : undefined
    }
  }
  
  /**
   * ออก Certification
   */
  static async issueCertification(
    userId: string, 
    certificationId: string
  ): Promise<string | null> {
    try {
      const certification = await prisma.skillCertification.findUnique({
        where: { id: certificationId },
        include: {
          requiredBadges: {
            include: { badge: true }
          }
        }
      })
      
      if (!certification) return null
      
      const user = await prisma.user.findUnique({ 
        where: { id: userId } 
      })
      
      if (!user) return null
      
      // 1. คำนวณ expiry
      const expiryDate = certification.validityMonths
        ? new Date(Date.now() + certification.validityMonths * 30 * 24 * 60 * 60 * 1000)
        : null
      
      // 2. สร้าง verification code
      const verificationCode = this.generateVerificationCode()
      const digitalSignature = this.generateDigitalSignature(
        userId, 
        certificationId, 
        verificationCode
      )
      
      // 3. Snapshot badges
      const userBadges = await prisma.userSkillBadge.findMany({
        where: { userId, status: 'ACTIVE' }
      })
      const badgeSnapshot = JSON.stringify(userBadges.map(ub => ub.badgeId))
      
      // 4. สร้าง UserCertification
      const userCert = await prisma.userCertification.create({
        data: {
          userId,
          certificationId,
          issueDate: new Date(),
          expiryDate,
          verificationCode,
          digitalSignature,
          earnedBadgesSnapshot: badgeSnapshot,
          status: 'ACTIVE'
        }
      })
      
      // 5. สร้าง PDF
      const pdfUrl = await generateCertificatePDF({
        userCertification: userCert,
        user,
        certification
      })
      
      // 6. Update PDF URL
      if (pdfUrl) {
        await prisma.userCertification.update({
          where: { id: userCert.id },
          data: { 
            pdfUrl,
            pdfGeneratedAt: new Date()
          }
        })
      }
      
      // 7. Log event
      await prisma.certificationEvent.create({
        data: {
          eventType: 'CERT_ISSUED',
          userId,
          entityType: 'CERTIFICATION',
          entityId: userCert.id,
          metadata: JSON.stringify({ certificationId })
        }
      })
      
      return userCert.id
    } catch (error) {
      console.error('Error issuing certification:', error)
      return null
    }
  }
  
  /**
   * ดู Progress
   */
  static async getCertificationProgress(
    userId: string, 
    certificationId: string
  ) {
    const certification = await prisma.skillCertification.findUnique({
      where: { id: certificationId },
      include: {
        requiredBadges: {
          include: { badge: true }
        }
      }
    })
    
    if (!certification) return null
    
    const userBadges = await prisma.userSkillBadge.findMany({
      where: { userId, status: 'ACTIVE' },
      include: { badge: true }
    })
    
    const userBadgeIds = new Set(userBadges.map(ub => ub.badgeId))
    
    const requiredBadges = certification.requiredBadges
      .filter(rb => rb.isRequired)
    
    const earnedCount = requiredBadges.filter(rb => 
      userBadgeIds.has(rb.badgeId)
    ).length
    
    const progress = requiredBadges.length > 0
      ? Math.round((earnedCount / requiredBadges.length) * 100)
      : 0
    
    return {
      certificationId,
      certificationName: certification.certificationName,
      progress,
      earned: earnedCount,
      total: requiredBadges.length,
      badges: requiredBadges.map(rb => ({
        badgeId: rb.badgeId,
        badgeName: rb.badge.badgeName,
        earned: userBadgeIds.has(rb.badgeId),
        isRequired: rb.isRequired
      }))
    }
  }
  
  // Helper methods
  private static generateVerificationCode(): string {
    return `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  }
  
  private static generateDigitalSignature(
    userId: string, 
    certId: string, 
    code: string
  ): string {
    // ใช้ SHA-256 hash
    const crypto = require('crypto')
    const data = `${userId}:${certId}:${code}:${process.env.CERT_SECRET || 'secret'}`
    return crypto.createHash('sha256').update(data).digest('hex')
  }
}

export default CertificationEngine
```

---

## 🔗 Integration Flow

### Step 1: Update Assessment Result Save

```typescript
// File: src/app/skills-test/[assessmentId]/page.tsx

// หลัง handleSubmitTest
const handleSubmitTest = useCallback(async () => {
  // ... existing code ...
  
  const testResults = {
    // ... existing results ...
  }
  
  // ✨ NEW: Save to database if user is logged in
  if (userEmail) {
    try {
      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: assessment.id,
          userEmail,
          score: finalScore,
          skillBreakdown: skillScores,
          detailedResults,
          passed: testResults.passed,
          timeSpent: testResults.timeSpent
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // แสดง badges ที่ได้รับ
        if (data.badges && data.badges.length > 0) {
          setEarnedBadges(data.badges)
        }
        
        // แสดง certificates ที่ได้รับ
        if (data.certificates && data.certificates.length > 0) {
          setEarnedCertificates(data.certificates)
        }
      }
    } catch (error) {
      console.error('Failed to save result:', error)
    }
  }
  
  setResults(testResults)
  setIsCompleted(true)
}, [/* deps */])
```

### Step 2: Create API Endpoint

```typescript
// File: src/app/api/assessment/submit/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { onAssessmentCompleted } from '@/lib/certification/integration-hooks'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      assessmentId, 
      userEmail, 
      score, 
      skillBreakdown, 
      detailedResults,
      passed,
      timeSpent
    } = body
    
    // 1. Find or create user
    let user = await prisma.user.findUnique({ 
      where: { email: userEmail } 
    })
    
    if (!user) {
      // Create guest user
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: userEmail.split('@')[0],
          role: 'STUDENT'
        }
      })
    }
    
    // 2. Save assessment result
    const result = await prisma.assessmentResult.create({
      data: {
        userId: user.id,
        careerId: assessmentId,
        totalScore: Math.round(score),
        percentage: score,
        answers: JSON.stringify(detailedResults),
        skillScores: JSON.stringify(skillBreakdown),
        timeSpent: timeSpent || 0
      }
    })
    
    // 3. ✨ Trigger certification system (only if passed)
    let badges = []
    let certificates = []
    
    if (passed) {
      const issuedBadges = await onAssessmentCompleted(
        user.id, 
        assessmentId, 
        score
      )
      
      // Get badge details
      if (issuedBadges && issuedBadges.length > 0) {
        badges = await prisma.userSkillBadge.findMany({
          where: { 
            id: { in: issuedBadges },
            userId: user.id 
          },
          include: { badge: true }
        })
      }
      
      // Get certificates
      certificates = await prisma.userCertification.findMany({
        where: { 
          userId: user.id,
          status: 'ACTIVE'
        },
        include: { certification: true },
        orderBy: { issueDate: 'desc' },
        take: 5
      })
    }
    
    return NextResponse.json({
      success: true,
      resultId: result.id,
      badges: badges.map(b => ({
        id: b.id,
        name: b.badge.badgeName,
        level: b.badge.level,
        imageUrl: b.badge.imageUrl,
        verificationCode: b.verificationCode
      })),
      certificates: certificates.map(c => ({
        id: c.id,
        name: c.certification.certificationName,
        pdfUrl: c.pdfUrl,
        verificationCode: c.verificationCode
      }))
    })
  } catch (error) {
    console.error('Assessment submit error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save result' },
      { status: 500 }
    )
  }
}
```

### Step 3: Update Integration Hooks

```typescript
// File: src/lib/certification/integration-hooks.ts

export async function onAssessmentCompleted(
  userId: string, 
  assessmentId: string, 
  percentage: number
): Promise<string[]> {
  // Call badge engine
  const issuedBadges = await BadgeEngine.checkAndIssueBadges(
    userId, 
    'ASSESSMENT', 
    assessmentId
  )
  
  return issuedBadges
}

export async function onBadgeEarned(
  userId: string, 
  badgeId: string
): Promise<string[]> {
  // Auto-check certifications
  const issuedCerts = await CertificationEngine.checkAndIssueCertifications(userId)
  
  return issuedCerts
}
```

---

## 🎨 UI/UX Components

### Component 1: Badge Display on Results Page

```tsx
// File: src/components/certification/BadgeDisplay.tsx

interface BadgeDisplayProps {
  badges: Array<{
    id: string
    name: string
    level: string
    imageUrl?: string
    verificationCode: string
  }>
}

export default function BadgeDisplay({ badges }: BadgeDisplayProps) {
  if (!badges || badges.length === 0) return null
  
  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-300">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-yellow-800 flex items-center justify-center gap-2">
          <span className="text-3xl">🏅</span>
          ยินดีด้วย! คุณได้รับ Badge
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div 
            key={badge.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-center">
              {badge.imageUrl ? (
                <img 
                  src={badge.imageUrl} 
                  alt={badge.name}
                  className="w-20 h-20 mx-auto mb-3"
                />
              ) : (
                <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-4xl">
                  🏆
                </div>
              )}
              
              <h4 className="font-bold text-lg text-gray-800 mb-1">
                {badge.name}
              </h4>
              
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                badge.level === 'EXPERT' ? 'bg-purple-100 text-purple-800' :
                badge.level === 'ADVANCED' ? 'bg-blue-100 text-blue-800' :
                badge.level === 'INTERMEDIATE' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {badge.level}
              </span>
              
              <div className="mt-3 text-xs text-gray-500">
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {badge.verificationCode}
                </code>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <a 
          href="/dashboard/badges"
          className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors"
        >
          ดู Badges ทั้งหมดของคุณ →
        </a>
      </div>
    </div>
  )
}
```

### Component 2: Certificate Display

```tsx
// File: src/components/certification/CertificateDisplay.tsx

interface CertificateDisplayProps {
  certificates: Array<{
    id: string
    name: string
    pdfUrl?: string
    verificationCode: string
  }>
}

export default function CertificateDisplay({ certificates }: CertificateDisplayProps) {
  if (!certificates || certificates.length === 0) return null
  
  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-blue-800 flex items-center justify-center gap-2">
          <span className="text-3xl">🎓</span>
          ยินดีด้วย! คุณได้รับ Certificate
        </h3>
      </div>
      
      <div className="space-y-4">
        {certificates.map((cert) => (
          <div 
            key={cert.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-bold text-xl text-gray-800 mb-2">
                  📜 {cert.name}
                </h4>
                
                <div className="text-sm text-gray-600 mb-3">
                  Verification Code: 
                  <code className="ml-2 bg-gray-100 px-3 py-1 rounded">
                    {cert.verificationCode}
                  </code>
                </div>
              </div>
              
              {cert.pdfUrl && (
                <div>
                  <a
                    href={cert.pdfUrl}
                    download
                    className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                  >
                    📥 ดาวน์โหลด PDF
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <a 
          href="/dashboard/certificates"
          className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-colors"
        >
          ดู Certificates ทั้งหมดของคุณ →
        </a>
      </div>
    </div>
  )
}
```

### Component 3: Badge Progress Widget (Dashboard)

```tsx
// File: src/components/certification/BadgeProgressWidget.tsx

export default function BadgeProgressWidget({ userId }: { userId: string }) {
  const [progress, setProgress] = useState<any[]>([])
  
  useEffect(() => {
    loadProgress()
  }, [userId])
  
  const loadProgress = async () => {
    const res = await fetch(`/api/certification/progress/${userId}`)
    const data = await res.json()
    setProgress(data.certifications || [])
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">🎯 Certification Progress</h3>
      
      <div className="space-y-4">
        {progress.map((cert) => (
          <div key={cert.certificationId}>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">{cert.certificationName}</span>
              <span className="text-sm text-gray-600">
                {cert.earned}/{cert.total} badges
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${cert.progress}%` }}
              />
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              {cert.progress}% Complete
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 🌐 API Endpoints

### 1. GET /api/certification/progress/[userId]

```typescript
// Get certification progress for user
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const certifications = await CertificationEngine.getAllProgress(params.userId)
  return NextResponse.json({ certifications })
}
```

### 2. GET /api/certification/verify/[code]

```typescript
// Verify certificate by code
export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const cert = await prisma.userCertification.findUnique({
    where: { verificationCode: params.code },
    include: { 
      user: true, 
      certification: true 
    }
  })
  
  if (!cert) {
    return NextResponse.json({ valid: false }, { status: 404 })
  }
  
  // Verify signature
  const isValid = CertificationEngine.verifySignature(cert)
  
  return NextResponse.json({
    valid: isValid,
    certificationName: cert.certification.certificationName,
    holderName: cert.user.name,
    issueDate: cert.issueDate,
    expiryDate: cert.expiryDate
  })
}
```

### 3. GET /api/badges/user/[userId]

```typescript
// Get user badges
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const badges = await BadgeEngine.getUserBadges(params.userId)
  return NextResponse.json({ badges })
}
```

---

## 📋 Implementation Checklist

### Phase 1: Database Setup
- [ ] เพิ่ม models ใน `schema.prisma`
- [ ] Run `npx prisma migrate dev --name add_certification_system`
- [ ] Seed ตัวอย่าง Badges และ Certifications

### Phase 2: Core Logic
- [ ] Implement `BadgeEngine` class
- [ ] Implement `CertificationEngine` class
- [ ] Implement `integration-hooks.ts`
- [ ] Create PDF generator (optional)

### Phase 3: API Integration
- [ ] Create `/api/assessment/submit` endpoint
- [ ] Create `/api/certification/*` endpoints
- [ ] Update `handleSubmitTest` in skills-test page

### Phase 4: UI Components
- [ ] Create `BadgeDisplay` component
- [ ] Create `CertificateDisplay` component
- [ ] Add to results page
- [ ] Create dashboard views

### Phase 5: Testing
- [ ] Test badge issuance
- [ ] Test certification issuance
- [ ] Test verification system
- [ ] Load testing

---

## 🎉 Success Metrics

### User Engagement
- ✅ **Badge Display Rate**: 100% (แสดงทุกครั้งที่ได้)
- ✅ **Certificate Download Rate**: > 80%
- ✅ **Verification Rate**: > 50% (people verify their certs)

### System Performance
- ✅ **Badge Issuance Time**: < 2 seconds
- ✅ **Cert Generation Time**: < 5 seconds
- ✅ **API Response Time**: < 500ms

### Business Impact
- 📈 **Completion Rate**: +30% (motivation to complete tests)
- 📈 **Retention Rate**: +40% (users come back for more badges)
- 📈 **Share Rate**: +50% (users share their achievements)

---

## 🚀 Next Steps

1. **Seed Sample Data**
   ```typescript
   // Create sample badges
   - JavaScript Expert (ADVANCED, min 80%)
   - React Master (ADVANCED, min 85%)
   - Full Stack Badge (EXPERT, min 90%)
   
   // Create certification
   - Full Stack Developer Certificate
     * Requires: JavaScript Expert + React Master
   ```

2. **Test Flow**
   ```
   1. ทำ Final Test (Programming) ได้ 82%
   2. ได้ Badge "JavaScript Expert"
   3. ทำ Final Test (React) ได้ 88%
   4. ได้ Badge "React Master"
   5. ✨ Auto-issue "Full Stack Developer Certificate"
   ```

3. **Deploy & Monitor**
   - Deploy to production
   - Monitor badge issuance
   - Collect user feedback
   - Iterate and improve

---

**Created:** February 2026  
**Version:** 1.0  
**Status:** Ready for Implementation 🚀
