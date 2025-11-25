@echo off
chcp 65001 >nul
echo.
echo 🔧 ระบบตรวจสอบและแก้ไขปัญหา SkillNexus LMS
echo ================================================
echo.

:menu
echo เลือกการดำเนินการ:
echo 1. ตรวจสอบสถานะระบบ
echo 2. แก้ไขปัญหา "map is not a function"
echo 3. แก้ไขปัญหาโหลดช้า
echo 4. แก้ไขปัญหา Chatbot
echo 5. รีเฟรชระบบ
echo 6. ล้างแคช
echo 7. แก้ไขปัญหาทั้งหมด
echo 8. รีสตาร์ทเซิร์ฟเวอร์
echo 0. ออก
echo.

set /p choice="กรุณาเลือก (0-8): "

if "%choice%"=="1" goto diagnostics
if "%choice%"=="2" goto fix_map
if "%choice%"=="3" goto fix_slow
if "%choice%"=="4" goto fix_chatbot
if "%choice%"=="5" goto refresh
if "%choice%"=="6" goto clear_cache
if "%choice%"=="7" goto fix_all
if "%choice%"=="8" goto restart_server
if "%choice%"=="0" goto exit

echo ❌ ตัวเลือกไม่ถูกต้อง กรุณาลองใหม่
echo.
goto menu

:diagnostics
echo.
echo 🔍 กำลังตรวจสอบสถานะระบบ...
node scripts/system-diagnostics.js
echo.
pause
goto menu

:fix_map
echo.
echo 🔧 กำลังแก้ไขปัญหา "map is not a function"...
node scripts/quick-fix.js map
echo.
pause
goto menu

:fix_slow
echo.
echo ⚡ กำลังแก้ไขปัญหาโหลดช้า...
node scripts/quick-fix.js slow
echo.
pause
goto menu

:fix_chatbot
echo.
echo 🤖 กำลังแก้ไขปัญหา Chatbot...
node scripts/quick-fix.js chatbot
echo.
pause
goto menu

:refresh
echo.
echo 🔄 กำลังรีเฟรชระบบ...
node scripts/quick-fix.js refresh
echo.
pause
goto menu

:clear_cache
echo.
echo 🧹 กำลังล้างแคช...
node scripts/quick-fix.js cache
echo.
pause
goto menu

:fix_all
echo.
echo 🚀 กำลังแก้ไขปัญหาทั้งหมด...
node scripts/quick-fix.js all
echo.
pause
goto menu

:restart_server
echo.
echo 🔄 กำลังรีสตาร์ทเซิร์ฟเวอร์...
echo กรุณารอสักครู่...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.
echo ✅ เซิร์ฟเวอร์ถูกหยุดแล้ว
echo 💡 กรุณารันคำสั่ง: npm run dev
echo.
pause
goto menu

:exit
echo.
echo 👋 ขอบคุณที่ใช้เครื่องมือแก้ไขปัญหา SkillNexus LMS
echo.
pause
exit