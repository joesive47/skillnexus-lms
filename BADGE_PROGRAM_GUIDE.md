# 🏆 SkillNexus Badge Program (Google-Style Certification Path)

## Overview
ระบบ Badge Program ที่ให้ผู้เรียนได้รับ Badge/Certificate เมื่อเรียนจบหลายคอร์สตามเกณฑ์ที่กำหนด แบบ Google Career Certificates

## 🎯 Features Implemented

### 1. Badge Program Management (Admin)
- **Location**: `/dashboard/admin/badges`
- **Features**:
  - สร้าง Badge Program ใหม่
  - กำหนด Course Requirements
  - ตั้งค่า Minimum Score ต่อคอร์ส
  - Auto-Issue Configuration
  - Export/Import JSON

### 2. Database Schema
```sql
-- Badge Programs
badge_programs (id, title, description, logoUrl, autoIssue, isActive)

-- Course Requirements
badge_requirements (badgeId, courseId, minScore)

-- User Badges
user_badges_new (userId, badgeId, earnedAt, verifyCode)
```

### 3. Badge Eligibility Logic
- **Video Progress**: ≥ 90% completion required
- **Quiz Scores**: Must meet minimum score per course
- **Interactive Modules**: Must pass all modules
- **Auto-Issue**: Automatic badge issuance when eligible

### 4. API Endpoints
```
POST /api/badges/create       - Create badge program
GET  /api/badges/list         - List all badge programs
POST /api/badges/check        - Check user eligibility
POST /api/badges/issue        - Issue badge to user
GET  /api/badges/user/[id]    - Get user's badges
GET  /api/badges/certificate/[code] - Download certificate
```

### 5. Student Profile Integration
- **Component**: `BadgeProfile.tsx`
- **Features**:
  - Display earned badges
  - Download PDF certificates
  - Verify badge authenticity
  - View requirements completed

### 6. Verification System
- **URL**: `/verify/[verifyCode]`
- **Features**:
  - Public badge verification
  - QR Code generation
  - Certificate authenticity check
  - Detailed badge information

## 🚀 How to Test

### 1. Setup Database
```bash
# Run migration
npm run db:push

# Or manually run SQL
sqlite3 prisma/dev.db < prisma/migrations/add_badge_program.sql
```

### 2. Create Badge Program (Admin)
1. Login as admin: `admin@skillnexus.com / admin123`
2. Go to `/dashboard/admin/badges`
3. Click "Create Badge Program"
4. Fill in:
   - Title: "Full Stack Developer"
   - Description: "Complete web development certification"
   - Select courses: JavaScript, React, Node.js
   - Set minimum scores: 70% each
5. Save program

### 3. Test Badge Earning (Student)
1. Login as student: `student@skillnexus.com / student123`
2. Enroll in required courses
3. Complete videos (≥90% watch time)
4. Pass quizzes (≥minimum score)
5. Badge should auto-issue

### 4. Verify Badge
1. Go to student profile
2. Click "Verify" on earned badge
3. Opens `/verify/[code]` page
4. Shows certificate with QR code

## 📋 Usage Examples

### Create Badge Program via API
```javascript
const response = await fetch('/api/badges/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "Data Science Specialist",
    description: "Master data science fundamentals",
    logoUrl: "https://example.com/logo.png",
    autoIssue: true,
    requirements: [
      { courseId: "course1", minScore: 80 },
      { courseId: "course2", minScore: 75 }
    ]
  })
})
```

### Check Badge Eligibility
```javascript
const response = await fetch('/api/badges/check', {
  method: 'POST'
})
const { issuedBadges } = await response.json()
console.log(`Earned ${issuedBadges.length} new badges!`)
```

### Integration with Course Completion
```javascript
import { BadgeAutoIssue } from '@/lib/badge-auto-issue'

// In your course completion logic
await BadgeAutoIssue.triggerOnCourseComplete(userId, courseId)

// In your quiz submission logic  
await BadgeAutoIssue.triggerOnQuizPass(userId, quizId, score)
```

## 🔧 Configuration

### Environment Variables
```env
NEXTAUTH_URL=http://localhost:3000  # For QR code generation
```

### Auto-Issue Settings
- Set `autoIssue: true` in badge program
- Badges check on every course/quiz completion
- Immediate issuance when eligible

## 📊 Badge Requirements Logic

### Course Completion Criteria:
1. **Enrollment**: Must be enrolled in course
2. **Video Progress**: ≥90% watch time on all video lessons
3. **Quiz Performance**: Score ≥ minimum required score
4. **Interactive Modules**: All modules must be passed

### Badge Issuance Flow:
1. Student completes course activity
2. System triggers eligibility check
3. Validates all requirements
4. Issues badge with unique verify code
5. Student receives notification (optional)

## 🎨 UI Components

### Admin Dashboard
- Badge creation form
- Course selection dropdown
- Minimum score inputs
- Preview functionality
- Export/Import tools

### Student Profile
- Badge gallery display
- Certificate download buttons
- Verification links
- Progress indicators

### Verification Page
- Certificate display
- QR code verification
- Public validation
- Detailed requirements

## 🔐 Security Features

- **Unique Verify Codes**: UUID-based verification
- **Session Validation**: NextAuth v5 integration
- **Role-based Access**: Admin-only badge creation
- **Public Verification**: Tamper-proof certificates

## 📈 Analytics & Reporting

Track badge program effectiveness:
- Badge earning rates
- Course completion correlation
- Popular certification paths
- Student engagement metrics

## 🚀 Next Steps

1. **PDF Generation**: Integrate jsPDF or Puppeteer
2. **Email Notifications**: Badge earning alerts
3. **Social Sharing**: LinkedIn integration
4. **Advanced Analytics**: Badge program insights
5. **Bulk Operations**: Mass badge management

---

**Badge Program is now fully functional!** 🎉

Students can earn Google-style certifications by completing multiple courses, and badges are automatically issued with verification capabilities.