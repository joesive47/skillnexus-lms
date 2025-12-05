# ⚡ Quick Deploy to Google Cloud Run

## Project: skillnexus-lms-2025
## Account: joesive@gmail.com

---

## 🚀 Deploy ใน 10 นาที!

### Step 1: Setup Project (2 นาที)

1. **ไปที่:** https://console.cloud.google.com
2. **Login:** joesive@gmail.com
3. **สร้าง Project:**
   - คลิก "NEW PROJECT"
   - Project name: `skillnexus-lms-2025`
   - Project ID: `skillnexus-lms-2025`
   - คลิก "CREATE"
4. **Enable Billing** (จำเป็น - แต่มี Free Tier)

---

### Step 2: Setup Database (3 นาที)

**ใช้ Supabase (ฟรี):**

1. **ไปที่:** https://supabase.com
2. **Sign up:** joesive@gmail.com
3. **New project:**
   - Name: `skillnexus-lms-2025`
   - Database Password: [สร้างและบันทึก]
   - Region: Southeast Asia (Singapore)
4. **Get Connection String:**
   - Settings → Database → Connection string (URI)
   - คัดลอกและแทนที่ `[YOUR-PASSWORD]`

---

### Step 3: Deploy (5 นาที)

**ใช้ Cloud Shell:**

1. **เปิด Cloud Shell** (ปุ่มด้านบนขวาใน Console)

2. **Set Project:**
```bash
gcloud config set project skillnexus-lms-2025
```

3. **Enable APIs:**
```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com
```

4. **Clone & Deploy:**
```bash
# Clone repository
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
  --max-instances=10 \
  --min-instances=0
```

5. **รอ 3-5 นาที** ☕

6. **จะได้ URL:** `https://skillnexus-lms-xxxxx-as.a.run.app`

---

### Step 4: Add Environment Variables (2 นาที)

1. **ไปที่:** https://console.cloud.google.com/run
2. **คลิก:** skillnexus-lms
3. **คลิก:** "EDIT & DEPLOY NEW REVISION"
4. **Variables & Secrets tab**
5. **Add variables:**

```bash
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres

NEXTAUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=

AUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=

NEXTAUTH_URL=https://skillnexus-lms-xxxxx-as.a.run.app

AUTH_URL=https://skillnexus-lms-xxxxx-as.a.run.app

NEXT_PUBLIC_URL=https://skillnexus-lms-xxxxx-as.a.run.app

AUTH_TRUST_HOST=true

NODE_ENV=production
```

6. **คลิก:** "DEPLOY"

---

### Step 5: Run Migrations (2 นาที)

**ใน Cloud Shell:**

```bash
cd The-SkillNexus

# Set DATABASE_URL
export DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres"

# Install & Generate
npm install
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed data
npm run db:seed
```

---

## ✅ เสร็จแล้ว! 🎉

**URL:** https://skillnexus-lms-xxxxx-as.a.run.app

**Login:**
- Email: `admin@skillnexus.com`
- Password: `Admin@123!`

---

## 🔧 Commands Reference

### View Logs:
```bash
gcloud run logs read skillnexus-lms --region=asia-southeast1 --limit=50
```

### Update Environment Variables:
```bash
gcloud run services update skillnexus-lms \
  --region=asia-southeast1 \
  --update-env-vars="KEY=VALUE"
```

### Redeploy:
```bash
gcloud run deploy skillnexus-lms \
  --source . \
  --region=asia-southeast1
```

### Delete Service:
```bash
gcloud run services delete skillnexus-lms --region=asia-southeast1
```

---

## 💰 Cost

- **Cloud Run:** $0-10/month (Free Tier: 2M requests)
- **Supabase:** $0/month (Free forever)
- **Total:** $0-10/month

---

## 🎯 Custom Domain (Optional)

### Setup www.uppowerskill.com:

1. **Cloud Run Console** → skillnexus-lms
2. **MANAGE CUSTOM DOMAINS**
3. **ADD MAPPING** → www.uppowerskill.com
4. **Update DNS** ตามที่ Google บอก
5. **รอ 5-30 นาที**
6. **SSL auto-generated!** ✅

---

## 📝 Checklist

- [ ] สร้าง Google Cloud Project: `skillnexus-lms-2025`
- [ ] Enable Billing
- [ ] Setup Supabase Database
- [ ] Deploy to Cloud Run
- [ ] Add Environment Variables
- [ ] Run Database Migrations
- [ ] Test Application
- [ ] (Optional) Setup Custom Domain

---

## 🆘 Need Help?

**Build Failed:**
```bash
gcloud builds log --region=asia-southeast1
```

**Database Error:**
```bash
# Test connection
psql "postgresql://postgres:[YOUR_PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres"
```

**View Service Details:**
```bash
gcloud run services describe skillnexus-lms --region=asia-southeast1
```

---

**Happy Deploying! 🚀**
