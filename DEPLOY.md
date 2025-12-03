# 🚀 Deploy SkillNexus LMS to Vercel

## วิธีที่ 1: Deploy ผ่าน Vercel Dashboard (แนะนำ - ง่ายที่สุด)

### ขั้นตอน:

1. **ไปที่ Vercel Dashboard**
   - เปิด https://vercel.com/new
   - Login ด้วย GitHub/GitLab/Bitbucket

2. **Import Repository**
   - คลิก "Import Git Repository"
   - เลือก `The-SkillNexus` repository
   - คลิก "Import"

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detect)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto)
   - Output Directory: `.next` (auto)

4. **Environment Variables** (สำคัญมาก!)
   
   คลิก "Environment Variables" แล้วเพิ่ม:

   ```env
   # Required
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   NEXTAUTH_SECRET=your-random-secret-key-min-32-chars
   NEXTAUTH_URL=https://your-app.vercel.app
   
   # Optional (ถ้ามี)
   OPENAI_API_KEY=sk-...
   REDIS_URL=redis://...
   RESEND_API_KEY=re_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

5. **Deploy**
   - คลิก "Deploy"
   - รอ 2-3 นาที
   - เสร็จแล้ว! 🎉

---

## วิธีที่ 2: Deploy ผ่าน Vercel CLI

### ขั้นตอน:

1. **Install Vercel CLI**
   ```powershell
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```powershell
   vercel login
   ```

3. **Deploy to Production**
   ```powershell
   vercel --prod
   ```

4. **Set Environment Variables**
   ```powershell
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   ```

5. **Redeploy**
   ```powershell
   vercel --prod
   ```

---

## 📋 Environment Variables ที่ต้องตั้ง

### Required (จำเป็น):
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret (32+ chars)
- `NEXTAUTH_URL` - Your Vercel URL

### Optional (ถ้าใช้ฟีเจอร์):
- `OPENAI_API_KEY` - สำหรับ AI Chatbot
- `REDIS_URL` - สำหรับ Caching
- `RESEND_API_KEY` - สำหรับส่ง Email
- `STRIPE_SECRET_KEY` - สำหรับ Payment

---

## 🗄️ Database Setup (PostgreSQL)

### ตัวเลือก 1: Vercel Postgres (แนะนำ)
```powershell
# ใน Vercel Dashboard
1. ไปที่ Storage → Create Database
2. เลือก Postgres
3. Copy DATABASE_URL
4. Paste ใน Environment Variables
```

### ตัวเลือก 2: Supabase (Free)
```powershell
1. ไปที่ https://supabase.com
2. Create New Project
3. Copy Connection String
4. Format: postgresql://postgres:[password]@[host]:5432/postgres
```

### ตัวเลือก 3: Railway (Free)
```powershell
1. ไปที่ https://railway.app
2. New Project → Provision PostgreSQL
3. Copy DATABASE_URL
```

---

## 🔧 Post-Deployment Setup

### 1. Run Database Migrations
```powershell
# ใน Vercel Dashboard → Settings → Functions
# หรือใช้ Vercel CLI:
vercel env pull
npx prisma migrate deploy
npx prisma db seed
```

### 2. Test Login
```
URL: https://your-app.vercel.app/login

Admin: admin@skillnexus.com / admin123
Teacher: teacher@skillnexus.com / teacher123
Student: student@skillnexus.com / student123
```

---

## 🔐 Generate NEXTAUTH_SECRET

```powershell
# Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# หรือใช้ online
https://generate-secret.vercel.app/32
```

---

## ⚡ Performance Tips

1. **Enable Edge Runtime** (ถ้าต้องการ)
   - แก้ไข `src/app/api/*/route.ts`
   - เพิ่ม: `export const runtime = 'edge'`

2. **Enable ISR** (Incremental Static Regeneration)
   - แก้ไข `src/app/page.tsx`
   - เพิ่ม: `export const revalidate = 60`

3. **Enable Image Optimization**
   - ใช้ `next/image` component
   - Vercel จะ optimize อัตโนมัติ

---

## 🐛 Troubleshooting

### Build Failed?
```powershell
# Check logs
vercel logs

# Common fixes:
1. ตรวจสอบ Environment Variables
2. ตรวจสอบ DATABASE_URL format
3. Run `npm run build` locally ก่อน
```

### Database Connection Error?
```powershell
# Test connection
npx prisma db push

# Check:
1. DATABASE_URL ถูกต้องไหม?
2. Database accessible from internet?
3. SSL mode: ?sslmode=require
```

### NextAuth Error?
```powershell
# Check:
1. NEXTAUTH_SECRET ตั้งแล้วหรือยัง?
2. NEXTAUTH_URL = https://your-app.vercel.app
3. Callback URL ใน OAuth providers
```

---

## 📊 Monitoring

### Vercel Analytics
```powershell
# Enable in Vercel Dashboard
Settings → Analytics → Enable
```

### Custom Monitoring
```powershell
# Check health
https://your-app.vercel.app/api/health

# Check metrics
https://your-app.vercel.app/api/metrics
```

---

## 🎯 Custom Domain

1. ไปที่ Vercel Dashboard → Settings → Domains
2. Add Domain: `skillnexus.com`
3. Update DNS Records (ตาม Vercel instructions)
4. Update `NEXTAUTH_URL` environment variable

---

## 💰 Cost Estimate

### Vercel (Hobby - Free)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ❌ No team features

### Vercel (Pro - $20/month)
- ✅ Everything in Hobby
- ✅ 1TB bandwidth/month
- ✅ Team collaboration
- ✅ Advanced analytics

### Database (Supabase Free)
- ✅ 500MB database
- ✅ 2GB bandwidth/month
- ✅ 50,000 monthly active users

**Total: $0-20/month** 🎉

---

## 🚀 Quick Deploy (One Command)

```powershell
# Clone → Install → Deploy
git clone https://github.com/your-repo/The-SkillNexus.git
cd The-SkillNexus
npm install
vercel --prod
```

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

---

**Deploy เสร็จแล้ว! SkillNexus LMS พร้อมใช้งาน! 🎉**
