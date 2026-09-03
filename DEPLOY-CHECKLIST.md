# ✅ Checklist: Deploy ไป Vercel และแก้ปัญหา Login

## สิ่งที่แก้ไขแล้ว ✅

- [x] แก้ TypeScript error ใน `src/app/welcome/page.tsx`
  - ลบ `INSTRUCTOR` และ `USER` roles ที่ไม่มีใน enum
  - ใช้เฉพาะ `ADMIN`, `TEACHER`, `STUDENT`
  
- [x] แก้ `scripts/seed-users.ts`
  - เปลี่ยน `USER` เป็น `STUDENT`
  - เปลี่ยน `INSTRUCTOR` เป็น `TEACHER`

- [x] สร้างเอกสารแก้ปัญหา
  - `VERCEL-LOGIN-FIX.md` - วิธีแก้ปัญหา login
  - `BUILD-FIX-GUIDE.md` - อธิบาย build error บน Windows

## ขั้นตอนถัดไป (ทำตามลำดับ)

### 1. Push Code ไป GitHub

```bash
git add .
git commit -m "Fix: UserRole types and prepare for Vercel deployment"
git push origin main
```

### 2. ตั้งค่า Environment Variables บน Vercel

เข้า: https://vercel.com/dashboard → เลือกโปรเจค → Settings → Environment Variables

เพิ่มตัวแปรเหล่านี้ (สำหรับ Production, Preview, Development):

```bash
# Database (Required)
DATABASE_URL=postgres://599ca1bd0bca6057c1ccbe2bdeffa8e5cbe2d4e57ebef667d701241c6991f09b:sk_9iApxejNToFLNWzHY2yUC@db.prisma.io:5432/postgres?sslmode=require

# Authentication (Required - สำคัญมาก!)
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

### 3. Redeploy บน Vercel

- ไปที่ Deployments tab
- คลิก **Redeploy** บน deployment ล่าสุด
- หรือรอให้ auto-deploy หลัง push

### 4. ตรวจสอบ Deployment

- รอให้ build เสร็จ (2-3 นาที)
- เช็คว่าไม่มี error
- ดู Function Logs ถ้ามีปัญหา

### 5. ทดสอบ Login

1. เปิด: https://www.uppowerskill.com
2. ไปหน้า Login
3. ทดสอบด้วย account ที่มีในระบบ:
   - Email: `admin@skillnexus.com`
   - Password: `Admin@123!`

### 6. Debug (ถ้า Login ไม่ได้)

1. เปิด Browser DevTools (F12)
2. ดู Console tab
3. ดู Network tab
4. เข้า: `https://www.uppowerskill.com/api/debug/env-check`
5. ดู Vercel Function Logs

## คำสั่ง Git

```bash
# 1. เช็คสถานะ
git status

# 2. Add ไฟล์ทั้งหมด
git add .

# 3. Commit
git commit -m "Fix: UserRole types and prepare for Vercel deployment

- Remove INSTRUCTOR and USER roles
- Use only ADMIN, TEACHER, STUDENT
- Fix welcome page type errors
- Update seed-users script
- Add deployment documentation"

# 4. Push
git push origin main
```

## ตรวจสอบก่อน Push

- [ ] ไฟล์ `.env` ไม่ถูก commit (อยู่ใน .gitignore)
- [ ] ไฟล์ `.env.production` มี production URL
- [ ] TypeScript errors แก้ไขแล้ว
- [ ] ไม่มี sensitive data ใน code

## หลัง Deploy สำเร็จ

- [ ] Login ได้
- [ ] Redirect ถูกต้อง
- [ ] Session ทำงานปกติ
- [ ] ไม่มี error ใน Console
- [ ] ไม่มี error ใน Vercel Logs

## ปัญหาที่อาจพบ

### Login แล้วกลับมาหน้า Login
→ ตรวจสอบ `NEXTAUTH_URL` ต้องเป็น `https://www.uppowerskill.com`

### Error: "Configuration error"
→ ตรวจสอบ `NEXTAUTH_SECRET` ต้องมีความยาว ≥ 32 ตัวอักษร

### Error: "Database connection failed"
→ ตรวจสอบ `DATABASE_URL` ต้องมี `?sslmode=require`

### Build Error บน Vercel
→ ดู Build Logs และแก้ไข TypeScript errors

## ติดต่อ

หากมีปัญหา:
1. เช็ค `VERCEL-LOGIN-FIX.md`
2. เช็ค `BUILD-FIX-GUIDE.md`
3. ดู Vercel Function Logs
4. ดู Browser Console

---

## สรุป

การแก้ปัญหา login บน Vercel:
1. ✅ แก้ TypeScript errors (เสร็จแล้ว)
2. ⏳ Push code ไป GitHub
3. ⏳ ตั้งค่า Environment Variables
4. ⏳ Redeploy
5. ⏳ ทดสอบ login

**Build error บน Windows ไม่ใช่ปัญหา** เพราะ Vercel build บน Linux ซึ่งไม่มีปัญหานี้
