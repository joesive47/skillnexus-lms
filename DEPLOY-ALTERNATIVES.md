# 🚀 Alternative Deployment Options

เนื่องจาก Vercel Free tier มีข้อจำกัด 100 deployments/วัน นี่คือทางเลือกอื่นที่ Deploy ได้ทันที:

---

## ⭐ Option 1: Railway (แนะนำที่สุด!)

**ข้อดี:**
- ✅ มี PostgreSQL Database ในตัว (ฟรี)
- ✅ Deploy ง่ายที่สุด
- ✅ Auto SSL/HTTPS
- ✅ Custom domain ฟรี
- ✅ $5 credit ฟรีทุกเดือน

**ขั้นตอน:**

### 1. สร้าง Account
```
https://railway.app
```

### 2. Create New Project
```
1. คลิก "New Project"
2. เลือก "Deploy from GitHub repo"
3. เลือก repository: skillnexus-lms
```

### 3. Add PostgreSQL Database
```
1. คลิก "+ New"
2. เลือก "Database" → "PostgreSQL"
3. Railway จะสร้าง DATABASE_URL ให้อัตโนมัติ
```

### 4. Add Environment Variables
```
Settings → Variables → Add:

NEXTAUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
AUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
NEXTAUTH_URL=https://your-app.railway.app
AUTH_URL=https://your-app.railway.app
NEXT_PUBLIC_URL=https://your-app.railway.app
AUTH_TRUST_HOST=true
NODE_ENV=production
```

### 5. Deploy & Run Migrations
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migrations
railway run npx prisma migrate deploy

# Seed database
railway run npm run db:seed
```

### 6. Custom Domain (Optional)
```
Settings → Domains → Add Custom Domain
```

**เวลา Deploy:** 3-5 นาที  
**ราคา:** ฟรี ($5 credit/เดือน)

---

## 🌐 Option 2: Netlify

**ข้อดี:**
- ✅ ไม่จำกัด deployments
- ✅ Deploy เร็วมาก
- ✅ Auto SSL/HTTPS
- ✅ Custom domain ฟรี

**ข้อจำกัด:**
- ⚠️ ต้องใช้ External Database (Supabase/Neon)

**ขั้นตอน:**

### 1. Setup Database (เลือก 1 ใน 2)

**A. Supabase (แนะนำ):**
```
1. https://supabase.com
2. Create Project
3. Settings → Database → Connection String
4. คัดลอก Connection String
```

**B. Neon:**
```
1. https://neon.tech
2. Create Project
3. คัดลอก Connection String
```

### 2. Deploy to Netlify
```
1. https://app.netlify.com
2. "Add new site" → "Import from Git"
3. เลือก repository: skillnexus-lms
4. Build command: npm run build
5. Publish directory: .next
```

### 3. Add Environment Variables
```
Site settings → Environment variables:

DATABASE_URL=postgresql://... (จาก Supabase/Neon)
NEXTAUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
AUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
NEXTAUTH_URL=https://your-app.netlify.app
AUTH_URL=https://your-app.netlify.app
NEXT_PUBLIC_URL=https://your-app.netlify.app
AUTH_TRUST_HOST=true
NODE_ENV=production
```

### 4. Run Migrations
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link site
netlify link

# Run migrations
netlify env:import .env.production
npx prisma migrate deploy
npm run db:seed
```

**เวลา Deploy:** 2-3 นาที  
**ราคา:** ฟรี

---

## 🎨 Option 3: Render

**ข้อดี:**
- ✅ มี PostgreSQL Database ในตัว (ฟรี)
- ✅ Auto SSL/HTTPS
- ✅ Custom domain ฟรี
- ✅ ไม่จำกัด deployments

**ข้อจำกัด:**
- ⚠️ Free tier มี cold start (ช้าหลังไม่ใช้งาน 15 นาที)

**ขั้นตอน:**

### 1. Create Account
```
https://render.com
```

### 2. Create PostgreSQL Database
```
1. Dashboard → "New +"
2. เลือก "PostgreSQL"
3. Name: skillnexus-db
4. Free tier
5. Create Database
6. คัดลอก "Internal Database URL"
```

### 3. Create Web Service
```
1. Dashboard → "New +"
2. เลือก "Web Service"
3. Connect GitHub repository: skillnexus-lms
4. Name: skillnexus-lms
5. Build Command: npm install && npm run build
6. Start Command: npm start
```

### 4. Add Environment Variables
```
Environment → Add:

DATABASE_URL=postgresql://... (จาก step 2)
NEXTAUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
AUTH_SECRET=hJtNdWscf3RFT97SZ3V/UesWs3X86lgN8zfLTMD0qJA=
NEXTAUTH_URL=https://your-app.onrender.com
AUTH_URL=https://your-app.onrender.com
NEXT_PUBLIC_URL=https://your-app.onrender.com
AUTH_TRUST_HOST=true
NODE_ENV=production
```

### 5. Run Migrations
```bash
# ใช้ Render Shell
1. Dashboard → Web Service → Shell
2. รัน:
npx prisma migrate deploy
npm run db:seed
```

**เวลา Deploy:** 5-10 นาที  
**ราคา:** ฟรี

---

## 📊 เปรียบเทียบ

| Platform | Database | Deploy Time | Cold Start | Limit | แนะนำ |
|----------|----------|-------------|------------|-------|-------|
| **Railway** | ✅ ฟรี | 3-5 นาที | ❌ ไม่มี | $5/เดือน | ⭐⭐⭐⭐⭐ |
| **Netlify** | ❌ ต้องซื้อ | 2-3 นาที | ❌ ไม่มี | ไม่จำกัด | ⭐⭐⭐⭐ |
| **Render** | ✅ ฟรี | 5-10 นาที | ⚠️ มี | ไม่จำกัด | ⭐⭐⭐ |
| **Vercel** | ❌ ต้องซื้อ | 2-3 นาที | ❌ ไม่มี | 100/วัน | ⭐⭐⭐⭐ |

---

## 🎯 คำแนะนำ

### สำหรับ Production (แนะนำ):
```
Railway + PostgreSQL
- มี Database ในตัว
- ไม่มี cold start
- Deploy ง่าย
- $5 credit ฟรี/เดือน
```

### สำหรับ Testing:
```
Netlify + Supabase
- Deploy เร็วที่สุด
- ไม่จำกัด deployments
- Database ฟรีจาก Supabase
```

### สำหรับ Budget:
```
Render + PostgreSQL
- ฟรีทั้งหมด
- มี Database ในตัว
- ยอมรับ cold start ได้
```

---

## 🚀 Quick Start (Railway - แนะนำ!)

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for Railway deployment"
git push origin main

# 2. Deploy
# ไปที่ https://railway.app
# คลิก "New Project" → "Deploy from GitHub"
# เลือก repository

# 3. Add PostgreSQL
# คลิก "+ New" → "Database" → "PostgreSQL"

# 4. Add Environment Variables
# Settings → Variables → Add variables

# 5. Run Migrations
npm install -g @railway/cli
railway login
railway link
railway run npx prisma migrate deploy
railway run npm run db:seed

# 6. เสร็จแล้ว! 🎉
```

---

## 💡 Tips

- ✅ Railway เหมาะที่สุดสำหรับ Next.js + PostgreSQL
- ✅ ใช้ Supabase ถ้าต้องการ Database แยก
- ✅ Render ฟรีแต่มี cold start
- ✅ Netlify เร็วแต่ต้องใช้ External Database

---

**เลือก Railway ถ้าต้องการ Deploy เร็วที่สุด! 🚀**
