@echo off
echo 🔧 Clear Credentials and Deploy
echo ====================================

echo 🧹 Clearing all GitHub credentials...
cmdkey /delete:LegacyGeneric:target=git:https://joesiveSkill@github.com 2>nul
cmdkey /delete:LegacyGeneric:target=git:https://github.com 2>nul
git credential-cache exit 2>nul

echo ✅ Credentials cleared
echo.

echo 📝 Setting Git config...
git config user.name "joesive47"
git config user.email "joesive47@gmail.com"

echo.
echo 🧹 Cleaning build cache...
if exist ".next" rmdir /s /q ".next" 2>nul
if exist "node_modules/.cache" rmdir /s /q "node_modules/.cache" 2>nul

echo.
echo 📦 Adding files...
git add .

echo.
echo 💾 Committing...
git commit -m "Optimize build for Vercel deployment"

echo.
echo 🚀 Pushing to GitHub...
echo 📍 Repository: joesive47/skillnexus-lms
echo.
echo ⚠️  You will be prompted for credentials:
echo    Username: joesive47
echo    Password: [your GitHub password or token]
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo ✅ Successfully deployed!
    echo.
    echo 📍 GitHub: https://github.com/joesive47/skillnexus-lms
    echo 🔄 Vercel will auto-deploy
    echo ====================================
) else (
    echo.
    echo ❌ Push failed
    echo.
    echo 💡 Try force push:
    echo    git push -u origin main --force
)
