# Notification System & Analytics - Quick Start Guide

## 🎯 ภาพรวม

คู่มือนี้จะแนะนำการติดตั้งและใช้งาน 3 ระบบใหม่ที่เพิ่มเข้ามา:
1. **Seed Data System** - ข้อมูลทดสอบสำหรับทดลองระบบ
2. **Notification System** - ระบบแจ้งเตือนแบบ Real-time
3. **Analytics Dashboard** - Dashboard แสดงสถิติการเรียนรู้

---

## 📦 ส่วนที่ 1: Seed Data System

### ไฟล์ที่สร้าง:
- `prisma/seed-lms-testing.ts` - Script สร้างข้อมูลทดสอบ

### ข้อมูลที่จะถูกสร้าง:
✅ ผู้ใช้ 3 คน (Student, Teacher, Admin)  
✅ Course 1 คอร์ส พร้อม Module  
✅ Lesson 6 บทเรียน (Video 3, Quiz 1, SCORM 1, Final Exam 1)  
✅ Quiz Questions 15 ข้อ  
✅ Learning Nodes with Dependencies  
✅ Certificate Template  
✅ Achievements 4 รายการ  
✅ Daily Missions 3 รายการ  

### วิธีรัน Seed:

```powershell
# 1. Update package.json (เพิ่มใน scripts section)
"seed:lms": "tsx prisma/seed-lms-testing.ts"

# 2. ติดตั้ง tsx (ถ้ายังไม่มี)
npm install -D tsx

# 3. รัน seed script
npm run seed:lms
```

### Test Credentials ที่สร้างให้:

```
Student:  student@test.com / password123
Teacher:  teacher@test.com / password123
Admin:    admin@test.com / password123
```

---

## 🔔 ส่วนที่ 2: Notification System

### ไฟล์ที่สร้าง:
1. `src/app/api/notifications/route.ts` - API endpoints
2. `src/lib/notification-service.ts` - Service layer
3. `src/components/NotificationBell.tsx` - UI Component

### Database Schema (เพิ่มใน schema.prisma):

```prisma
model Notification {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type      String   // COURSE_ENROLLED, QUIZ_PASSED, CERTIFICATE_ISSUED, etc.
  title     String
  message   String   @db.Text
  actionUrl String?
  metadata  String?  @db.Text
  
  isRead    Boolean  @default(false)
  readAt    DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId, isRead])
  @@index([createdAt])
}

// Update User model (เพิ่ม relation)
model User {
  // ... existing fields ...
  notifications Notification[]
}
```

### Migration Command:

```powershell
npx prisma migrate dev --name add_notifications
npx prisma generate
```

### API Endpoints:

```typescript
// GET /api/notifications - ดึงการแจ้งเตือนของผู้ใช้
// Query params: ?unreadOnly=true&limit=20

// POST /api/notifications - สร้างการแจ้งเตือนใหม่
// Body: { userId, type, title, message, actionUrl, metadata }

// PATCH /api/notifications - Mark as read
// Body: { notificationIds: [...] } หรือ { markAllAsRead: true }
```

### การใช้งาน Notification Service:

```typescript
import { notificationService } from '@/lib/notification-service'

// ตัวอย่าง: แจ้งเตือนเมื่อได้ Certificate
await notificationService.notifyCertificateIssued(
  userId,
  'Web Development Bootcamp',
  'ABC123XYZ',
  certificateId
)

// ตัวอย่าง: แจ้งเตือนเมื่อสอบผ่าน
await notificationService.notifyQuizPassed(
  userId,
  'HTML Quiz',
  85,
  courseId
)

// แจ้งเตือนแบบ Custom
await notificationService.send({
  userId: 'user-id',
  type: 'SYSTEM',
  title: 'ระบบปิดปรับปรุง',
  message: 'จะปิดปรับปรุงวันที่ 15 ก.พ. 2567',
  actionUrl: '/announcements'
})
```

### เพิ่ม NotificationBell ในหน้า Layout:

```tsx
// src/app/layout.tsx หรือ Navbar component
import { NotificationBell } from '@/components/NotificationBell'

export default function Layout() {
  return (
    <nav>
      {/* ... existing nav items ... */}
      <NotificationBell />
    </nav>
  )
}
```

### ฟีเจอร์ของ NotificationBell:
✅ แสดงจำนวน unread notifications  
✅ Dropdown แสดงการแจ้งเตือน 10 รายการล่าสุด  
✅ Mark as read เมื่อคลิก  
✅ Mark all as read  
✅ Auto-refresh ทุก 30 วินาที  
✅ คลิกแล้วไปหน้า action URL  

---

## 📊 ส่วนที่ 3: Analytics Dashboard

### ไฟล์ที่สร้าง:
1. `src/app/api/analytics/overview/route.ts` - Admin/Teacher analytics
2. `src/app/api/analytics/user/route.ts` - Student analytics
3. `src/app/dashboard/analytics/page.tsx` - Dashboard page
4. `src/components/analytics/AnalyticsDashboard.tsx` - Dashboard component

### API Endpoints:

```typescript
// GET /api/analytics/overview - สำหรับ Admin/Teacher
// Query params: ?period=7 (7, 30, 90 days)
// Returns: {
//   overview: { users, courses, enrollments, learning, quizzes, certificates },
//   popularCourses: [...],
//   recentActivity: [...]
// }

// GET /api/analytics/user - สำหรับ Student
// Returns: {
//   stats: { enrollments, completedLessons, certificates, totalXP, ... },
//   coursesProgress: [...],
//   recentActivity: [...],
//   learningTime: { daily: [...], totalMinutes },
//   quizPerformance: [...]
// }
```

### Dashboard สำหรับ Admin/Teacher แสดง:
📈 Active Users  
📚 Published Courses  
📊 New Enrollments Trend  
🏆 Certificates Issued  
✅ Quiz Performance (Pass Rate)  
⭐ Popular Courses (Top 5)  
🕒 Recent Learning Activity  

### Dashboard สำหรับ Student แสดง:
📚 Courses Enrolled & Progress  
✅ Lessons Completed  
🏆 Certificates & Achievements  
📈 Total XP & Level  
📝 Quiz Performance  
⏱️ Learning Time (Last 7 days)  
🔥 Learning Streak  

### การเข้าถึง Dashboard:

```
URL: /dashboard/analytics

- Admin/Teacher จะเห็น Overview Dashboard
- Student จะเห็น Personal Learning Dashboard
```

### ตัวอย่างการใช้ใน Component:

```tsx
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'

export default function MyDashboard({ session }) {
  return (
    <AnalyticsDashboard userRole={session.user.role} />
  )
}
```

---

## 🚀 Quick Setup (Step by Step)

### 1️⃣ Update Database Schema:

เพิ่ม Notification model ใน `prisma/schema.prisma` ตามที่ระบุด้านบน

```powershell
npx prisma migrate dev --name add_notifications
npx prisma generate
```

### 2️⃣ Install Dependencies (ถ้าจำเป็น):

```powershell
npm install bcrypt lucide-react
npm install -D @types/bcrypt tsx
```

### 3️⃣ Update package.json:

```json
{
  "scripts": {
    "seed:lms": "tsx prisma/seed-lms-testing.ts"
  }
}
```

### 4️⃣ Run Seed Data:

```powershell
npm run seed:lms
```

### 5️⃣ Update Layout/Navbar:

เพิ่ม `<NotificationBell />` component ใน navbar

### 6️⃣ ทดสอบระบบ:

```powershell
# Start dev server
npm run dev

# เปิดเบราว์เซอร์
http://localhost:3000

# Login ด้วย test account
student@test.com / password123

# ทดสอบ features:
✅ เข้าหน้า /dashboard/analytics
✅ ดูการแจ้งเตือน (NotificationBell)
✅ เรียนบทเรียนที่ seed สร้างไว้
```

---

## 🔧 Integration with Existing Systems

### ตัวอย่าง: ส่งการแจ้งเตือนเมื่อ Complete Lesson

```typescript
// src/app/api/video/progress/route.ts
import { notificationService } from '@/lib/notification-service'

// หลังจาก save watch history แล้ว
if (isCompleted) {
  // Update progress
  await prisma.nodeProgress.update({ ... })
  
  // ส่งการแจ้งเตือน
  await notificationService.notifyLessonCompleted(
    userId,
    lesson.title,
    lesson.courseId
  )
}
```

### ตัวอย่าง: ส่งการแจ้งเตือนเมื่อออกใบ Certificate

```typescript
// src/app/api/certificates/issue/route.ts
import { notificationService } from '@/lib/notification-service'

const certificate = await prisma.courseCertificate.create({ ... })

// ส่งการแจ้งเตือน
await notificationService.notifyCertificateIssued(
  userId,
  course.title,
  verificationCode,
  certificate.id
)
```

---

## 📝 Best Practices

### Notification:
1. ส่งการแจ้งเตือนเฉพาะ action ที่สำคัญ (หลีกเลี่ยง spam)
2. ใช้ actionUrl เพื่อให้ user คลิกไปหน้าที่เกี่ยวข้อง
3. เก็บ metadata เป็น JSON สำหรับข้อมูลเพิ่มเติม
4. ทำ cleanup notification เก่าเป็นประจำ

```typescript
// Cleanup old notifications (เรียกใน cron job)
await notificationService.cleanupOldNotifications(30) // ลบที่อ่านแล้วเกิน 30 วัน
```

### Analytics:
1. ใช้ period parameter เพื่อกรองข้อมูล
2. Cache ผลลัพธ์ถ้าข้อมูลเยอะ
3. ใช้ parallel queries (Promise.all) เพื่อความเร็ว
4. เพิ่ม database index สำหรับ query ที่ใช้บ่อย

---

## 🎨 Customization

### Custom Notification Types:

```typescript
// เพิ่มใน notification-service.ts
async notifySystemMaintenance(userId: string, message: string) {
  return this.send({
    userId,
    type: 'SYSTEM',
    title: 'แจ้งปิดปรับปรุงระบบ',
    message,
    actionUrl: '/announcements',
    metadata: { maintenanceDate: new Date() }
  })
}
```

### Custom Analytics Metrics:

```typescript
// เพิ่มใน analytics API
const customMetric = await prisma.yourModel.aggregate({
  _sum: { yourField: true }
})
```

---

## ✅ Summary

คุณได้เพิ่ม 3 ระบบใหม่:

1. **Seed Data** → ข้อมูลทดสอบพร้อมใช้ (6 lessons, 15 questions, 3 users)
2. **Notifications** → ระบบแจ้งเตือนแบบ real-time พร้อม UI Component
3. **Analytics** → Dashboard สำหรับ Admin และ Student แสดงสถิติการเรียนรู้

พร้อมใช้งานเลย! 🚀
