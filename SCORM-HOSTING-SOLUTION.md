# 🚀 SCORM Hosting Guide - Free Providers & Best Practices

## 📊 สถานะไฟล์ SCORM ปัจจุบัน

### ✅ ไฟล์ที่มีอยู่
```
public/
├── scorm-packages/
│   ├── prompt-engineering-scorm.zip ✅
│   ├── javascript-fundamentals/ (folder)
│   ├── prompt-engineering-scorm/ (folder)
│   └── web-dev-fundamentals/ (folder)
├── scorm-test.zip ✅
├── scorm-sample-demo.zip ✅
└── scorm-working-demo.zip ✅
```

---

## 🎯 แนวทางที่แนะนำ (เรียงตามลำดับความเหมาะสม)

### 🥇 #1: GitHub Releases (แนะนำที่สุด - ฟรี 100%)

**ทำไมดีที่สุด:**
- ✅ ฟรี 100% ไม่จำกัดขนาด
- ✅ CDN ทั่วโลก (Fast)
- ✅ Version control
- ✅ Direct download URL
- ✅ ไม่มีโฆษณา
- ✅ Stable & Reliable

**ขั้นตอน:**

```bash
# 1. สร้าง Release บน GitHub
git tag -a v1.0.0 -m "SCORM Packages Release v1.0"
git push origin v1.0.0

# 2. ไปที่ GitHub → Releases → Create Release
# 3. Upload .zip files
# 4. Publish Release

# URL Format:
https://github.com/[username]/[repo]/releases/download/v1.0.0/prompt-engineering-scorm.zip
```

**ตัวอย่าง URL:**
```
https://github.com/yourusername/The-SkillNexus/releases/download/v1.0.0/prompt-engineering-scorm.zip
```

---

### 🥈 #2: Vercel Blob Storage (แนะนำ - Free 1GB)

**ข้อดี:**
- ✅ Free 1GB
- ✅ CDN Global
- ✅ Fast Upload/Download
- ✅ Simple API
- ✅ ใช้ร่วมกับ Vercel Deployment

**ขั้นตอน:**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Enable Blob Storage
vercel blob

# 4. Upload files
vercel blob upload prompt-engineering-scorm.zip
```

**Code Integration:**
```typescript
// app/api/scorm/upload/route.ts
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  const file = await request.blob();
  const blob = await put('scorm/prompt-engineering.zip', file, {
    access: 'public',
  });
  
  return Response.json({ url: blob.url });
}
```

**URL Format:**
```
https://[random-id].public.blob.vercel-storage.com/scorm/prompt-engineering.zip
```

---

### 🥉 #3: Cloudflare R2 (Free 10GB)

**ข้อดี:**
- ✅ Free 10GB storage
- ✅ Free bandwidth (ไม่จำกัด)
- ✅ S3-compatible API
- ✅ Global CDN
- ✅ Fast

**ขั้นตอน:**

```bash
# 1. สมัคร Cloudflare (ฟรี)
https://dash.cloudflare.com/sign-up

# 2. ไปที่ R2 → Create Bucket
# 3. Upload files
# 4. Enable Public Access

# 5. Get URL
https://pub-[bucket-id].r2.dev/scorm/prompt-engineering.zip
```

**Wrangler CLI:**
```bash
npm install -g wrangler
wrangler login
wrangler r2 bucket create scorm-packages
wrangler r2 object put scorm-packages/prompt-engineering.zip --file=./prompt-engineering-scorm.zip
```

---

### 🏅 #4: Supabase Storage (Free 1GB)

**ข้อดี:**
- ✅ Free 1GB
- ✅ CDN
- ✅ Easy API
- ✅ PostgreSQL Database included
- ✅ Authentication built-in

**ขั้นตอน:**

```bash
# 1. สมัคร Supabase
https://supabase.com

# 2. Create Project
# 3. Go to Storage → Create Bucket "scorm-packages"
# 4. Upload files
```

**Code:**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

// Upload
const { data, error } = await supabase.storage
  .from('scorm-packages')
  .upload('prompt-engineering.zip', file)

// Get Public URL
const { data: { publicUrl } } = supabase.storage
  .from('scorm-packages')
  .getPublicUrl('prompt-engineering.zip')
```

---

### 🎖️ #5: AWS S3 (Free 5GB - 12 เดือนแรก)

**ข้อดี:**
- ✅ Free tier: 5GB storage
- ✅ 20,000 GET requests
- ✅ 2,000 PUT requests
- ✅ Industry standard
- ✅ Reliable

**ขั้นตอน:**

```bash
# 1. สมัคร AWS Free Tier
https://aws.amazon.com/free/

# 2. Create S3 Bucket
aws s3 mb s3://skillnexus-scorm

# 3. Upload files
aws s3 cp prompt-engineering-scorm.zip s3://skillnexus-scorm/

# 4. Make public
aws s3api put-object-acl --bucket skillnexus-scorm --key prompt-engineering-scorm.zip --acl public-read
```

**URL:**
```
https://skillnexus-scorm.s3.amazonaws.com/prompt-engineering-scorm.zip
```

---

### 🎁 #6: Google Drive (Free 15GB)

**ข้อดี:**
- ✅ Free 15GB
- ✅ Easy to use
- ✅ Familiar interface

**ข้อเสีย:**
- ⚠️ ต้อง Generate Share Link
- ⚠️ มี Quota limits
- ⚠️ ไม่เหมาะกับ Production

**ขั้นตอน:**

```bash
# 1. Upload to Google Drive
# 2. Right-click → Share → Anyone with link
# 3. Copy link

# Original Link:
https://drive.google.com/file/d/FILE_ID/view?usp=sharing

# Direct Download Link:
https://drive.google.com/uc?export=download&id=FILE_ID
```

---

### 🎪 #7: Netlify (Free 100GB bandwidth/month)

**ข้อดี:**
- ✅ Free 100GB bandwidth
- ✅ CDN
- ✅ Easy deployment

**ขั้นตอน:**

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
netlify deploy --prod --dir=public/scorm-packages

# URL:
https://[site-name].netlify.app/prompt-engineering-scorm.zip
```

---

## 📋 เปรียบเทียบผู้ให้บริการ

| Provider | Free Storage | Bandwidth | Speed | Ease | Best For |
|----------|-------------|-----------|-------|------|----------|
| **GitHub Releases** | ไม่จำกัด | ไม่จำกัด | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | **Production** |
| **Vercel Blob** | 1GB | ไม่จำกัด | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **Production** |
| **Cloudflare R2** | 10GB | ไม่จำกัด | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | **Production** |
| **Supabase** | 1GB | 2GB/day | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **Small Projects** |
| **AWS S3** | 5GB | 15GB | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | **Enterprise** |
| **Google Drive** | 15GB | Limited | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **Testing** |
| **Netlify** | 100GB BW | 100GB | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | **Static Sites** |

---

## 🔧 เตรียมไฟล์ SCORM ให้พร้อม Upload

### 1. ตรวจสอบโครงสร้างไฟล์

```bash
# ไฟล์ที่ต้องมีใน .zip
scorm-package.zip
├── imsmanifest.xml ✅ (Required)
├── index.html ✅ (Required)
├── modules/
├── assets/
└── shared/
```

### 2. Optimize ขนาดไฟล์

```bash
# Compress videos
ffmpeg -i video.mp4 -vcodec h264 -acodec aac -b:v 1M video-compressed.mp4

# Optimize images
npm install -g imagemin-cli
imagemin assets/images/*.png --out-dir=assets/images/optimized

# Remove unnecessary files
- .DS_Store
- Thumbs.db
- node_modules/
- .git/
```

### 3. สร้าง .zip ที่ถูกต้อง

```bash
# Windows
cd scorm-package
tar -a -c -f ../prompt-engineering-scorm.zip *

# Mac/Linux
cd scorm-package
zip -r ../prompt-engineering-scorm.zip * -x "*.DS_Store"
```

---

## 🚀 Quick Start Script

สร้างไฟล์ `upload-scorm.js`:

```javascript
const fs = require('fs');
const path = require('path');

// Configuration
const SCORM_DIR = './public/scorm-packages';
const OUTPUT_DIR = './scorm-ready';

// Get all folders and zip files
const items = fs.readdirSync(SCORM_DIR);

console.log('📦 SCORM Packages Found:');
items.forEach((item, index) => {
  const fullPath = path.join(SCORM_DIR, item);
  const stats = fs.statSync(fullPath);
  
  if (stats.isDirectory()) {
    console.log(`${index + 1}. 📁 ${item} (folder)`);
  } else if (item.endsWith('.zip')) {
    const size = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`${index + 1}. 📦 ${item} (${size} MB)`);
  }
});

console.log('\n✅ Ready to upload to:');
console.log('1. GitHub Releases (Recommended)');
console.log('2. Vercel Blob');
console.log('3. Cloudflare R2');
console.log('4. Supabase Storage');
```

**Run:**
```bash
node upload-scorm.js
```

---

## 📝 สร้าง Course ใน Database

```typescript
// app/api/courses/create-scorm/route.ts
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const { title, scormUrl } = await request.json();
  
  const course = await prisma.course.create({
    data: {
      title,
      description: 'SCORM Course',
      scormUrl, // URL from hosting provider
      scormVersion: '2004',
      duration: 120,
      level: 'INTERMEDIATE',
      categoryId: 'your-category-id',
      teacherId: 'your-teacher-id',
      published: true
    }
  });
  
  return Response.json({ success: true, course });
}
```

---

## 🎯 แนวทางที่แนะนำสำหรับ SkillNexus

### Phase 1: Development (ใช้ตอนนี้)
```
✅ GitHub Releases
- Upload ไฟล์ .zip ทั้งหมด
- ได้ URL ที่ stable
- ฟรี 100%
```

### Phase 2: Production (เมื่อมี Users)
```
✅ Vercel Blob + Cloudflare R2
- Vercel Blob: สำหรับ SCORM packages หลัก
- Cloudflare R2: สำหรับ backup และ large files
- Total: 11GB free
```

### Phase 3: Scale (เมื่อมี Revenue)
```
✅ AWS S3 + CloudFront
- Professional setup
- Unlimited scale
- Pay as you go
```

---

## 🔗 ตัวอย่าง Implementation

### 1. Upload to GitHub Releases

```bash
# Create release
gh release create v1.0.0 \
  --title "SCORM Packages v1.0" \
  --notes "Initial SCORM packages release" \
  public/scorm-packages/*.zip
```

### 2. Update Database

```sql
-- Update course with SCORM URL
UPDATE "Course"
SET "scormUrl" = 'https://github.com/yourusername/The-SkillNexus/releases/download/v1.0.0/prompt-engineering-scorm.zip'
WHERE id = 'course-id';
```

### 3. Test SCORM Player

```typescript
// components/scorm/ScormPlayer.tsx
export function ScormPlayer({ scormUrl }: { scormUrl: string }) {
  return (
    <iframe
      src={`/api/scorm/player?url=${encodeURIComponent(scormUrl)}`}
      width="100%"
      height="600px"
      frameBorder="0"
    />
  );
}
```

---

## ✅ Checklist ก่อน Upload

- [ ] ตรวจสอบ imsmanifest.xml
- [ ] ทดสอบ SCORM package locally
- [ ] Optimize ขนาดไฟล์ (< 50MB แนะนำ)
- [ ] สร้าง .zip ที่ถูกต้อง
- [ ] เลือก hosting provider
- [ ] Upload และได้ URL
- [ ] Test download URL
- [ ] Update database
- [ ] Test SCORM player
- [ ] Verify tracking works

---

## 🎉 สรุป: แนวทางที่แนะนำ

### สำหรับ SkillNexus ตอนนี้:

**🥇 ใช้ GitHub Releases**
```bash
# 1. สร้าง Release
gh release create v1.0.0 public/scorm-packages/*.zip

# 2. ได้ URL
https://github.com/[user]/The-SkillNexus/releases/download/v1.0.0/[file].zip

# 3. Update Course
UPDATE "Course" SET "scormUrl" = '[URL]' WHERE id = '[id]';
```

**ข้อดี:**
- ✅ ฟรี 100%
- ✅ ไม่จำกัดขนาด
- ✅ CDN ทั่วโลก
- ✅ Version control
- ✅ Stable & Reliable

**เริ่มได้เลยตอนนี้!** 🚀

---

*Last Updated: January 2025*
