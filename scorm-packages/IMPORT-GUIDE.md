# 📦 SCORM Packages - Ready to Import

## 🎓 Available Courses

### 1. AI Architect's Blueprint
**File:** `ai-architect-blueprint.zip`  
**Path:** `/public/uploads/scorm/ai-architect-blueprint.zip`  
**Size:** ~100KB  
**Duration:** 45 minutes  
**Modules:** 5 (4 lessons + 1 assessment)

### 2. Prompt Engineering
**File:** `prompt-engineering.zip`  
**Path:** `/public/uploads/scorm/prompt-engineering.zip`  
**Size:** ~80KB  
**Duration:** 30 minutes  
**Modules:** 4 (3 lessons + 1 quiz)

## 🚀 How to Import

### Method 1: Via Admin Dashboard (Recommended)

1. **Login as Admin**
   ```
   http://localhost:3000/login
   Email: admin@skillnexus.com
   Password: Admin@123!
   ```

2. **Go to Courses**
   ```
   http://localhost:3000/dashboard/admin
   Click "Courses" → "Create Course"
   ```

3. **Create Course**
   ```
   Title: AI Architect's Blueprint
   Description: จากไอเดียฟุ้งสู่ระบบจริงด้วย Amazon Q & VS Code
   Price: 0 (Free) or set price
   Published: ✓
   ```

4. **Add SCORM Lesson**
   ```
   Click "Add Lesson"
   Type: SCORM Package
   Upload: Select ai-architect-blueprint.zip
   Save
   ```

5. **Test**
   ```
   Go to course page
   Click "Start Learning"
   Complete all modules
   ```

### Method 2: Direct File Access

**Files are located at:**
```
C:\API\The-SkillNexus\public\uploads\scorm\
├── ai-architect-blueprint.zip
└── prompt-engineering.zip
```

**Or via URL (after deploy):**
```
https://uppowerskill.com/uploads/scorm/ai-architect-blueprint.zip
https://uppowerskill.com/uploads/scorm/prompt-engineering.zip
```

## 📊 Course Details

### AI Architect's Blueprint

**Modules:**
1. Module 1: รู้จัก Amazon Q Developer (10 min)
2. Module 2: Setup VS Code + Amazon Q (10 min)
3. Module 3: สร้างระบบจริงด้วย AI (15 min)
4. Module 4: Best Practices (10 min)
5. Assessment: 8 questions (10 min)

**Learning Outcomes:**
- ✅ เข้าใจ Amazon Q Developer
- ✅ Setup และใช้งาน VS Code + Amazon Q
- ✅ สร้าง REST API ด้วย AI
- ✅ เรียนรู้ Best Practices
- ✅ ผ่านการทดสอบ (80%+)

### Prompt Engineering

**Modules:**
1. Lesson 1: Introduction (5 min)
2. Lesson 2: Basic Techniques (10 min)
3. Lesson 3: Advanced Strategies (10 min)
4. Quiz: 5 questions (5 min)

**Learning Outcomes:**
- ✅ เข้าใจ Prompt Engineering
- ✅ ใช้เทคนิค Zero-Shot, Few-Shot, CoT
- ✅ เรียนรู้กลยุทธ์ขั้นสูง
- ✅ ผ่านการทดสอบ (70%+)

## 🔧 Troubleshooting

### ปัญหา: ไม่สามารถอัพโหลดได้
**แก้ไข:**
- ตรวจสอบขนาดไฟล์ (ต้องไม่เกิน 50MB)
- ตรวจสอบว่าโฟลเดอร์ `/public/uploads/scorm/` มีสิทธิ์เขียน

### ปัญหา: SCORM ไม่ทำงาน
**แก้ไข:**
- ตรวจสอบว่า LMS รองรับ SCORM 2004
- เปิด Browser Console ดู error
- ตรวจสอบ imsmanifest.xml

### ปัญหา: คะแนนไม่บันทึก
**แก้ไข:**
- ตรวจสอบ SCORM API connection
- ดู Console logs
- ตรวจสอบ Database

## 📝 Notes

- ✅ ไฟล์ ZIP พร้อมใช้งาน
- ✅ SCORM 2004 4th Edition
- ✅ รองรับ Desktop, Tablet, Mobile
- ✅ มี Progress Tracking
- ✅ มี Score Tracking
- ✅ Auto Certificate (คะแนนผ่าน)

## 🎯 Next Steps

1. Import courses ตามคู่มือข้างต้น
2. ทดสอบการเรียนรู้
3. ตรวจสอบ Progress & Score
4. Deploy to production
5. Share with students!

---

**Support:** support@uppowerskill.com  
**Docs:** https://github.com/joesive47/skillnexus-lms
