# 🐘 Setup PostgreSQL for Production (uppowerskill.com)

## 🎯 ทำไมต้องใช้ PostgreSQL?

❌ **SQLite Problems:**
- ข้อมูลหายทุกครั้งที่ redeploy
- ไม่ support concurrent users
- ไม่มี backup

✅ **PostgreSQL Benefits:**
- ข้อมูลถาวร (persistent)
- Support หลายพัน concurrent users
- Auto backup
- Production-ready

---

## 🚀 Quick Setup (เลือก 1 ใน 3)

### Option 1: Vercel Postgres (แนะนำ - ง่ายที่สุด)

#### Step 1: สร้าง Database
1. ไปที่ https://vercel.com/dashboard
2. เลือก project → Storage tab
3. Click "Create Database" → "Postgres"
4. เลือก region ใกล้ users (Singapore/Tokyo)
5. Click "Create"

#### Step 2: Connect to Project
1. เลือก database ที่สร้าง
2. Click "Connect Project"
3. เลือก project: uppowerskill
4. Click "Connect"

✅ **Done!** DATABASE_URL จะถูกเพิ่มอัตโนมัติ

---

### Option 2: Supabase (ฟรี 500MB)

#### Step 1: สร้าง Project
1. ไปที่ https://supabase.com
2. Sign up/Login
3. New Project
4. ตั้งชื่อ: uppowerskill
5. Password: <strong-password>
6. Region: Singapore
7. Create Project (รอ 2-3 นาที)

#### Step 2: Get Connection String
1. Settings → Database
2. Copy "Connection string" (Transaction mode)
3. แทนที่ `[YOUR-PASSWORD]` ด้วย password จริง

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

#### Step 3: Add to Vercel
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Edit DATABASE_URL
3. Paste connection string
4. Save

---

### Option 3: Neon (ฟรี 3GB)

#### Step 1: สร้าง Project
1. ไปที่ https://neon.tech
2. Sign up/Login
3. Create Project
4. Name: uppowerskill
5. Region: Singapore
6. Create

#### Step 2: Get Connection String
1. Dashboard → Connection Details
2. Copy "Connection string"

```
postgresql://user:pass@ep-xxx.aws-region.neon.tech/neondb?sslmode=require
```

#### Step 3: Add to Vercel
1. Vercel Dashboard → Settings → Environment Variables
2. Edit DATABASE_URL
3. Paste connection string
4. Save

---

## 🔧 After Database Setup

### Step 1: Update Environment Variables

ตรวจสอบใน Vercel ว่ามีครบ:

```env
DATABASE_URL=postgresql://...  (✅ ต้องเป็น postgresql://)
NEXTAUTH_URL=https://www.uppowerskill.com
NEXT_PUBLIC_URL=https://www.uppowerskill.com
NEXTAUTH_SECRET=<production-secret>
AUTH_SECRET=<production-secret>
AUTH_TRUST_HOST=true
NODE_ENV=production
SEED_SECRET=uppowerskill-seed-2024
```

### Step 2: Redeploy

```bash
# Auto-deploy จะทำงานอัตโนมัติ
# หรือ manual: Vercel Dashboard → Deployments → Redeploy
```

### Step 3: Run Migrations

**Option A: Local (แนะนำ)**
```bash
# Copy production DATABASE_URL
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

**Option B: Vercel CLI**
```bash
vercel env pull .env.production.local
npm run db:push
```

### Step 4: Seed Users

```bash
curl -X POST https://www.uppowerskill.com/api/seed-production \
  -H "Content-Type: application/json" \
  -d '{"secret":"uppowerskill-seed-2024"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Production users created",
  "users": [
    {"email": "admin@skillnexus.com", "role": "ADMIN"},
    {"email": "teacher@skillnexus.com", "role": "TEACHER"},
    {"email": "student@skillnexus.com", "role": "STUDENT"}
  ]
}
```

### Step 5: Test Login

1. ไปที่ https://www.uppowerskill.com/login
2. Login ด้วย:
   - admin@skillnexus.com / Admin@123!
3. ✅ ควรเข้าสู่ระบบได้และไปที่ dashboard

---

## 🔍 Verify Database Connection

### Check in Vercel Logs:
1. Vercel Dashboard → Deployments
2. Click latest deployment
3. View Function Logs
4. ดูว่ามี "[AUTH] Database connected successfully"

### Test Database:
```bash
# Local test
DATABASE_URL="postgresql://..." npx prisma studio
```

---

## 📊 Database Comparison

| Feature | SQLite | Vercel Postgres | Supabase | Neon |
|---------|--------|-----------------|----------|------|
| Free Tier | ✅ | 256MB | 500MB | 3GB |
| Persistent | ❌ | ✅ | ✅ | ✅ |
| Concurrent Users | ❌ | ✅ | ✅ | ✅ |
| Auto Backup | ❌ | ✅ | ✅ | ✅ |
| Setup Time | 0 min | 2 min | 3 min | 2 min |
| Best For | Dev | Vercel | Full-stack | Serverless |

---

## ⚠️ Common Issues

**"Database connection failed"**
→ ตรวจสอบ DATABASE_URL ถูกต้อง และมี `?sslmode=require`

**"Migration failed"**
→ ลองใช้ `npx prisma db push` แทน `migrate deploy`

**"Users not created"**
→ ตรวจสอบ SEED_SECRET ตรงกับที่ตั้งใน Vercel

**"Still using SQLite"**
→ ลบ DATABASE_URL เก่าใน Vercel และเพิ่มใหม่

---

## ✅ Success Checklist

- [ ] สร้าง PostgreSQL database
- [ ] Update DATABASE_URL ใน Vercel
- [ ] Redeploy project
- [ ] Run migrations
- [ ] Seed users
- [ ] Test login สำเร็จ
- [ ] ข้อมูลไม่หายหลัง redeploy

---

**แนะนำ:** ใช้ Vercel Postgres เพราะ integrate ง่ายที่สุด! 🚀
