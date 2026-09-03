# 🎯 LMS Enhancement - Quick Reference

## ⚡ Quick Start (3 นาที)

```powershell
# 1-Click Setup
.\quick-setup-lms.ps1

# หรือแบบ manual
npx prisma generate
npx prisma migrate dev --name add_notifications
npm run db:seed:lms
npm run dev
```

---

## 🔑 Test Accounts

```
Student: student@test.com / password123
Teacher: teacher@test.com / password123
Admin:   admin@test.com / password123
```

---

## 📍 Important URLs

```
Homepage:     http://localhost:3000
Analytics:    http://localhost:3000/dashboard/analytics
Notifications: Click bell icon in navbar (🔔)
```

---

## 🔔 Notification API

### Get Notifications
```typescript
GET /api/notifications?unreadOnly=true&limit=20
```

### Create Notification
```typescript
POST /api/notifications
{
  "userId": "user-id",
  "type": "CERTIFICATE_ISSUED",
  "title": "ได้รับใบประกาศนียบัตร",
  "message": "ยินดีด้วย!",
  "actionUrl": "/certificates/123"
}
```

### Mark as Read
```typescript
PATCH /api/notifications
{ "notificationIds": ["id1", "id2"] }
// or
{ "markAllAsRead": true }
```

---

## 🛠️ Notification Service

```typescript
import { notificationService } from '@/lib/notification-service'

// Quick templates
await notificationService.notifyCourseEnrolled(userId, courseName, courseId)
await notificationService.notifyLessonCompleted(userId, lessonTitle, courseId)
await notificationService.notifyQuizPassed(userId, quizTitle, score, courseId)
await notificationService.notifyQuizFailed(userId, quizTitle, score, courseId)
await notificationService.notifyCertificateIssued(userId, courseName, verificationCode, certId)
await notificationService.notifyAchievementUnlocked(userId, name, description, xpReward)
await notificationService.notifyCourseCompleted(userId, courseName, courseId)
await notificationService.notifyFinalExamAvailable(userId, courseName, courseId)

// Custom notification
await notificationService.send({
  userId: 'user-id',
  type: 'SYSTEM',
  title: 'Custom Title',
  message: 'Custom Message',
  actionUrl: '/custom',
  metadata: { key: 'value' }
})

// Cleanup old notifications
await notificationService.cleanupOldNotifications(30) // 30 days
```

---

## 📊 Analytics API

### Admin/Teacher Dashboard
```typescript
GET /api/analytics/overview?period=7
// Returns: users, courses, enrollments, quizzes, certificates, trends
```

### Student Dashboard
```typescript
GET /api/analytics/user
// Returns: stats, courses progress, learning time, quiz performance
```

---

## 🎨 UI Components

### Add Notification Bell
```tsx
import { NotificationBell } from '@/components/NotificationBell'

<NotificationBell />
```

### Add Analytics Dashboard
```tsx
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'

<AnalyticsDashboard userRole={session.user.role} />
```

---

## 📦 Seed Data

### What's Created:
- 3 Users (Student, Teacher, Admin)
- 1 Course with 6 Lessons
- 15 Quiz Questions
- Learning Path (Nodes + Dependencies)
- Certificate Template
- 4 Achievements
- 3 Daily Missions

### Run Seed:
```powershell
npm run db:seed:lms
```

---

## 🗄️ Database Schema

```prisma
model Notification {
  id        String    @id @default(cuid())
  userId    String
  type      String
  title     String
  message   String    @db.Text
  actionUrl String?
  metadata  String?   @db.Text
  isRead    Boolean   @default(false)
  readAt    DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  user      User      @relation(...)
}
```

---

## 🐛 Troubleshooting

### Migration Failed?
```powershell
npx prisma db push
npx prisma generate
```

### Seed Failed?
```powershell
# Check if database is accessible
npx prisma db push

# Try seed again
npm run db:seed:lms
```

### NotificationBell not showing?
```tsx
// Make sure to import in your layout/navbar
import { NotificationBell } from '@/components/NotificationBell'
```

### Analytics page 404?
```powershell
# Make sure file exists at:
src/app/dashboard/analytics/page.tsx
```

---

## 📝 Quick Commands

```powershell
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run start              # Start production server

# Database
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Run migrations
npx prisma db push         # Push schema changes
npx prisma generate        # Generate Prisma Client

# Testing
npm run db:seed:lms        # Seed test data
npm run test               # Run tests
```

---

## 📚 Full Documentation

- **Complete Guide:** [NOTIFICATION-ANALYTICS-GUIDE.md](NOTIFICATION-ANALYTICS-GUIDE.md)
- **Summary:** [LMS-ENHANCEMENT-SUMMARY.md](LMS-ENHANCEMENT-SUMMARY.md)
- **Original LMS Docs:**
  - [LMS-COMPLETE-IMPLEMENTATION-GUIDE.md](LMS-COMPLETE-IMPLEMENTATION-GUIDE.md)
  - [LMS-API-IMPLEMENTATION.md](LMS-API-IMPLEMENTATION.md)
  - [LMS-QUICK-DEPLOYMENT-CHECKLIST.md](LMS-QUICK-DEPLOYMENT-CHECKLIST.md)

---

## ✅ Quick Checklist

- [ ] Run `quick-setup-lms.ps1`
- [ ] Add `<NotificationBell />` to navbar
- [ ] Test login with student@test.com
- [ ] Visit `/dashboard/analytics`
- [ ] Check notification bell works
- [ ] Verify analytics data shows
- [ ] Review complete documentation

---

## 🆘 Need Help?

Check the full documentation files for detailed explanations, examples, and troubleshooting guides.

Happy coding! 🚀
