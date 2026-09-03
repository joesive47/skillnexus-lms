@echo off
echo 🚀 Setting up GitHub + Vercel Auto-Deploy...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel@latest
)

REM Login to Vercel
echo Please login to Vercel:
vercel login

REM Link project
echo Linking project to Vercel...
vercel link

REM Get project info
echo Getting project information...
if exist ".vercel\project.json" (
    echo.
    echo 📋 Add these secrets to GitHub:
    echo Repository → Settings → Secrets and variables → Actions
    echo.
    echo Check .vercel\project.json for:
    echo - VERCEL_ORG_ID
    echo - VERCEL_PROJECT_ID
    echo - VERCEL_TOKEN: Get from https://vercel.com/account/tokens
    echo.
)

REM Commit and push
echo Committing changes...
git add .
git commit -m "Setup auto-deploy to Vercel"

echo.
echo ✅ Setup complete!
echo Push to GitHub: git push origin main
echo Auto-deploy will trigger on every push to main branch
pause