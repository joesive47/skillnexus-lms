# 🔧 แก้ไขปัญหา: Can't reach database server

## ❌ ปัญหา
```
Can't reach database server at `xxxxx-pooler.aws-region.postgres.vercel-storage.com:5432`
```

## ✅ สาเหตุ
DATABASE_URL ใน `.env` ยังเป็น **placeholder** ไม่ใช่ URL จริง

## 🚀 วิธีแก้ไข

### ขั้นตอนที่ 1: เลือก Database Provider

คุณต้องเลือก 1 ใน 5 ตัวเลือกนี้:

#### Option 1: Vercel Postgres (แนะนำถ้าใช้ Vercel)
1. ไปที่ https://vercel.com/dashboard
2. เลือก Project → Storage → Create Database → Postgres
3. Copy `DATABASE_URL` จาก Environment Variables tab
4. Paste ใน `.env`

**ตัวอย่าง URL จริง:**
```
postgres://default:AbCd1234XyZ@ep-cool-name-123456-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require
```

---

#### Option 2: Supabase (แนะนำถ้าต้องการ Free Tier)
1. ไปที่ https://supabase.com
2. Create New Project
3. ไปที่ Settings → Database
4. Copy "Connection string" (Transaction mode)
5. แทนที่ `[YOUR-PASSWORD]` ด้วยรหัสผ่านที่คุณตั้งไว้
6. Paste ใน `.env`

**ตัวอย่าง URL จริง:**
```
postgresql://postgres:YourPassword123@db.abcdefghijklmnop.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

---

#### Option 3: Neon (แนะนำสำหรับ Serverless)
1. ไปที่ https://neon.tech
2. Create New Project
3. Copy Connection String
4. Paste ใน `.env`

**ตัวอย่าง URL จริง:**
```
postgresql://user123:password456@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

#### Option 4: Railway
1. ไปที่ https://railway.app
2. New Project → Add PostgreSQL
3. Copy DATABASE_URL
4. Paste ใน `.env`

**ตัวอย่าง URL จริง:**
```
postgresql://postgres:password123@containers-us-west-123.railway.app:5432/railway?sslmode=require
```

---

#### Option 5: ใช้ Local PostgreSQL (Development)
```bash
# Install PostgreSQL locally
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql

# Start PostgreSQL
# Windows: Services → PostgreSQL
# Mac: brew services start postgresql

# Create database
createdb skillnexus
```

**URL สำหรับ Local:**
```
postgresql://postgres:password@localhost:5432/skillnexus?schema=public
```

---

### ขั้นตอนที่ 2: อัปเดต .env

เปิดไฟล์ `.env` และแก้ไข:

```bash
# เปลี่ยนจาก (placeholder)
DATABASE_URL="postgres://default:xxxxx@xxxxx-pooler.aws-region.postgres.vercel-storage.com:5432/verceldb?sslmode=require"

# เป็น URL จริงที่คุณได้จาก Provider
DATABASE_URL="postgresql://postgres:YourRealPassword@db.yourproject.supabase.co:5432/postgres?pgbouncer=true"
```

---

### ขั้นตอนที่ 3: ทดสอบการเชื่อมต่อ

```bash
# Test connection
npx prisma db pull

# ถ้าสำเร็จจะแสดง
# ✔ Introspected 50 models and wrote them into prisma/schema.prisma
```

---

### ขั้นตอนที่ 4: Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Deploy migrations
npx prisma migrate deploy

# Seed database
npm run db:seed
```

---

## 🎯 Quick Fix (ใช้ Local Database)

ถ้าต้องการทดสอบเร็วๆ ให้กลับไปใช้ Local Database:

```bash
# แก้ไข .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillnexus?schema=public"

# Run migrations
npx prisma generate
npx prisma db push
npm run db:seed

# Start dev server
npm run dev
```

---

## 📋 Checklist

- [ ] เลือก Database Provider (Vercel/Supabase/Neon/Railway/Local)
- [ ] สร้าง Database ใน Provider ที่เลือก
- [ ] Copy DATABASE_URL จริง (ไม่ใช่ placeholder)
- [ ] Paste ใน `.env`
- [ ] ทดสอบด้วย `npx prisma db pull`
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Seed data: `npm run db:seed`
- [ ] Start server: `npm run dev`

---

## 🆘 ยังแก้ไม่ได้?

### ตรวจสอบ DATABASE_URL Format

**ถูกต้อง ✅:**
```
postgresql://user:password@host:5432/database?sslmode=require
```

**ผิด ❌:**
```
postgres://default:xxxxx@xxxxx-pooler.aws-region...  (placeholder)
postgresql://user:[YOUR-PASSWORD]@host...  (ยังไม่แทนที่ password)
postgresql://user:password@host/database  (ไม่มี ?sslmode=require)
```

### ตรวจสอบ Firewall/Network

```bash
# Test if you can reach the host
ping your-database-host.com

# Test port connection (Windows)
Test-NetConnection -ComputerName your-host.com -Port 5432

# Test port connection (Linux/Mac)
nc -zv your-host.com 5432
```

### ตรวจสอบ SSL/TLS

Production databases ต้องใช้ SSL:
```
?sslmode=require
```

---

## 💡 แนะนำสำหรับ Development

**ใช้ Local PostgreSQL:**
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillnexus"
```

**หรือใช้ Supabase Free Tier:**
```bash
DATABASE_URL="postgresql://postgres:YourPassword@db.yourproject.supabase.co:5432/postgres?pgbouncer=true"
```

---

## 📚 Resources

- [Vercel Postgres Setup](https://vercel.com/docs/storage/vercel-postgres/quickstart)
- [Supabase Database Setup](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Neon Quickstart](https://neon.tech/docs/get-started-with-neon/signing-up)
- [Prisma Connection Troubleshooting](https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)

---

**ต้องการความช่วยเหลือ?** 
1. เลือก Database Provider ที่ต้องการ
2. Follow setup guide ด้านบน
3. Copy DATABASE_URL จริง (ไม่ใช่ placeholder)
4. Paste ใน `.env`
