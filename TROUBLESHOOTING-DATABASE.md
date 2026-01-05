# 🔧 Database Connection Troubleshooting Guide

## ❌ ปัญหาที่พบบ่อย: "Can't reach database server at `host:5432`"

### 🎯 รากเหง้าของปัญหา
1. **Schema Provider ไม่ตรงกับ Database URL**
2. **Environment Variables ไม่ถูกต้อง**
3. **Prisma Client ไม่ได้ regenerate**

---

## ✅ วิธีแก้ไขแบบถาวร

### 1. ตรวจสอบ Prisma Schema
```prisma
// ไฟล์: prisma/schema.prisma
datasource db {
  provider = "postgresql"  // ✅ ต้องเป็น postgresql
  url      = env("DATABASE_URL")
}
```

### 2. ตรวจสอบ Environment Variables
```env
# ไฟล์: .env
# ✅ Production Database (แนะนำ)
DATABASE_URL="postgres://default:password@host:5432/database?sslmode=require"

# ❌ อย่าใช้ SQLite ใน Production
# DATABASE_URL="file:./dev.db"
```

### 3. Regenerate Prisma Client
```bash
npx prisma generate
npx prisma db push
```

---

## 🚨 Checklist ก่อนรัน Development

- [ ] ✅ `prisma/schema.prisma` ใช้ `provider = "postgresql"`
- [ ] ✅ `.env` มี `DATABASE_URL` ที่ถูกต้อง
- [ ] ✅ รัน `npx prisma generate` หลังเปลี่ยน schema
- [ ] ✅ Database server กำลังรัน (หรือใช้ cloud database)
- [ ] ✅ ทดสอบด้วย `npx prisma db push`

---

## 🔄 Quick Fix Commands

```bash
# 1. แก้ไข schema provider
# เปลี่ยน sqlite เป็น postgresql ใน prisma/schema.prisma

# 2. Regenerate client
npx prisma generate

# 3. Push schema
npx prisma db push

# 4. Seed data (ถ้าจำเป็น)
npm run db:seed

# 5. Start development
npm run dev
```

---

## 🌐 Production Database Options

### 1. Vercel Postgres (แนะนำ)
```env
DATABASE_URL="postgres://default:password@ep-xxx.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"
```

### 2. Supabase (ฟรี)
```env
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?schema=public"
```

### 3. Neon (Serverless)
```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

---

## 🚫 สิ่งที่ไม่ควรทำ

- ❌ **อย่าใช้ SQLite ใน Production** - ไม่รองรับ concurrent users
- ❌ **อย่าลืม regenerate Prisma client** หลังเปลี่ยน schema
- ❌ **อย่าใช้ localhost database ใน Production**
- ❌ **อย่าใช้ port ผิด** (5432 สำหรับ PostgreSQL)

---

## 📊 การตรวจสอบสถานะ

### ทดสอบ Database Connection
```bash
npx prisma db push
```

### ตรวจสอบ Schema
```bash
npx prisma studio
```

### ดู Database URL ปัจจุบัน
```bash
echo $DATABASE_URL
```

---

## 🎯 สรุป

**ปัญหาหลัก:** Schema ใช้ SQLite แต่ .env ใช้ PostgreSQL URL

**วิธีแก้:**
1. เปลี่ยน `provider = "sqlite"` เป็น `provider = "postgresql"`
2. รัน `npx prisma generate`
3. รัน `npx prisma db push`

**ป้องกันปัญหา:**
- ตรวจสอบ schema provider ก่อนรัน development
- ใช้ production database แทน local database
- เก็บ checklist นี้ไว้อ้างอิง

---

**📅 อัพเดทล่าสุด:** $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")  
**🔧 แก้ไขโดย:** Amazon Q Developer  
**✅ สถานะ:** แก้ไขแล้ว - พร้อมใช้งาน