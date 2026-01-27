# 🚀 SCORM on Vercel - Solution Guide

## ⚠️ ปัญหา: Vercel Read-Only Filesystem

Vercel ไม่รองรับการ upload ไฟล์เพราะเป็น read-only filesystem

## ✅ วิธีแก้ไข: 3 ทางเลือก

### Option 1: Vercel Blob Storage (แนะนำ) ⭐

**ขั้นตอน:**

1. **Install Vercel Blob**
```bash
npm install @vercel/blob
```

2. **Setup Environment Variable**
```
BLOB_READ_WRITE_TOKEN=vercel_blob_xxx
```

3. **Upload SCORM via API**
```typescript
import { put } from '@vercel/blob';

// Upload SCORM package
const blob = await put('scorm/ai-architect.zip', file, {
  access: 'public',
});

// Save URL to database
await prisma.scormPackage.create({
  data: {
    packagePath: blob.url,
    // ...
  }
});
```

**ข้อดี:**
- ✅ Serverless-friendly
- ✅ CDN-backed
- ✅ Auto-scaling
- ✅ Free tier: 500MB

**ราคา:**
- Free: 500MB
- Pro: $0.15/GB

---

### Option 2: AWS S3 / Cloudflare R2

**ขั้นตอน:**

1. **Install AWS SDK**
```bash
npm install @aws-sdk/client-s3
```

2. **Setup Environment Variables**
```
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=ap-southeast-1
AWS_BUCKET_NAME=uppowerskill-scorm
```

3. **Upload to S3**
```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.AWS_REGION });

await s3.send(new PutObjectCommand({
  Bucket: process.env.AWS_BUCKET_NAME,
  Key: 'scorm/ai-architect.zip',
  Body: fileBuffer,
  ContentType: 'application/zip',
}));
```

**ข้อดี:**
- ✅ ราคาถูก ($0.023/GB)
- ✅ Reliable
- ✅ Global CDN

---

### Option 3: GitHub + jsDelivr CDN (ฟรี!) 🎉

**ขั้นตอน:**

1. **Push SCORM ไป GitHub**
```bash
git add public/scorm-packages/
git commit -m "Add SCORM packages"
git push origin main
```

2. **ใช้ jsDelivr CDN**
```
https://cdn.jsdelivr.net/gh/joesive47/skillnexus-lms@main/public/scorm-packages/ai-architect-blueprint.zip
```

3. **บันทึก URL ใน Database**
```typescript
await prisma.scormPackage.create({
  data: {
    packagePath: 'https://cdn.jsdelivr.net/gh/joesive47/skillnexus-lms@main/public/scorm-packages/ai-architect-blueprint.zip',
    // ...
  }
});
```

**ข้อดี:**
- ✅ ฟรี 100%
- ✅ Global CDN
- ✅ ไม่ต้อง setup
- ✅ Auto-update จาก GitHub

**ข้อจำกัด:**
- ⚠️ ไฟล์ต้องไม่เกิน 50MB
- ⚠️ Public เท่านั้น

---

## 🎯 แนะนำสำหรับ upPowerSkill

### สำหรับ Development (Local):
✅ ใช้ local filesystem ตามปกติ

### สำหรับ Production (Vercel):
✅ **Option 3: GitHub + jsDelivr** (ฟรีและง่ายที่สุด)

---

## 📝 Implementation Guide

### Step 1: อัพเดต SCORM Service

สร้างไฟล์ `src/lib/scorm-cdn.ts`:

```typescript
export function getSCORMUrl(packageName: string): string {
  if (process.env.NODE_ENV === 'development') {
    return `/scorm-packages/${packageName}`;
  }
  
  // Production: Use jsDelivr CDN
  return `https://cdn.jsdelivr.net/gh/joesive47/skillnexus-lms@main/public/scorm-packages/${packageName}`;
}

// Usage:
const url = getSCORMUrl('ai-architect-blueprint.zip');
```

### Step 2: อัพเดต SCORM Player

```typescript
// ใน SCORM Player component
const scormUrl = getSCORMUrl(lesson.packagePath);

// Extract และ load SCORM
const response = await fetch(scormUrl);
const blob = await response.blob();
// ... unzip and load
```

### Step 3: Pre-seed Database

สร้าง `prisma/seed-scorm.ts`:

```typescript
import { prisma } from '../src/lib/prisma';

async function main() {
  // AI Architect's Blueprint
  await prisma.course.create({
    data: {
      title: "AI Architect's Blueprint",
      description: "จากไอเดียฟุ้งสู่ระบบจริงด้วย Amazon Q & VS Code",
      published: true,
      lessons: {
        create: {
          title: "AI Architect's Blueprint - Full Course",
          type: "SCORM",
          launchUrl: "https://cdn.jsdelivr.net/gh/joesive47/skillnexus-lms@main/public/scorm-packages/ai-architect-blueprint.zip",
          order: 1,
        }
      }
    }
  });

  // Prompt Engineering
  await prisma.course.create({
    data: {
      title: "Prompt Engineering",
      description: "Master AI Communication",
      published: true,
      lessons: {
        create: {
          title: "Prompt Engineering - Full Course",
          type: "SCORM",
          launchUrl: "https://cdn.jsdelivr.net/gh/joesive47/skillnexus-lms@main/public/scorm-packages/prompt-engineering.zip",
          order: 1,
        }
      }
    }
  });
}

main();
```

---

## 🚀 Quick Fix (ใช้ได้เลย!)

### URL ที่พร้อมใช้งาน:

```
AI Architect's Blueprint:
https://cdn.jsdelivr.net/gh/joesive47/skillnexus-lms@main/public/scorm-packages/ai-architect-blueprint.zip

Prompt Engineering:
https://cdn.jsdelivr.net/gh/joesive47/skillnexus-lms@main/public/scorm-packages/prompt-engineering.zip
```

### วิธีใช้:

1. ไปที่ Admin Dashboard
2. Create Course
3. Add Lesson → Type: SCORM
4. Launch URL: วาง URL ข้างบน
5. Save

---

## 📊 Comparison

| Feature | Vercel Blob | AWS S3 | GitHub+jsDelivr |
|---------|-------------|--------|-----------------|
| ราคา | $0.15/GB | $0.023/GB | ฟรี |
| Setup | ง่าย | ปานกลาง | ง่ายมาก |
| CDN | ✅ | ✅ | ✅ |
| ขนาดไฟล์ | ไม่จำกัด | ไม่จำกัด | <50MB |
| Private | ✅ | ✅ | ❌ |

---

## 🎯 Recommendation

**ใช้ GitHub + jsDelivr** เพราะ:
- ✅ ฟรี 100%
- ✅ Setup ง่าย
- ✅ SCORM files < 50MB
- ✅ Public content (ไม่มีปัญหา)
- ✅ Auto-update จาก Git

---

**Next Steps:**
1. SCORM packages อยู่ใน GitHub แล้ว ✅
2. ใช้ jsDelivr URL ✅
3. Create courses ผ่าน Admin Dashboard
4. Done! 🎉
