@echo off
echo 🚀 Quick Deploy to GitHub + Vercel
echo ====================================
echo 📍 Repository: https://github.com/joesiveSkill/skillnexus-pro
echo.

REM Check git status
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
echo 🧹 Cleaning cache...
if exist ".next" rmdir /s /q ".next"
if exist "node_modules/.cache" rmdir /s /q "node_modules/.cache"

echo.
echo 📦 Adding files...
git add .

echo.
echo 💾 Committing...
git commit -m "%COMMIT_MSG%"

echo.
echo 🚀 Pushing to GitHub (skillnexus-pro)...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo ✅ Successfully pushed!
    echo.
    echo 📍 GitHub: https://github.com/joesiveSkill/skillnexus-pro
    echo 🔄 Vercel will auto-deploy in ~2-3 minutes
    echo 📊 Dashboard: https://vercel.com/dashboard
    echo ====================================
) else (
    echo.
    echo ⚠️ Push failed - trying force push...
    git push -u origin main --force
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Force push successful!
    ) else (
        echo ✗ Failed - check git configuration
        exit /b 1
    )
)
