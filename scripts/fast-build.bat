@echo off
echo 🚀 Fast Build Script - Phase 9 Performance Fix
echo ================================================

echo.
echo 📋 Step 1: Killing existing Node processes...
taskkill /f /im node.exe >nul 2>&1
echo ✅ Node processes terminated

echo.
echo 🔧 Step 2: Running performance fix...
node performance-fix.js
if %errorlevel% neq 0 (
    echo ❌ Performance fix failed
    pause
    exit /b 1
)

echo.
echo 🧹 Step 3: Cleaning build cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo ✅ Cache cleared

echo.
echo 📦 Step 4: Checking Prisma...
npm run prisma:check
if %errorlevel% neq 0 (
    echo 🔄 Generating Prisma client...
    npx prisma generate
)

echo.
echo 🏗️ Step 5: Fast build with optimizations...
set NODE_OPTIONS=--max-old-space-size=2048
npm run build:fast
if %errorlevel% neq 0 (
    echo ❌ Fast build failed, trying regular build...
    npm run build
)

echo.
echo 🚀 Step 6: Starting server...
npm start

pause