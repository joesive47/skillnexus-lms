# 🔧 Production Login Fix - uppowerskill.com

## ❌ ปัญหา
Login ไม่ได้บน uppowerskill.com เพราะ:
1. Production ใช้ SQLite database ที่ว่างเปล่า
2. ไม่มี user accounts ใน production database
3. Environment variables ไม่ถูกต้อง

---

## ✅ วิธีแก้ไข (เลือก 1 ใน 3)

### 🚀 Option 1: ใช้ PostgreSQL Database (แนะนำ)

#### Step 1: สร้าง Database
เลือก 1 ใน 4:
- **Vercel Postgres** (ฟรี 256MB): https://vercel.com/storage/postgres
- **Supabase** (ฟรี 500MB): https://supabase.com
- **Neon** (ฟรี 3GB): https://neon.tech
- **Railway** (ฟรี $5/month): https://railway.app

#### Step 2: Update Vercel Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Auth (IMPORTANT!)
NEXTAUTH_URL=https://www.uppowerskill.com
NEXT_PUBLIC_URL=https://www.uppowerskill.com
AUTH_URL=https://www.uppowerskill.com
NEXTAUTH_SECRET=<generate-new-secret>
AUTH_SECRET=<generate-new-secret>
AUTH_TRUST_HOST=true
NODE_ENV=production
```

**Generate secrets:**
```bash
openssl rand -base64 32
```

#### Step 3: Run Migrations & Seed
```bash
# Local
DATABASE_URL="your-production-db-url" npx prisma migrate deploy
DATABASE_URL="your-production-db-url" npx prisma db seed

# Or use Vercel CLI
vercel env pull .env.production.local
npm run db:push
npm run db:seed
```

#### Step 4: Redeploy
```bash
git push origin main
# Or manual: Vercel Dashboard → Redeploy
```

---

### 🔄 Option 2: ใช้ SQLite + Manual User Creation

#### Step 1: เข้า Vercel Dashboard
1. Project → Settings → Environment Variables
2. ตรวจสอบ DATABASE_URL = `file:./dev.db`

#### Step 2: สร้าง API Endpoint สำหรับ Seed Users
```bash
# Deploy แล้วเรียก
curl -X POST https://www.uppowerskill.com/api/seed-users
```

#### Step 3: หรือสร้าง User ผ่าน Register
1. ไปที่ https://www.uppowerskill.com/register
2. สมัครสมาชิกใหม่
3. Login ด้วย account ที่สร้าง

---

### 🛠️ Option 3: Copy Local Database to Production

#### Step 1: Export Local Database
```bash
# Backup local database
copy dev.db dev.db.backup
```

#### Step 2: Upload to Vercel Storage
```bash
vercel env add DATABASE_URL
# Paste: file:./dev.db
```

**⚠️ หมายเหตุ:** SQLite ไม่เหมาะกับ production เพราะ:
- ไม่ support concurrent connections
- ข้อมูลหายเมื่อ redeploy
- ไม่มี backup

---

## 🧪 ตรวจสอบ Environment Variables ใน Vercel

### ไปที่: Vercel Dashboard → Project → Settings → Environment Variables

**ต้องมี:**
```env
✅ DATABASE_URL (PostgreSQL URL)
✅ NEXTAUTH_URL (https://www.uppowerskill.com)
✅ NEXT_PUBLIC_URL (https://www.uppowerskill.com)
✅ AUTH_URL (https://www.uppowerskill.com)
✅ NEXTAUTH_SECRET (production secret)
✅ AUTH_SECRET (production secret)
✅ AUTH_TRUST_HOST (true)
✅ NODE_ENV (production)
```

**ต้องไม่มี:**
```env
❌ localhost URLs
❌ development secrets
❌ file:./dev.db (ถ้าใช้ PostgreSQL)
```

---

## 🔍 Debug Production Login

### Check Vercel Logs:
1. Vercel Dashboard → Deployments
2. Click latest deployment
3. View Function Logs
4. ดู error messages

### Common Errors:

**"Database connection failed"**
→ DATABASE_URL ไม่ถูกต้อง

**"User not found"**
→ ไม่มี users ใน database (ต้อง seed)

**"Invalid password"**
→ Password hash ไม่ตรง (ต้อง seed ใหม่)

**"Redirect error"**
→ NEXTAUTH_URL ไม่ตรงกับ domain

---

## 📝 Quick Fix Commands

### 1. Setup PostgreSQL (Recommended)
```bash
# Create database on Vercel/Supabase/Neon
# Copy DATABASE_URL

# Update Vercel env vars
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET

# Run migrations
DATABASE_URL="your-url" npx prisma migrate deploy
DATABASE_URL="your-url" npx prisma db seed

# Redeploy
git push origin main
```

### 2. Create Seed API (Quick Fix)
```bash
# Will create in next step
curl -X POST https://www.uppowerskill.com/api/seed-production
```

---

## ✅ Test After Fix

1. Clear browser cache
2. Go to https://www.uppowerskill.com/login
3. Try login:
   - admin@skillnexus.com / Admin@123!
   - Or newly registered account
4. Should redirect to dashboard

---

**แนะนำ:** ใช้ Option 1 (PostgreSQL) เพราะ:
- ✅ Persistent data
- ✅ Concurrent connections
- ✅ Automatic backups
- ✅ Production-ready
