# 🔧 SCORM "No Package Found" - แก้ปัญหา

## ❌ ปัญหา: "No SCORM package found"

เกิดจาก SCORM package ไม่ได้ถูกบันทึกใน database หรือ path ไม่ถูกต้อง

## ✅ วิธีแก้ไข

### วิธีที่ 1: ใช้ GitHub Release URL (แนะนำ)

1. **Upload SCORM ไปยัง GitHub Release** (ตามคู่มือ SCORM-GITHUB-RELEASE.md)

2. **สร้าง Lesson ใหม่:**
   - ไปที่ `/dashboard/teacher/courses/[courseId]`
   - คลิก "Add Lesson"
   - เลือก Type: **SCORM**
   - ใส่ URL จาก GitHub Release:
   ```
   https://github.com/joesive47/skillnexus-lms/releases/download/v1.0-scorm/ai-architect-blueprint.zip
   ```

3. **Save** - ระบบจะดาวน์โหลดและ extract อัตโนมัติ

---

### วิธีที่ 2: ใช้ External Hosting

**ตัวอย่าง URL ที่ใช้ได้:**

```
# Cloudflare R2
https://pub-xxxxx.r2.dev/scorm/ai-architect-blueprint.zip

# AWS S3
https://your-bucket.s3.amazonaws.com/scorm/ai-architect-blueprint.zip

# Supabase Storage
https://xxxxx.supabase.co/storage/v1/object/public/scorm/ai-architect-blueprint.zip
```

---

### วิธีที่ 3: ตรวจสอบ Database

```sql
-- ตรวจสอบว่า SCORM package ถูกบันทึกหรือยัง
SELECT * FROM scorm_packages WHERE lesson_id = 'YOUR_LESSON_ID';

-- ถ้าไม่มี ให้เพิ่มด้วยมือ
INSERT INTO scorm_packages (
  id, lesson_id, package_path, manifest, version, title
) VALUES (
  'scorm_xxx',
  'lesson_xxx',
  '/scorm/ai-architect-blueprint',
  '<?xml version="1.0"?>...',
  '2004',
  'AI Architect Blueprint'
);
```

---

## 🔍 Debug Steps

### 1. เช็ค Console (F12)
```javascript
// ดูว่ามี error อะไร
console.log('Package Path:', packagePath)
console.log('Lesson ID:', lessonId)
```

### 2. เช็ค Network Tab
- ดูว่า API call `/api/scorm/progress` ส่งค่าอะไร
- เช็คว่า SCORM files โหลดได้หรือไม่

### 3. เช็ค Database
```bash
npx prisma studio
# ดูที่ table: scorm_packages, lessons
```

---

## 📝 ตัวอย่างการสร้าง SCORM Lesson ที่ถูกต้อง

```typescript
// ใน Teacher Dashboard
const lesson = {
  title: "AI Architect Blueprint",
  type: "SCORM",
  courseId: "course_xxx",
  scormPackageUrl: "https://github.com/joesive47/skillnexus-lms/releases/download/v1.0-scorm/ai-architect-blueprint.zip"
}

// ระบบจะ:
// 1. ดาวน์โหลด ZIP
// 2. Extract ไฟล์
// 3. Parse imsmanifest.xml
// 4. บันทึกใน database
// 5. สร้าง SCORM player
```

---

## ✨ Quick Fix

ถ้าต้องการแก้ไขด่วน ให้:

1. **ลบ Lesson เดิม**
2. **สร้างใหม่** ด้วย GitHub Release URL
3. **ทดสอบ** โดยคลิกเข้าไปดู

---

## 🆘 ยังไม่ได้?

ส่งข้อมูลเหล่านี้มา:
- Lesson ID
- Course ID  
- SCORM Package URL ที่ใช้
- Screenshot ของ error
- Console log (F12)

จะช่วยแก้ไขให้ครับ! 🚀
