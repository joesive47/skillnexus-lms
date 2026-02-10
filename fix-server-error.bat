@echo off
echo ============================================
echo   🔧 แก้ไข Server Component Error
echo   Quick Fix and Deploy Script
echo ============================================
echo.

echo 📋 ขั้นตอนการแก้ไข:
echo.

echo [1/5] ทำความสะอาด Build Cache...
call npm run clean:cache
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ทำความสะอาดล้มเหลว
    pause
    exit /b 1
)
echo ✅ ทำความสะอาดสำเร็จ
echo.

echo [2/5] Generate Prisma Client...
call npm run db:generate
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Prisma generate ล้มเหลว
    pause
    exit /b 1
)
echo ✅ Prisma generate สำเร็จ
echo.

echo [3/5] Build Application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build ล้มเหลว
    echo.
    echo 💡 แนะนำ: ตรวจสอบ error ข้างต้นและแก้ไขก่อน deploy
    pause
    exit /b 1
)
echo ✅ Build สำเร็จ
echo.

echo [4/5] ทดสอบ Health Check...
timeout /t 2 /nobreak >nul
call npm run health
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Health check ล้มเหลว (อาจเป็นเพราะ server ไม่ได้รัน)
    echo.
    echo 💡 คุณต้องการ start server และทดสอบหรือไม่? (y/n)
    choice /C YN /N /M "Start server? (Y/N): "
    if errorlevel 2 goto DEPLOY
    if errorlevel 1 goto START_SERVER
) else (
    echo ✅ Health check สำเร็จ
)
echo.

:DEPLOY
echo [5/5] Deploy to Vercel...
echo.
echo ⚠️ สำคัญ: ตรวจสอบว่าคุณได้เพิ่ม Environment Variables บน Vercel แล้ว:
echo   ✓ DATABASE_URL
echo   ✓ NEXTAUTH_SECRET  
echo   ✓ NEXTAUTH_URL
echo.
echo 💡 Deploy แนะนำ:
echo   1. git add .
echo   2. git commit -m "fix: Server Component error handling"
echo   3. git push origin main
echo.
echo หรือใช้ Vercel CLI:
echo   vercel --prod
echo.
pause
goto END

:START_SERVER
echo.
echo 🚀 Starting development server...
call npm run dev
goto END

:END
echo.
echo ============================================
echo   ✅ เสร็จสิ้น!
echo ============================================
echo.
echo 📚 อ่านเพิ่มเติมที่: FIX-SERVER-COMPONENT-ERROR.md
echo.
pause
