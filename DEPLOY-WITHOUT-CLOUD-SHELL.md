# 🚀 Deploy Google Cloud Run - ไม่ต้องใช้ Cloud Shell

## วิธีที่ 1: Deploy ผ่าน Console (ง่ายที่สุด!)

### Step 1: Push Code to GitHub

```bash
# ใน local terminal (Windows)
cd c:\API\The-SkillNexus

git add .
git commit -m "Ready for Google Cloud Run"
git push origin main
```

### Step 2: Deploy ผ่าน Cloud Run Console

1. **ไปที่ Cloud Run:**
   ```
   https://console.cloud.google.com/run
   ```

2. **คลิก "CREATE SERVICE"**

3. **เลือก "Continuously deploy from a repository"**

4. **Setup Cloud Build:**
   - คลิก "SET UP WITH CLOUD BUILD"
   - เลือก "GitHub"
   - Authenticate GitHub
   - เลือก repository: `The-SkillNexus`
   - Branch: `main`
   - Build type: `Dockerfile`
   - คลิก "SAVE"

5. **Configure Service:**
   - Service name: `skillnexus-lms`
   - Region: `asia-southeast1`
   - Authentication: `Allow unauthenticated invocations`
   - CPU allocation: `CPU is only allocated during request processing`
   - Memory: `1 GiB`
   - Maximum instances: `10`
   - Minimum instances: `0`

6. **Add Environment Variables:**
   - คลิก "VARIABLES & SECRETS"
   - เพิ่ม variables:
   ```
   DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres
   NEXTAUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
   AUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
   AUTH_TRUST_HOST=true
   NODE_ENV=production
   ```

7. **คลิก "CREATE"**

8. **รอ 5-10 นาที** ☕

9. **จะได้ URL!** 🎉

### Step 3: Update URLs

1. **คัดลอก URL** ที่ได้: `https://skillnexus-lms-xxxxx-as.a.run.app`

2. **กลับไปที่ Cloud Run Console**

3. **คลิก service → EDIT & DEPLOY NEW REVISION**

4. **Update variables:**
   ```
   NEXTAUTH_URL=https://skillnexus-lms-xxxxx-as.a.run.app
   AUTH_URL=https://skillnexus-lms-xxxxx-as.a.run.app
   NEXT_PUBLIC_URL=https://skillnexus-lms-xxxxx-as.a.run.app
   ```

5. **คลิก "DEPLOY"**

### Step 4: Run Migrations

**ใช้ Supabase SQL Editor:**

1. **ไปที่ Supabase Dashboard:**
   ```
   https://supabase.com/dashboard
   ```

2. **เลือก project: skillnexus-lms-2025**

3. **ไปที่ SQL Editor**

4. **Run migrations ด้วย local:**
   ```bash
   # ใน local terminal
   set DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres
   
   npx prisma migrate deploy
   npm run db:seed
   ```

---

## วิธีที่ 2: ใช้ Google Cloud CLI (Local)

### Step 1: Install Google Cloud CLI

**Windows:**
```
https://cloud.google.com/sdk/docs/install
```
- Download installer
- Run และติดตั้ง
- Restart terminal

### Step 2: Login & Deploy

```bash
# Login
gcloud auth login

# Set project
gcloud config set project skillnexus-lms-2025

# Enable APIs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com

# Deploy
cd c:\API\The-SkillNexus

gcloud run deploy skillnexus-lms \
  --source . \
  --region=asia-southeast1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=1Gi \
  --set-env-vars="DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres,NEXTAUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=,AUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=,AUTH_TRUST_HOST=true,NODE_ENV=production"
```

### Step 3: Update URLs & Run Migrations

```bash
# Get URL
gcloud run services describe skillnexus-lms --region=asia-southeast1 --format="value(status.url)"

# Update URLs (แทนที่ URL ที่ได้)
gcloud run services update skillnexus-lms \
  --region=asia-southeast1 \
  --update-env-vars="NEXTAUTH_URL=https://skillnexus-lms-xxxxx-as.a.run.app,AUTH_URL=https://skillnexus-lms-xxxxx-as.a.run.app,NEXT_PUBLIC_URL=https://skillnexus-lms-xxxxx-as.a.run.app"

# Run migrations
set DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.sorvxmipetkhofhhqjio.supabase.co:5432/postgres
npx prisma migrate deploy
npm run db:seed
```

---

## วิธีที่ 3: ใช้ Railway (ทางเลือก - ง่ายกว่า!)

ถ้า Google Cloud ยุ่งยาก ลอง Railway แทน:

### Step 1: Deploy to Railway

1. **ไปที่:** https://railway.app
2. **Sign up with GitHub**
3. **New Project → Deploy from GitHub**
4. **เลือก repository: The-SkillNexus**
5. **Add PostgreSQL Database** (คลิก + New → Database → PostgreSQL)
6. **Add Environment Variables:**
   ```
   NEXTAUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
   AUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
   AUTH_TRUST_HOST=true
   NODE_ENV=production
   ```
7. **Deploy อัตโนมัติ!** 🎉

### Step 2: Run Migrations

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migrations
railway run npx prisma migrate deploy
railway run npm run db:seed
```

**เสร็จแล้ว!** URL: `https://your-app.railway.app`

---

## 📊 เปรียบเทียบ

| วิธี | ความยาก | เวลา | ต้องติดตั้ง |
|------|---------|------|-------------|
| **Console (วิธีที่ 1)** | ⭐ ง่าย | 10 นาที | ❌ ไม่ต้อง |
| **Local CLI (วิธีที่ 2)** | ⭐⭐ ปานกลาง | 15 นาที | ✅ ต้อง |
| **Railway (วิธีที่ 3)** | ⭐ ง่ายที่สุด | 5 นาที | ❌ ไม่ต้อง |

---

## 🎯 แนะนำ

### ถ้าไม่เจอ Cloud Shell:
→ **ใช้วิธีที่ 1** (Deploy ผ่าน Console)

### ถ้าอยากใช้ command line:
→ **ใช้วิธีที่ 2** (Install CLI local)

### ถ้าอยาก deploy ง่ายที่สุด:
→ **ใช้วิธีที่ 3** (Railway)

---

## 💡 Tips

### หา Cloud Shell:
- มองหา icon รูป `>_` ด้านบนขวา
- หรือกด `Ctrl + ~` (Windows)
- หรือไปที่ Menu → Tools → Cloud Shell

### ถ้ายังไม่เจอ:
- ลอง refresh หน้า Console
- ตรวจสอบว่า enable Cloud Shell API แล้ว
- ลองใช้ browser อื่น (Chrome แนะนำ)

---

## 🆘 ต้องการความช่วยเหลือ?

**แนะนำ: ใช้วิธีที่ 1 (Deploy ผ่าน Console)**
- ไม่ต้องติดตั้งอะไร
- ทำผ่าน web browser
- ง่ายที่สุด!

หรือถ้าต้องการ deploy เร็วๆ:
**ใช้ Railway แทน!** (วิธีที่ 3)

---

**เลือกวิธีที่เหมาะกับคุณ! 🚀**
