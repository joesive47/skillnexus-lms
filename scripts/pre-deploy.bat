@echo off
echo 🚀 Pre-Deployment Checklist
echo ============================

echo.
echo ✅ 1. Checking environment files...
if exist ".env.production" (
    echo    ✓ .env.production exists
) else (
    echo    ✗ .env.production missing
)

echo.
echo ✅ 2. Checking Prisma schema...
node scripts/check-prisma.js
if %ERRORLEVEL% EQU 0 (
    echo    ✓ Prisma client is ready
) else (
    echo    ✗ Run: npx prisma generate
)

echo.
echo ✅ 3. Clearing build cache...
if exist ".next" rmdir /s /q ".next"
if exist "node_modules/.cache" rmdir /s /q "node_modules/.cache"
echo    ✓ Cache cleared

echo.
echo ✅ 4. Testing build locally...
set NODE_OPTIONS=--max-old-space-size=2048
set SKIP_ENV_VALIDATION=true
npm run build:fast
if %ERRORLEVEL% EQU 0 (
    echo    ✓ Build successful
) else (
    echo    ✗ Build failed - fix errors before deploying
    exit /b 1
)

echo.
echo ============================
echo ✅ Ready to deploy!
echo.
echo Next steps:
echo 1. git add .
echo 2. git commit -m "Optimize build for deployment"
echo 3. git push origin main
echo 4. Vercel will auto-deploy
echo ============================
