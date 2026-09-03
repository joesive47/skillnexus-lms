# 🎓 AI Architect Course Setup

## ✅ ไฟล์พร้อมแล้ว

### SCORM Files (Copied to public/scorm/prompt-engineering/)
- ✅ index.html
- ✅ scorm_functions.js
- ✅ imsmanifest.xml

### Database Script
- ✅ scripts/seed-ai-architect-course.sql

## 🚀 วิธี Setup

### Option 1: ผ่าน Database (แนะนำ)
```sql
-- รัน SQL script นี้ใน database
-- ไฟล์: scripts/seed-ai-architect-course.sql
```

### Option 2: ผ่าน Admin Dashboard
1. Login as Admin
2. Courses → Create New Course
   - Title: AI Architect's Blueprint: จากไอเดียฟุ้งสู่ระบบจริงด้วย Amazon Q & VS Code
   - Price: 0 (Free)
   - Published: Yes

3. Add Lesson
   - Title: Prompt Engineering Practice
   - Type: SCORM
   - Order: 1

4. SCORM จะโหลดจาก: `/scorm/prompt-engineering/`

## 📦 Course Details

**Course ID:** ai-architect-001
**Lesson ID:** lesson-prompt-eng-001
**SCORM Package ID:** scorm-prompt-001

**URL:** http://localhost:3000/courses/ai-architect-001

## 🎯 Features
- Interactive Prompt Engineering Practice
- Real-time Scoring
- SCORM 1.2 Compliant
- Beautiful UI
- Mobile Responsive

## ✨ Ready to Deploy!
