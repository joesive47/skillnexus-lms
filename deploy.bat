@echo off
echo ========================================
echo   SkillNexus LMS - Google Cloud Deploy
echo ========================================
echo.

echo [1/5] Checking gcloud CLI...
where gcloud >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: gcloud CLI not found!
    echo Please install: https://cloud.google.com/sdk/docs/install
    pause
    exit /b 1
)
echo ✓ gcloud CLI found

echo.
echo [2/5] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo [3/5] Generating Prisma Client...
call npm run db:generate
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)
echo ✓ Prisma Client generated

echo.
echo [4/5] Building application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo ✓ Build completed

echo.
echo [5/5] Deploying to Google Cloud...
echo.
echo WARNING: This will deploy to production!
echo Press Ctrl+C to cancel, or
pause

call gcloud app deploy --quiet
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Deployment failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✓ Deployment Successful!
echo ========================================
echo.
echo Opening application...
call gcloud app browse

echo.
echo View logs: gcloud app logs tail
echo.
pause
