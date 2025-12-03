# 🚀 Google Cloud Deployment Guide - SkillNexus LMS

## 📋 Pre-requisites

1. **Google Cloud Account** - มี billing enabled
2. **gcloud CLI** - ติดตั้งแล้ว ([Download](https://cloud.google.com/sdk/docs/install))
3. **Project ID** - สร้าง project บน Google Cloud Console

## 🔧 Step 1: Setup Google Cloud CLI

```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable appengine.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable storage-api.googleapis.com
```

## 🗄️ Step 2: Setup Cloud SQL (PostgreSQL)

### Option A: ใช้ Database ที่มีอยู่แล้ว (34.124.203.250)

ไฟล์ `app.yaml` ตั้งค่าให้ใช้ database นี้อยู่แล้ว:
```
DATABASE_URL: "postgresql://skillnexus-user:SkillNexus2025!Secure@34.124.203.250:5432/skillnexus?sslmode=require"
```

### Option B: สร้าง Cloud SQL ใหม่

```bash
# สร้าง Cloud SQL instance
gcloud sql instances create skillnexus-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-southeast1

# ตั้งรหัสผ่าน root
gcloud sql users set-password postgres \
  --instance=skillnexus-db \
  --password=YOUR_SECURE_PASSWORD

# สร้าง database
gcloud sql databases create skillnexus \
  --instance=skillnexus-db

# อนุญาต IP ภายนอก (ถ้าต้องการ)
gcloud sql instances patch skillnexus-db \
  --authorized-networks=0.0.0.0/0
```

แล้วแก้ไข `app.yaml`:
```yaml
DATABASE_URL: "postgresql://postgres:YOUR_PASSWORD@/skillnexus?host=/cloudsql/YOUR_PROJECT_ID:asia-southeast1:skillnexus-db"
```

## 📦 Step 3: Setup Cloud Storage (Optional)

```bash
# สร้าง bucket สำหรับเก็บไฟล์
gsutil mb -l asia-southeast1 gs://uppowerskill-assets

# ตั้งค่า public access
gsutil iam ch allUsers:objectViewer gs://uppowerskill-assets
```

## 🔐 Step 4: Setup Environment Variables

แก้ไขไฟล์ `app.yaml` ให้ตรงกับ environment ของคุณ:

```yaml
env_variables:
  DATABASE_URL: "your-database-url"
  NEXTAUTH_SECRET: "your-secret-key"
  # ... other variables
```

**สร้าง NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

## 🏗️ Step 5: Build Application

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Build Next.js
npm run build
```

## 🚀 Step 6: Deploy to Google App Engine

```bash
# Deploy
gcloud app deploy

# หรือระบุ region
gcloud app deploy --project=YOUR_PROJECT_ID
```

**ตัวเลือกการ deploy:**
```bash
# Deploy แบบ quiet (ไม่ถามยืนยัน)
gcloud app deploy --quiet

# Deploy version เฉพาะ
gcloud app deploy --version=v1

# Deploy และดู logs
gcloud app deploy && gcloud app logs tail -s default
```

## 🌐 Step 7: Setup Custom Domain (uppowerskill.com)

```bash
# Verify domain ownership
gcloud app domain-mappings create uppowerskill.com

# ดู DNS records ที่ต้องตั้งค่า
gcloud app domain-mappings describe uppowerskill.com
```

**ตั้งค่า DNS Records:**
- Type: `A`
- Name: `@`
- Value: `216.239.32.21` (หรือตาม output ของคำสั่งข้างบน)

- Type: `AAAA`
- Name: `@`
- Value: `2001:4860:4802:32::15`

- Type: `CNAME`
- Name: `www`
- Value: `ghs.googlehosted.com`

## 🔄 Step 8: Run Database Migrations

```bash
# เชื่อมต่อกับ Cloud SQL
gcloud sql connect skillnexus-db --user=postgres

# หรือใช้ Cloud SQL Proxy
cloud_sql_proxy -instances=YOUR_PROJECT_ID:asia-southeast1:skillnexus-db=tcp:5432

# Run migrations
npm run db:push
```

## 📊 Step 9: Monitor & Logs

```bash
# ดู logs แบบ real-time
gcloud app logs tail -s default

# ดู logs ย้อนหลัง
gcloud app logs read

# เปิด Cloud Console
gcloud app browse
```

## 🔧 Useful Commands

```bash
# ดูข้อมูล app
gcloud app describe

# ดู versions ทั้งหมด
gcloud app versions list

# ลบ version เก่า
gcloud app versions delete v1

# Stop instance
gcloud app versions stop v1

# Scale instances
gcloud app instances list
```

## 💰 Cost Optimization

### Free Tier Limits:
- **App Engine**: 28 instance hours/day (F1)
- **Cloud SQL**: db-f1-micro (shared CPU)
- **Cloud Storage**: 5GB

### Recommendations:
```yaml
# app.yaml - สำหรับ free tier
instance_class: F1
automatic_scaling:
  min_instances: 0  # ประหยัดค่าใช้จ่าย
  max_instances: 1
```

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
```bash
# ตรวจสอบ Cloud SQL IP
gcloud sql instances describe skillnexus-db

# Test connection
psql "postgresql://user:pass@IP:5432/skillnexus?sslmode=require"
```

### Error: "Build failed"
```bash
# ลบ .next และ build ใหม่
rm -rf .next
npm run build
```

### Error: "Out of memory"
```yaml
# เพิ่ม instance class ใน app.yaml
instance_class: F4  # หรือ F4_1G
```

## 📝 Post-Deployment Checklist

- [ ] ตรวจสอบ app ทำงานที่ `https://YOUR_PROJECT_ID.appspot.com`
- [ ] ทดสอบ login/register
- [ ] ตรวจสอบ database connection
- [ ] Setup custom domain
- [ ] Configure SSL certificate (auto by Google)
- [ ] Setup monitoring & alerts
- [ ] Backup database
- [ ] Test payment integration
- [ ] Configure CDN (Cloud CDN)

## 🔄 Update & Redeploy

```bash
# Pull latest code
git pull

# Install dependencies
npm install

# Build
npm run build

# Deploy
gcloud app deploy
```

## 📞 Support

- **Google Cloud Console**: https://console.cloud.google.com
- **Documentation**: https://cloud.google.com/appengine/docs
- **Pricing**: https://cloud.google.com/appengine/pricing

---

**🎉 ขอให้ deployment สำเร็จ!**
