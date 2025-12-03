@echo off
echo ========================================
echo   Deploy uppowerskill.com to Cloud Run
echo ========================================
echo.

set PROJECT_ID=skillnexus-lms-2025
set SERVICE_NAME=uppowerskill
set REGION=asia-southeast1
set IMAGE=gcr.io/%PROJECT_ID%/%SERVICE_NAME%:latest

echo [1/6] Login to Google Cloud...
call gcloud auth login joesive@gmail.com
if %ERRORLEVEL% NEQ 0 exit /b 1

echo.
echo [2/6] Set project...
call gcloud config set project %PROJECT_ID%

echo.
echo [3/6] Enable APIs...
call gcloud services enable run.googleapis.com
call gcloud services enable containerregistry.googleapis.com

echo.
echo [4/6] Build Docker image...
call docker build -t %IMAGE% .
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker build failed!
    pause
    exit /b 1
)

echo.
echo [5/6] Push to Container Registry...
call docker push %IMAGE%
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker push failed!
    pause
    exit /b 1
)

echo.
echo [6/6] Deploy to Cloud Run...
call gcloud run deploy %SERVICE_NAME% ^
  --image %IMAGE% ^
  --platform managed ^
  --region %REGION% ^
  --allow-unauthenticated ^
  --memory 2Gi ^
  --cpu 2 ^
  --min-instances 1 ^
  --max-instances 10 ^
  --set-env-vars DATABASE_URL="postgresql://skillnexus-user:SkillNexus2025!Secure@34.124.203.250:5432/skillnexus?sslmode=require" ^
  --set-env-vars NEXTAUTH_URL="https://uppowerskill.com" ^
  --set-env-vars NEXTAUTH_SECRET="rmQnCNXy9qxpobw61k3E2HWAcRezvfgt" ^
  --set-env-vars JWT_SECRET="jUng2EDA3aWX80GsJwkyCML1rQSVpPbN" ^
  --set-env-vars NODE_ENV="production"

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
echo Service URL:
call gcloud run services describe %SERVICE_NAME% --region %REGION% --format="value(status.url)"
echo.
echo Next steps:
echo 1. Map custom domain: gcloud run domain-mappings create --service %SERVICE_NAME% --domain uppowerskill.com --region %REGION%
echo 2. Update DNS records to point to Google Cloud
echo.
pause
