# 🚀 Deploy to Google Cloud Run - Step by Step

## Account: joesive@gmail.com

---

## ⚡ Quick Deploy (5 นาที)

### Step 1: Setup Google Cloud Project (2 นาที)

1. **ไปที่ Google Cloud Console**
   ```
   https://console.cloud.google.com
   ```

2. **Login ด้วย joesive@gmail.com**

3. **สร้าง Project ใหม่**
   - คลิก "Select a project" ด้านบนซ้าย
   - คลิก "NEW PROJECT"
   - Project name: `skillnexus-lms-2025`
   - Project ID: `skillnexus-lms-2025`
   - คลิก "CREATE"

4. **Enable Billing** (จำเป็น แต่มี Free Tier)
   - ไปที่ Billing
   - เพิ่ม credit card (จะไม่เสียเงินถ้าอยู่ใน Free Tier)
   - Free Tier: 2M requests/เดือน ฟรี

---

### Step 2: Setup Database (3 นาที)

**ตัวเลือก A: Supabase (แนะนำ - ฟรี)**

1. **ไปที่ Supabase**
   ```
   https://supabase.com
   ```

2. **Sign up ด้วย joesive@gmail.com**

3. **สร้าง Project**
   - Name: `skillnexus-lms-2025`
   - Database Password: [สร้าง password แล้วบันทึกไว้]
   - Region: Southeast Asia (Singapore)
   - คลิก "Create new project"

4. **Get Connection String**
   - ไปที่ Settings → Database
   - คัดลอก "Connection string" (URI)
   - แทนที่ `[YOUR-PASSWORD]` ด้วย password ที่สร้างไว้

   ```
   postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

**ตัวเลือก B: Neon (ฟรี)**

1. ไปที่ https://neon.tech
2. Sign up ด้วย joesive@gmail.com
3. สร้าง Project → คัดลอก Connection String

---

### Step 3: Deploy to Cloud Run (5 นาที)

**วิธีที่ 1: ใช้ Cloud Shell (ง่ายที่สุด - ไม่ต้องติดตั้งอะไร!)**

1. **เปิด Cloud Shell**
   - ไปที่ https://console.cloud.google.com
   - คลิกปุ่ม "Activate Cloud Shell" (ด้านบนขวา)

2. **Clone Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/The-SkillNexus.git
   cd The-SkillNexus
   ```

3. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy skillnexus-lms \
     --source . \
     --region=asia-southeast1 \
     --platform=managed \
     --allow-unauthenticated \
     --memory=1Gi \
     --cpu=1 \
     --max-instances=10 \
     --min-instances=0
   ```

4. **รอ 3-5 นาที**
   - Cloud Build จะ build Docker image
   - Deploy ไปยัง Cloud Run
   - จะได้ URL: `https://skillnexus-lms-xxxxx-as.a.run.app`

---

### Step 4: Add Environment Variables (2 นาที)

1. **ไปที่ Cloud Run Console**
   ```
   https://console.cloud.google.com/run
   ```

2. **คลิกที่ service: skillnexus-lms**

3. **คลิก "EDIT & DEPLOY NEW REVISION"**

4. **ไปที่ "Variables & Secrets" tab**

5. **เพิ่ม Environment Variables:**

   ```
   DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   
   NEXTAUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
   
   AUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
   
   NEXTAUTH_URL=https://skillnexus-lms-xxxxx-as.a.run.app
   
   AUTH_URL=https://skillnexus-lms-xxxxx-as.a.run.app
   
   NEXT_PUBLIC_URL=https://skillnexus-lms-xxxxx-as.a.run.app
   
   AUTH_TRUST_HOST=true
   
   NODE_ENV=production
   ```

6. **คลิก "DEPLOY"**

---

### Step 5: Run Database Migrations (2 นาที)

**ใช้ Cloud Shell:**

1. **เปิด Cloud Shell**

2. **Run Migrations**
   ```bash
   cd The-SkillNexus
   
   # Set DATABASE_URL
   export DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
   
   # Install dependencies
   npm install
   
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate deploy
   
   # Seed database
   npm run db:seed
   ```

---

### Step 6: Test Your App! 🎉

1. **เปิด URL**
   ```
   https://skillnexus-lms-xxxxx-as.a.run.app
   ```

2. **Login ด้วย:**
   - Email: `admin@skillnexus.com`
   - Password: `Admin@123!`

3. **เสร็จแล้ว!** 🎉

---

## 🔧 Optional: Custom Domain

### Setup www.uppowerskill.com

1. **ไปที่ Cloud Run Console**
   ```
   https://console.cloud.google.com/run
   ```

2. **คลิกที่ service: skillnexus-lms**

3. **ไปที่ "MANAGE CUSTOM DOMAINS"**

4. **คลิก "ADD MAPPING"**

5. **เลือก domain: www.uppowerskill.com**

6. **Update DNS Records:**
   - Google จะบอก DNS records ที่ต้องเพิ่ม
   - ไปที่ domain registrar (GoDaddy/Namecheap/etc.)
   - เพิ่ม CNAME record ตามที่ Google บอก

7. **รอ DNS propagate (5-30 นาที)**

8. **เสร็จแล้ว!** SSL certificate จะถูกสร้างอัตโนมัติ

---

## 💰 ค่าใช้จ่าย

### Free Tier (ทุกเดือน):
- ✅ 2 million requests
- ✅ 360,000 GB-seconds
- ✅ 180,000 vCPU-seconds

### ประมาณการ:
- **0-10K requests/วัน**: $0/เดือน (Free Tier)
- **10K-50K requests/วัน**: $5-10/เดือน
- **50K-100K requests/วัน**: $15-20/เดือน

### Database (Supabase):
- ✅ Free Tier: 500MB storage, 2GB bandwidth
- ✅ ฟรีตลอดไป!

**รวม: $0-10/เดือน** 🎉

---

## 🔍 Monitoring & Logs

### ดู Logs:
```bash
# ใน Cloud Shell
gcloud run logs read skillnexus-lms --region=asia-southeast1 --limit=50
```

### ดู Metrics:
```
https://console.cloud.google.com/run/detail/asia-southeast1/skillnexus-lms/metrics
```

---

## 🚀 CI/CD (Auto Deploy)

### Setup GitHub Actions

1. **สร้าง Service Account**
   ```bash
   gcloud iam service-accounts create github-actions \
     --display-name="GitHub Actions"
   
   gcloud projects add-iam-policy-binding skillnexus-lms-xxxxx \
     --member="serviceAccount:github-actions@skillnexus-lms-xxxxx.iam.gserviceaccount.com" \
     --role="roles/run.admin"
   
   gcloud iam service-accounts keys create key.json \
     --iam-account=github-actions@skillnexus-lms-xxxxx.iam.gserviceaccount.com
   ```

2. **เพิ่ม Secret ใน GitHub**
   - Settings → Secrets → New repository secret
   - Name: `GCP_SA_KEY`
   - Value: [เนื้อหาใน key.json]

3. **Push to GitHub**
   ```bash
   git push origin main
   ```

4. **Auto deploy!** 🚀

---

## 📝 Checklist

- [ ] สร้าง Google Cloud Project
- [ ] Enable Billing
- [ ] Setup Database (Supabase/Neon)
- [ ] Deploy to Cloud Run
- [ ] Add Environment Variables
- [ ] Run Database Migrations
- [ ] Test Application
- [ ] (Optional) Setup Custom Domain
- [ ] (Optional) Setup CI/CD

---

## 🆘 Troubleshooting

### Build Failed
```bash
# ดู logs
gcloud builds log [BUILD_ID]

# ลอง build ใหม่
gcloud run deploy skillnexus-lms --source .
```

### Database Connection Error
```bash
# ตรวจสอบ DATABASE_URL
gcloud run services describe skillnexus-lms --region=asia-southeast1

# Update DATABASE_URL
gcloud run services update skillnexus-lms \
  --region=asia-southeast1 \
  --update-env-vars="DATABASE_URL=postgresql://..."
```

### 500 Error
```bash
# ดู logs
gcloud run logs read skillnexus-lms --region=asia-southeast1 --limit=100
```

---

## 💡 Tips

- ✅ ใช้ Cloud Shell เพื่อไม่ต้องติดตั้ง CLI
- ✅ ใช้ Supabase สำหรับ database ฟรี
- ✅ Set min-instances=0 เพื่อประหยัดค่าใช้จ่าย
- ✅ Enable Cloud Build API ก่อน deploy
- ✅ ใช้ asia-southeast1 region (ใกล้ไทย)

---

## 🎉 Success!

Your SkillNexus LMS is now live on Google Cloud Run!

**URL:** https://skillnexus-lms-xxxxx-as.a.run.app
**Account:** joesive@gmail.com
**Cost:** $0-10/month

---

**Happy Learning! 🚀**
