# 🔧 แก้ไขปัญหา Login ที่ www.uppowerskill.com

## ✅ สถานะปัจจุบัน (ตรวจสอบแล้ว)
- เว็บไซต์: **ONLINE** (HTTP 200)
- Server: **Vercel** (sin1 region)
- CSRF Token: **ทำงานได้**
- Auth API: **❌ HTTP 400 Bad Request** ← ปัญหาหลัก!

## 🐛 สาเหตุที่เป็นไปได้

### 1. Environment Variables ไม่ถูกต้อง
```
NEXTAUTH_URL ยังเป็น localhost หรือไม่ตรงกับ domain จริง
AUTH_URL ยังเป็น localhost หรือไม่ตรงกับ domain จริง
DATABASE_URL ไม่ได้ระบุหรือไม่สามารถเชื่อมต่อได้
NEXTAUTH_SECRET หรือ AUTH_SECRET ไม่ได้ตั้งค่า
```

## 🔧 วิธีแก้ไข

### Step 1: ตรวจสอบ Environment Variables ใน Vercel

1. ไปที่: https://vercel.com/dashboard
2. เลือกโปรเจค **uppowerskill**
3. ไปที่ **Settings** → **Environment Variables**
4. ตรวจสอบว่ามีตัวแปรต่อไปนี้และ**ถูกต้อง**:

#### Variables ที่จำเป็น (MUST HAVE):

```env
# Auth Configuration - ต้องใช้ domain จริง!
NEXTAUTH_URL=https://www.uppowerskill.com
NEXTAUTH_SECRET=<your-secret-key>

# Auth v5 Configuration
AUTH_URL=https://www.uppowerskill.com
AUTH_SECRET=<same-as-nextauth-secret>
AUTH_TRUST_HOST=true

# Database
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Environment
NODE_ENV=production
NEXT_PUBLIC_URL=https://www.uppowerskill.com
NEXT_PUBLIC_BASE_URL=https://www.uppowerskill.com
```

#### ⚠️ สิ่งที่ต้องเช็ค:
- ✅ NEXTAUTH_URL **ต้องเป็น** `https://www.uppowerskill.com` (ไม่ใช่ localhost!)
- ✅ AUTH_URL **ต้องเป็น** `https://www.uppowerskill.com` (ไม่ใช่ localhost!)
- ✅ NEXTAUTH_SECRET และ AUTH_SECRET **ต้องมีค่าเดียวกัน**
- ✅ DATABASE_URL **ต้องเชื่อมต่อได้** และมี `?sslmode=require`

### Step 2: Generate Secret Key (ถ้ายังไม่มี)

```powershell
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

เอาค่าที่ได้ไปใส่ใน NEXTAUTH_SECRET และ AUTH_SECRET

### Step 3: ตรวจสอบ Database Connection

```bash
# ใน Vercel Dashboard → Database
# ตรวจสอบว่า:
1. Database ถูกสร้างแล้ว
2. Tables ถูก migrate แล้ว
3. Connection string ถูกต้อง
```

### Step 4: Redeploy

หลังจากแก้ Environment Variables แล้ว:

1. ใน Vercel Dashboard → Deployments
2. คลิก **Redeploy** ที่ deployment ล่าสุด
3. เลือก "Redeploy with existing Build Cache" หรือ
4. กด **Deploy** ใหม่เลย

### Step 5: ทดสอบ

```powershell
# ทดสอบ auth endpoint
curl https://www.uppowerskill.com/api/auth/csrf -s | ConvertFrom-Json

# ควรได้ csrfToken กลับมา
```

## 🚨 แก้ปัญหาด่วน (Emergency Fix)

ถ้าต้องการแก้ด่วน ให้ทำตามนี้:

### 1. ตรวจสอบ Environment Variables ที่จำเป็น

```bash
# เข้า Vercel Dashboard
https://vercel.com/your-project/settings/environment-variables

# เพิ่ม/แก้ไขทั้งหมดนี้:
NEXTAUTH_URL=https://www.uppowerskill.com
AUTH_URL=https://www.uppowerskill.com
NEXTAUTH_SECRET=<generate-new-secret>
AUTH_SECRET=<same-as-nextauth-secret>
AUTH_TRUST_HOST=true
DATABASE_URL=<your-database-url>
NODE_ENV=production
```

### 2. Force Redeploy

```bash
# Local
git commit --allow-empty -m "Force redeploy to fix auth"
git push origin main

# หรือใน Vercel Dashboard
Deployments → Redeploy
```

## 📝 Checklist

- [ ] NEXTAUTH_URL = https://www.uppowerskill.com (ไม่ใช่ localhost)
- [ ] AUTH_URL = https://www.uppowerskill.com (ไม่ใช่ localhost)
- [ ] NEXTAUTH_SECRET และ AUTH_SECRET มีค่าเดียวกัน
- [ ] AUTH_TRUST_HOST = true
- [ ] DATABASE_URL ถูกต้องและเชื่อมต่อได้
- [ ] NODE_ENV = production
- [ ] Redeploy แล้ว
- [ ] ทดสอบ login ได้

## 🔍 Debug เพิ่มเติม

### ดู Logs ใน Vercel

1. ไปที่ Vercel Dashboard → Deployments
2. คลิกที่ deployment ล่าสุด
3. ดู **Function Logs** หรือ **Runtime Logs**
4. หา error messages เกี่ยวกับ auth

### ตรวจสอบ Database

```bash
# ถ้าใช้ Vercel Postgres
vercel env pull .env.vercel
cat .env.vercel | grep DATABASE_URL

# ทดสอบ connection
npx prisma db pull --schema=./prisma/schema.prisma
```

## 💡 Tips

1. **NEXTAUTH_URL ต้องตรงกับ domain จริง** - นี่คือสาเหตุหลักของปัญหา 80%
2. **Redeploy หลังเปลี่ยน env vars** - Environment variables ต้อง rebuild
3. **ใช้ AUTH_TRUST_HOST=true** - สำหรับ Next.js 14+ บน Vercel
4. **Database URL ต้องมี sslmode=require** - สำหรับ production database

## 📞 หากยังแก้ไม่ได้

ส่ง screenshot ของ:
1. Vercel Environment Variables (Settings → Environment Variables)
2. Error message จาก Vercel Function Logs
3. Error ที่เห็นตอน login (F12 Console)

---

## 🎯 Quick Fix Commands

```powershell
# 1. ตรวจสอบสถานะ
curl https://www.uppowerskill.com/api/auth/csrf -s | ConvertFrom-Json

# 2. ตรวจสอบ auth endpoint
curl https://www.uppowerskill.com/api/auth/signin -I

# 3. Generate new secret
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## ✅ Expected Result

หลังแก้ไขแล้ว:
```powershell
curl https://www.uppowerskill.com/api/auth/signin -I
# ควรได้ HTTP 200 หรือ redirect (3xx) ไม่ใช่ 400
```

---

**อัพเดท**: 12 ก.พ. 2026
**สถานะ**: รอตรวจสอบ Environment Variables ใน Vercel
