# ✅ LMS Quick Deployment Checklist
## เช็คลิสต์สำหรับ Deploy ระบบ LMS ครบวงจรภายใน 1 วัน

> **คู่มือฉบับนี้จะพาคุณจาก 0 → Production ด้วย Step-by-Step Checklist**  
> ครอบคลุมทั้ง Database Setup, API Implementation, Frontend Integration, และ Deployment

---

## 📋 Phase 1: Database Setup (30 นาที)

### ✅ 1.1 ตรวจสอบ Schema

```bash
# 1. เช็คว่ามี models ที่จำเป็นครบหรือไม่
cd c:\API\The-SkillNexus
code prisma/schema.prisma
```

**Models ที่ต้องมี:**
- [x] `LearningNode` - กราฟการเรียนรู้
- [x] `NodeDependency` - Prerequisites
- [x] `NodeProgress` - ความคืบหน้า
- [x] `WatchHistory` - วิดีโอ
- [x] `VideoSegment` - Anti-skip
- [x] `ScormPackage` + `ScormRuntimeData` - SCORM
- [x] `Quiz` + `QuizAttemptRecord` - Quiz
- [x] `CourseCertificate` + `CourseCertificateDefinition` - Cert

### ✅ 1.2 Migrate Database

```bash
# Generate Prisma Client
npx prisma generate

# Push to database
npx prisma db push

# Verify
npx prisma studio
```

**Expected Output:**
```
✔ Generated Prisma Client to ./node_modules/.prisma/client
✔ Database schema synced
```

---

## 📋 Phase 2: API Implementation (2 ชั่วโมง)

### ✅ 2.1 สร้าง API Routes

**Copy code จาก [LMS-API-IMPLEMENTATION.md](./LMS-API-IMPLEMENTATION.md) ไปยังโฟลเดอร์เหล่านี้:**

| API | Path | Status |
|-----|------|--------|
| Video Progress | `src/app/api/video/progress/route.ts` | ⬜ |
| SCORM Init | `src/app/api/scorm/init/route.ts` | ⬜ |
| SCORM Commit | `src/app/api/scorm/commit/route.ts` | ⬜ |
| Quiz Submit | `src/app/api/quiz/submit/route.ts` | ⬜ |
| Course Progress | `src/app/api/courses/[courseId]/progress/route.ts` | ⬜ |
| Final Exam Eligibility | `src/app/api/final-exam/eligibility/route.ts` | ⬜ |
| Certificate Issue | `src/app/api/certificates/issue/route.ts` | ⬜ |
| Certificate Download | `src/app/api/certificates/[certificateId]/download/route.ts` | ⬜ |
| Student Certifications | `src/app/api/student/certifications/route.ts` | ⬜ |
| Unlock Status | `src/app/api/courses/[courseId]/unlock-status/route.ts` | ⬜ |

**Quick Create Script:**

```bash
# Windows PowerShell
$apis = @(
  "src/app/api/video/progress",
  "src/app/api/scorm/init",
  "src/app/api/scorm/commit",
  "src/app/api/quiz/submit",
  "src/app/api/courses/[courseId]/progress",
  "src/app/api/final-exam/eligibility",
  "src/app/api/certificates/issue",
  "src/app/api/certificates/[certificateId]/download",
  "src/app/api/student/certifications",
  "src/app/api/courses/[courseId]/unlock-status"
)

foreach ($api in $apis) {
  New-Item -ItemType Directory -Force -Path $api
  New-Item -ItemType File -Force -Path "$api/route.ts"
}
```

### ✅ 2.2 สร้าง Helper Libraries

#### `src/lib/learning-flow-engine.ts`

**ถ้ายังไม่มี ให้สร้างไฟล์นี้:**

```typescript
// Learning Flow Rule Engine
// Copy from LEARNING-FLOW-ARCHITECTURE.md or use existing implementation

export class LearningFlowRuleEngine {
  async getCourseUnlockState(userId: string, courseId: string) {
    // Implementation
  }
  
  async checkNodeUnlocked(userId: string, nodeId: string) {
    // Implementation
  }
}
```

#### `src/lib/certificate-generator.ts`

```typescript
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export async function generateCertificatePDF(data: {
  template: string
  data: {
    recipientName: string
    courseName: string
    issueDate: string
    verificationCode: string
    issuerName: string
    issuerTitle: string
    qrCodeUrl: string
  }
}) {
  // Simple PDF generation (replace with your template logic)
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  page.drawText('CERTIFICATE OF COMPLETION', {
    x: 150,
    y: 700,
    size: 24,
    font,
    color: rgb(0, 0.3, 0.5)
  })
  
  page.drawText(data.data.recipientName, {
    x: 200,
    y: 600,
    size: 18,
    font
  })
  
  page.drawText(`Course: ${data.data.courseName}`, {
    x: 100,
    y: 550,
    size: 14
  })
  
  page.drawText(`Issued: ${data.data.issueDate}`, {
    x: 100,
    y: 500,
    size: 12
  })
  
  page.drawText(`Verification: ${data.data.verificationCode}`, {
    x: 100,
    y: 450,
    size: 10
  })
  
  const pdfBytes = await pdfDoc.save()
  
  // Upload to storage (Vercel Blob, AWS S3, etc.)
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  // ... upload logic
  
  return 'https://your-storage-url/certificate.pdf'
}
```

**Install dependencies:**

```bash
npm install pdf-lib
```

### ✅ 2.3 Test APIs

```bash
# Start dev server
npm run dev

# Test video progress
curl -X POST http://localhost:3000/api/video/progress \
  -H "Content-Type: application/json" \
  -d '{"lessonId":"lesson_123", "currentTime":120, "duration":600}'

# Test quiz submit
curl -X POST http://localhost:3000/api/quiz/submit \
  -H "Content-Type: application/json" \
  -d '{"quizId":"quiz_456", "answers":[...]}'
```

---

## 📋 Phase 3: Frontend Integration (3 ชั่วโมง)

### ✅ 3.1 สร้าง Hooks

#### `src/hooks/useVideoProgress.ts`

```typescript
import { useEffect, useRef } from 'react'

export function useVideoProgress(lessonId: string, videoRef: React.RefObject<HTMLVideoElement>) {
  const lastUpdateRef = useRef(0)
  
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    const interval = setInterval(async () => {
      if (video.paused) return
      
      const currentTime = video.currentTime
      const duration = video.duration
      
      // Send progress every 5 seconds
      if (currentTime - lastUpdateRef.current >= 5) {
        await fetch('/api/video/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId,
            currentTime,
            duration,
            watchedSegment: {
              start: lastUpdateRef.current,
              end: currentTime
            }
          })
        })
        
        lastUpdateRef.current = currentTime
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [lessonId, videoRef])
}
```

#### `src/hooks/useScormTracking.ts`

```typescript
import { useEffect } from 'react'

export function useScormTracking(lessonId: string) {
  useEffect(() => {
    // Setup SCORM API
    window.API = {
      LMSInitialize: () => {
        fetch('/api/scorm/init', {
          method: 'POST',
          body: JSON.stringify({ lessonId })
        })
        return 'true'
      },
      
      LMSCommit: () => {
        const cmiData = window.scormData || {}
        fetch('/api/scorm/commit', {
          method: 'POST',
          body: JSON.stringify({
            registrationId: window.scormRegistrationId,
            cmiData
          })
        })
        return 'true'
      },
      
      LMSGetValue: (key: string) => {
        return window.scormData?.[key] || ''
      },
      
      LMSSetValue: (key: string, value: string) => {
        if (!window.scormData) window.scormData = {}
        window.scormData[key] = value
        return 'true'
      }
    }
    
    return () => {
      delete window.API
    }
  }, [lessonId])
}
```

### ✅ 3.2 สร้าง Components

#### `src/components/VideoPlayer.tsx`

```tsx
'use client'

import { useRef } from 'react'
import { useVideoProgress } from '@/hooks/useVideoProgress'

export function VideoPlayer({ lessonId, videoUrl }: {
  lessonId: string
  videoUrl: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useVideoProgress(lessonId, videoRef)
  
  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="w-full h-full"
      />
    </div>
  )
}
```

#### `src/components/QuizForm.tsx`

```tsx
'use client'

import { useState } from 'react'

export function QuizForm({ quizId, questions }: any) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId,
          answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
            questionId,
            selectedOption
          })),
          timeSpent: 300
        })
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  if (result) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">
          {result.passed ? '✅ ผ่าน!' : '❌ ไม่ผ่าน'}
        </h2>
        <p>คะแนน: {result.score}%</p>
        <p>{result.feedback}</p>
        
        {result.passed && (
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded">
            ต่อไปบทถัดไป →
          </button>
        )}
      </div>
    )
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((q: any) => (
        <div key={q.id} className="bg-gray-50 p-4 rounded">
          <p className="font-semibold mb-2">{q.text}</p>
          {q.options.map((opt: any) => (
            <label key={opt.id} className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name={q.id}
                value={opt.id}
                onChange={() => setAnswers({ ...answers, [q.id]: opt.id })}
                className="w-4 h-4"
              />
              <span>{opt.text}</span>
            </label>
          ))}
        </div>
      ))}
      
      <button
        type="submit"
        disabled={loading || Object.keys(answers).length !== questions.length}
        className="w-full bg-blue-600 text-white py-3 rounded disabled:opacity-50"
      >
        {loading ? 'กำลังส่ง...' : 'ส่งคำตอบ'}
      </button>
    </form>
  )
}
```

#### `src/components/CertificateList.tsx`

```tsx
'use client'

import { useEffect, useState } from 'react'

export function CertificateList() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/student/certifications')
      .then(r => r.json())
      .then(data => {
        setCertificates(data.courseCertificates)
        setLoading(false)
      })
  }, [])
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div className="grid gap-4">
      {certificates.map((cert: any) => (
        <div key={cert.id} className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">{cert.courseName}</h3>
              <p className="text-sm text-gray-600">
                ออกวันที่: {new Date(cert.issueDate).toLocaleDateString('th-TH')}
              </p>
              <p className="text-xs text-gray-500">
                รหัสตรวจสอบ: {cert.verificationCode}
              </p>
            </div>
            
            <div className="flex gap-2">
              <a
                href={cert.pdfUrl}
                download
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                📥 ดาวน์โหลด
              </a>
              <a
                href={cert.verifyUrl}
                target="_blank"
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                🔍 ตรวจสอบ
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### ✅ 3.3 Integration Checklist

- [ ] Lesson Page มี VideoPlayer component
- [ ] Quiz Page มี QuizForm component  
- [ ] Student Dashboard มี CertificateList
- [ ] Course Progress แสดง progress bar
- [ ] Final Exam ตรวจสอบ eligibility ก่อนเข้าสอบ
- [ ] หลังสอบผ่าน Final → auto issue certificate

---

## 📋 Phase 4: Certificate Template Setup (1 ชั่วโมง)

### ✅ 4.1 สร้าง Certificate Definition

```typescript
// Seed script: prisma/seed-certificates.ts
import prisma from '../src/lib/prisma'

async function seedCertificates() {
  const courses = await prisma.course.findMany()
  
  for (const course of courses) {
    await prisma.courseCertificateDefinition.upsert({
      where: { courseId: course.id },
      update: {},
      create: {
        courseId: course.id,
        templateHtml: `
          <!DOCTYPE html>
          <html>
          <head><title>Certificate</title></head>
          <body>
            <h1>Certificate of Completion</h1>
            <p>This certifies that</p>
            <h2>{{recipientName}}</h2>
            <p>has successfully completed</p>
            <h3>{{courseName}}</h3>
            <p>Issued: {{issueDate}}</p>
            <p>Verification: {{verificationCode}}</p>
          </body>
          </html>
        `,
        issuerName: 'SkillNexus Academy',
        issuerTitle: 'Learning Management System',
        expiryMonths: null, // Never expires
        isActive: true
      }
    })
  }
  
  console.log('✅ Certificate templates created')
}

seedCertificates()
```

```bash
# Run seed
npx ts-node prisma/seed-certificates.ts
```

### ✅ 4.2 Test Certificate Generation

```bash
# Test issue certificate
curl -X POST http://localhost:3000/api/certificates/issue \
  -H "Content-Type: application/json" \
  -d '{"courseId":"course_123"}'

# Expected response:
# {
#   "success": true,
#   "certificate": {
#     "id": "cert_xyz",
#     "verificationCode": "ABC123XYZ789",
#     "pdfUrl": "https://..."
#   }
# }
```

---

## 📋 Phase 5: Final Testing (1 ชั่วโมง)

### ✅ 5.1 End-to-End Test Scenario

**Scenario: ผู้เรียนเรียนจนได้ Certificate**

1. [ ] **เริ่มเรียนคอร์ส**
   - สมัครเข้าคอร์ส
   - ดูบทเรียนที่ 1 (Video)
   - ✅ Progress = 10%

2. [ ] **เรียนต่อ**
   - ดูบทเรียนที่ 2-9 (Video + SCORM)
   - ทำ Quiz ผ่าน
   - ✅ Progress = 90%

3. [ ] **เข้าสอบ Final**
   - ตรวจสอบ eligibility
   - ✅ Eligible (progress 100%, quiz ผ่าน)
   - ทำข้อสอบ Final
   - ✅ ผ่าน (คะแนน 85%)

4. [ ] **ออกใบ Certificate**
   - Auto issue certificate
   - ✅ Download PDF ได้
   - ✅ แสดงใน Dashboard

5. [ ] **Verify Certificate**
   - เปิด URL `/verify/{code}`
   - ✅ แสดงข้อมูลถูกต้อง

### ✅ 5.2 Performance Test

```bash
# Load test (optional)
npm install -g artillery

# Create test.yml
artillery quick --count 10 --num 50 http://localhost:3000/api/courses/course_123/progress
```

---

## 📋 Phase 6: Production Deployment (2 ชั่วโมง)

### ✅ 6.1 Environment Variables

**`.env.production`:**

```env
# Database
DATABASE_URL="postgresql://..."

# App
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://yourdomain.com"

# Storage (for PDFs)
BLOB_READ_WRITE_TOKEN="..."

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_USER="..."
SMTP_PASS="..."
```

### ✅ 6.2 Build & Deploy

**Vercel:**

```bash
# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
```

**Self-hosted (Docker):**

```bash
# Build
npm run build

# Run production
npm start
```

### ✅ 6.3 Post-Deployment Checks

- [ ] ✅ Database connected
- [ ] ✅ APIs responding (test `/api/health`)
- [ ] ✅ Authentication working
- [ ] ✅ Video progress tracking
- [ ] ✅ SCORM player working
- [ ] ✅ Quiz submission
- [ ] ✅ Certificate download
- [ ] ✅ Email notifications (if enabled)

---

## 📋 Phase 7: Monitoring & Maintenance

### ✅ 7.1 Setup Monitoring

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: 'Database connection failed'
    }, { status: 500 })
  }
}
```

### ✅ 7.2 Error Logging

```typescript
// src/lib/logger.ts
export function logError(context: string, error: any) {
  console.error(`[${new Date().toISOString()}] ${context}:`, error)
  
  // Send to monitoring service (Sentry, etc.)
  // sentry.captureException(error)
}
```

### ✅ 7.3 Backup Strategy

```bash
# Database backup (daily cron)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Upload to S3/Google Cloud
aws s3 cp backup_*.sql s3://your-bucket/backups/
```

---

## 🎯 Quick Reference Checklist

### Must-Have Features

- [x] Video Progress Tracking (anti-skip)
- [x] SCORM 1.2/2004 Support
- [x] Quiz with Attempt Limits
- [x] Sequential Learning Path
- [x] Final Exam Gating
- [x] Auto Certificate Issuance
- [x] Student Dashboard
- [x] Public Verification

### Nice-to-Have Features

- [ ] Email Notifications (certificate issued)
- [ ] Leaderboard
- [ ] Peer Reviews
- [ ] Discussion Forum
- [ ] Mobile App
- [ ] Offline Mode

---

## 📞 Support & Resources

- **Documentation**: [LMS-COMPLETE-IMPLEMENTATION-GUIDE.md](./LMS-COMPLETE-IMPLEMENTATION-GUIDE.md)
- **API Reference**: [LMS-API-IMPLEMENTATION.md](./LMS-API-IMPLEMENTATION.md)
- **Database Schema**: [prisma/schema.prisma](./prisma/schema.prisma)

---

## 🚀 Deployment Timeline

| Phase | Time | Status |
|-------|------|--------|
| 1. Database Setup | 30 min | ⬜ |
| 2. API Implementation | 2 hr | ⬜ |
| 3. Frontend Integration | 3 hr | ⬜ |
| 4. Certificate Setup | 1 hr | ⬜ |
| 5. Testing | 1 hr | ⬜ |
| 6. Deployment | 2 hr | ⬜ |
| **Total** | **9.5 hr** | ⬜ |

**คุณสามารถ deploy ระบบ LMS ครบวงจรภายใน 1 วันทำการ!** ✨

---

**เอกสารนี้เป็น living document - อัพเดทเมื่อมีการเปลี่ยนแปลง**  
Last updated: {{ current_date }}
