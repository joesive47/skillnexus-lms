@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  🚀 Auto Deploy to Vercel - SCORM 2004 LMS               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git not found. Please install Git first.
    pause
    exit /b 1
)

REM Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

echo 📦 Step 1: Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm install failed
    pause
    exit /b 1
)

echo.
echo 🔧 Step 2: Generating Prisma Client...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Prisma generate failed
    pause
    exit /b 1
)

echo.
echo 📝 Step 3: Committing changes to Git...
git add .
git commit -m "🌍 Deploy: 5 SCORM 2004 World-Changing Courses - Auto Deploy %date% %time%"
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  No changes to commit or commit failed
)

echo.
echo 🚀 Step 4: Pushing to GitHub...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git push failed. Please check your repository settings.
    pause
    exit /b 1
)

echo.
echo ✅ Code pushed to GitHub successfully!
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  📋 Next Steps - Vercel Deployment                        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 1. Go to: https://vercel.com/new
echo 2. Import your repository: The-SkillNexus
echo 3. Add Environment Variables:
echo.
echo    DATABASE_URL=postgresql://user:pass@host:5432/db
echo    NEXTAUTH_SECRET=your-secret-key
echo    NEXTAUTH_URL=https://your-app.vercel.app
echo.
echo 4. Click "Deploy"
echo.
echo 5. After deployment, run database setup:
echo    npm run deploy:all
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  🎯 Quick Database Setup (Choose One)                     ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Option A - Vercel Postgres (Recommended):
echo   https://vercel.com/dashboard/stores
echo.
echo Option B - Supabase (Free):
echo   https://supabase.com/dashboard/projects
echo.
echo Option C - Neon (Serverless):
echo   https://console.neon.tech/app/projects
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  🔑 Test Accounts                                          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Admin:   admin@skillnexus.com / Admin@123!
echo Teacher: teacher@skillnexus.com / Teacher@123!
echo Student: joesive47@gmail.com / Student@123! (10,000 credits)
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  🌍 5 SCORM 2004 Courses Ready                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 1. 🎯 SDGs Leadership (8h - ฿4,999)
echo 2. ♻️  Circular Economy (6h - ฿3,999)
echo 3. 💡 Social Entrepreneurship (7h - ฿4,499)
echo 4. ⚡ Renewable Energy (6.5h - ฿3,799)
echo 5. 🌱 Regenerative Agriculture (6.3h - ฿3,599)
echo.
echo Total: 33.8 hours ^| 60 lessons ^| ฿20,796
echo.
echo 🎉 Auto Deploy Complete! Ready to change the world! 🌍
echo.
pause
