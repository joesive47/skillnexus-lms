@echo off
echo ========================================
echo    Deployment Status Check
echo ========================================
echo.

echo Checking GitHub repository...
git remote -v

echo.
echo Checking Vercel project...
if exist ".vercel\project.json" (
    echo ✅ Vercel project linked
    type .vercel\project.json
) else (
    echo ❌ Vercel project not linked
    echo Run: setup-complete.bat
)

echo.
echo Checking workflow file...
if exist ".github\workflows\auto-deploy.yml" (
    echo ✅ Auto-deploy workflow ready
) else (
    echo ❌ Workflow file missing
)

echo.
echo ========================================
echo    Next Steps
echo ========================================
echo 1. Add GitHub Secrets (if not done)
echo 2. git push origin main
echo 3. Check GitHub Actions tab
echo.
pause