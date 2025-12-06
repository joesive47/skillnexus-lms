# 🚀 DEPLOY NOW - Google Cloud Run

## ✅ พร้อมแล้ว!
- Balance: THB 18.73 ✅
- Project: skillnexus-lms-2025 ✅
- Database: Supabase ✅

---

## 📋 ข้อมูลที่ต้องใช้

```
Project ID: skillnexus-lms-2025
Account: joesive@gmail.com
Database: postgresql://postgres:[PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres
Region: asia-southeast1
```

---

## 🚀 Deploy เลย! (Copy-Paste)

### วิธีที่ 1: ใช้ Local Terminal (Windows)

```bash
# 1. Install Google Cloud CLI (ถ้ายังไม่มี)
# Download: https://cloud.google.com/sdk/docs/install

# 2. Login
gcloud auth login

# 3. Set project
gcloud config set project skillnexus-lms-2025

# 4. Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# 5. Deploy
cd c:\API\The-SkillNexus

gcloud run deploy skillnexus-lms ^
  --source . ^
  --region=asia-southeast1 ^
  --platform=managed ^
  --allow-unauthenticated ^
  --memory=1Gi ^
  --cpu=1 ^
  --max-instances=5 ^
  --min-instances=0

# รอ 5-10 นาที...
```

### วิธีที่ 2: ใช้ Cloud Console (ไม่ต้องติดตั้งอะไร)

1. **ไปที่:** https://shell.cloud.google.com
2. **Login:** joesive@gmail.com
3. **Copy-paste commands:**

```bash
# Set project
gcloud config set project skillnexus-lms-2025

# Enable APIs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com

# Clone repo (แก้ YOUR_USERNAME)
git clone https://github.com/YOUR_USERNAME/The-SkillNexus.git
cd The-SkillNexus

# Deploy
gcloud run deploy skillnexus-lms \
  --source . \
  --region=asia-southeast1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=1Gi \
  --cpu=1 \
  --max-instances=5 \
  --min-instances=0
```

---

## 🔑 Add Environment Variables

### หลัง Deploy สำเร็จ:

1. **Get URL:**
```bash
gcloud run services describe skillnexus-lms --region=asia-southeast1 --format="value(status.url)"
```

2. **Update Environment Variables:**
```bash
# แทนที่ [PASSWORD] และ [URL]
gcloud run services update skillnexus-lms ^
  --region=asia-southeast1 ^
  --set-env-vars="DATABASE_URL=postgresql://postgres:[PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres,NEXTAUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=,AUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=,NEXTAUTH_URL=[URL],AUTH_URL=[URL],NEXT_PUBLIC_URL=[URL],AUTH_TRUST_HOST=true,NODE_ENV=production"
```

---

## 🗄️ Run Migrations

```bash
# Set DATABASE_URL (แทนที่ [PASSWORD])
set DATABASE_URL=postgresql://postgres:[PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres

# Run migrations
npx prisma migrate deploy

# Seed database
npm run db:seed
```

---

## ✅ Test!

**URL:** https://skillnexus-lms-xxxxx-as.a.run.app

**Login:**
- Email: `admin@skillnexus.com`
- Password: `Admin@123!`

---

## 💰 ค่าใช้จ่าย (ประมาณการ)

### Configuration:
- Memory: 1GB
- CPU: 1
- Max instances: 5
- Min instances: 0

### ค่าใช้จ่าย:
- **0-1K requests/วัน:** ~฿0/เดือน (Free Tier)
- **1K-10K requests/วัน:** ~฿15-30/เดือน
- **10K-50K requests/วัน:** ~฿150-300/เดือน

### Balance ปัจจุบัน: THB 18.73
- **พอใช้:** 1-2 เดือน (traffic ปกติ)
- **Free Tier:** 2M requests/เดือน

---

## 🎯 ตั้ง Budget Alert

```bash
# ไปที่
https://console.cloud.google.com/billing/budgets

# สร้าง Budget
- Name: skillnexus-budget
- Budget: THB 50
- Alert at: 50%, 90%, 100%
- Email: joesive@gmail.com
```

---

## 📊 Monitor Usage

### View Metrics:
```
https://console.cloud.google.com/run/detail/asia-southeast1/skillnexus-lms/metrics
```

### View Logs:
```bash
gcloud run logs read skillnexus-lms --region=asia-southeast1 --limit=50
```

### Check Billing:
```
https://console.cloud.google.com/billing
```

---

## 🔧 Useful Commands

### View Service:
```bash
gcloud run services describe skillnexus-lms --region=asia-southeast1
```

### Update Config:
```bash
# ลด memory เพื่อประหยัด
gcloud run services update skillnexus-lms --region=asia-southeast1 --memory=512Mi

# ลด max instances
gcloud run services update skillnexus-lms --region=asia-southeast1 --max-instances=3
```

### Pause Service (ประหยัดเงิน):
```bash
# Set max instances = 0 (หยุดชั่วคราว)
gcloud run services update skillnexus-lms --region=asia-southeast1 --max-instances=0

# Resume
gcloud run services update skillnexus-lms --region=asia-southeast1 --max-instances=5
```

### Delete Service:
```bash
gcloud run services delete skillnexus-lms --region=asia-southeast1
```

---

## 💡 Tips ประหยัดเงิน

1. **ใช้ min-instances=0** (pay-per-use)
2. **ลด memory เป็น 512Mi** (ถ้าพอใช้)
3. **จำกัด max-instances=3-5**
4. **ตั้ง budget alert**
5. **ลบ service ถ้าไม่ใช้**

---

## 🆘 Troubleshooting

### Build Failed:
```bash
gcloud builds list --limit=5
```

### Out of Memory:
```bash
# เพิ่ม memory
gcloud run services update skillnexus-lms --region=asia-southeast1 --memory=2Gi
```

### Database Error:
```bash
# Test connection
psql "postgresql://postgres:[PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres"
```

---

## 📝 Checklist

- [ ] Install Google Cloud CLI (หรือใช้ Cloud Shell)
- [ ] Login & Set Project
- [ ] Enable APIs
- [ ] Deploy to Cloud Run
- [ ] Add Environment Variables
- [ ] Run Migrations
- [ ] Test Application
- [ ] Setup Budget Alert
- [ ] Monitor Usage

---

## 🎉 Ready to Deploy!

**Balance:** THB 18.73 ✅  
**Project:** skillnexus-lms-2025 ✅  
**Database:** Supabase ✅  

**เลือกวิธีที่ 1 หรือ 2 แล้ว Deploy เลย!** 🚀

---

**Good Luck! 🎉**
