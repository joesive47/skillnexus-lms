@echo off
chcp 65001 > nul
echo ================================================
echo 🔧 แก้ไขปัญหา Login - www.uppowerskill.com
echo ================================================
echo.

echo 📋 ขั้นตอนการแก้ไข:
echo.
echo 1. Generate Secret Key
echo 2. ตั้งค่า Environment Variables ใน Vercel
echo 3. Redeploy
echo.

echo ================================================
echo 1️⃣  สร้าง Secret Key ใหม่
echo ================================================
echo.
echo กำลังสร้าง Secret Key...
powershell -Command "[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))" > temp_secret.txt
set /p SECRET=<temp_secret.txt
del temp_secret.txt

echo.
echo ✅ Secret Key ที่สร้าง:
echo.
echo %SECRET%
echo.
echo ⚠️  กรุณาคัดลอก Secret Key ด้านบนไว้!
echo.

echo ================================================
echo 2️⃣  ตั้งค่า Environment Variables ใน Vercel
echo ================================================
echo.
echo 🌐 เปิด Vercel Dashboard...
start https://vercel.com/dashboard
echo.
echo 📝 ทำตามขั้นตอน:
echo.
echo 1. เลือกโปรเจค "uppowerskill" หรือ "The-SkillNexus"
echo 2. คลิก Settings → Environment Variables
echo 3. เพิ่ม/แก้ไข Environment Variables ต่อไปนี้:
echo.
echo    Variable Name: NEXTAUTH_URL
echo    Value: https://www.uppowerskill.com
echo    Environment: Production
echo.
echo    Variable Name: AUTH_URL
echo    Value: https://www.uppowerskill.com
echo    Environment: Production
echo.
echo    Variable Name: NEXTAUTH_SECRET
echo    Value: %SECRET%
echo    Environment: Production
echo.
echo    Variable Name: AUTH_SECRET
echo    Value: %SECRET%
echo    Environment: Production
echo.
echo    Variable Name: AUTH_TRUST_HOST
echo    Value: true
echo    Environment: Production
echo.
echo    Variable Name: NODE_ENV
echo    Value: production
echo    Environment: Production
echo.
echo    Variable Name: NEXT_PUBLIC_URL
echo    Value: https://www.uppowerskill.com
echo    Environment: Production
echo.
echo    Variable Name: NEXT_PUBLIC_BASE_URL
echo    Value: https://www.uppowerskill.com
echo    Environment: Production
echo.
echo 4. ตรวจสอบว่า DATABASE_URL มีอยู่และถูกต้อง
echo.

echo ================================================
echo 3️⃣  Redeploy
echo ================================================
echo.
echo หลังจากตั้งค่า Environment Variables เสร็จแล้ว:
echo.
echo 1. ใน Vercel Dashboard → Deployments
echo 2. คลิกที่ Deployment ล่าสุด
echo 3. คลิก "..." (three dots) → Redeploy
echo 4. เลือก "Redeploy"
echo.

echo ================================================
echo 🎯 ทดสอบหลัง Redeploy
echo ================================================
echo.
echo รอให้ Deployment เสร็จ (ประมาณ 2-3 นาที) แล้วรัน:
echo.
echo    .\check-production-auth.ps1
echo.
echo เพื่อตรวจสอบว่า SignIn API ทำงานได้แล้ว
echo.

pause

echo.
echo ================================================
echo 🔍 ตรวจสอบสถานะตอนนี้
echo ================================================
echo.
powershell -ExecutionPolicy Bypass -File check-production-auth.ps1

echo.
echo ================================================
echo 📖 อ่านเพิ่มเติม
echo ================================================
echo.
echo FIX-LOGIN-PRODUCTION.md
echo.

pause
