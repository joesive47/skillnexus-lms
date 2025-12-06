# 🚀 Google Cloud Run - Deploy Guide (Final)

## Project: skillnexus-lms-2025
## Account: joesive@gmail.com
## Database: postgresql://postgres:[PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres

---

## ⚠️ ข้อกำหนด

### 1. Enable Billing (จำเป็น!)

Google Cloud Run ต้องมี billing account แม้จะใช้ Free Tier

**Free Tier ได้:**
- 2 million requests/เดือน
- 360,000 GB-seconds
- 180,000 vCPU-seconds

**วิธี Enable Billing:**

1. **ไปที่:** https://console.cloud.google.com/billing
2. **คลิก "ADD BILLING ACCOUNT"**
3. **เลือก Country:** Thailand
4. **เพิ่ม Credit Card** (จะไม่ถูกเรียกเก็บถ้าอยู่ใน Free Tier)
5. **Link กับ Project:** skillnexus-lms-2025

**💡 Tips:**
- ใช้ Virtual Credit Card (Rabbit LINE Pay, TrueMoney Wallet)
- Set budget alert ที่ $5 เพื่อป้องกัน
- Google จะไม่เรียกเก็บเงินโดยอัตโนมัติ

---

## 🚀 Deploy Steps

### Step 1: Install Google Cloud CLI (Local)

**Windows:**
```
https://cloud.google.com/sdk/docs/install
```
- Download installer
- Run และติดตั้ง
- Restart terminal

**ตรวจสอบ:**
```bash
gcloud --version
```

---

### Step 2: Login & Setup

```bash
# Login
gcloud auth login

# Set project
gcloud config set project skillnexus-lms-2025

# Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

---

### Step 3: Deploy

```bash
# ไปที่ project directory
cd c:\API\The-SkillNexus

# Deploy
gcloud run deploy skillnexus-lms ^
  --source . ^
  --region=asia-southeast1 ^
  --platform=managed ^
  --allow-unauthenticated ^
  --memory=1Gi ^
  --cpu=1 ^
  --max-instances=10 ^
  --min-instances=0
```

**รอ 5-10 นาที** ☕

---

### Step 4: Add Environment Variables

```bash
# Get service URL
gcloud run services describe skillnexus-lms --region=asia-southeast1 --format="value(status.url)"

# Update environment variables (แทนที่ [PASSWORD] และ [URL])
gcloud run services update skillnexus-lms ^
  --region=asia-southeast1 ^
  --set-env-vars="DATABASE_URL=postgresql://postgres:[PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres,NEXTAUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=,AUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=,NEXTAUTH_URL=[URL],AUTH_URL=[URL],NEXT_PUBLIC_URL=[URL],AUTH_TRUST_HOST=true,NODE_ENV=production"
```

---

### Step 5: Run Migrations

```bash
# Set DATABASE_URL (แทนที่ [PASSWORD])
set DATABASE_URL=postgresql://postgres:[PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres

# Run migrations
npx prisma migrate deploy

# Seed database
npm run db:seed
```

---

## ✅ เสร็จแล้ว!

**URL:** https://skillnexus-lms-xxxxx-as.a.run.app

**Login:**
- Email: `admin@skillnexus.com`
- Password: `Admin@123!`

---

## 💰 ค่าใช้จ่าย

### Free Tier (ทุกเดือน):
- ✅ 2 million requests
- ✅ 360,000 GB-seconds  
- ✅ 180,000 vCPU-seconds

### ประมาณการ (หลัง Free Tier):
- **10K requests/วัน:** ~$5/เดือน
- **50K requests/วัน:** ~$15/เดือน
- **100K requests/วัน:** ~$30/เดือน

### ตั้ง Budget Alert:

```bash
# ไปที่ Billing Console
https://console.cloud.google.com/billing/budgets

# สร้าง Budget Alert
- Budget: $5
- Alert at: 50%, 90%, 100%
- Email: joesive@gmail.com
```

---

## 🔧 Useful Commands

### View Logs:
```bash
gcloud run logs read skillnexus-lms --region=asia-southeast1 --limit=50
```

### View Service Details:
```bash
gcloud run services describe skillnexus-lms --region=asia-southeast1
```

### Update Environment Variables:
```bash
gcloud run services update skillnexus-lms ^
  --region=asia-southeast1 ^
  --update-env-vars="KEY=VALUE"
```

### Redeploy:
```bash
gcloud run deploy skillnexus-lms --source . --region=asia-southeast1
```

### Scale:
```bash
# เพิ่ม memory
gcloud run services update skillnexus-lms ^
  --region=asia-southeast1 ^
  --memory=2Gi

# เพิ่ม min instances (ลด cold start)
gcloud run services update skillnexus-lms ^
  --region=asia-southeast1 ^
  --min-instances=1
```

### Delete Service:
```bash
gcloud run services delete skillnexus-lms --region=asia-southeast1
```

---

## 🎯 Custom Domain

### Setup www.uppowerskill.com:

```bash
# Map domain
gcloud run domain-mappings create ^
  --service=skillnexus-lms ^
  --domain=www.uppowerskill.com ^
  --region=asia-southeast1

# Google จะบอก DNS records ที่ต้องเพิ่ม
# ไปที่ domain registrar และเพิ่ม records
```

---

## 📊 Monitoring

### View Metrics:
```
https://console.cloud.google.com/run/detail/asia-southeast1/skillnexus-lms/metrics
```

### Setup Alerts:
```
https://console.cloud.google.com/monitoring/alerting
```

---

## 🆘 Troubleshooting

### Build Failed:
```bash
# View build logs
gcloud builds list --limit=5
gcloud builds log [BUILD_ID]
```

### Database Connection Error:
```bash
# Test connection
psql "postgresql://postgres:[PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres"
```

### 500 Error:
```bash
# View logs
gcloud run logs read skillnexus-lms --region=asia-southeast1 --limit=100 --format=json
```

### Out of Memory:
```bash
# เพิ่ม memory
gcloud run services update skillnexus-lms --region=asia-southeast1 --memory=2Gi
```

---

## 📝 Checklist

- [ ] Enable Billing Account
- [ ] Install Google Cloud CLI
- [ ] Login & Set Project
- [ ] Enable APIs
- [ ] Deploy to Cloud Run
- [ ] Add Environment Variables
- [ ] Run Database Migrations
- [ ] Test Application
- [ ] Setup Budget Alert
- [ ] (Optional) Custom Domain

---

## 💡 Tips

### ประหยัดค่าใช้จ่าย:
```bash
# ใช้ min-instances=0 (pay-per-use)
# ใช้ memory=1Gi (พอใช้งาน)
# ใช้ max-instances=10 (จำกัดค่าใช้จ่าย)
```

### เพิ่ม Performance:
```bash
# ใช้ min-instances=1 (ไม่มี cold start)
# ใช้ memory=2Gi (เร็วขึ้น)
# ใช้ cpu=2 (handle traffic มากขึ้น)
```

### Security:
```bash
# ใช้ Secret Manager สำหรับ sensitive data
gcloud secrets create database-url --data-file=-
# แล้ว mount เป็น environment variable
```

---

## 🎉 Success!

Your SkillNexus LMS is now running on Google Cloud Run!

**URL:** https://skillnexus-lms-xxxxx-as.a.run.app  
**Cost:** $0-10/month (Free Tier)  
**Scalability:** Auto-scale 0-10 instances  

---

**ใช้ Google Cloud Run ไปให้สุด! 🚀**
