@echo off
echo ========================================
echo   SkillNexus LMS - Google Cloud Deploy
echo ========================================
echo.

echo [1/5] Checking Google Cloud CLI...
where gcloud >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Google Cloud CLI not found!
    echo Please install from: https://cloud.google.com/sdk/docs/install
    pause
    exit /b 1
)

echo [2/5] Login to Google Cloud...
gcloud auth login

echo [3/5] Set project...
set /p PROJECT_ID="Enter your Google Cloud Project ID: "
gcloud config set project %PROJECT_ID%

echo [4/5] Enable required APIs...
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable sqladmin.googleapis.com

echo [5/5] Deploying to Cloud Run...
gcloud run deploy skillnexus-lms ^
  --source . ^
  --region=asia-southeast1 ^
  --platform=managed ^
  --allow-unauthenticated ^
  --memory=1Gi ^
  --cpu=1 ^
  --max-instances=10 ^
  --min-instances=0

echo.
echo ========================================
echo   Deployment Complete! 
echo ========================================
echo.
echo Next steps:
echo 1. Setup Cloud SQL database
echo 2. Add environment variables
echo 3. Run database migrations
echo.
echo See GOOGLE-CLOUD-DEPLOYMENT.md for details
pause
