@echo off
echo 🚀 Initial Push to New Repository
echo ====================================
echo 📍 Target: https://github.com/joesiveSkill/skillnexus-pro
echo.

echo 🧹 Cleaning cache...
if exist ".next" rmdir /s /q ".next"
if exist "node_modules/.cache" rmdir /s /q "node_modules/.cache"

echo.
echo 📦 Adding all files...
git add .

echo.
echo 💾 Creating initial commit...
git commit -m "Initial commit: SkillNexus Pro LMS with optimized build"

echo.
echo 🚀 Pushing to GitHub (may take a few minutes)...
git push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo ✅ Successfully pushed to GitHub!
    echo.
    echo 📍 Repository: https://github.com/joesiveSkill/skillnexus-pro
    echo.
    echo 🔄 Next Steps:
    echo 1. Go to https://vercel.com/new
    echo 2. Import from GitHub: joesiveSkill/skillnexus-pro
    echo 3. Add environment variables
    echo 4. Deploy!
    echo ====================================
) else (
    echo.
    echo ⚠️ Push failed. Trying without force...
    git push -u origin main
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Push successful!
    ) else (
        echo ❌ Failed - check repository access
        exit /b 1
    )
)
