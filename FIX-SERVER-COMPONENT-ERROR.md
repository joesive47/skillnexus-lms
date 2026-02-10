# 🔧 วิธีแก้ไขข้อผิดพลาด Server Component Error (Digest: 2962584593)

## 🔍 สาเหตุของปัญหา

ข้อผิดพลาดนี้เกิดจาก:
1. **ไม่มี Environment Variables ใน Production** (Vercel/Production)
2. **Database Connection ล้มเหลว**
3. **Async Operations ไม่มี Error Handling**

---

## ✅ วิธีแก้ไข

### 1. ตรวจสอบ Environment Variables บน Vercel

ไปที่ **Vercel Dashboard** → **Project Settings** → **Environment Variables**

เพิ่ม Environment Variables ต่อไปนี้:

```env
# Database (Required)
DATABASE_URL="your-production-database-url"

# NextAuth (Required)
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Optional but Recommended
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

### 2. ตรวจสอบ Database Connection

```bash
# ทดสอบ Database locally
npm run db:test

# หรือใช้ Prisma Studio
npm run db:studio
```

### 3. Deploy ใหม่บน Vercel

หลังจากเพิ่ม Environment Variables แล้ว:

```bash
# Option 1: Re-deploy from Dashboard
ไปที่ Vercel → Deployments → Redeploy

# Option 2: Push to Git
git add .
git commit -m "Fix: Add error handling for database"
git push origin main
```

---

## 🛡️ การป้องกันในอนาคต

### 1. ไฟล์ที่ได้แก้ไขแล้ว:

✅ **src/lib/prisma.ts** - เพิ่ม Error Handling สำหรับ Database Connection
✅ **src/lib/db-health.ts** - สร้างฟังก์ชันตรวจสอบสุขภาพของ Database
✅ **src/app/error.tsx** - Error Boundary สำหรับ Client Errors
✅ **src/app/global-error.tsx** - Error Boundary สำหรับ Global Errors

### 2. เพิ่ม Health Check Endpoint

สร้างไฟล์ `src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/db-health'

export async function GET() {
  try {
    const dbHealth = await checkDatabaseHealth()
    
    return NextResponse.json({
      status: dbHealth.status === 'healthy' ? 'ok' : 'error',
      database: dbHealth,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
```

---

## 📊 ตรวจสอบสถานะ

### หลัง Deploy แล้ว ให้ตรวจสอบ:

1. **Health Check**
   ```
   https://your-domain.vercel.app/api/health
   ```

2. **Vercel Logs**
   - ไปที่ Vercel Dashboard
   - เลือก Deployment
   - ดู Runtime Logs

3. **Browser Console**
   - เปิด Developer Tools (F12)
   - ดู Console และ Network tabs

---

## 🚨 หากยังพบข้อผิดพลาด

### ตรวจสอบเพิ่มเติม:

1. **Database URL Format ถูกต้องหรือไม่**
   ```
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
   ```

2. **Database ยังทำงานอยู่หรือไม่**
   - ตรวจสอบ Vercel Postgres / Supabase / Railway

3. **Prisma Schema sync หรือไม่**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

---

## 🎯 ตัวอย่าง Environment Variables ที่ถูกต้อง

### Development (.env.local)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
NEXTAUTH_SECRET="dev-secret-key-min-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"
```

### Production (Vercel)
```env
DATABASE_URL="postgresql://user:pass@host.com:5432/db?sslmode=require"
NEXTAUTH_SECRET="prod-secret-key-min-32-characters-long-very-secure"
NEXTAUTH_URL="https://your-app.vercel.app"
```

---

## 📝 Checklist

- [ ] เพิ่ม `DATABASE_URL` บน Vercel
- [ ] เพิ่ม `NEXTAUTH_SECRET` บน Vercel
- [ ] เพิ่ม `NEXTAUTH_URL` บน Vercel
- [ ] Re-deploy บน Vercel
- [ ] ตรวจสอบ `/api/health`
- [ ] ทดสอบเข้าเว็บไซต์
- [ ] ตรวจสอบ Logs บน Vercel

---

## 💡 เคล็ดลับ

1. **ใช้ Vercel Environment Variables UI**
   - Production, Preview, Development แยกกัน
   
2. **Test Locally First**
   ```bash
   npm run build
   npm start
   ```

3. **Monitor Logs**
   ```bash
   vercel logs --follow
   ```

---

## 🔗 ลิงก์ที่เป็นประโยชน์

- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Prisma Error Reference](https://www.prisma.io/docs/reference/api-reference/error-reference)

---

**หมายเหตุ:** หากปัญหายังคงอยู่ กรุณาตรวจสอบ Vercel Logs และส่งข้อมูล Error Digest มาเพื่อวิเคราะห์เพิ่มเติม
