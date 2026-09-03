# 🔍 Auth Debug System - ระบบตรวจสอบปัญหา Login

## ภาพรวม

ระบบนี้ถูกสร้างขึ้นเพื่อ**ติดตามและวิเคราะห์ปัญหาการ Login** แบบ Real-time โดยจะบันทึกทุกขั้นตอนของกระบวนการ Authentication

## 🎯 สาเหตุที่พบได้จากระบบนี้

ระบบจะช่วยระบุปัญหาเหล่านี้:

### 1️⃣ ปัญหา Credentials (Email/Password)
- ❌ Email ไม่ถูกต้องหรือไม่มีในระบบ
- ❌ รหัสผ่านไม่ตรงกับที่บันทึกไว้
- ℹ️ ข้อมูลที่กรอกไม่ครบถ้วน

### 2️⃣ ปัญหา Database
- ❌ ไม่สามารถเชื่อมต่อ Database ได้
- ❌ User ไม่มีในตาราง
- ⚠️ Database ช้าเกินไป (timeout)

### 3️⃣ ปัญหา Password Hashing
- ❌ Password hash ไม่ตรงกัน
- ❌ Bcrypt verification ล้มเหลว

### 4️⃣ ปัญหา Session/JWT
- ❌ ไม่สามารถสร้าง JWT Token ได้
- ❌ Session creation ล้มเหลว
- ❌ Role ไม่ถูกต้อง

### 5️⃣ ปัญหา Redirect
- ❌ Redirect URL ไม่ถูกต้อง
- ⚠️ Redirect loop
- ⚠️ CORS error

### 6️⃣ ปัญหา Client-Side
- ❌ Form submission error
- ❌ Network timeout
- ⚠️ Browser compatibility issues

## 📊 ขั้นตอนการติดตาม (Steps)

ระบบจะ log ทุกขั้นตอน:

1. **START** - เริ่มกระบวนการ login
2. **VALIDATION** - ตรวจสอบ input (email, password)
3. **DB_CHECK** - ทดสอบการเชื่อมต่อ database
4. **USER_QUERY** - ค้นหา user ในฐานข้อมูล
5. **PASSWORD_CHECK** - ตรวจสอบรหัสผ่าน
6. **AUTH_SUCCESS** - Authentication สำเร็จ
7. **JWT** - สร้าง JWT Token
8. **SESSION** - สร้าง Session
9. **REDIRECT** - Redirect ไปหน้าที่เหมาะสม
10. **REDIRECT_SUCCESS** - Redirect สำเร็จ

## 🛠️ วิธีใช้งาน

### สำหรับ Admin (ดู Logs)

1. Login ด้วยบัญชี Admin
2. ไปที่: `/admin/debug/auth-logs`
3. ดู logs แบบ real-time

**หรือใช้ API โดยตรง:**
```bash
# ดู logs (ต้อง login เป็น Admin)
curl https://www.uppowerskill.com/api/debug/auth-logs

# ลบ logs
curl -X DELETE https://www.uppowerskill.com/api/debug/auth-logs
```

### สำหรับ Developer (วิเคราะห์ปัญหา)

1. **ดู Console Logs**
   - เปิด Browser DevTools (F12)
   - ดูที่ Console tab
   - ลอง Login
   - จะเห็น logs ทุกขั้นตอน

2. **ดู Vercel Function Logs**
   - Vercel Dashboard → Deployments
   - เลือก deployment → View Function Logs
   - Flight ใช้ email ลอง login
   - ดู logs ที่แสดง

3. **ใช้ Debug Page**
   - ไปที่ `/admin/debug/auth-logs`
   - เปิด Auto-Refresh
   - ลอง Login ในอีก tab
   - ดูผลลัพธ์แบบ real-time

## 📋 ตัวอย่าง Logs

### ✅ Login สำเร็จ
```
[AUTH SUCCESS] [START] t***e@uppowerskill.com - Login attempt started
[AUTH SUCCESS] [DB_CHECK] t***e@uppowerskill.com - Database connected
[AUTH SUCCESS] [USER_QUERY] t***e@uppowerskill.com - User found
[AUTH SUCCESS] [PASSWORD_CHECK] t***e@uppowerskill.com - Password verified
[AUTH SUCCESS] [AUTH_SUCCESS] t***e@uppowerskill.com - Authentication successful
[AUTH INFO] [JWT] Creating JWT token
[AUTH INFO] [SESSION] Creating session
[AUTH SUCCESS] [REDIRECT] Redirecting to relative path
[AUTH SUCCESS] [REDIRECT_SUCCESS] Redirecting to /dashboard
```

### ❌ Email ผิด
```
[AUTH INFO] [START] wrong***@example.com - Login attempt started
[AUTH SUCCESS] [DB_CHECK] wrong***@example.com - Database connected
[AUTH ERROR] [USER_QUERY] wrong***@example.com - User not found in database
```

### ❌ Password ผิด
```
[AUTH INFO] [START] t***e@uppowerskill.com - Login attempt started
[AUTH SUCCESS] [DB_CHECK] t***e@uppowerskill.com - Database connected
[AUTH SUCCESS] [USER_QUERY] t***e@uppowerskill.com - User found
[AUTH ERROR] [PASSWORD_CHECK] t***e@uppowerskill.com - Invalid password
```

### ❌ Database Error
```
[AUTH INFO] [START] t***e@uppowerskill.com - Login attempt started
[AUTH ERROR] [DB_CHECK] t***e@uppowerskill.com - Database connection failed
```

## 🔒 ความปลอดภัย

- ✅ Email จะถูก mask (เช่น `t***e@uppowerskill.com`)
- ✅ Password ไม่ถูก log เลย
- ✅ Sensitive data ถูกซ่อน
- ✅ Logs เก็บใน memory เท่านั้น (ไม่บันทึกลง database)
- ✅ จำกัด 100 entries ล่าสุด
- ✅ Admin เท่านั้นที่ดู logs ได้

## 🚀 การ Deploy

Logs จะทำงานอัตโนมัติใน Production โดย:
- Console logs → Vercel Function Logs
- API logs → `/api/debug/auth-logs`
- Client logs → `/api/debug/log-auth`

## 💡 Tips การ Debug

### ถ้า Login ช้า
ดูที่ timestamps ระหว่าง steps - จะบอกได้ว่า step ไหนใช้เวลานาน

### ถ้า Login ล้มเหลว
1. ดู step สุดท้ายที่ SUCCESS
2. ดู step แรกที่ ERROR
3. วิเคราะห์ error message

### ถ้า Production มีปัญหา
1. ตรวจสอบ Environment Variables
2. ตรวจสอบ Database URL
3. ดู Vercel Function Logs
4. ใช้ Test User ที่มั่นใจว่ามีในระบบ

## 🎯 Next Steps

หลังจากหาสาเหตุได้แล้ว:
1. แก้ไขปัญหาที่จุดที่ระบุ
2. Deploy ใหม่
3. ทดสอบอีกครั้ง
4. ดู logs เพื่อ confirm ว่าแก้ไขสำเร็จ

## 📞 Support

หากต้องการความช่วยเหลือ:
- ดู logs ที่ `/admin/debug/auth-logs`
- Copy error message และ steps
- แจ้งทีม Support พร้อม logs
