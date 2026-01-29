# 🌐 SCORM File Hosting Guide

## 🏆 Top 6 SCORM Hosting Providers

### 1. SCORM Cloud (แนะนำสำหรับ SCORM!)
- **URL:** https://cloud.scorm.com
- **ราคา:** Free (10 reg/month), $50/month (100 reg)
- **ข้อดี:** เชี่ยวชาญ SCORM, Analytics ดี
- **เหมาะสำหรับ:** LMS ที่ต้องการ SCORM tracking

### 2. AWS S3 + CloudFront (Production Ready)
- **URL:** https://aws.amazon.com/s3/
- **ราคา:** ~$5-10/month (100GB)
- **ข้อดี:** Scalable, CDN ทั่วโลก
- **เหมาะสำหรับ:** Enterprise, High traffic

### 3. Vercel Blob (ง่ายที่สุด!)
- **URL:** https://vercel.com/storage/blob
- **ราคา:** Free (1GB), $0.15/GB
- **ข้อดี:** Integration ง่าย, CDN อัตโนมัติ
- **เหมาะสำหรับ:** Vercel projects

### 4. Cloudflare R2 (ถูกที่สุด!)
- **URL:** https://cloudflare.com/products/r2/
- **ราคา:** $0.015/GB, **Transfer FREE!**
- **ข้อดี:** ไม่มีค่า egress, ถูกมาก
- **เหมาะสำหรับ:** Budget-conscious

### 5. Supabase Storage
- **URL:** https://supabase.com/storage
- **ราคา:** Free (1GB), $25/month (100GB)
- **ข้อดี:** มี Database อยู่แล้ว
- **เหมาะสำหรับ:** Supabase users

### 6. Bunny CDN (เร็วที่สุด!)
- **URL:** https://bunny.net
- **ราคา:** $0.01/GB storage + transfer
- **ข้อดี:** 114 CDN locations, เร็วมาก
- **เหมาะสำหรับ:** Global audience

---

## 🚀 Quick Setup: Vercel Blob

### 1. Install Package
```bash
npm install @vercel/blob
```

### 2. Get Token
```
1. Go to: https://vercel.com/dashboard/stores
2. Create Blob Store
3. Copy BLOB_READ_WRITE_TOKEN
```

### 3. Add to .env
```env
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxx"
```

### 4. Upload SCORM
```bash
npx tsx scripts/upload-scorm.ts
```

### 5. Get URLs
```
Output:
{
  "sdgs-leadership-2030": "https://xxx.public.blob.vercel-storage.com/...",
  "circular-economy-zero-waste": "https://xxx.public.blob.vercel-storage.com/...",
  ...
}
```

---

## 🎯 Quick Setup: Cloudflare R2

### 1. Create R2 Bucket
```
1. Go to: https://dash.cloudflare.com/
2. R2 → Create Bucket
3. Name: scorm-files
```

### 2. Get Credentials
```
Settings → API Tokens → Create API Token
Copy:
- Access Key ID
- Secret Access Key
- Bucket URL
```

### 3. Upload with AWS CLI
```bash
# Configure
aws configure --profile r2
AWS Access Key ID: your-key
AWS Secret Access Key: your-secret
Default region: auto

# Upload
aws s3 sync ./public/scorm/ s3://scorm-files/scorm/ \
  --endpoint-url https://xxx.r2.cloudflarestorage.com \
  --profile r2 \
  --acl public-read
```

### 4. Get Public URL
```
https://pub-xxxxx.r2.dev/scorm/course-1/index.html
```

---

## 📊 Cost Comparison (100GB, 1TB transfer)

| Provider | Storage | Transfer | Total/Month |
|----------|---------|----------|-------------|
| Cloudflare R2 | $1.50 | **FREE** | **$1.50** 🏆 |
| Bunny CDN | $1.00 | $10.00 | $11.00 |
| AWS S3 | $2.30 | $90.00 | $92.30 |
| Vercel Blob | $15.00 | Included | $15.00 |
| Supabase | $25.00 | Included | $25.00 |
| SCORM Cloud | - | - | $50-200 |

---

## 🎨 SCORM Package Structure

```
public/scorm/
├── sdgs-leadership-2030/
│   ├── index.html              # Launch URL
│   ├── imsmanifest.xml         # SCORM manifest
│   ├── content/
│   │   ├── module-1/
│   │   ├── module-2/
│   │   ├── module-3/
│   │   └── module-4/
│   ├── assets/
│   │   ├── images/
│   │   ├── videos/
│   │   └── css/
│   └── scorm/
│       └── api.js              # SCORM API
│
├── circular-economy-zero-waste/
├── social-entrepreneurship-impact/
├── renewable-energy-cleantech/
└── regenerative-agriculture-food/
```

---

## 🔗 Update Course URLs

หลังจาก upload แล้ว update ใน database:

```sql
-- Update SCORM URLs
UPDATE "Course" 
SET "scormPackageUrl" = 'https://your-cdn.com/scorm/sdgs-leadership-2030/'
WHERE "title" = 'Sustainable Development Goals (SDGs) Leadership';

UPDATE "Course" 
SET "scormPackageUrl" = 'https://your-cdn.com/scorm/circular-economy-zero-waste/'
WHERE "title" = 'Circular Economy & Zero Waste Innovation';

-- ... repeat for other courses
```

หรือใช้ Prisma:

```typescript
await prisma.course.update({
  where: { id: courseId },
  data: {
    scormPackageUrl: 'https://your-cdn.com/scorm/course-name/'
  }
})
```

---

## 🎯 แนะนำ:

### สำหรับคุณ (SkillNexus):
```
1. Cloudflare R2 (ถูกที่สุด, ไม่มีค่า transfer)
2. Vercel Blob (ง่าย, integrate ดี)
3. AWS S3 (ถ้าต้องการ enterprise features)
```

### Setup ง่ายที่สุด:
```bash
# Vercel Blob
npm i @vercel/blob
npx tsx scripts/upload-scorm.ts
```

### ถูกที่สุด:
```bash
# Cloudflare R2
# $1.50/month สำหรับ 100GB
# Transfer ฟรี!
```

---

## 📞 Need Help?

- 📖 Vercel Blob: https://vercel.com/docs/storage/vercel-blob
- 📖 Cloudflare R2: https://developers.cloudflare.com/r2/
- 📖 AWS S3: https://docs.aws.amazon.com/s3/

---

**🎉 เลือกที่เหมาะกับคุณแล้วเริ่มต้นได้เลย! 🚀**
