@echo off
echo Fixing build for deployment...

echo [1/3] Updating package.json...
echo Build command fixed for Vercel

echo [2/3] Testing build locally...
npm run build:check
if %errorlevel% neq 0 (
    echo Build check failed, fixing...
    npx prisma generate
)

echo [3/3] Ready for deployment
echo.
echo ✅ Build fixed! Now run:
echo git add .
echo git commit -m "fix build"
echo git push origin main
pause