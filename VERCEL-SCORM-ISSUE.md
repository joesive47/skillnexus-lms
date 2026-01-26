# 🚨 SCORM Upload บน Vercel ไม่รองรับ

## ปัญหา
Vercel ไม่รองรับ file system operations (fs.writeFile, fs.mkdir)
ทำให้ไม่สามารถ upload SCORM ZIP ได้

## ✅ วิธีแก้ (3 ทางเลือก)

### Option 1: ใช้ SCORM ที่มีอยู่แล้ว (แนะนำ)
```
SCORM files อยู่ใน: /public/scorm/prompt-engineering/
- index.html
- scorm_functions.js
- imsmanifest.xml

เรียก API: POST /api/seed/ai-architect
จะสร้างคอร์สที่ใช้ SCORM นี้อัตโนมัติ
```

### Option 2: ใช้ Vercel Blob Storage
```bash
npm install @vercel/blob
```

แก้ไข `scorm-service.ts` ให้ใช้ Vercel Blob แทน fs

### Option 3: ใช้ External Storage
- AWS S3
- Cloudinary
- DigitalOcean Spaces

## 🎯 วิธีที่ใช้ได้ตอนนี้

**1. เรียก API เพื่อสร้างคอร์ส:**
```
POST https://your-domain.vercel.app/api/seed/ai-architect
```

**2. SCORM จะโหลดจาก:**
```
/public/scorm/prompt-engineering/index.html
```

**3. ดูคอร์สที่:**
```
https://your-domain.vercel.app/courses/ai-architect-001
```

## 📝 สรุป
- ❌ Upload SCORM ZIP ไม่ได้บน Vercel
- ✅ ใช้ SCORM ที่ commit ไว้ใน /public/ ได้
- ✅ ใช้ Vercel Blob Storage ได้ (ต้องแก้โค้ด)
