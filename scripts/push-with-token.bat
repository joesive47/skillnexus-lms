@echo off
echo 🚀 Push to GitHub with Authentication
echo ====================================
echo 📍 Repository: skillnexus-pro
echo 👤 User: joesiveSkill
echo.

REM Check if Personal Access Token is set
if "%GITHUB_TOKEN%"=="" (
    echo ⚠️  GITHUB_TOKEN not set
    echo.
    echo 🔑 Create a Personal Access Token:
    echo    1. Go to: https://github.com/settings/tokens
    echo    2. Click "Generate new token (classic)"
    echo    3. Select scopes: repo, workflow
    echo    4. Copy the token
    echo.
    set /p GITHUB_TOKEN="Enter your GitHub Personal Access Token: "
)

echo.
echo 🧹 Cleaning cache...
if exist ".next" rmdir /s /q ".next" 2>nul
if exist "node_modules/.cache" rmdir /s /q "node_modules/.cache" 2>nul

echo.
echo 📦 Adding files...
git add .

echo.
echo 💾 Committing...
git commit -m "Initial commit: SkillNexus Pro LMS with optimized build"

echo.
echo 🚀 Pushing to GitHub...
git push https://%GITHUB_TOKEN%@github.com/joesiveSkill/skillnexus-pro.git main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo ✅ Successfully pushed to GitHub!
    echo.
    echo 📍 Repository: https://github.com/joesiveSkill/skillnexus-pro
    echo.
    echo 🔄 Next: Import to Vercel
    echo    https://vercel.com/new
    echo ====================================
) else (
    echo.
    echo ❌ Push failed
    echo.
    echo 💡 Troubleshooting:
    echo    1. Verify token has correct permissions
    echo    2. Check repository exists
    echo    3. Try: git remote -v
    exit /b 1
)
