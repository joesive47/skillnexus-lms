# 🚀 Fix Production Login - uppowerskill.com

## ขั้นตอนแก้ไข Login ใน Production

### 1. อัพเดท Environment Variables ใน Vercel

ไปที่ Vercel Dashboard → Project → Settings → Environment Variables

**อัพเดทตัวแปรเหล่านี้:**

```bash
# Authentication URLs - CRITICAL!
NEXTAUTH_URL=https://uppowerskill.com
AUTH_URL=https://uppowerskill.com
NEXT_PUBLIC_URL=https://uppowerskill.com
NEXTAUTH_URL_INTERNAL=https://uppowerskill.com
NEXT_PUBLIC_BASE_URL=https://uppowerskill.com

# Environment
NODE_ENV=production
AUTH_TRUST_HOST=true

# Secrets (ใช้ค่าเดิม)
NEXTAUTH_SECRET=skillnexus-super-secret-key-2024-production-ready
AUTH_SECRET=skillnexus-super-secret-key-2024-production-ready

# Database (ใช้ production database)
DATABASE_URL=your_production_database_url
```

### 2. Setup Production Database

**Option A: Vercel Postgres (แนะนำ)**
```bash
# ใน Vercel Dashboard
1. ไปที่ Storage → Create Database → Postgres
2. Copy DATABASE_URL
3. เพิ่มใน Environment Variables
```

**Option B: Supabase (Free)**
```bash
# ไปที่ supabase.com
1. Create new project
2. ไปที่ Settings → Database
3. Copy Connection String
4. เพิ่มใน Environment Variables
```

### 3. Run Database Migration

```bash
# หลังจากตั้ง DATABASE_URL แล้ว
npx prisma migrate deploy
npx prisma db seed
```

### 4. Redeploy

```bash
# Push code และ redeploy
git add .
git commit -m "Fix production login URLs"
git push origin main

# หรือ Manual Deploy ใน Vercel Dashboard
```

### 5. Test Login

1. ไปที่ https://uppowerskill.com/login
2. ใช้ test account: admin@skillnexus.com / Admin@123!
3. ตรวจสอบว่า login ได้

## 🔧 Quick Commands

```bash
# Generate new secret (optional)
openssl rand -base64 32

# Check database connection
npx prisma studio

# Reset database (if needed)
npx prisma migrate reset
```

## ✅ Checklist

- [ ] อัพเดท Environment Variables ใน Vercel
- [ ] Setup Production Database
- [ ] Run Database Migration
- [ ] Redeploy Application
- [ ] Test Login Functionality
- [ ] Verify All URLs point to uppowerskill.com

## 🚨 Common Issues

**Issue 1: "Invalid URL" Error**
- ตรวจสอบ NEXTAUTH_URL และ AUTH_URL
- ต้องเป็น https://uppowerskill.com

**Issue 2: Database Connection Error**
- ตรวจสอบ DATABASE_URL
- ต้องเป็น production database

**Issue 3: "CSRF Token Mismatch"**
- ตั้ง AUTH_TRUST_HOST=true
- ตรวจสอบ domain ใน environment variables