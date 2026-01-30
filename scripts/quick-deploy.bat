@echo off
echo 🚀 Deploy to GitHub (joesive47/skillnexus-lms)
echo ====================================
echo.

echo 🧹 Cleaning cache...
if exist ".next" rmdir /s /q ".next" 2>nul
if exist "node_modules/.cache" rmdir /s /q "node_modules/.cache" 2>nul

echo.
echo 📦 Adding files...
git add .

echo.
echo 💾 Committing...
git commit -m "Optimize build and fix deployment issues"

echo.
echo 🚀 Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo ✅ Successfully pushed!
    echo.
    echo 📍 GitHub: https://github.com/joesive47/skillnexus-lms
    echo 🔄 Vercel will auto-deploy in ~2-3 minutes
    echo 📊 Dashboard: https://vercel.com/dashboard
    echo ====================================
) else (
    echo.
    echo ❌ Push failed
    echo 💡 Try: git push -u origin main --force
    exit /b 1
)
