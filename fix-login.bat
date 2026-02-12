@echo off
chcp 65001 > nul
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  🚀 แก้ไขปัญหา Login - www.uppowerskill.com                ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📋 เครื่องมือสำเร็จรูป:
echo.
echo    [1] แก้แบบง่าย - แสดงค่าและเปิด Vercel Dashboard
echo    [2] แก้แบบอัตโนมัติ - ใช้ Vercel CLI (ต้อง login)
echo    [3] ตรวจสอบสถานะ - ดูว่าแก้ไขแล้วหรือยัง
echo    [4] ออก
echo.
set /p choice="เลือก (1-4): "

if "%choice%"=="1" (
    cls
    echo.
    echo 🔧 กำลังรัน Fix แบบง่าย...
    echo.
    powershell -ExecutionPolicy Bypass -File fix-login-simple.ps1
    goto end
)

if "%choice%"=="2" (
    cls
    echo.
    echo 🤖 กำลังรัน Fix แบบอัตโนมัติ...
    echo.
    powershell -ExecutionPolicy Bypass -File fix-vercel-env-auto.ps1
    goto end
)

if "%choice%"=="3" (
    cls
    echo.
    echo 🔍 กำลังตรวจสอบสถานะ...
    echo.
    powershell -ExecutionPolicy Bypass -File check-production-auth.ps1
    pause
    goto menu
)

if "%choice%"=="4" (
    echo.
    echo 👋 ขอบคุณที่ใช้บริการ!
    echo.
    timeout /t 2 > nul
    exit
)

echo.
echo ❌ กรุณาเลือก 1-4 เท่านั้น
timeout /t 2 > nul
goto menu

:end
echo.
echo ══════════════════════════════════════════════════════════════
echo ✅ เสร็จสิ้น!
echo ══════════════════════════════════════════════════════════════
echo.
echo 📝 ขั้นตอนต่อไป:
echo    1. ตั้งค่า Environment Variables ใน Vercel Dashboard
echo    2. Redeploy (รอ 2-3 นาที)
echo    3. ทดสอบ login ที่ www.uppowerskill.com/login
echo.
echo 💡 หากต้องการตรวจสอบสถานะ รันคำสั่ง:
echo    check-production-auth.ps1
echo.

:menu
pause

:exit
