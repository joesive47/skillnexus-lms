@echo off
echo ========================================
echo   Deploy to Google App Engine
echo ========================================
echo.

echo [1/5] Login...
call gcloud auth login joesive@gmail.com
if %ERRORLEVEL% NEQ 0 exit /b 1

echo.
echo [2/5] Set project...
call gcloud config set project skillnexus-lms-2025

echo.
echo [3/5] Enable API...
call gcloud services enable appengine.googleapis.com

echo.
echo [4/5] Clean and build...
if exist .next rmdir /s /q .next
set NODE_ENV=production
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [5/5] Deploy...
call gcloud app deploy --quiet

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Deployment failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✓ Success!
echo ========================================
echo.
call gcloud app browse
pause
