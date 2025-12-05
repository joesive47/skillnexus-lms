# 🚀 Google Cloud Deployment Guide - SkillNexus LMS

Google Cloud มี 2 ทางเลือกหลัก:

---

## ⭐ Option 1: Cloud Run (แนะนำ - ง่ายและถูก!)

**ข้อดี:**
- ✅ ง่ายที่สุด (Deploy ใน 5 นาที)
- ✅ Pay-per-use (จ่ายเฉพาะเวลาใช้งาน)
- ✅ Auto-scaling (0 → 1000 instances)
- ✅ HTTPS ฟรี
- ✅ Custom domain ฟรี
- ✅ ถูกมาก ($0-10/เดือน สำหรับ traffic ปานกลาง)

**ราคา:** $0-20/เดือน (ขึ้นกับ traffic)

### ขั้นตอน:

#### 1. Setup Google Cloud Project

```bash
# ติดตั้ง Google Cloud CLI
# Windows: https://cloud.google.com/sdk/docs/install
# หรือใช้ Cloud Shell ใน Console

# Login
gcloud auth login

# สร้าง project (หรือใช้ที่มีอยู่)
gcloud projects create skillnexus-lms --name="SkillNexus LMS"

# Set project
gcloud config set project skillnexus-lms

# Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable sqladmin.googleapis.com
```

#### 2. Setup Cloud SQL (PostgreSQL)

```bash
# สร้าง Cloud SQL instance
gcloud sql instances create skillnexus-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-southeast1 \
  --root-password=[YOUR_PASSWORD]

# สร้าง database
gcloud sql databases create skillnexus_lms \
  --instance=skillnexus-db

# สร้าง user
gcloud sql users create skillnexus \
  --instance=skillnexus-db \
  --password=[YOUR_PASSWORD]

# Get connection name
gcloud sql instances describe skillnexus-db --format="value(connectionName)"
# Output: skillnexus-lms:asia-southeast1:skillnexus-db
```

**Connection String:**
```
postgresql://skillnexus:[password]@/skillnexus_lms?host=/cloudsql/skillnexus-lms:asia-southeast1:skillnexus-db
```

#### 3. Build & Deploy to Cloud Run

```bash
# ไปที่ project directory
cd c:\API\The-SkillNexus

# Build และ Deploy (วิธีที่ 1 - ง่ายที่สุด)
gcloud run deploy skillnexus-lms \
  --source . \
  --region=asia-southeast1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=1Gi \
  --cpu=1 \
  --max-instances=10 \
  --min-instances=0 \
  --add-cloudsql-instances=skillnexus-lms:asia-southeast1:skillnexus-db

# หรือ Build Docker แล้ว Deploy (วิธีที่ 2)
# Build image
gcloud builds submit --tag gcr.io/skillnexus-lms/skillnexus-lms

# Deploy
gcloud run deploy skillnexus-lms \
  --image gcr.io/skillnexus-lms/skillnexus-lms \
  --region=asia-southeast1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=1Gi \
  --cpu=1 \
  --add-cloudsql-instances=skillnexus-lms:asia-southeast1:skillnexus-db
```

#### 4. Set Environment Variables

```bash
# Set secrets
gcloud run services update skillnexus-lms \
  --region=asia-southeast1 \
  --update-env-vars="DATABASE_URL=postgresql://skillnexus:[password]@/skillnexus_lms?host=/cloudsql/skillnexus-lms:asia-southeast1:skillnexus-db,\
NEXTAUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=,\
AUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=,\
NEXTAUTH_URL=https://skillnexus-lms-xxxxx-as.a.run.app,\
AUTH_URL=https://skillnexus-lms-xxxxx-as.a.run.app,\
NEXT_PUBLIC_URL=https://skillnexus-lms-xxxxx-as.a.run.app,\
AUTH_TRUST_HOST=true,\
NODE_ENV=production"
```

#### 5. Run Migrations

```bash
# Option A: ใช้ Cloud Shell
gcloud sql connect skillnexus-db --user=skillnexus
# รัน migrations ผ่าน psql

# Option B: ใช้ Cloud SQL Proxy (แนะนำ)
# Download proxy
curl -o cloud-sql-proxy https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.8.0/cloud-sql-proxy.windows.amd64.exe

# Run proxy
cloud-sql-proxy skillnexus-lms:asia-southeast1:skillnexus-db

# ใน terminal อื่น
DATABASE_URL="postgresql://skillnexus:[password]@localhost:5432/skillnexus_lms" npx prisma migrate deploy
DATABASE_URL="postgresql://skillnexus:[password]@localhost:5432/skillnexus_lms" npm run db:seed
```

#### 6. Custom Domain (Optional)

```bash
# Map domain
gcloud run domain-mappings create \
  --service=skillnexus-lms \
  --domain=www.uppowerskill.com \
  --region=asia-southeast1

# Update DNS records ตามที่ Google แนะนำ
```

**เวลา Deploy:** 5-10 นาที  
**URL:** https://skillnexus-lms-xxxxx-as.a.run.app

---

## 🚀 Option 2: App Engine (Alternative)

**ข้อดี:**
- ✅ Managed platform
- ✅ Auto-scaling
- ✅ ไม่ต้องจัดการ container

**ราคา:** $20-50/เดือน

### ขั้นตอน:

#### 1. Setup Database
```bash
# เหมือน Option 1
```

#### 2. Deploy to App Engine

```bash
# Create app
gcloud app create --region=asia-southeast1

# Deploy
gcloud app deploy

# Set environment variables
gcloud app deploy --set-env-vars="DATABASE_URL=postgresql://...,NEXTAUTH_SECRET=...,AUTH_SECRET=..."
```

#### 3. Run Migrations
```bash
# เหมือน Option 1
```

**เวลา Deploy:** 10-15 นาที  
**URL:** https://skillnexus-lms.as.r.appspot.com

---

## 💰 ราคา Google Cloud

### Cloud Run (Pay-per-use)
```
Free Tier (ทุกเดือน):
- 2 million requests
- 360,000 GB-seconds
- 180,000 vCPU-seconds

หลัง Free Tier:
- $0.00002400 per request
- $0.00000250 per GB-second
- $0.00001000 per vCPU-second

ประมาณการ:
- 10,000 requests/วัน: ~$5/เดือน
- 50,000 requests/วัน: ~$15/เดือน
- 100,000 requests/วัน: ~$30/เดือน
```

### Cloud SQL
```
db-f1-micro (Free Tier eligible):
- 0.6 GB RAM
- Shared CPU
- $0 (ใน Free Tier)
- หรือ ~$7/เดือน

db-g1-small (Production):
- 1.7 GB RAM
- 1 shared vCPU
- ~$25/เดือน
```

**รวม:** $0-10/เดือน (Free Tier) หรือ $15-40/เดือน (Production)

---

## 📊 เปรียบเทียบ

| Feature | Cloud Run | App Engine |
|---------|-----------|------------|
| ราคา | $0-20/เดือน | $20-50/เดือน |
| Scaling | 0 → 1000 | Auto |
| Cold Start | ~1-2 วินาที | ~5-10 วินาที |
| Deploy Time | 3-5 นาที | 10-15 นาที |
| ความยาก | ⭐⭐ ง่าย | ⭐⭐⭐ ปานกลาง |

---

## 🎯 Quick Start (Cloud Run - แนะนำ!)

### วิธีที่ 1: ใช้ Cloud Console (ง่ายที่สุด!)

```bash
1. ไปที่ https://console.cloud.google.com
2. เปิด Cloud Shell (ปุ่มด้านบนขวา)
3. Clone repository:
   git clone https://github.com/YOUR_USERNAME/The-SkillNexus.git
   cd The-SkillNexus

4. Deploy:
   gcloud run deploy skillnexus-lms \
     --source . \
     --region=asia-southeast1 \
     --allow-unauthenticated

5. เสร็จแล้ว! 🎉
```

### วิธีที่ 2: ใช้ Local CLI

```bash
# 1. Install Google Cloud CLI
# https://cloud.google.com/sdk/docs/install

# 2. Login
gcloud auth login

# 3. Set project
gcloud config set project YOUR_PROJECT_ID

# 4. Deploy
cd c:\API\The-SkillNexus
gcloud run deploy skillnexus-lms \
  --source . \
  --region=asia-southeast1 \
  --allow-unauthenticated

# 5. Setup Database
gcloud sql instances create skillnexus-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-southeast1

# 6. Add environment variables
gcloud run services update skillnexus-lms \
  --region=asia-southeast1 \
  --update-env-vars="DATABASE_URL=...,NEXTAUTH_SECRET=..."

# 7. Run migrations
# ใช้ Cloud SQL Proxy
```

---

## 🔧 CI/CD with Cloud Build

### Setup Automatic Deployment

```bash
# 1. Connect GitHub
gcloud builds triggers create github \
  --repo-name=The-SkillNexus \
  --repo-owner=YOUR_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml

# 2. Push to GitHub
git push origin main

# 3. Auto deploy! 🚀
```

---

## 💡 Tips & Best Practices

### Performance
```bash
# เพิ่ม memory สำหรับ performance ดีขึ้น
gcloud run services update skillnexus-lms \
  --memory=2Gi \
  --cpu=2

# เพิ่ม min instances เพื่อลด cold start
gcloud run services update skillnexus-lms \
  --min-instances=1
```

### Cost Optimization
```bash
# ใช้ min-instances=0 สำหรับ dev/staging
# ใช้ min-instances=1-2 สำหรับ production

# Set max instances เพื่อควบคุมค่าใช้จ่าย
gcloud run services update skillnexus-lms \
  --max-instances=5
```

### Monitoring
```bash
# ดู logs
gcloud run logs read skillnexus-lms --region=asia-southeast1

# ดู metrics
gcloud run services describe skillnexus-lms --region=asia-southeast1
```

---

## 🔒 Security

### Use Secret Manager (แนะนำ!)

```bash
# สร้าง secrets
echo -n "hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=" | \
  gcloud secrets create nextauth-secret --data-file=-

echo -n "postgresql://..." | \
  gcloud secrets create database-url --data-file=-

# ใช้ secrets ใน Cloud Run
gcloud run services update skillnexus-lms \
  --update-secrets=NEXTAUTH_SECRET=nextauth-secret:latest,\
DATABASE_URL=database-url:latest
```

---

## 📈 Scaling Configuration

### Development
```bash
--min-instances=0
--max-instances=2
--memory=512Mi
--cpu=1
```

### Production
```bash
--min-instances=1
--max-instances=10
--memory=1Gi
--cpu=2
```

### High Traffic
```bash
--min-instances=2
--max-instances=50
--memory=2Gi
--cpu=2
```

---

## 🎉 ข้อดีของ Google Cloud Run

- ✅ **ถูกที่สุด**: จ่ายเฉพาะเวลาใช้งาน
- ✅ **ง่ายที่สุด**: Deploy ใน 5 นาที
- ✅ **Scale อัตโนมัติ**: 0 → 1000 instances
- ✅ **HTTPS ฟรี**: SSL certificate อัตโนมัติ
- ✅ **Global CDN**: ใช้ Google's network
- ✅ **Free Tier**: 2M requests/เดือน ฟรี

---

## 🚀 Deploy Now!

```bash
# One-line deploy!
gcloud run deploy skillnexus-lms \
  --source . \
  --region=asia-southeast1 \
  --allow-unauthenticated \
  --memory=1Gi

# เสร็จแล้ว! 🎉
```

**URL:** https://skillnexus-lms-xxxxx-as.a.run.app

---

**Google Cloud Run = ง่าย + ถูก + Scalable! 🚀**
