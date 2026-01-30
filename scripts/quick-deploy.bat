@echo off
echo 🚀 Quick Deploy to GitHub + Vercel
echo ====================================

REM Check if there are changes
git status --short
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Git not initialized
    exit /b 1
)

echo.
echo 📝 Enter commit message (or press Enter for default):
set /p COMMIT_MSG="Message: "
if "%COMMIT_MSG%"=="" set COMMIT_MSG="Optimize build and fix deployment issues"

echo.
echo 🧹 Cleaning up...
if exist ".next" rmdir /s /q ".next"
if exist "node_modules/.cache" rmdir /s /q "node_modules/.cache"

echo.
echo 📦 Adding files to git...
git add .

echo.
echo 💾 Committing changes...
git commit -m "%COMMIT_MSG%"

echo.
echo 🚀 Pushing to GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo ✅ Successfully pushed to GitHub!
    echo.
    echo 🔄 Vercel will auto-deploy in ~2-3 minutes
    echo 📊 Check status: https://vercel.com/dashboard
    echo ====================================
) else (
    echo.
    echo ✗ Push failed - check your git configuration
    exit /b 1
)
