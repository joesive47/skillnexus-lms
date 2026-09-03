@echo off
cls
echo ========================================
echo    SkillNexus Auto-Deploy Setup
echo ========================================
echo.

echo [1/4] Installing Vercel CLI...
npm install -g vercel@latest

echo.
echo [2/4] Login to Vercel (browser will open)
vercel login

echo.
echo [3/4] Linking project...
vercel link

echo.
echo [4/4] Getting project info...
if exist ".vercel\project.json" (
    for /f "tokens=2 delims=:" %%a in ('findstr "orgId" .vercel\project.json') do set ORG_ID=%%a
    for /f "tokens=2 delims=:" %%a in ('findstr "projectId" .vercel\project.json') do set PROJECT_ID=%%a
    
    echo.
    echo ========================================
    echo    GitHub Secrets Setup
    echo ========================================
    echo Go to: GitHub Repo ^> Settings ^> Secrets ^> Actions
    echo.
    echo Add these 3 secrets:
    echo VERCEL_ORG_ID: %ORG_ID:"=%
    echo VERCEL_PROJECT_ID: %PROJECT_ID:"=%
    echo VERCEL_TOKEN: Get from https://vercel.com/account/tokens
    echo.
)

echo ========================================
echo    Ready to Deploy!
echo ========================================
echo 1. Add secrets to GitHub
echo 2. git add . && git commit -m "auto-deploy"
echo 3. git push origin main
echo.
echo Auto-deploy will work on every push!
pause