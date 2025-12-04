# 🚀 Vercel Deployment Guide - SkillNexus LMS

## 📋 Pre-Deployment Checklist

### ✅ Step 1: เตรียม Database (PostgreSQL)

คุณต้องมี PostgreSQL Database สำหรับ Production:

**ตัวเลือก A: Vercel Postgres (แนะนำ)**
1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือก Storage → Create Database → Postgres
3. คัดลอก `DATABASE_URL` ที่ได้

**ตัวเลือก B: Supabase (ฟรี)**
1. ไปที่ [Supabase](https://supabase.com)
2. สร้าง Project ใหม่
3. ไปที่ Settings → Database → Connection String
4. คัดลอก Connection String (Transaction Mode)

**ตัวเลือก C: Railway (ฟรี)**
1. ไปที่ [Railway](https://railway.app)
2. สร้าง PostgreSQL Database
3. คัดลอก `DATABASE_URL`

**ตัวเลือก D: Neon (ฟรี)**
1. ไปที่ [Neon](https://neon.tech)
2. สร้าง Project ใหม่
3. คัดลอก Connection String

---

## 🔧 Step 2: เตรียม Environment Variables

คุณต้องเตรียม Environment Variables ต่อไปนี้:

### Required Variables:
```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_SECRET="generate-random-secret-here"
NEXTAUTH_URL="https://your-app.vercel.app"

# App URL
NEXT_PUBLIC_URL="https://your-app.vercel.app"
```

### Optional Variables (ถ้าใช้งาน):
```bash
# OpenAI (สำหรับ AI Chatbot)
OPENAI_API_KEY="sk-..."

# Redis (สำหรับ Caching)
REDIS_URL="redis://..."

# Email (Resend)
RESEND_API_KEY="re_..."

# Stripe (Payment)
STRIPE_SECRET_KEY="sk_..."

# Google SSO
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Azure AD SSO
AZURE_CLIENT_ID="..."
AZURE_CLIENT_SECRET="..."
AZURE_TENANT_ID="common"
```

### 🔐 Generate NEXTAUTH_SECRET:
```bash
# วิธีที่ 1: ใช้ OpenSSL
openssl rand -base64 32

# วิธีที่ 2: ใช้ Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# วิธีที่ 3: ใช้ Online Generator
# https://generate-secret.vercel.app/32
```

---

## 🚀 Step 3: Deploy to Vercel

### วิธีที่ 1: Deploy ผ่าน Vercel Dashboard (แนะนำสำหรับครั้งแรก)

1. **Push Code ไปยัง GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Ready for Vercel"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/skillnexus-lms.git
   git push -u origin main
   ```

2. **Import Project ใน Vercel**
   - ไปที่ [Vercel Dashboard](https://vercel.com/new)
   - คลิก "Import Project"
   - เลือก Repository ของคุณ
   - คลิก "Import"

3. **Configure Project**
   - Framework Preset: **Next.js** (จะเลือกอัตโนมัติ)
   - Root Directory: `./` (default)
   - Build Command: `npm run vercel-build` (หรือปล่อยว่าง)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**
   - คลิก "Environment Variables"
   - เพิ่มตัวแปรทั้งหมดจาก Step 2
   - เลือก Environment: **Production, Preview, Development**

5. **Deploy**
   - คลิก "Deploy"
   - รอ 2-5 นาที
   - เสร็จแล้ว! 🎉

---

### วิธีที่ 2: Deploy ผ่าน Vercel CLI

1. **ติดตั้ง Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # Deploy to Preview
   vercel

   # Deploy to Production
   vercel --prod
   ```

4. **Add Environment Variables**
   ```bash
   vercel env add DATABASE_URL production
   vercel env add NEXTAUTH_SECRET production
   vercel env add NEXTAUTH_URL production
   # ... เพิ่มตัวแปรอื่นๆ
   ```

---

## 🗄️ Step 4: Setup Database Schema

หลังจาก Deploy แล้ว คุณต้อง Setup Database Schema:

### วิธีที่ 1: ใช้ Prisma Migrate (แนะนำ)

1. **สร้าง Migration**
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Deploy Migration to Production**
   ```bash
   # Set DATABASE_URL ใน .env
   DATABASE_URL="your-production-database-url"
   
   # Run migration
   npx prisma migrate deploy
   ```

### วิธีที่ 2: ใช้ Prisma DB Push (รวดเร็ว)

```bash
# Set DATABASE_URL
DATABASE_URL="your-production-database-url"

# Push schema
npx prisma db push
```

### วิธีที่ 3: ใช้ Vercel CLI

```bash
# Connect to production
vercel env pull .env.production

# Run migration
npx prisma migrate deploy
```

---

## 🌱 Step 5: Seed Database (Optional)

ถ้าต้องการข้อมูลตัวอย่าง:

```bash
# Set DATABASE_URL
DATABASE_URL="your-production-database-url"

# Run seed
npm run db:seed
```

---

## ✅ Step 6: Verify Deployment

1. **เช็ค URL**
   - เปิด `https://your-app.vercel.app`
   - ควรเห็นหน้า Landing Page

2. **ทดสอบ Login**
   - ไปที่ `/login`
   - ลองเข้าสู่ระบบด้วย Admin Account

3. **เช็ค Database Connection**
   - ไปที่ `/dashboard`
   - ถ้าโหลดได้ แสดงว่า Database เชื่อมต่อสำเร็จ

4. **เช็ค API Health**
   - เปิด `https://your-app.vercel.app/api/health`
   - ควรได้ Response: `{"status": "ok"}`

---

## 🔧 Troubleshooting

### ❌ Build Failed

**Error: Prisma Client not generated**
```bash
# Solution: เพิ่ม postinstall script
"postinstall": "prisma generate"
```

**Error: Database connection failed**
```bash
# Solution: เช็ค DATABASE_URL
# ต้องเป็น PostgreSQL URL ที่ถูกต้อง
# Format: postgresql://user:password@host:5432/database
```

**Error: NEXTAUTH_SECRET is not set**
```bash
# Solution: เพิ่ม Environment Variable
vercel env add NEXTAUTH_SECRET production
```

### ❌ Runtime Errors

**Error: Cannot connect to database**
- เช็คว่า DATABASE_URL ถูกต้อง
- เช็คว่า Database ยังทำงานอยู่
- ลอง Redeploy: `vercel --prod`

**Error: 500 Internal Server Error**
- เช็ค Logs: `vercel logs`
- เช็ค Environment Variables
- เช็ค Database Schema

---

## 📊 Monitoring & Logs

### View Logs
```bash
# Real-time logs
vercel logs --follow

# Recent logs
vercel logs
```

### View Deployment Status
```bash
vercel ls
```

### View Environment Variables
```bash
vercel env ls
```

---

## 🔄 Update Deployment

### Auto Deploy (แนะนำ)
- Push code ไปยัง GitHub
- Vercel จะ Deploy อัตโนมัติ

### Manual Deploy
```bash
# Deploy to Production
vercel --prod

# Deploy specific branch
vercel --prod --branch main
```

---

## 🎯 Performance Optimization

### 1. Enable Edge Functions
```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

### 2. Enable Caching
- ใช้ Redis (Upstash) สำหรับ Caching
- ใช้ Vercel KV สำหรับ Edge Caching

### 3. Optimize Images
- ใช้ Next.js Image Optimization
- Upload images ไปยัง CDN (Cloudinary, AWS S3)

---

## 💰 Cost Estimation

### Vercel (Hobby Plan - FREE)
- ✅ Unlimited Deployments
- ✅ 100GB Bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom Domain
- ⚠️ Serverless Function: 100GB-Hrs/month

### Vercel (Pro Plan - $20/month)
- ✅ Everything in Hobby
- ✅ 1TB Bandwidth/month
- ✅ Advanced Analytics
- ✅ Team Collaboration

### Database Options
- **Vercel Postgres**: $0.25/GB/month
- **Supabase**: Free (500MB), $25/month (8GB)
- **Railway**: Free ($5 credit), $5/month
- **Neon**: Free (3GB), $19/month (Unlimited)

---

## 🔐 Security Checklist

- ✅ NEXTAUTH_SECRET ต้องเป็น Random String
- ✅ DATABASE_URL ต้องใช้ SSL Connection
- ✅ ไม่ Commit .env ไปยัง Git
- ✅ ใช้ Environment Variables สำหรับ Secrets
- ✅ Enable CORS Protection
- ✅ Enable Rate Limiting

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)

---

## 🆘 Need Help?

- Vercel Discord: https://vercel.com/discord
- Next.js Discord: https://nextjs.org/discord
- GitHub Issues: https://github.com/YOUR_USERNAME/skillnexus-lms/issues

---

**🎉 ยินดีด้วย! SkillNexus LMS ของคุณพร้อม Deploy แล้ว!**
