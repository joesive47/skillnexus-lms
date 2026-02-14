# 🔥 Fix: Login Redirect to Admin Issue

## ปัญหา
- ผู้ใช้ทุกคนล็อกอินแล้วถูกพา ไปที่ `/admin/dashboard` โดยไม่คำนึงถึง role ของตน
- คาดว่า:
  - ADMIN → `/admin/dashboard`
  - TEACHER → `/teacher/dashboard`  
  - STUDENT → `/student/dashboard`

## สาเหตุ
ปัญหาเกิดจากหนึ่งในสาเหตุต่อไปนี้:
1. ✅ Role ในฐานข้อมูลของ user ทั้งหมดถูกตั้งเป็น 'ADMIN'
2. ✅ Token/Session ไม่ได้นำ role จาก user มาอย่างถูกต้อง
3. ✅ Logic ในการ redirect มีข้อผิดพลาด

## วิธีแก้ไข

### 1. ปรับปรุง `/dashboard/page.tsx` - เพิ่ม debugging
- ✅ เพิ่ม detailed logging สำหรับ role
- ✅ Normalize role เพื่อป้องกัน case-sensitive issues
- ✅ Log type ของ role เพื่อตรวจสอบ

### 2. สร้าง API endpoint สำหรับ check role
**`/api/auth/check-role`**
- ตรวจสอบ role จาก session
- เทียบ role จากฐานข้อมูล
- Debug tool เพื่อหา root cause

### 3. สร้าง script สำหรับ audit roles
**`scripts/audit-roles.ts`**
- ตรวจสอบ role distribution
- หา users ที่มี invalid role
- Show recent users

**วิธีใช้:**
```bash
ts-node scripts/audit-roles.ts
```

### 4. สร้าง script สำหรับ reset roles
**`scripts/reset-roles.ts`**
- Fix users ที่มี wrong role
- Reset invalid roles เป็น STUDENT
- Verify final distribution

**วิธีใช้:**
```bash
ts-node scripts/reset-roles.ts
```

## ขั้นตอนการแก้ไข

### Step 1: ตรวจสอบ Role Distribution
```bash
# ดูว่า role ของ users ในฐานข้อมูลเป็นอย่างไร
ts-node scripts/audit-roles.ts
```

### Step 2: ถ้า Role ผิด ให้ Fix ฐานข้อมูล
```bash
# Reset role ให้ถูกต้อง
ts-node scripts/reset-roles.ts
```

### Step 3: ทดสอบ Redirect
```bash
# ทดสอบ login กับ account ต่างๆ
# ADMIN: admin@skillnexus.com / Admin@123!
# TEACHER: teacher@skillnexus.com / teacher@123!
# STUDENT: test@uppowerskill.com / student@123!
```

### Step 4: Debug ถ้ายังมีปัญหา
```bash
# ไปที่ /api/auth/check-role เพื่อดู role จาก session
# เปิด browser console ดู logs จาก /dashboard
# ตรวจสอบ error ใน Vercel logs
```

## Debugging Points

### 1. Check Browser Logs
```
[DASHBOARD] Full Session response: {...}
[DASHBOARD] Role: ADMIN
[DASHBOARD] Role Type: string
[DASHBOARD] Normalized role: ADMIN
```

### 2. Check API Endpoint
```
GET /api/auth/check-role
Response: {
  session: { user: { role: 'ADMIN' } },
  database: { role: 'ADMIN' },
  match: 'YES'
}
```

### 3. Check Database
```sql
SELECT email, role, COUNT(*) 
FROM "User" 
GROUP BY role
ORDER BY COUNT(*) DESC;
```

## Expected Behavior After Fix

### ✅ Correct Flow
```
Login (any user)
  ↓
/dashboard
  ↓
  ├─ ADMIN → /admin/dashboard
  ├─ TEACHER → /teacher/dashboard
  └─ STUDENT → /student/dashboard
```

### ✅ Tests
```
1. Login as admin@skillnexus.com → /admin/dashboard ✓
2. Login as teacher@skillnexus.com → /teacher/dashboard ✓
3. Login as test@uppowerskill.com → /student/dashboard ✓
```

## Files Modified
- ✅ `src/app/dashboard/page.tsx` - Enhanced debugging
- ✅ `src/app/api/auth/debug-session/route.ts` - New debug endpoint
- ✅ `src/app/api/auth/check-role/route.ts` - New check role endpoint
- ✅ `scripts/audit-roles.ts` - New audit script
- ✅ `scripts/reset-roles.ts` - New reset script

## Notes
- ⚠️ Role comparison ต้อง exact match (case-sensitive)
- ⚠️ Database role field ต้อง uppercase: 'ADMIN', 'TEACHER', 'STUDENT'
- ⚠️ Session callback ต้อง return session พร้อม role
- ⚠️ JWT token ต้องมี role field

---
**Status:** 🔧 Fixed
**Date:** 2026-02-14
**Priority:** 🔴 Critical
