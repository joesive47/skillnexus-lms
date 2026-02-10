# 📚 ระบบบันทึกความก้าวหน้าและออกใบรับรอง

## ✅ สิ่งที่เพิ่มเข้ามาใหม่

### 1. API Endpoints

#### 📝 บันทึกความก้าวหน้าบทเรียน
```
POST /api/courses/{courseId}/lessons/{lessonId}/complete
GET  /api/courses/{courseId}/lessons/{lessonId}/complete
```

**Request Body (POST):**
```json
{
  "watchTime": 450,
  "totalTime": 600,
  "completed": false
}
```

**Response:**
```json
{
  "success": true,
  "watchHistory": { ... },
  "courseComplete": false,
  "message": "✅ บันทึกความก้าวหน้าสำเร็จ"
}
```

**พิเศษ:** ถ้าเป็นสอบไฟนอลและผ่าน จะออกใบรับรองอัตโนมัติ!
```json
{
  "success": true,
  "watchHistory": { ... },
  "courseComplete": true,
  "certificate": {
    "id": "cert_xxx",
    "verificationCode": "CERT-2024-XXX",
    "issueDate": "2024-02-11T..."
  },
  "message": "🎉 ยินดีด้วย! คุณผ่านสอบไฟนอลและจบคอร์สแล้ว"
}
```

---

#### 🎓 จบคอร์สและออกใบรับรอง
```
POST /api/courses/{courseId}/complete
GET  /api/courses/{courseId}/complete
```

**Response (POST):**
```json
{
  "success": true,
  "courseComplete": true,
  "progress": {
    "totalLessons": 20,
    "completedLessons": 20,
    "percentage": 100,
    "isComplete": true,
    "finalExamCompleted": true
  },
  "certificate": {
    "id": "cert_xxx",
    "verificationCode": "CERT-2024-XXX",
    "issueDate": "2024-02-11T...",
    "course": {
      "title": "AI Automation Mastery"
    }
  },
  "message": "🎉 ยินดีด้วย! คุณจบคอร์สนี้แล้ว"
}
```

---

#### 📊 ตรวจสอบความก้าวหน้าคอร์ส
```
GET /api/courses/{courseId}/progress
```

**Response:**
```json
{
  "progress": {
    "completedLessons": 18,
    "totalLessons": 20,
    "percentage": 90,
    "isComplete": false
  },
  "lessons": [
    {
      "id": "lesson_1",
      "title": "Introduction to AI",
      "type": "VIDEO",
      "isFinalExam": false,
      "completed": true,
      "progressPercent": 100
    },
    ...
  ],
  "finalExam": {
    "id": "lesson_20",
    "title": "Final Assessment",
    "completed": false,
    "passed": false
  },
  "certificate": null,
  "canIssueCertificate": false
}
```

---

### 2. Helper Functions

ไฟล์: `src/lib/course-progress.ts`

#### ✅ บันทึกความก้าวหน้า
```typescript
import { updateLessonProgress } from '@/lib/course-progress'

const result = await updateLessonProgress(courseId, lessonId, {
  watchTime: 450,
  totalTime: 600,
  completed: false
})

if (result.courseComplete) {
  console.log('🎉 ได้ใบรับรองแล้ว!', result.certificate)
}
```

#### 📊 ดูความก้าวหน้า
```typescript
import { getCourseProgress } from '@/lib/course-progress'

const data = await getCourseProgress(courseId)
console.log(`Progress: ${data.progress.percentage}%`)
console.log(`Completed: ${data.progress.completedLessons}/${data.progress.totalLessons}`)

if (data.canIssueCertificate) {
  // แสดงปุ่มขอใบรับรอง
}
```

#### ⚡ Auto-save (บันทึกอัตโนมัติ)
```typescript
import { useAutoSaveProgress } from '@/lib/course-progress'

// In your video player component
useEffect(() => {
  const cleanup = useAutoSaveProgress(
    courseId,
    lessonId,
    () => ({
      watchTime: videoRef.current.currentTime,
      totalTime: videoRef.current.duration,
      completed: false
    })
  )

  return cleanup // Clean up on unmount
}, [courseId, lessonId])
```

#### ✔️ Mark Complete
```typescript
import { markLessonComplete } from '@/lib/course-progress'

// เมื่อทำแบบทดสอบเสร็จ หรือดูวิดีโอจบ
await markLessonComplete(courseId, lessonId, videoDuration)
```

---

## 🎯 การใช้งานในส่วนต่างๆ

### 1. Video Player Component

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { useAutoSaveProgress, markLessonComplete } from '@/lib/course-progress'

export default function VideoPlayer({ courseId, lessonId, videoUrl }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Auto-save progress every 30 seconds
  useEffect(() => {
    const cleanup = useAutoSaveProgress(
      courseId,
      lessonId,
      () => ({
        watchTime: videoRef.current?.currentTime || 0,
        totalTime: videoRef.current?.duration || 0,
        completed: false
      })
    )

    return cleanup
  }, [courseId, lessonId])

  // Mark complete when video ends
  const handleVideoEnded = async () => {
    await markLessonComplete(
      courseId,
      lessonId,
      videoRef.current?.duration
    )
  }

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      onEnded={handleVideoEnded}
      controls
    />
  )
}
```

---

### 2. Course Progress Page

```tsx
'use client'

import { useEffect, useState } from 'react'
import { getCourseProgress, completeCourse } from '@/lib/course-progress'

export default function CourseProgressPage({ courseId }: Props) {
  const [data, setData] = useState(null)

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = async () => {
    const result = await getCourseProgress(courseId)
    setData(result)
  }

  const handleGetCertificate = async () => {
    const result = await completeCourse(courseId)
    
    if (result.certificate) {
      alert('🎉 ยินดีด้วย! คุณได้รับใบรับรองแล้ว')
      loadProgress() // Reload
    }
  }

  if (!data) return <div>Loading...</div>

  return (
    <div>
      <h1>ความก้าวหน้าของคุณ</h1>
      
      <div className="progress-bar">
        <div style={{ width: `${data.progress.percentage}%` }} />
      </div>
      
      <p>{data.progress.completedLessons} / {data.progress.totalLessons} บทเรียน</p>

      {data.finalExam && (
        <div>
          <h2>สอบไฟนอล</h2>
          <p>{data.finalExam.passed ? '✅ ผ่าน' : '❌ ยังไม่ผ่าน'}</p>
        </div>
      )}

      {data.canIssueCertificate && (
        <button onClick={handleGetCertificate}>
          🎓 รับใบรับรอง
        </button>
      )}

      {data.certificate && (
        <div>
          <h2>ใบรับรองของคุณ</h2>
          <p>รหัส: {data.certificate.verificationCode}</p>
          <a href={`/certificates/${data.certificate.id}`}>ดูใบรับรอง</a>
        </div>
      )}
    </div>
  )
}
```

---

### 3. Quiz/Exam Component

```tsx
'use client'

import { markLessonComplete } from '@/lib/course-progress'

export default function QuizComponent({ courseId, lessonId, isFinalExam }: Props) {
  const handleQuizComplete = async (score: number, passed: boolean) => {
    if (passed) {
      const result = await markLessonComplete(courseId, lessonId)
      
      if (isFinalExam && result.courseComplete) {
        // แสดง popup certificate
        showCertificateModal(result.certificate)
      }
    }
  }

  return (
    <div>
      {/* Quiz UI */}
    </div>
  )
}
```

---

## 🔄 Flow การทำงาน

### Flow 1: เรียนบทเรียนปกติ
```
1. เปิดบทเรียน
   ↓
2. Video Player เริ่มเล่น
   ↓
3. Auto-save ทุก 30 วินาที (watchTime, totalTime)
   ↓
4. ดูจบ (watchTime = totalTime)
   ↓
5. Mark as completed
   ↓
6. บันทึก WatchHistory
```

### Flow 2: สอบไฟนอลและได้ใบรับรอง
```
1. เปิดสอบไฟนอล (isFinalExam = true)
   ↓
2. ทำข้อสอบ
   ↓
3. ส่งคำตอบและผ่าน
   ↓
4. POST /api/courses/{id}/lessons/{id}/complete
   ↓
5. ตรวจสอบ: isFinalExam && completed
   ↓
6. คำนวณ course progress
   ↓
7. ถ้า 100% → ออกใบรับรองอัตโนมัติ
   ↓
8. Return certificate + success message
```

### Flow 3: ขอใบรับรองด้วยตัวเอง
```
1. ไปที่หน้า Course Progress
   ↓
2. ตรวจสอบ canIssueCertificate
   ↓
3. คลิก "รับใบรับรอง"
   ↓
4. POST /api/courses/{id}/complete
   ↓
5. ตรวจสอบเงื่อนไข:
   - เรียนครบทุกบท
   - สอบไฟนอลผ่าน
   ↓
6. ออกใบรับรอง
   ↓
7. แสดงใบรับรอง
```

---

## 📋 Database Schema

### WatchHistory (ความก้าวหน้าบทเรียน)
```prisma
model WatchHistory {
  id        String   @id @default(cuid())
  userId    String
  lessonId  String
  watchTime Float    @default(0)    // เวลาที่ดูไปแล้ว (วินาที)
  totalTime Float    @default(0)    // เวลารวมทั้งหมด (วินาที)
  completed Boolean  @default(false) // จบหรือยัง
  updatedAt DateTime @updatedAt
  
  @@unique([userId, lessonId])
}
```

### CourseCertificate (ใบรับรองคอร์ส)
```prisma
model CourseCertificate {
  id               String   @id @default(cuid())
  userId           String
  courseId         String
  verificationCode String   @unique @default(cuid())
  issueDate        DateTime @default(now())
  expiryDate       DateTime?
  status           String   @default("ACTIVE")
  pdfUrl           String?
  
  @@unique([userId, courseId])
}
```

---

## ✅ Checklist การนำไปใช้

### Backend
- [x] API: Complete Lesson
- [x] API: Complete Course
- [x] API: Get Progress
- [x] Helper Functions
- [x] Auto Certificate Issuance

### Frontend (ต้องทำต่อ)
- [ ] Video Player Integration
- [ ] Quiz/Exam Integration
- [ ] Course Progress Page
- [ ] Certificate Display Page
- [ ] Progress Bar Component
- [ ] Notification when complete

---

## 🧪 ทดสอบ

### 1. ทดสอบบันทึกความก้าวหน้า
```bash
curl -X POST http://localhost:3000/api/courses/COURSE_ID/lessons/LESSON_ID/complete \
  -H "Content-Type: application/json" \
  -d '{"watchTime": 450, "totalTime": 600, "completed": false}'
```

### 2. ทดสอบขอใบรับรอง
```bash
curl -X POST http://localhost:3000/api/courses/COURSE_ID/complete \
  -H "Content-Type: application/json"
```

### 3. ทดสอบดูความก้าวหน้า
```bash
curl http://localhost:3000/api/courses/COURSE_ID/progress
```

---

## 🎯 ขั้นตอนถัดไป

1. **นำ Helper Functions ไปใช้ใน Components**
   - Video Player
   - Quiz Component
   - Course Page

2. **สร้างหน้า Certificate Display**
   - แสดงใบรับรอง
   - Download PDF
   - Verify Certificate

3. **เพิ่ม Notification**
   - เมื่อจบบทเรียน
   - เมื่อได้ใบรับรอง
   - เมื่อใกล้จบคอร์ส

4. **Deploy to Production**

---

**เอกสารนี้อธิบาย:** ระบบบันทึกความก้าวหน้าและออกใบรับรองอัตโนมัติ

**ไฟล์ที่เกี่ยวข้อง:**
- `src/app/api/courses/[courseId]/lessons/[lessonId]/complete/route.ts`
- `src/app/api/courses/[courseId]/complete/route.ts`
- `src/app/api/courses/[courseId]/progress/route.ts`
- `src/lib/course-progress.ts`
