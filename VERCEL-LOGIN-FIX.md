# 🔧 แก้ปัญหา Login บน Vercel

## ปัญหา
หลังจาก push code ไป GitHub และ deploy บน Vercel แล้ว ไม่สามารถ login ได้

## สาเหตุ
Environment Variables บน Vercel ไม่ถูกต้อง โดยเฉพาะ:
- `NEXTAUTH_URL` ยังเป็น localhost
- `AUTH_URL` ยังเป็น localhost
- หรือไม่ได้ตั้งค่าเลย

## วิธีแก้ (ทำตามขั้นตอน)

### ขั้นที่ 1: ตั้งค่า Environment Variables บน Vercel

1. เข้า Vercel Dashboard: https://vercel.com/dashboard
2. เลือกโปรเจค ของคุณ
3. ไปที่ **Settings** → **Environment Variables**
4. เพิ่ม/แก้ไข Variables ต่อไปนี้:

#### Variables ที่จำเป็น (Required):

```bash
# Database
DATABASE_URL=postgres://599ca1bd0bca6057c1ccbe2bdeffa8e5cbe2d4e57ebef667d701241c6991f09b:sk_9iApxejNToFLNWzHY2yUC@db.prisma.io:5432/postgres?sslmode=require

# Authentication (สำคัญมาก!)
NEXTAUTH_SECRET=skillnexus-super-secret-key-2024-production-ready
NEXTAUTH_URL=https://www.uppowerskill.com
AUTH_SECRET=skillnexus-super-secret-key-2024-production-ready
AUTH_URL=https://www.uppowerskill.com
AUTH_TRUST_HOST=true

# Node Environment
NODE_ENV=production
NEXT_PUBLIC_URL=https://www.uppowerskill.com
NEXT_PUBLIC_BASE_URL=https://www.uppowerskill.com
```

#### สำหรับแต่ละ Variable:
- เลือก Environment: **Production**, **Preview**, และ **Development** (ทั้ง 3 อัน)
- คลิก **Save**

### ขั้นที่ 2: Redeploy

หลังจากตั้งค่า Environment Variables แล้ว:

1. ไปที่ **Deployments** tab
2. เลือก deployment ล่าสุด
3. คลิกปุ่ม **⋯** (three dots)
4. เลือก **Redeploy**
5. เลือก **Use existing Build Cache** (ถ้ามี)
6. คลิก **Redeploy**

### ขั้นที่ 3: ตรวจสอบว่าแก้ไขสำเร็จ

1. รอให้ deployment เสร็จ (ประมาณ 2-3 นาที)
2. เปิดเว็บไซต์: https://www.uppowerskill.com
3. ลองเข้าหน้า Login
4. ทดสอบ login ด้วย email/password ที่มีในระบบ

### ขั้นที่ 4: Debug (ถ้ายัง login ไม่ได้)

เปิด Browser DevTools (กด F12) และดู:

1. **Console Tab** - ดู error messages
2. **Network Tab** - ดู API calls ที่ล้มเหลว
3. ลองเข้า: `https://www.uppowerskill.com/api/debug/env-check`
   - จะแสดงว่า Environment Variables ตั้งค่าถูกต้องหรือไม่

### ขั้นที่ 5: ดู Logs บน Vercel

1. ไปที่ Vercel Dashboard
2. เลือกโปรเจค
3. ไปที่ **Deployments** → เลือก deployment ล่าสุด
4. คลิก **View Function Logs**
5. ลอง login อีกครั้ง
6. ดู logs ที่แสดงขึ้นมา

## เช็คลิสต์ที่ต้องตรวจสอบ

- [ ] `NEXTAUTH_URL` = `https://www.uppowerskill.com` (ไม่ใช่ localhost)
- [ ] `AUTH_URL` = `https://www.uppowerskill.com` (ไม่ใช่ localhost)
- [ ] `NEXTAUTH_SECRET` มีความยาวอย่างน้อย 32 ตัวอักษร
- [ ] `AUTH_SECRET` = เหมือนกับ `NEXTAUTH_SECRET`
- [ ] `DATABASE_URL` ถูกต้อง (มี `?sslmode=require` ต่อท้าย)
- [ ] `AUTH_TRUST_HOST` = `true`
- [ ] Redeploy แล้ว
- [ ] ไม่มี error ใน Browser Console
- [ ] ไม่มี error ใน Vercel Function Logs

## คำสั่งที่มีประโยชน์

### ตรวจสอบ Environment Variables
```bash
# เข้าไปดูที่
https://www.uppowerskill.com/api/debug/env-check
```

### ดู Auth Logs (ต้อง login เป็น Admin ก่อน)
```bash
# เข้าไปดูที่
https://www.uppowerskill.com/admin/debug/auth-logs
```

## ปัญหาที่พบบ่อย

### 1. Login แล้วกลับมาหน้า Login
**สาเหตุ:** `NEXTAUTH_URL` ไม่ตรงกับ domain จริง
**แก้ไข:** ตั้งค่า `NEXTAUTH_URL=https://www.uppowerskill.com`

### 2. Error: "Configuration error"
**สาเหตุ:** `NEXTAUTH_SECRET` ไม่ได้ตั้งค่าหรือสั้นเกินไป
**แก้ไข:** ตั้งค่า `NEXTAUTH_SECRET` ให้มีความยาวอย่างน้อย 32 ตัวอักษร

### 3. Error: "Database connection failed"
**สาเหตุ:** `DATABASE_URL` ไม่ถูกต้อง
**แก้ไข:** ตรวจสอบ connection string และต้องมี `?sslmode=require`

### 4. Error: "User not found"
**สาเหตุ:** Database ไม่มี user หรือ password ไม่ถูกต้อง
**แก้ไข:** ตรวจสอบว่ามี user ในฐานข้อมูลจริง

## สร้าง NEXTAUTH_SECRET ใหม่ (ถ้าต้องการ)

ใช้คำสั่งนี้สร้าง secret key ใหม่:

```bash
# บน Mac/Linux
openssl rand -base64 32

# บน Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## ติดต่อ Support

หากทำตามขั้นตอนแล้วยังไม่ได้:
1. Copy error message จาก Browser Console
2. Copy logs จาก Vercel Function Logs
3. Screenshot หน้า Environment Variables
4. แจ้งทีม Support

---

## สรุป

ปัญหาหลักคือ **Environment Variables บน Vercel ต้องใช้ production URL** ไม่ใช่ localhost

ขั้นตอนสำคัญ:
1. ตั้งค่า Environment Variables บน Vercel
2. Redeploy
3. ทดสอบ login
4. ดู logs ถ้ามีปัญหา
