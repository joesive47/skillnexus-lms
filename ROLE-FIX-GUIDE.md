# 🔧 Role Fix Guide - Production Database

## ปัญหา
User `joesive47@gmail.com` (และอาจมี users อื่นๆ) มี role ผิดในฐานข้อมูล production ทำให้:
- STUDENT users เข้าถึง `/admin/dashboard` ได้ (privilege escalation)
- ระบบ redirect ผิด role

## สาเหตุ
- Seed file เดิมใช้ `update: {}` หรือ `update: { credits }` เท่านั้น
- ไม่ได้บังคับ role ตอน update
- User ที่ถูกสร้างก่อนหน้าจะคง role เดิม (ผิด) แม้จะ reseed

## วิธีแก้ไข (เลือก 1 จาก 3 วิธี)

---

### 🎯 วิธีที่ 1: Admin API Route (แนะนำ - ปลอดภัยที่สุด)

**ข้อดี:**
- มี authentication check (ADMIN only)
- มี dry-run mode (ทดลองก่อน apply)
- มี logging และ audit trail
- ไม่ต้องเข้า database โดยตรง

**ขั้นตอน:**

#### 1.1 Deploy Admin API Route
```bash
# Push code ที่มี /api/admin/fix-roles
git add src/app/api/admin/fix-roles/route.ts
git commit -m "feat: Add admin API to fix user roles"
git push
```

#### 1.2 Check Current Status
```bash
# Login as ADMIN first on production
# Then use browser or curl:

curl https://skillnexus.vercel.app/api/admin/fix-roles \
  -H "Cookie: your-session-cookie"
```

**Response ตัวอย่าง:**
```json
{
  "success": true,
  "totalUsers": 15,
  "incorrectRoles": 1,
  "needsFix": true,
  "incorrectUsers": [
    {
      "email": "joesive47@gmail.com",
      "currentRole": "ADMIN",
      "expectedRole": "STUDENT",
      "isCorrect": false
    }
  ]
}
```

#### 1.3 Dry Run (ดูว่าจะเปลี่ยนอะไรบ้าง)
```bash
curl -X POST https://skillnexus.vercel.app/api/admin/fix-roles \
  -H "Cookie: your-session-cookie" \
  -H "Content-Type: application/json" \
  -d '{"dryRun": true}'
```

**Response:**
```json
{
  "success": true,
  "dryRun": true,
  "message": "Dry run completed - no changes made",
  "changes": [
    {
      "email": "joesive47@gmail.com",
      "name": "Joe Sive",
      "from": "ADMIN",
      "to": "STUDENT"
    }
  ],
  "summary": {
    "studentsFixed": 1,
    "teachersFixed": 0,
    "adminsFixed": 0,
    "totalFixed": 1
  }
}
```

#### 1.4 Apply Changes
```bash
curl -X POST https://skillnexus.vercel.app/api/admin/fix-roles \
  -H "Cookie: your-session-cookie" \
  -H "Content-Type: application/json" \
  -d '{"dryRun": false}'
```

#### 1.5 Verify Fix
```bash
# Login again with joesive47@gmail.com
# Should redirect to /dashboard (not /admin/dashboard)
```

---

### 🗄️ วิธีที่ 2: SQL Script (เร็วที่สุด)

**ข้อดี:**
- เร็วมาก
- ไม่ต้อง deploy code
- รันได้ทันที

**ข้อเสีย:**
- ต้องเข้า database console โดยตรง
- ไม่มี audit trail
- ต้องระวังมากขึ้น

**ขั้นตอน:**

#### 2.1 เข้า Vercel Postgres Console
1. เข้า [Vercel Dashboard](https://vercel.com)
2. เลือก Project: `skillnexus`
3. Go to **Storage** tab
4. Select PostgreSQL database
5. Click **Query** or **Data** tab

#### 2.2 Check Current Role
```sql
SELECT email, name, role, "updatedAt" 
FROM "User" 
WHERE email = 'joesive47@gmail.com';
```

#### 2.3 Fix Role (QUICK FIX)
```sql
UPDATE "User" 
SET role = 'STUDENT', "updatedAt" = NOW()
WHERE email = 'joesive47@gmail.com';
```

#### 2.4 Verify
```sql
SELECT email, name, role, "updatedAt" 
FROM "User" 
WHERE email = 'joesive47@gmail.com';
```

**Expected Result:**
```
email                | name     | role    | updatedAt
---------------------|----------|---------|-------------------
joesive47@gmail.com  | Joe Sive | STUDENT | 2026-02-15 08:00:00
```

#### 2.5 Fix All Users (Optional)
ถ้าต้องการแก้ทุก user ให้ตรงกับ seed data:

```sql
-- เปิดไฟล์ prisma/fix-user-roles.sql
-- Copy SQL commands ไปรันใน Vercel Postgres Console
```

---

### 🐳 วิธีที่ 3: Prisma Studio (มี GUI)

**ข้อดี:**
- มี UI ใช้งานง่าย
- เห็นภาพทั้งหมดชัดเจน
- ปลอดภัย (แก้ทีละ record)

**ข้อเสีย:**
- ต้อง connect production database
- ต้องมี DATABASE_URL

**ขั้นตอน:**

#### 3.1 Get Production Database URL
1. เข้า Vercel Dashboard
2. Project → Settings → Environment Variables
3. Copy `DATABASE_URL` (ต้องมี password)

#### 3.2 Set Environment Variable
```bash
# Windows PowerShell
$env:DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require"

# หรือแก้ไขไฟล์ .env.production
```

#### 3.3 Open Prisma Studio
```bash
npx prisma studio --browser none
```

#### 3.4 Edit User
1. เปิด browser: http://localhost:5555
2. Click **User** model
3. หา `joesive47@gmail.com`
4. Click Edit
5. เปลี่ยน `role` จาก `ADMIN` เป็น `STUDENT`
6. Click Save

#### 3.5 Verify
Login ที่ production ด้วย `joesive47@gmail.com` ควร redirect ไป `/dashboard`

---

## 🧪 Testing After Fix

### Test Case 1: joesive47@gmail.com (STUDENT)
```
1. เข้า https://skillnexus.vercel.app/login
2. Email: joesive47@gmail.com
3. Password: student@123!
4. Expected: Redirect to /dashboard
5. Try access /admin/dashboard → Should redirect to /login
```

### Test Case 2: admin@skillnexus.com (ADMIN)
```
1. เข้า https://skillnexus.vercel.app/login
2. Email: admin@skillnexus.com
3. Password: admin@123!
4. Expected: Redirect to /admin/dashboard
5. Can access all routes
```

### Test Case 3: teacher@example.com (TEACHER)
```
1. เข้า https://skillnexus.vercel.app/login
2. Email: teacher@example.com
3. Password: teacher@123!
4. Expected: Redirect to /teacher/dashboard
5. Cannot access /admin/dashboard
```

---

## 📊 Verification Queries

### Check All Users
```sql
SELECT 
  email, 
  name, 
  role,
  "createdAt",
  "updatedAt"
FROM "User" 
WHERE email IN (
  'joesive47@gmail.com',
  'admin@skillnexus.com',
  'teacher@example.com',
  'student1@example.com'
)
ORDER BY role, email;
```

### Count Users by Role
```sql
SELECT 
  role,
  COUNT(*) as count
FROM "User"
GROUP BY role
ORDER BY role;
```

### Find Potential Issues
```sql
-- Students with wrong role
SELECT email, name, role 
FROM "User" 
WHERE email LIKE '%student%' 
  AND role != 'STUDENT';

-- Admins with wrong role
SELECT email, name, role 
FROM "User" 
WHERE email LIKE '%admin%' 
  AND role != 'ADMIN';

-- Teachers with wrong role
SELECT email, name, role 
FROM "User" 
WHERE email LIKE '%teacher%' 
  AND role != 'TEACHER';
```

---

## 🔐 Security Notes

1. **Admin API Route:**
   - ใช้ได้เฉพาะ user ที่ login เป็น ADMIN
   - มี session authentication
   - มี dry-run mode ตามค่า default

2. **SQL Script:**
   - ระวังการรัน UPDATE โดยไม่มี WHERE clause
   - ควร SELECT ก่อนเสมอ
   - Backup database ก่อนรัน production

3. **Prisma Studio:**
   - ปิด port 5555 หลังใช้งานเสร็จ
   - ไม่เปิด production DB บน public network
   - ใช้ SSH tunnel หรือ VPN ถ้าจำเป็น

---

## 🔄 Prevention (ป้องกันปัญหาในอนาคต)

ปัญหานี้แก้ไขแล้วใน commit `3b798402`:

```typescript
// prisma/seed.ts - Before
update: { credits: student.credits }

// prisma/seed.ts - After
update: { 
  credits: student.credits,
  role: 'STUDENT' // CRITICAL: Ensure role is always STUDENT
}
```

✅ ทุกครั้งที่รัน `npx tsx prisma/seed.ts` จะบังคับ role ให้ถูกต้อง

---

## 📞 Troubleshooting

### ปัญหา: API Route returns 403 Forbidden
**สาเหตุ:** ไม่ได้ login หรือ login ไม่ใช่ ADMIN  
**แก้ไข:** Login ด้วย admin account ก่อน (admin@skillnexus.com)

### ปัญหา: SQL returns 0 rows updated
**สาเหตุ:** User ไม่มีในฐานข้อมูล  
**แก้ไข:** Check ว่า email ถูกต้องหรือไม่

### ปัญหา: Prisma Studio can't connect
**สาเหตุ:** DATABASE_URL ผิดหรือ SSL mode ไม่ถูกต้อง  
**แก้ไข:** ตรวจสอบว่ามี `?sslmode=require` ใน connection string

### ปัญหา: หลังแก้แล้วยัง redirect ผิด
**สาเหตุ:** Browser cache หรือ session cache  
**แก้ไข:**
1. Clear browser cache
2. Logout แล้ว login ใหม่
3. ใช้ Incognito/Private mode

---

## ✅ Success Criteria

เมื่อแก้ไขเสร็จสมบูรณ์:

- [ ] `joesive47@gmail.com` login → redirect to `/dashboard`
- [ ] `admin@skillnexus.com` login → redirect to `/admin/dashboard`
- [ ] `teacher@example.com` login → redirect to `/teacher/dashboard`
- [ ] STUDENT ไม่สามารถเข้า `/admin/dashboard`
- [ ] TEACHER ไม่สามารถเข้า `/admin/dashboard`
- [ ] Database verification query แสดง role ถูกต้องทุก user
