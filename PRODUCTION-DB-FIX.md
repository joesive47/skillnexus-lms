# 🚨 Production Database Connection Fix

## ปัญหา: ไม่สามารถเชื่อมต่อฐานข้อมูลได้

### ✅ แก้ไขแล้ว:
1. **Schema Fix**: เปลี่ยนจาก SQLite เป็น PostgreSQL
2. **Database Test API**: `/api/db-test` สำหรับตรวจสอบการเชื่อมต่อ
3. **Environment Variables**: Template สำหรับ production

## 🔧 ขั้นตอนแก้ไข:

### 1. ตรวจสอบ Environment Variables ใน Vercel:
```bash
DATABASE_URL="postgresql://username:password@host:5432/database"
NEXTAUTH_SECRET="your-32-character-secret-key"
NEXTAUTH_URL="https://uppoerskill.com"
```

### 2. ตรวจสอบการเชื่อมต่อ:
```
https://uppoerskill.com/api/db-test
```

### 3. Database Providers (เลือก 1):
- **Vercel Postgres** (แนะนำ)
- **Supabase** (ฟรี)
- **Neon** (serverless)
- **Railway** (full-stack)

### 4. Setup Database:
```bash
# หลังจากได้ DATABASE_URL แล้ว
npx prisma migrate deploy
npx prisma generate
```

## 🚀 Quick Fix Commands:

```bash
# 1. Commit schema fix
git add prisma/schema.prisma
git commit -m "fix: Change database provider to PostgreSQL for production"
git push origin main

# 2. Setup Vercel Postgres (if using Vercel)
# Go to Vercel Dashboard > Storage > Create Database > Postgres

# 3. Add environment variables in Vercel Dashboard
# 4. Redeploy
```

## 📊 Database Test Results:
- ✅ Success: Database connected, user count returned
- ❌ Error: Check DATABASE_URL and database status

## 🔍 Debug Steps:
1. Check `/api/db-test` endpoint
2. Verify DATABASE_URL format
3. Ensure database is running
4. Check Prisma schema matches database
5. Run migrations if needed