@echo off
echo 🚀 SkillNexus Quick Setup
echo ========================

echo.
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ npm install failed
    pause
    exit /b 1
)

echo.
echo 🧹 Cleaning up project...
node cleanup-project.js
if %errorlevel% neq 0 (
    echo ⚠️ Cleanup had issues, continuing...
)

echo.
echo 🗄️ Setting up database...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Prisma generate failed
    pause
    exit /b 1
)

call npx prisma db push --accept-data-loss
if %errorlevel% neq 0 (
    echo ❌ Database push failed
    pause
    exit /b 1
)

echo.
echo 🌱 Seeding database...
call npx tsx prisma/seed.ts
if %errorlevel% neq 0 (
    echo ⚠️ Seeding had issues, continuing...
)

echo.
echo 🏗️ Building project...
node build-and-deploy.js
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo ✅ Setup completed successfully!
echo.
echo 📋 Next steps:
echo    1. npm run dev - Start development server
echo    2. Open http://localhost:3000
echo    3. Login with: admin@skillnexus.com / Admin@123!
echo.
echo 🚀 Ready to go!
pause