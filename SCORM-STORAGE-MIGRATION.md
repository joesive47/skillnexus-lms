# 🚀 SCORM Storage Migration Plan

## 🎯 เป้าหมาย: ย้าย SCORM จาก Local Storage ไป Cloudflare R2

### ทำไมต้องย้าย?
- ✅ **ฟรี 10GB** (เพียงพอสำหรับเริ่มต้น)
- ✅ **ไม่มีค่า Bandwidth** (ประหยัดมาก!)
- ✅ **ไม่จำกัดขนาดไฟล์**
- ✅ **CDN Global** (เร็วทั่วโลก)
- ✅ **S3 Compatible** (ใช้ AWS SDK ได้)

---

## 📋 Step-by-Step Migration

### Step 1: Setup Cloudflare R2 (5 นาที)

1. **สมัคร Cloudflare** (ถ้ายังไม่มี)
   - ไปที่: https://dash.cloudflare.com/sign-up
   - ฟรี ไม่ต้องใส่บัตร

2. **สร้าง R2 Bucket**
   ```bash
   # ไปที่ Cloudflare Dashboard
   # R2 > Create Bucket
   # ชื่อ: skillnexus-scorm
   # Region: Automatic (APAC)
   ```

3. **สร้าง API Token**
   ```bash
   # R2 > Manage R2 API Tokens
   # Create API Token
   # Permissions: Object Read & Write
   # บันทึก: Access Key ID และ Secret Access Key
   ```

4. **เพิ่ม Environment Variables**
   ```env
   # Cloudflare R2
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET_NAME=skillnexus-scorm
   R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
   ```

---

### Step 2: Install Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

---

### Step 3: สร้าง R2 Storage Service

สร้างไฟล์: `src/lib/storage/r2-storage.ts`

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export class R2Storage {
  private client: S3Client
  private bucketName: string
  private publicUrl: string

  constructor() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })
    this.bucketName = process.env.R2_BUCKET_NAME!
    this.publicUrl = process.env.R2_PUBLIC_URL!
  }

  async uploadFile(key: string, buffer: Buffer, contentType: string = 'application/octet-stream') {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })

    await this.client.send(command)
    return `${this.publicUrl}/${key}`
  }

  async getFileUrl(key: string, expiresIn: number = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    return await getSignedUrl(this.client, command, { expiresIn })
  }

  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    await this.client.send(command)
  }

  getPublicUrl(key: string) {
    return `${this.publicUrl}/${key}`
  }
}

export const r2Storage = new R2Storage()
```

---

### Step 4: อัพเดท SCORM Service

แก้ไขไฟล์: `src/lib/scorm-service.ts`

```typescript
import { r2Storage } from './storage/r2-storage'

export class ScormService {
  // เปลี่ยนจาก local storage เป็น R2
  async uploadPackage(file: File | Buffer, lessonId: string, replace: boolean = false): Promise<string> {
    try {
      console.log(`📦 Starting SCORM upload to R2 for lesson ${lessonId}...`)
      
      // Verify lesson exists
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { scormPackage: true }
      })
      
      if (!lesson) {
        throw new Error(`Lesson with ID ${lessonId} not found`)
      }

      // Delete existing package if replacing
      if (lesson.scormPackage && replace) {
        await r2Storage.deleteFile(lesson.scormPackage.packagePath)
        await prisma.scormPackage.delete({ where: { id: lesson.scormPackage.id } })
      }

      const packageId = `scorm/${lessonId}/${Date.now()}`
      const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file
      
      // Upload ZIP to R2
      console.log(`☁️ Uploading to R2...`)
      const zipUrl = await r2Storage.uploadFile(
        `${packageId}/package.zip`,
        buffer,
        'application/zip'
      )
      
      // Extract and upload files
      console.log(`📂 Extracting and uploading files...`)
      const manifest = await this.extractAndUploadToR2(buffer, packageId)
      
      // Save to database
      const scormPackage = await prisma.scormPackage.create({
        data: {
          lessonId,
          packagePath: packageId,
          manifest: JSON.stringify(manifest),
          version: manifest.version || '1.2',
          title: manifest.title,
          identifier: manifest.identifier
        }
      })
      
      console.log(`✅ SCORM uploaded to R2: ${packageId}`)
      return scormPackage.id
    } catch (error) {
      console.error('❌ R2 upload error:', error)
      throw error
    }
  }

  private async extractAndUploadToR2(buffer: Buffer, packageId: string) {
    // Extract ZIP in memory
    // Upload each file to R2
    // Parse manifest
    // Return manifest data
  }
}
```

---

### Step 5: อัพเดท SCORM Player

แก้ไขไฟล์: `src/app/lesson/[id]/page.tsx`

```typescript
// เปลี่ยน URL จาก local เป็น R2
const scormUrl = scormPackage.packagePath.startsWith('http')
  ? scormPackage.packagePath
  : `${process.env.R2_PUBLIC_URL}/${scormPackage.packagePath}`
```

---

### Step 6: Migrate Existing SCORM Files

สร้างสคริปต์: `scripts/migrate-scorm-to-r2.ts`

```typescript
import { r2Storage } from '../src/lib/storage/r2-storage'
import prisma from '../src/lib/prisma'
import fs from 'fs/promises'
import path from 'path'

async function migrateScormToR2() {
  console.log('🚀 Starting SCORM migration to R2...')
  
  const packages = await prisma.scormPackage.findMany()
  
  for (const pkg of packages) {
    try {
      const localPath = path.join(process.cwd(), 'public', pkg.packagePath)
      
      // Check if file exists
      const exists = await fs.access(localPath).then(() => true).catch(() => false)
      if (!exists) {
        console.log(`⚠️ File not found: ${localPath}`)
        continue
      }
      
      // Read all files in directory
      const files = await fs.readdir(localPath, { recursive: true })
      
      for (const file of files) {
        const filePath = path.join(localPath, file)
        const stat = await fs.stat(filePath)
        
        if (stat.isFile()) {
          const buffer = await fs.readFile(filePath)
          const key = `${pkg.packagePath}/${file}`
          
          await r2Storage.uploadFile(key, buffer)
          console.log(`✅ Uploaded: ${key}`)
        }
      }
      
      console.log(`✅ Migrated package: ${pkg.id}`)
    } catch (error) {
      console.error(`❌ Failed to migrate ${pkg.id}:`, error)
    }
  }
  
  console.log('🎉 Migration complete!')
}

migrateScormToR2()
```

---

## 📊 Cost Comparison

### Vercel (ปัจจุบัน)
- Storage: รวมใน deployment (จำกัด 50MB/file)
- Bandwidth: $40/100GB
- **ต้นทุน 100GB SCORM + 1000 users:** ~$400/เดือน 💸

### Cloudflare R2 (แนะนำ)
- Storage: $0.015/GB/เดือน
- Bandwidth: **ฟรี!** 🎉
- **ต้นทุน 100GB SCORM + 1000 users:** ~$1.50/เดือน 💰

**ประหยัด 99.6%!** 🚀

---

## 🎯 Timeline

- **Week 1:** Setup R2 + สร้าง Storage Service
- **Week 2:** อัพเดท SCORM Service + Testing
- **Week 3:** Migrate existing files
- **Week 4:** Deploy to production

---

## 🔒 Security

1. **Private Bucket** - ไม่เปิด public access
2. **Signed URLs** - ใช้ presigned URLs (expire 1 ชั่วโมง)
3. **CORS** - จำกัด domain ที่เข้าถึงได้
4. **Rate Limiting** - จำกัดการ download

---

## 📝 Checklist

- [ ] สมัคร Cloudflare R2
- [ ] สร้าง Bucket
- [ ] สร้าง API Token
- [ ] เพิ่ม Environment Variables
- [ ] Install Dependencies
- [ ] สร้าง R2 Storage Service
- [ ] อัพเดท SCORM Service
- [ ] อัพเดท SCORM Player
- [ ] Test upload/download
- [ ] Migrate existing files
- [ ] Deploy to production
- [ ] ลบ local files

---

## 🆘 Troubleshooting

### ปัญหา: CORS Error
```typescript
// เพิ่ม CORS ใน R2 Bucket Settings
{
  "AllowedOrigins": ["https://www.uppowerskill.com"],
  "AllowedMethods": ["GET", "HEAD"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 3600
}
```

### ปัญหา: Slow Upload
- ใช้ multipart upload สำหรับไฟล์ใหญ่
- Upload แบบ parallel

---

## 🎉 Benefits After Migration

- ✅ ไม่จำกัดขนาด SCORM
- ✅ ประหยัดค่าใช้จ่าย 99%
- ✅ เร็วขึ้น (CDN global)
- ✅ Scalable (รองรับผู้ใช้ไม่จำกัด)
- ✅ Backup ง่าย
- ✅ Version control

---

**🚀 พร้อมเริ่มต้นแล้ว! ต้องการให้ช่วยสร้างโค้ดไหมครับ?**
