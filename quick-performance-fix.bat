@echo off
echo 🚀 เริ่มแก้ปัญหาความช้าแบบเร่งด่วน...

echo.
echo 📦 ติดตั้ง dependencies ที่จำเป็น...
npm install --save-dev @next/bundle-analyzer

echo.
echo 🔧 รัน performance fix script...
node performance-fix.js

echo.
echo 🗄️ อัพเดท Prisma...
npx prisma generate

echo.
echo 🧹 ล้าง cache...
npm run build:check
rd /s /q .next 2>nul
rd /s /q node_modules\.cache 2>nul

echo.
echo 🚀 Build แบบเร็ว...
npm run build:fast

echo.
echo ✅ เสร็จแล้ว! ระบบควรเร็วขึ้นแล้ว
echo.
echo 📋 ขั้นตอนต่อไป:
echo 1. รัน: npm run dev
echo 2. เปิด browser และตรวจสอบความเร็ว
echo 3. หากยังช้า รัน: npm run performance:check

pause