@echo off
echo 🚀 Deploy SkillNexus LMS
echo ====================================
echo 📍 Repository: joesive47/skillnexus-lms
echo 👤 User: joesive47
echo.

REM Clean cache
if exist ".next" rmdir /s /q ".next" 2>nul
if exist "node_modules/.cache" rmdir /s /q "node_modules/.cache" 2>nul

REM Git operations
git add .
git commit -m "Optimize build for Vercel deployment"
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Deployed successfully!
    echo 🔄 Vercel will auto-deploy
) else (
    echo.
    echo ⚠️ Trying force push...
    git push -u origin main --force
)
