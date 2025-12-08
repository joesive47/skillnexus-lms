# 🔧 Fix: ใช้ Vercel Postgres แทน Prisma Accelerate

## ปัญหา: Prisma Accelerate อาจมีปัญหาการเชื่อมต่อ

## ✅ Solution: ใช้ Vercel Postgres โดยตรง

### 1. ไปที่ Vercel Dashboard
```
https://vercel.com/dashboard
→ uppowerskill.com project
→ Storage tab
→ uppowerskill-db
→ Settings → General
```

### 2. Copy Direct Database URL
หา **POSTGRES_URL** (ไม่ใช่ POSTGRES_PRISMA_URL)
```
postgresql://username:password@host:port/database
```

### 3. อัพเดท Environment Variables
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### 4. หรือใช้ Supabase (Alternative)
```
1. ไปที่ supabase.com
2. Create new project
3. Settings → Database → Connection String
4. Copy URL: postgresql://postgres:[password]@[host]:5432/postgres
```

## 🚀 Quick Test Commands
```bash
# Test with new DATABASE_URL
copy .env.production-temp .env
npx prisma db push
npx prisma db seed
copy .env.local .env
```