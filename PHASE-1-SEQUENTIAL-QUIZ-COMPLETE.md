# 🎯 Phase 1: Sequential Quiz Dependency - Implementation Complete

## ✅ สิ่งที่ทำเสร็จแล้ว

### 1. Database Schema (Prisma)
**ไฟล์:** `prisma/schema.prisma`

เพิ่ม fields ใน Quiz model:
- ✅ `prerequisiteQuizId` - ID ของ Quiz ที่ต้องผ่านก่อน
- ✅ `retryDelayMinutes` - เวลารอก่อนสอบใหม่ (สำหรับ Phase 2)
- ✅ `prerequisiteQuiz` - Relation ไป Quiz ที่เป็นเงื่อนไข
- ✅ `dependentQuizzes` - Relation กลับมาจาก Quiz ที่ต้องรอ

### 2. API Route
**ไฟล์:** `src/app/api/quiz/[quizId]/check-prerequisite/route.ts`

Features:
- ✅ ตรวจสอบว่า Quiz มี prerequisite หรือไม่
- ✅ ดึงข้อมูล attempts ของ user จาก QuizAttemptRecord
- ✅ เช็คว่า user ผ่าน prerequisite quiz หรือยัง (passed = true)
- ✅ Return response พร้อมข้อมูล:
  - `canAccess`: true/false
  - `reason`: เหตุผลที่ล็อค
  - `prerequisiteQuiz`: ข้อมูล Quiz ที่ต้องทำก่อน
  - `message`: ข้อความแจ้งเตือน

### 3. UI Components

#### QuizLockStatus
**ไฟล์:** `src/components/quiz/quiz-lock-status.tsx`

Features:
- ✅ แสดงสถานะ Loading ขณะตรวจสอบ
- ✅ แสดงข้อความ "พร้อมทำแบบทดสอบ" (สีเขียว) ถ้าผ่านเงื่อนไข
- ✅ แสดงข้อความ "แบบทดสอบนี้ถูกล็อค" (สีเหลือง) ถ้ายังไม่ผ่าน
- ✅ แสดงชื่อ Quiz ที่ต้องทำก่อน
- ✅ แสดงคะแนนที่ต้องได้ vs คะแนนปัจจุบัน
- ✅ มีปุ่ม "ไปทำแบบทดสอบ" เพื่อไปทำ prerequisite quiz

#### QuizWithPrerequisiteCheck
**ไฟล์:** `src/components/quiz/quiz-with-prerequisite-check.tsx`

Features:
- ✅ Wrapper component ที่เช็ค prerequisite ก่อนแสดง Quiz
- ✅ แสดง QuizLockStatus ถ้ายังไม่ผ่านเงื่อนไข
- ✅ แสดง QuizComponent ถ้าผ่านเงื่อนไขแล้ว
- ✅ มีปุ่ม "ย้อนกลับ" เมื่อ Quiz ถูกล็อค

### 4. Quiz Page Integration
**ไฟล์:** `src/app/courses/[courseId]/lessons/[lessonId]/quiz/page.tsx`

Changes:
- ✅ ใช้ QuizWithPrerequisiteCheck แทน QuizComponent
- ✅ ดึง `passScore` และ `prerequisiteQuizId` จาก database
- ✅ ส่งข้อมูลไปให้ wrapper component ตรวจสอบ

---

## 🔧 ขั้นตอนที่ต้องทำต่อ (Manual Steps)

### Step 1: เปิด Docker Desktop
```bash
# เปิด Docker Desktop application
# รอจน Docker Engine พร้อมใช้งาน (สถานะเป็น Running)
```

### Step 2: Run Database Migration
```bash
npx prisma migrate dev --name add_quiz_prerequisite_and_retry_delay
```

คำสั่งนี้จะ:
1. สร้าง migration file
2. เพิ่ม columns ใหม่ใน database:
   - `prerequisite_quiz_id` (String, nullable)
   - `retry_delay_minutes` (Int, nullable)
3. เพิ่ม foreign key relation
4. เพิ่ม index สำหรับ `prerequisite_quiz_id`

### Step 3: Regenerate Prisma Client
```bash
npx prisma generate
```

คำสั่งนี้จะ update Prisma Client types ให้รู้จัก fields ใหม่

### Step 4: Restart Dev Server (ถ้ารันอยู่)
```bash
# กด Ctrl+C เพื่อหยุด
npm run dev
```

---

## 🧪 การทดสอบ Sequential Quiz Flow

### สถานการณ์ทดสอบที่ 1: ไม่มี Prerequisite
**Setup:**
1. สร้าง Course พร้อม Quiz A (prerequisiteQuizId = null)
2. Login ด้วย Student account

**Expected:**
- ✅ เข้าทำ Quiz A ได้เลย ไม่มีข้อความล็อค
- ✅ แสดง "พร้อมทำแบบทดสอบ"

---

### สถานการณ์ทดสอบที่ 2: มี Prerequisite แต่ยังไม่ทำ
**Setup:**
1. สร้าง Quiz A (passScore = 70%)
2. สร้าง Quiz B (prerequisiteQuizId = Quiz A.id)
3. Login ด้วย Student account
4. **ไม่ต้องทำ Quiz A**

**Expected:**
- ✅ เข้า Quiz B จะเห็น:
  - 🔒 "แบบทดสอบนี้ถูกล็อค"
  - 📋 "ต้องทำ 'Quiz A' ให้ผ่านก่อน (คะแนนขั้นต่ำ: 70%)"
  - ปุ่ม "ไปทำแบบทดสอบ" → พาไป Quiz A
- ✅ ไม่สามารถทำ Quiz B ได้

---

### สถานการณ์ทดสอบที่ 3: ทำ Prerequisite แต่ไม่ผ่าน
**Setup:**
1. ต่อจากสถานการณ์ที่ 2
2. ทำ Quiz A ได้คะแนน 50% (ไม่ผ่าน)

**Expected:**
- ✅ เข้า Quiz B จะเห็น:
  - 🔒 "แบบทดสอบนี้ถูกล็อค"
  - ❌ "คะแนนสูงสุดของคุณ: 50% (ต้องเพิ่มอีก 20%)"
  - ปุ่ม "ไปทำแบบทดสอบ" → ให้ทำ Quiz A ใหม่
- ✅ ยังไม่สามารถทำ Quiz B ได้

---

### สถานการณ์ทดสอบที่ 4: ทำ Prerequisite ผ่านแล้ว
**Setup:**
1. ต่อจากสถานการณ์ที่ 3
2. ทำ Quiz A ใหม่ได้คะแนน 85% (ผ่าน)

**Expected:**
- ✅ เข้า Quiz B จะเห็น:
  - ✅ "พร้อมทำแบบทดสอบ"
  - "คุณผ่านแบบทดสอบ 'Quiz A' แล้ว (คะแนน: 85%)"
- ✅ สามารถทำ Quiz B ได้ทันที

---

### สถานการณ์ทดสอบที่ 5: Sequential 3 Quiz
**Setup:**
1. สร้าง Quiz A (no prerequisite)
2. สร้าง Quiz B (prerequisite = Quiz A, passScore = 70%)
3. สร้าง Quiz C (prerequisite = Quiz B, passScore = 80%)

**Expected:**
- ✅ ทำ Quiz A ผ่าน → Quiz B ปลดล็อค
- ✅ ทำ Quiz B ผ่าน → Quiz C ปลดล็อค
- ✅ ถ้าทำ Quiz B ไม่ผ่าน → Quiz C ยังล็อคอยู่

---

## 🎯 Admin: วิธีตั้ง Prerequisite ให้ Quiz

### ใน Admin Dashboard (ถ้ามี UI สำหรับสร้าง Quiz)
1. ไปที่ Quiz Management
2. Edit Quiz ที่ต้องการตั้ง prerequisite
3. เลือก "Prerequisite Quiz" จาก dropdown
4. บันทึก

### ผ่าน Database (ชั่วคราว)
```sql
-- ตั้งให้ Quiz B ต้องทำ Quiz A ก่อน
UPDATE quizzes 
SET prerequisite_quiz_id = '<Quiz A ID>' 
WHERE id = '<Quiz B ID>';

-- ตรวจสอบ
SELECT id, title, prerequisite_quiz_id, pass_score 
FROM quizzes 
WHERE id = '<Quiz B ID>';
```

---

## 📊 Database Schema (Reference)

```prisma
model Quiz {
  id                  String              @id @default(cuid())
  title               String
  passScore           Int                 @default(70)
  prerequisiteQuizId  String?             // 🆕 NEW
  retryDelayMinutes   Int?                @default(0) // 🆕 NEW (Phase 2)
  
  prerequisiteQuiz    Quiz?               @relation("QuizPrerequisite", fields: [prerequisiteQuizId], references: [id])
  dependentQuizzes    Quiz[]              @relation("QuizPrerequisite")
  
  attemptRecords      QuizAttemptRecord[]
  // ... other fields
}

model QuizAttemptRecord {
  id             String   @id @default(cuid())
  userId         String
  quizId         String
  score          Float
  passed         Boolean  // 🔥 IMPORTANT: ใช้ field นี้เช็คว่าผ่านหรือไม่
  submittedAt    DateTime
  // ... other fields
}
```

---

## 🔍 Troubleshooting

### ❌ TypeScript Error: "Property 'prerequisiteQuizId' does not exist"
**สาเหตุ:** Prisma Client ยังไม่ได้ regenerate หลัง schema เปลี่ยน

**แก้ไข:**
```bash
npx prisma generate
```

### ❌ Database Error: "Column doesn't exist"
**สาเหตุ:** ยังไม่ได้ run migration

**แก้ไข:**
```bash
npx prisma migrate dev --name add_quiz_prerequisite
```

### ❌ "Can't reach database server"
**สาเหตุ:** Docker Desktop ไม่ทำงาน

**แก้ไข:**
1. เปิด Docker Desktop
2. รอจน status เป็น "Running"
3. ลอง `docker ps` ดู container

### ❌ Quiz B ยังล็อคอยู่ทั้งที่ทำ Quiz A ผ่านแล้ว
**ตรวจสอบ:**
1. เช็คว่า QuizAttemptRecord.passed = true หรือยัง
```sql
SELECT * FROM quiz_attempt_records 
WHERE user_id = '<user ID>' 
AND quiz_id = '<Quiz A ID>'
ORDER BY submitted_at DESC;
```

2. เช็คว่า score >= passScore หรือไม่
3. Hard refresh browser (Ctrl+Shift+R)

---

## 🚀 Next Steps

Phase 1 เสร็จสมบูรณ์แล้ว! พร้อมไปต่อ Phase 2:

### Phase 2: Re-attempt with Cooldown
- เพิ่ม Countdown Timer ถ้าสอบไม่ผ่าน
- เช็คจาก QuizAttemptRecord.submittedAt + retryDelayMinutes
- UI แสดง "กรุณารออีก X นาที Y วินาที"

---

## 📝 Summary

**Phase 1 Status:** ✅ COMPLETE (โค้ดพร้อม, รอ migration)

**Files Changed:**
1. ✅ `prisma/schema.prisma` - เพิ่ม prerequisiteQuizId
2. ✅ `src/app/api/quiz/[quizId]/check-prerequisite/route.ts` - API route ใหม่
3. ✅ `src/components/quiz/quiz-lock-status.tsx` - Component ใหม่
4. ✅ `src/components/quiz/quiz-with-prerequisite-check.tsx` - Wrapper component
5. ✅ `src/app/courses/[courseId]/lessons/[lessonId]/quiz/page.tsx` - Integration

**Manual Steps Required:**
1. ⏳ เปิด Docker Desktop
2. ⏳ Run `npx prisma migrate dev`
3. ⏳ Run `npx prisma generate`
4. ⏳ ทดสอบตามสถานการณ์ด้านบน

---

**สร้างโดย:** AI Assistant  
**วันที่:** February 15, 2026  
**Phase:** 1/6 - Sequential Quiz Dependency
